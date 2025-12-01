// 사용자 생성 문제 타입
export interface UserQuestion {
  id: string
  type: "code" | "quiz" | "fill-blank" | "short-answer" | "multiple_choice" | "coding" | "fill_in_blank" | "essay"
  title: string
  description?: string
  content: string
  question?: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
  createdBy: string
  createdByName: string
  createdAt: { toDate: () => Date }
  isApproved: boolean
  likes: number
  likedBy: string[]
  reports: string[]
  explanation?: string

  // 코딩 문제 관련
  language?: string
  initialCode?: string
  starterCode?: string
  solution?: string
  testCases?: TestCase[]

  // 객관식/주관식 관련
  options?: string[]
  correctAnswer?: string | number
  sampleAnswer?: string
}

export interface TestCase {
  input: string
  expectedOutput: string
  description?: string
}

// 사용자 문제 제출 답안
export interface UserQuestionSubmission {
  id: string
  questionId: string
  userId: string
  userAnswer: string | number
  isCorrect: boolean
  submittedAt: { toDate: () => Date }
  executionResult?: {
    passed: boolean
    testResults: TestResult[]
    error?: string
  }
}

export interface TestResult {
  input: string
  expectedOutput: string
  actualOutput: string
  passed: boolean
}

// 커리큘럼 관련 타입 추가
export interface CurriculumCategory {
  id: string
  title: string
  name?: string // Added for compatibility
  description: string
  order: number
  slug: string
  imageUrl?: string
  isVisible: boolean
  createdAt: any
  updatedAt: any
  createdBy?: string // Added
}

export interface CurriculumStep {
  id: string
  title: string
  description: string
  order: number
  content?: string
  videoUrl?: string
  type: "video" | "text" | "quiz" | "project"
  duration?: number // 분 단위
  isOptional: boolean
}

export interface Curriculum {
  id: string
  title: string
  description: string
  categories: CurriculumCategory[]
  category?: string // Added for compatibility
  tags: string[]
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Easy" | "Medium" | "Hard" | "Expert" // Expanded
  estimatedDuration: number // 시간 단위
  estimatedTime?: string
  thumbnailUrl?: string
  isVisible: boolean
  createdAt: any
  updatedAt: any
  prerequisites?: string[]
  learningObjectives?: string[]
  instructor?: string
  courseType?: string
  rating?: number
  enrollmentCount?: number
  steps?: CurriculumStep[]
  totalSteps?: number
  password?: string
  isPasswordProtected?: boolean
  createdByName?: string
  createdBy?: string
  viewCount?: number
  content?: string
  isPublished?: boolean // Added
  tier?: number // Added
}

export interface Banner {
  id: string
  imageUrl: string
  linkUrl?: string
  title?: string
  description?: string
  order: number
  isActive: boolean
  backgroundColor?: string // Added
  textColor?: string // Added
  buttonText?: string // Added
  buttonColor?: string // Added
  createdAt?: any // Added
  updatedAt?: any // Added
  createdBy?: string // Added
  startDate?: any // Added
  endDate?: any // Added
}

export interface Slide {
  id: string
  order: number
  content: string
  type: "text" | "image" | "code" | "title" | "list"
  title?: string
  imageUrl?: string
  codeLanguage?: string
  layout?: "center" | "left" | "right" | "split"
  notes?: string
}

export interface UserCurriculumProgress {
  userId: string
  curriculumId: string
  completedSteps: string[]
  lastAccessedStepId?: string
  startedAt: any
  completedAt?: any
  progress: number // 0-100
}
