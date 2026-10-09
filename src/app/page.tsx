"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap, BookOpen, ClipboardList, Trophy, TrendingUp,
  Smartphone, UserCheck, ShieldCheck
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const subjects = [
  { name: "Science", desc: "Human body, organ systems, biology, and everyday forces", icon: "🔬" },
  { name: "Mathematics", desc: "Fractions, arithmetic, geometry, and problem solving", icon: "📐" },
  { name: "English", desc: "Parts of speech, grammar rules, reading, and vocabulary", icon: "📖" },
  { name: "Social Science", desc: "Indian freedom movement, geography, and civics", icon: "🌍" },
  { name: "Computer Science", desc: "Hardware basics, software, typing, and digital safety", icon: "💻" },
];

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(user.role === "admin" ? "/admin/dashboard" : "/student/dashboard");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base leading-tight block">
                Digital Learning Platform
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:block">
                For Rural School Students
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm" className="text-xs font-semibold">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-12 sm:py-16 px-4 bg-white border-b">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-100">
              <span>School Education Initiative</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Digital Learning Platform
              <span className="block text-blue-600 mt-1 font-bold text-2xl sm:text-3xl">
                for Rural School Students
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Learning made simple and accessible for rural school students. Access curriculum study notes, take practice quizzes, earn appreciation badges, and track your progress.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-3">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2">
                  <UserCheck className="h-4 w-4" />
                  Student Login
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold gap-2">
                  <ShieldCheck className="h-4 w-4 text-slate-700" />
                  Teacher Login
                </Button>
              </Link>
            </div>

            <p className="text-xs text-slate-500 pt-2 font-mono">
              Demo accounts: student@example.com (demo123) • admin@example.com (admin123)
            </p>
          </div>
        </section>

        {/* Subjects Section */}
        <section className="py-12 px-4 max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">Academic Subjects</h2>
            <p className="text-sm text-slate-600">Standard Class 10 school syllabus notes and quizzes</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((sub) => (
              <Card key={sub.name} className="border bg-white hover:border-blue-300 transition-colors shadow-sm">
                <CardContent className="p-5 flex items-start gap-3.5">
                  <span className="text-3xl p-2 bg-slate-50 border rounded-lg shrink-0">{sub.icon}</span>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-slate-900">{sub.name}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{sub.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Platform Key Features */}
        <section className="py-12 px-4 bg-white border-t border-b">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">How It Helps Rural Students</h2>
              <p className="text-sm text-slate-600">Designed to be simple, fast, and easy to use on mobile phones</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl border bg-slate-50 space-y-2">
                <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Simple Study Notes</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Concise chapter summaries and notes that load quickly without requiring high-speed broadband.
                </p>
              </div>

              <div className="p-5 rounded-xl border bg-slate-50 space-y-2">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Self-Assessment Quizzes</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Interactive 10-question multiple-choice quizzes that calculate your score instantly with full answer review.
                </p>
              </div>

              <div className="p-5 rounded-xl border bg-slate-50 space-y-2">
                <div className="h-10 w-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Trophy className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">75% Appreciation Rewards</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Score 75% or higher to unlock appreciation awards like &ldquo;Great Achievement&rdquo; and &ldquo;Excellent Learner&rdquo;.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 Digital Learning Platform for Rural School Students</p>
          <p>College Educational Project • Designed for Rural Schools</p>
        </div>
      </footer>
    </div>
  );
}
