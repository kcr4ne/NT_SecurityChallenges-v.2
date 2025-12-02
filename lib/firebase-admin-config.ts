import * as admin from "firebase-admin"

const initFirebaseAdmin = () => {
    if (!admin.apps.length) {
        try {
            // 환경 변수에서 서비스 계정 정보 가져오기
            const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
            const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
            const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

            if (!projectId || !clientEmail || !privateKey) {
                console.warn("Firebase Admin SDK 초기화 실패: 환경 변수가 누락되었습니다.")
                return false
            }

            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            })
            console.log("Firebase Admin SDK initialized successfully")
            return true
        } catch (error) {
            console.error("Firebase admin initialization error", error)
            return false
        }
    }
    return true
}

export const getAdminDb = () => {
    if (!initFirebaseAdmin()) {
        throw new Error("Firebase Admin SDK not initialized (Missing Env Vars?)")
    }
    return admin.firestore()
}

export const getAdminAuth = () => {
    if (!initFirebaseAdmin()) {
        throw new Error("Firebase Admin SDK not initialized (Missing Env Vars?)")
    }
    return admin.auth()
}
