"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  getSubjects, getMaterials, getQuizzes, getProgress, getRewards,
  getQuizResults, markMaterialComplete
} from "@/lib/data-service";
import { Subject, Material, Quiz, Progress, Reward, QuizResult } from "@/types";
import { LoadingState } from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import {
  BookOpen, Trophy, ArrowRight, CheckCircle2,
  FileText, Video, X, Award, ChevronRight, HelpCircle
} from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [progressList, setProgressList] = useState<Progress[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Lesson reader modal
  const [activeMaterial, setActiveMaterial] = useState<Material | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const [subData, matData, qzData, progData, rewData, resData] = await Promise.all([
          getSubjects(),
          getMaterials(),
          getQuizzes(),
          getProgress(user.id),
          getRewards(user.id),
          getQuizResults(user.id),
        ]);
        setSubjects(subData);
        setMaterials(matData);
        setQuizzes(qzData);
        setProgressList(progData);
        setRewards(rewData);
        setResults(resData);
      } catch (err) {
        console.error("Error loading student dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleMarkComplete = async (mat: Material) => {
    if (!user) return;
    const sub = subjects.find((s) => s.id === mat.subjectId);
    try {
      await markMaterialComplete(user.id, mat.subjectId, sub?.name || "Subject");
      const updatedProg = await getProgress(user.id);
      setProgressList(updatedProg);
      setActiveMaterial(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingState message="Loading your student classroom..." />;
  }

  // Greeting
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const studentName = user?.name ? user.name.split(" ")[0] : "Student";

  // Science / Human Body focus for Continue Learning
  const scienceSubject = subjects.find(s => s.name.toLowerCase().includes("science")) || subjects[0];
  const humanBodyMaterial = materials.find(m => m.id === "mat-1") || materials[0];
  const scienceProg = progressList.find(p => p.subjectId === (scienceSubject?.id || "sub-1"));
  const scienceProgressPct = scienceProg?.progressPercentage ?? 60;

  // Recent quiz results
  const recentResults = results.length > 0 ? results.slice(0, 3) : [
    {
      id: "demo-res-1",
      studentId: user?.id || "student-1",
      quizId: "quiz-1",
      quizTitle: "Science Quiz",
      subjectId: "sub-1",
      subjectName: "Science",
      totalQuestions: 10,
      correctAnswers: 8,
      wrongAnswers: 2,
      percentage: 80,
      rewardEarned: "Great Achievement",
      completedAt: new Date().toISOString(),
    },
    {
      id: "demo-res-2",
      studentId: user?.id || "student-1",
      quizId: "quiz-2",
      quizTitle: "Math Quiz",
      subjectId: "sub-2",
      subjectName: "Mathematics",
      totalQuestions: 5,
      correctAnswers: 3,
      wrongAnswers: 2,
      percentage: 70,
      rewardEarned: "None",
      completedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  // Primary reward display
  const primaryReward = rewards[0] || (results.some(r => r.percentage >= 80) ? {
    id: "rew-featured",
    studentId: user?.id || "student-1",
    quizId: "quiz-1",
    quizTitle: "Human Body Quiz",
    percentage: 80,
    badgeName: "Great Achievement",
    message: "Excellent work! You are making great progress.",
    earnedAt: new Date().toISOString(),
  } : null);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* 1. STUDENT HEADER & GREETING */}
      <section className="bg-white border rounded-xl p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            <span>Class 10 Student Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {timeGreeting}, {studentName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {user?.school || "Government High School, Rampur"} • Learning made simple and accessible
          </p>
        </div>

        <Link href="/student/subjects">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2 text-xs sm:text-sm">
            <BookOpen className="h-4 w-4" />
            Explore Subjects
          </Button>
        </Link>
      </section>

      {/* 2. CONTINUE LEARNING SECTION */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Continue Learning</h2>
        <div className="bg-white border rounded-xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-lg">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Science
              </span>
              <span className="text-xs text-slate-500 font-medium">Chapter 1</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Human Body
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Learn about the major organs of the human body and their functions including digestive, circulatory, and respiratory systems.
            </p>

            <div className="pt-2 max-w-xs space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span>Progress: {scienceProgressPct}%</span>
              </div>
              <ProgressBar value={scienceProgressPct} className="h-2" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
            {humanBodyMaterial && (
              <Button
                variant="outline"
                className="gap-2 font-semibold text-xs sm:text-sm w-full sm:w-auto"
                onClick={() => setActiveMaterial(humanBodyMaterial)}
              >
                <BookOpen className="h-4 w-4 text-blue-600" />
                Read Lesson
              </Button>
            )}
            <Link href="/student/quizzes/quiz-1" className="w-full sm:w-auto">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2 text-xs sm:text-sm w-full sm:w-auto">
                <span>Continue Learning</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. MY SUBJECTS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">My Subjects</h2>
          <Link href="/student/subjects" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
            View all subjects <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((sub) => {
            const subProg = progressList.find(p => p.subjectId === sub.id);
            const pct = subProg?.progressPercentage ?? (sub.id === "sub-1" ? 80 : sub.id === "sub-2" ? 65 : sub.id === "sub-3" ? 70 : 50);

            return (
              <div
                key={sub.id}
                className="bg-white border rounded-xl p-4 sm:p-5 flex flex-col justify-between hover:border-blue-300 transition-colors shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl p-1 bg-slate-50 border rounded-lg">{sub.image || "📚"}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {sub.className || "Class 10"}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-1">{sub.name}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {sub.description}
                  </p>
                </div>

                <div className="space-y-2.5 pt-3 border-t">
                  <div className="flex justify-between text-xs text-slate-600 font-medium">
                    <span>Syllabus Progress</span>
                    <span className="font-bold text-slate-900">{pct}%</span>
                  </div>
                  <ProgressBar value={pct} className="h-1.5" />

                  <Link href={`/student/subjects/${sub.id}`} className="block pt-1">
                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                      Open {sub.name}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. RECENT QUIZ RESULTS & 5. MY PROGRESS & 6. MY REWARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Quiz Results */}
        <section className="bg-white border rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Quiz Results</h2>
              <p className="text-xs text-slate-500">Your latest test attempts</p>
            </div>
            <Link href="/student/quizzes/history">
              <Button variant="ghost" size="sm" className="text-xs p-1 h-7 text-blue-600">
                History
              </Button>
            </Link>
          </div>

          <div className="divide-y text-xs space-y-1">
            {recentResults.map((res) => (
              <div key={res.id} className="pt-2.5 pb-2 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 text-sm">
                    {res.quizTitle || `${res.subjectName} Quiz`}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {res.correctAnswers} of {res.totalQuestions} correct
                  </p>
                </div>
                <div className="text-right">
                  <span className={`font-bold text-sm ${res.percentage >= 75 ? "text-emerald-600" : "text-slate-800"}`}>
                    {res.percentage}%
                  </span>
                  {res.rewardEarned && res.rewardEarned !== "None" && (
                    <span className="block text-[10px] text-amber-700 font-semibold">
                      🏆 {res.rewardEarned}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Link href="/student/quizzes" className="block pt-2">
            <Button variant="outline" size="sm" className="w-full text-xs font-medium">
              Take Another Quiz
            </Button>
          </Link>
        </section>

        {/* My Progress */}
        <section className="bg-white border rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b">
            <div>
              <h2 className="text-base font-bold text-slate-900">My Progress</h2>
              <p className="text-xs text-slate-500">Subject-wise syllabus completion</p>
            </div>
            <Link href="/student/progress">
              <Button variant="ghost" size="sm" className="text-xs p-1 h-7 text-blue-600">
                Details
              </Button>
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            {subjects.slice(0, 3).map((sub) => {
              const p = progressList.find(pr => pr.subjectId === sub.id);
              const pct = p?.progressPercentage ?? (sub.id === "sub-1" ? 80 : sub.id === "sub-2" ? 65 : 70);

              return (
                <div key={sub.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-800 font-semibold">{sub.name}</span>
                    <span className="text-blue-700 font-bold">{pct}%</span>
                  </div>
                  <ProgressBar value={pct} className="h-1.5" />
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t text-center">
            <Link href="/student/progress">
              <Button variant="outline" size="sm" className="w-full text-xs font-medium">
                View Full Progress Report
              </Button>
            </Link>
          </div>
        </section>

        {/* My Rewards */}
        <section className="bg-white border rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b">
            <div>
              <h2 className="text-base font-bold text-slate-900">My Rewards</h2>
              <p className="text-xs text-slate-500">Honors for 75%+ scores</p>
            </div>
            <Link href="/student/rewards">
              <Button variant="ghost" size="sm" className="text-xs p-1 h-7 text-blue-600">
                All
              </Button>
            </Link>
          </div>

          {primaryReward ? (
            <div className="p-3.5 rounded-lg border bg-amber-50/70 border-amber-200 space-y-1.5">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-600 shrink-0" />
                <span className="font-bold text-sm text-slate-900">
                  {primaryReward.badgeName}
                </span>
                <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  {primaryReward.percentage}%
                </span>
              </div>
              <p className="text-xs text-slate-600 italic">
                &ldquo;{primaryReward.message}&rdquo;
              </p>
            </div>
          ) : (
            <div className="py-6 text-center space-y-1 bg-slate-50 rounded-lg border border-dashed p-3">
              <Trophy className="h-7 w-7 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">No Rewards Yet</p>
              <p className="text-[11px] text-slate-500">Score 75% or higher on any quiz to unlock a badge!</p>
            </div>
          )}

          <Link href="/student/rewards" className="block pt-2">
            <Button variant="outline" size="sm" className="w-full text-xs font-medium">
              View My Rewards
            </Button>
          </Link>
        </section>
      </div>

      {/* Lesson Reader Modal */}
      {activeMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-xl border shadow-xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase">
                  Lesson Note
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-1">{activeMaterial.title}</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setActiveMaterial(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="prose max-w-none text-xs sm:text-sm whitespace-pre-line leading-relaxed text-slate-800">
                {activeMaterial.content || "Lesson content is loading..."}
              </div>
            </div>

            <div className="p-4 border-t flex justify-between items-center bg-slate-50">
              <Link href="/student/quizzes/quiz-1">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5 text-xs">
                  <HelpCircle className="h-4 w-4" />
                  Take Human Body Quiz (10 Qs)
                </Button>
              </Link>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setActiveMaterial(null)} className="text-xs">
                  Close
                </Button>
                <Button size="sm" onClick={() => handleMarkComplete(activeMaterial)} className="text-xs gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Mark Read
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
