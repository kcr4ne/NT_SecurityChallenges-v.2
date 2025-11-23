import { format, formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"
import {
  Megaphone,
  HelpCircle,
  MessageSquare,
  Briefcase,
  Info,
  Code,
  BookOpen,
  UserPlus,
  Trophy,
  Star,
  TrendingUp,
  FileText,
} from "lucide-react"

export function cn(...inputs: any) {
  return inputs.filter(Boolean).join(" ")
}

export const formatDate = (date: any) => {
  if (!date) return "날짜 없음"

  try {
    const jsDate = getTimestampDate(date)
    return format(jsDate, "yyyy년 MM월 dd일", { locale: ko })
  } catch (error) {
    console.error("Date formatting error:", error)
    return "날짜 형식 오류"
  }
}

export const getTimestampDate = (timestamp: any): Date => {
  if (!timestamp) return new Date()
  if (timestamp.toDate) return timestamp.toDate()
  if (timestamp instanceof Date) return timestamp
  if (typeof timestamp === "string") return new Date(timestamp)
  if (typeof timestamp === "number") return new Date(timestamp)
  return new Date()
}

export const formatRelativeTime = (date: any) => {
  if (!date) return ""
  try {
    const jsDate = getTimestampDate(date)
    return formatDistanceToNow(jsDate, { addSuffix: true, locale: ko })
  } catch (error) {
    return ""
  }
}

export const formatDateTime = (date: any) => {
  if (!date) return ""
  try {
    const jsDate = getTimestampDate(date)
    return format(jsDate, "yyyy.MM.dd HH:mm", { locale: ko })
  } catch (error) {
    return ""
  }
}

export const categoryIcons: Record<string, any> = {
  "공지사항": Megaphone,
  "Q&A": HelpCircle,
  "자유게시판": MessageSquare,
  "이직/커리어": Briefcase,
  "정보공유": Info,
  "테크": Code,
  "스터디": BookOpen,
  "팀원모집": UserPlus,
  "대회": Trophy,
  "행사홍보": Megaphone,
  "후기": Star,
  "인기글": TrendingUp,
  "기타": FileText,
}

export const difficultyColors: Record<string, string> = {
  "초급": "text-green-500",
  "중급": "text-blue-500",
  "고급": "text-purple-500",
  "대회": "text-yellow-500",
  "레벨 1": "text-green-500",
  "레벨 2": "text-green-600",
  "레벨 3": "text-blue-400",
  "레벨 4": "text-blue-500",
  "레벨 5": "text-blue-600",
  "레벨 6": "text-purple-400",
  "레벨 7": "text-purple-500",
  "레벨 8": "text-purple-600",
  "레벨 9": "text-red-500",
  "레벨 10": "text-red-600",
}
