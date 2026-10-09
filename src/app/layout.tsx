import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "DigiLearn - Digital Learning Platform for Rural School Students",
  description: "A lightweight, mobile-first digital learning platform designed for rural school students. Access subjects, materials, quizzes, and track your progress.",
  keywords: "education, learning, rural, school, students, quizzes, progress",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className="min-h-screen antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
