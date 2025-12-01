import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Target, Users, Trophy } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-900 via-black to-blue-900">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-12 md:px-6 md:py-16">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                            NT-SecurityChallenges
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            덕영고등학교 정보보안소프트웨어과 학생들이 만든 차세대 보안 학습 플랫폼입니다.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="bg-gray-900/50 border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Shield className="h-6 w-6 text-blue-400" />
                                    안전한 실습 환경
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-gray-400">
                                실제 보안 위협을 시뮬레이션한 안전한 환경에서 해킹 방어 기술을 실습하고 익힐 수 있습니다.
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-900/50 border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Target className="h-6 w-6 text-red-400" />
                                    다양한 챌린지
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-gray-400">
                                웹 해킹, 시스템 해킹, 포렌식 등 다양한 분야의 워게임과 CTF 문제를 제공합니다.
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-900/50 border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Users className="h-6 w-6 text-green-400" />
                                    커뮤니티
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-gray-400">
                                보안에 관심 있는 학생들과 지식을 공유하고 함께 성장하는 커뮤니티를 지향합니다.
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-900/50 border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Trophy className="h-6 w-6 text-yellow-400" />
                                    랭킹 시스템
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-gray-400">
                                실시간 랭킹 시스템을 통해 자신의 실력을 증명하고 건전한 경쟁을 즐길 수 있습니다.
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
