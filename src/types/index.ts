// Types for the Digital Learning Platform

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  className?: string;
  school?: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  className: string;
  image: string;
  createdAt: string;
}

export interface Material {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  type: "pdf" | "note" | "video";
  fileUrl?: string;
  videoUrl?: string;
  content?: string;
  createdAt: string;
  createdBy: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index 0-3
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  className: string;
  questions: QuizQuestion[];
  createdAt: string;
  createdBy: string;
}

export interface QuizResult {
  id: string;
  studentId: string;
  studentName?: string;
  quizId: string;
  quizTitle?: string;
  subjectId: string;
  subjectName?: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  percentage: number;
  rewardEarned: string;
  completedAt: string;
}

export interface Progress {
  id: string;
  studentId: string;
  subjectId: string;
  subjectName?: string;
  materialsCompleted: number;
  quizzesCompleted: number;
  averageScore: number;
  progressPercentage: number;
  updatedAt: string;
}

export interface Reward {
  id: string;
  studentId: string;
  quizId: string;
  quizTitle?: string;
  subjectId: string;
  subjectName?: string;
  percentage: number;
  badgeName: string;
  message: string;
  earnedAt: string;
}
