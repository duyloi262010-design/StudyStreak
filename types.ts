
export type Language = 'vi' | 'en';
export type TextbookSet = 'Kết nối tri thức' | 'Chân trời sáng tạo' | 'Cánh diều';

export type PetAvatarType = 'classic' | 'cyber' | 'nature' | 'magic' | 'ocean' | 'space' | 'fire' | 'zen';

export interface PetState {
  name: string;
  avatarType: PetAvatarType;
  xp: number; // Tổng EXP tích lũy (mỗi 100 lên 1 level)
  iq: number; // Điểm IQ (mặc định 50)
  level: number;
  lastTalkedAt: string | null;
}

export interface UserProfile {
  id: string; 
  username: string;
  avatar?: string;
  grade: string;
  subjectTextbooks: Record<string, TextbookSet>;
  schedule: Record<string, string[]>;
  streak: number;
  lastCompletedDate: string | null;
  lockoutUntil: number | null;
  pet: PetState;
  authMethod: 'google' | 'facebook' | 'guest';
  theme?: 'light' | 'dark';
  language: Language; 
  studyHistory: Record<string, number>; // Lưu thời gian học (giây) theo ngày: { "YYYY-MM-DD": seconds }
  dailyGoalHours?: number; // Mục tiêu giờ học mỗi ngày
}

export interface SubjectLesson {
  subject: string;
  lesson: string;
  textbook?: TextbookSet;
}

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  subject: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: QuestionDifficulty; // Độ khó mới
}

export interface QuizResult {
  score: number;
  total: number;
  timeSpent: number;
  date: string;
  passed: boolean;
  userAnswers: Record<string, number>;
  questions: Question[];
  xpGained: number; // EXP nhận được
  iqChange: number; // IQ thay đổi
}

export enum AppState {
  ACCOUNT_SELECTOR = 'ACCOUNT_SELECTOR',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  LESSON_INPUT = 'LESSON_INPUT',
  QUIZ = 'QUIZ',
  RESULT = 'RESULT',
  REVIEW = 'REVIEW',
  PET_CHAT = 'PET_CHAT',
  SCHEDULE_MANAGER = 'SCHEDULE_MANAGER',
  PROGRESS = 'PROGRESS'
}
