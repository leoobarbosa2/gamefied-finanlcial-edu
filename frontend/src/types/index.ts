// ─── Auth ─────────────────────────────────────────────────────────────────

export type UserRole = 'STUDENT' | 'ADMIN'
export type UserPlan = 'FREE' | 'PRO'

export interface User {
  id: string
  email: string
  displayName: string
  avatarUrl?: string | null
  dailyGoalMins: number
  role: UserRole
  plan: UserPlan
  createdAt?: string
  streak?: {
    currentStreak: number
    longestStreak: number
    lastActivityAt: string | null
  }
}

export interface AuthTokens {
  accessToken: string
}

export interface AuthResponse {
  user: User
  accessToken: string
}

// ─── Learning Path ─────────────────────────────────────────────────────────

export interface LearningPath {
  id: string
  slug: string
  title: string
  description: string
  iconName: string
  colorToken: string
  orderIndex: number
  isPremium: boolean
  totalLessons: number
  completedLessons: number
  completionPct: number
}

export interface LearningPathDetail extends Omit<LearningPath, 'totalLessons' | 'completedLessons' | 'completionPct'> {
  lessons: LessonSummary[]
}

// ─── Lessons ───────────────────────────────────────────────────────────────

export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
export type StepType = 'READ' | 'QUIZ' | 'REFLECT'

export interface LessonSummary {
  id: string
  title: string
  description?: string | null
  orderIndex: number
  estimatedMins: number
  status: ProgressStatus
  score: number | null
}

export interface LessonStep {
  id: string
  stepType: StepType
  orderIndex: number
  content: ReadContent | QuizContent | ReflectContent
  questions: Question[]
}

export interface ReadContent {
  type: 'READ'
  heading: string
  body: string
  tip?: string
}

export interface QuizContent {
  type: 'QUIZ'
}

export interface ReflectContent {
  type: 'REFLECT'
  prompt: string
  hint?: string
}

export interface Question {
  id: string
  questionText: string
  options: QuestionOption[]
}

export interface QuestionOption {
  id: string
  text: string
  orderIndex: number
}

export interface Lesson {
  id: string
  title: string
  description?: string | null
  estimatedMins: number
  path: { id: string; slug: string; title: string }
  steps: LessonStep[]
  progress: {
    status: ProgressStatus
    lastStepIndex: number
    score: number | null
  } | null
}

// ─── Progress ──────────────────────────────────────────────────────────────

export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActivityAt: string | null
  weekActivity: boolean[]
}

export interface ProgressSummary {
  totalCompleted: number
  currentStreak: number
  longestStreak: number
  lastActivityAt: string | null
}

// ─── Dashboard ─────────────────────────────────────────────────────────────

export interface ContinueLesson {
  lessonId: string
  lessonTitle: string
  pathSlug: string
  pathTitle: string
  estimatedMins: number
}

export interface DashboardData {
  greeting: string
  streak: StreakData
  dailyGoal: {
    targetMins: number
    completedToday: number
  }
  continueLesson: ContinueLesson | null
  recommendedPaths: LearningPath[]
}

// ─── API Response wrapper ──────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  timestamp: string
}

// ─── Answer submission ─────────────────────────────────────────────────────

export interface AnswerResult {
  isCorrect: boolean
  explanation: string | null
  correctOptionId: string | null
}

// ─── Daily Limit ────────────────────────────────────────────────────────────

export interface DailyLimitStatus {
  used: number
  limit: number
  canLearn: boolean
  resetAt: string
}

// ─── User Metrics ──────────────────────────────────────────────────────────

export interface UserMetrics {
  totalCompleted: number
  averageScore: number | null
  totalTimeSpentSecs: number
  weeklyCompleted: number
}
