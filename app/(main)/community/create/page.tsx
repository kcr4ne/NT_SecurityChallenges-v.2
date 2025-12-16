"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    ArrowLeft,
    Loader2,
    Plus,
    X,
    FileText,
    MessageSquare,
    HelpCircle,
    Briefcase,
    Info,
    Code,
    BookOpen,
    UserPlus,
    Trophy,
    Megaphone,
    Star,
    LogIn,
} from "lucide-react"
import Link from "next/link"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase-config"

// 카테고리 정의
const CATEGORIES = [
    { id: "자유게시판", name: "💬 자유게시판", icon: MessageSquare },
    { id: "Q&A", name: "❓ Q&A", icon: HelpCircle },
    { id: "이직/커리어", name: "💼 이직/커리어", icon: Briefcase },
    { id: "정보공유", name: "💡 정보공유", icon: Info },
    { id: "테크", name: "⚡ 테크", icon: Code },
    { id: "스터디", name: "📚 스터디", icon: BookOpen },
    { id: "팀원모집", name: "👥 팀원모집", icon: UserPlus },
    { id: "대회", name: "🏆 대회", icon: Trophy },
    { id: "행사홍보", name: "🎉 행사홍보", icon: Megaphone },
    { id: "후기", name: "✍️ 후기", icon: Star },
]

export default function CreateCommunityPostPage() {
    const router = useRouter()
    const { user, userProfile } = useAuth()
    const { toast } = useToast()

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [category, setCategory] = useState("자유게시판")
    const [tags, setTags] = useState<string[]>([])
    const [newTag, setNewTag] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // 로그인하지 않은 경우 접근 차단 안내
    if (!user && typeof window !== "undefined") {
        return (
            <div className="flex min-h-screen flex-col bg-black">
                <Navbar />
                <main className="flex-1 py-8 flex items-center justify-center">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center py-12 max-w-md mx-auto bg-gray-900/50 rounded-2xl border border-gray-800 p-8 backdrop-blur-xl">
                            <LogIn className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold mb-4 text-white">로그인이 필요합니다</h1>
                            <p className="text-gray-400 mb-6">게시글을 작성하려면 먼저 로그인해주세요.</p>
                            <div className="flex gap-3 justify-center">
                                <Link href="/login">
                                    <Button className="bg-blue-600 hover:bg-blue-700">로그인하기</Button>
                                </Link>
                                <Link href="/community">
                                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                                        돌아가기
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    // 태그 추가
    const addTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
            setTags([...tags, newTag.trim()])
            setNewTag("")
        }
    }

    // 태그 제거
    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove))
    }

    // 게시글 작성
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim() || !content.trim()) {
            toast({
                title: "입력 오류",
                description: "제목과 내용을 모두 입력해주세요.",
                variant: "destructive",
            })
            return
        }

        if (!user || (!userProfile && !user.displayName)) {
            toast({
                title: "인증 오류",
                description: "로그인 정보가 올바르지 않습니다.",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)

        try {
            const postData = {
                title: title.trim(),
                content: content.trim(),
                category,
                tags,
                author: userProfile?.username || user.displayName || "익명",
                authorId: user.uid,
                authorPhotoURL: userProfile?.photoURL || user.photoURL || null,
                isPinned: false, // 일반 유저는 고정 불가
                isNotice: false, // 일반 유저는 공지 불가
                viewCount: 0,
                commentCount: 0,
                // likeCount: 0, // Removed feature
                viewedBy: [],
                // likedBy: [], // Removed feature
                bookmarks: [],
                isPublished: true, // 즉시 게시
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            }

            const docRef = await addDoc(collection(db, "community_posts"), postData)

            toast({
                title: "게시글 작성 완료",
                description: "게시글이 성공적으로 작성되었습니다.",
            })

            router.push(`/community/${docRef.id}`)
        } catch (error: any) {
            console.error("Error creating post:", error)
            toast({
                title: "작성 실패",
                description: `게시글 작성 중 오류가 발생했습니다: ${error.message}`,
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-black text-white">
            <Navbar />

            <main className="flex-1 py-8">
                <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                    {/* 헤더 */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/community">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                돌아가기
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                                게시글 작성
                            </h1>
                            <p className="text-gray-400 mt-1">자유롭게 의견을 나누거나 질문해보세요.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <FileText className="h-5 w-5 text-blue-400" />
                                    기본 정보
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* 제목 */}
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-gray-300">제목 *</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="게시글 제목을 입력하세요"
                                        maxLength={100}
                                        required
                                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500"
                                    />
                                    <p className="text-xs text-gray-500 text-right">{title.length}/100자</p>
                                </div>

                                {/* 카테고리 */}
                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-gray-300">카테고리 *</Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                            <SelectValue placeholder="카테고리를 선택하세요" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                            {CATEGORIES.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id} className="focus:bg-gray-700 focus:text-white cursor-pointer">
                                                    <div className="flex items-center gap-2">
                                                        <cat.icon className="h-4 w-4" />
                                                        {cat.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* 태그 */}
                                <div className="space-y-2">
                                    <Label htmlFor="tags" className="text-gray-300">태그 (최대 5개)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="tags"
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            placeholder="태그를 입력하고 Enter를 누르세요"
                                            maxLength={20}
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault()
                                                    addTag()
                                                }
                                            }}
                                            className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={addTag}
                                            disabled={!newTag.trim() || tags.length >= 5}
                                            className="border-gray-700 text-gray-300 hover:bg-gray-700"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {tags.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="flex items-center gap-1 bg-gray-800 text-blue-300 border border-gray-700">
                                                    #{tag}
                                                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-red-400 transition-colors">
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-500">태그는 검색에 도움이 됩니다.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 내용 */}
                        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-white">내용 *</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="내용을 입력하세요. 마크다운을 지원합니다."
                                        rows={15}
                                        required
                                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 font-mono text-sm leading-relaxed"
                                    />
                                    <p className="text-xs text-gray-500 text-right">{content.length}자</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 작성 버튼 */}
                        <div className="flex justify-end gap-4">
                            <Link href="/community">
                                <Button variant="outline" disabled={isSubmitting} className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                                    취소
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        작성 중...
                                    </>
                                ) : (
                                    <>
                                        <FileText className="mr-2 h-4 w-4" />
                                        게시글 작성
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    )
}
