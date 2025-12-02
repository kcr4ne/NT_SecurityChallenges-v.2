import { type NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin-config"

export async function POST(request: NextRequest) {
    try {
        // 1. 인증 확인 (Authorization 헤더의 Bearer 토큰 검증)
        const authHeader = request.headers.get("Authorization")
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const idToken = authHeader.split("Bearer ")[1]
        let decodedToken
        try {
            // Admin SDK로 토큰 검증
            const { getAdminAuth } = await import("@/lib/firebase-admin-config")
            const adminAuth = getAdminAuth()
            decodedToken = await adminAuth.verifyIdToken(idToken)
        } catch (error) {
            console.error("Token verification failed:", error)
            return NextResponse.json({ error: "Invalid token" }, { status: 401 })
        }

        const userId = decodedToken.uid
        const { challengeId, flag } = await request.json()

        if (!challengeId || !flag) {
            return NextResponse.json({ error: "Missing challengeId or flag" }, { status: 400 })
        }

        const adminDb = getAdminDb()

        // 2. 챌린지 정보 조회 (Admin SDK 사용)
        const challengeRef = adminDb.collection("wargame_challenges").doc(challengeId)
        const challengeDoc = await challengeRef.get()

        if (!challengeDoc.exists) {
            return NextResponse.json({ error: "Challenge not found" }, { status: 404 })
        }

        const challengeData = challengeDoc.data()!
        const correctFlag = challengeData.flag

        // 3. 플래그 검증
        if (flag.trim().toLowerCase() !== correctFlag.trim().toLowerCase()) {
            return NextResponse.json({ success: false, message: "Incorrect flag" }, { status: 200 })
        }

        // 4. 중복 해결 확인
        if (challengeData.solvedBy && challengeData.solvedBy.includes(userId)) {
            return NextResponse.json({ success: false, message: "Already solved" }, { status: 200 })
        }

        // 5. 점수 및 로그 업데이트 (Transaction 사용 권장)
        const points = challengeData.points || 0

        await adminDb.runTransaction(async (transaction) => {
            // Note: admin.firestore.FieldValue is needed.
            const admin = (await import("firebase-admin")).default
            const FieldValue = admin.firestore.FieldValue

            // 챌린지 업데이트
            transaction.update(challengeRef, {
                solvedCount: FieldValue.increment(1),
                solvedBy: FieldValue.arrayUnion(userId),
            })

            // 사용자 업데이트
            const userRef = adminDb.collection("users").doc(userId)
            transaction.set(userRef, {
                points: FieldValue.increment(points),
                wargameScore: FieldValue.increment(points),
                solvedWargameProblems: FieldValue.arrayUnion(challengeId),
            }, { merge: true })

            // 로그 생성
            const solveLogRef = adminDb.collection("wargame_solve_logs").doc()
            transaction.set(solveLogRef, {
                userId: userId,
                challengeId: challengeId,
                challengeTitle: challengeData.title,
                category: challengeData.category,
                level: challengeData.level,
                points: points,
                solvedAt: FieldValue.serverTimestamp(),
            })

            const userSolveLogRef = adminDb.collection("user_solve_logs").doc(`${userId}_${challengeId}`)
            transaction.set(userSolveLogRef, {
                userId: userId,
                challengeId: challengeId,
                challengeTitle: challengeData.title,
                type: "wargame",
                category: challengeData.category,
                level: challengeData.level,
                points: points,
                solvedAt: FieldValue.serverTimestamp(),
            })
        })

        return NextResponse.json({ success: true, points, message: "Correct flag!" })

    } catch (error: any) {
        console.error("Submit error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
