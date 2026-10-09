"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  getSubjects, getMaterials, getQuizzes, getStudents,
  getQuizResults, getProgress
} from "@/lib/data-service";
import { Subject, Material, Quiz, User, QuizResult, Progress } from "@/types";
import { LoadingState } from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import {
  Users, BookOpen, FileText, ClipboardList, PlusCircle,
  ChevronRight, Trophy, CheckCircle2, TrendingUp
} from "lucide-react";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [progressList, setProgressList] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [studData, subData, matData, qzData, resData, progData] = await Promise.all([
          getStudents(),
          getSubjects(),
          getMaterials(),
          getQuizzes(),
          getQuizResults(),
          getProgress(),
        ]);
        setStudents(studData);
        setSubjects(subData);
        setMaterials(matData);
        setQuizzes(qzData);
        // Sort newest first
        setResults(resData.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()));
        setProgressList(progData);
      } catch (err) {
        console.error("Error loading teacher dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <LoadingState message="Loading teacher classroom dashboard..." />;
  }

  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const teacherName = user?.name || "Teacher";

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* 1. TEACHER HEADER */}
      <section className="bg-white border rounded-xl p-6 sm:p-7 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-100">
            <span>Teacher Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {timeGreeting}, {teacherName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Government High School, Rampur • Monitor students, curriculum materials, and test results
          </p>
        </div>
      </section>

      {/* 2. OVERVIEW METRICS: Total Students, Total Subjects, Total Materials, Total Quizzes */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Students</span>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{students.length}</p>
          <p className="text-xs text-slate-500">Enrolled in Class 10</p>
        </div>

        <div className="bg-white border rounded-xl p-5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Subjects</span>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{subjects.length}</p>
          <p className="text-xs text-slate-500">Curriculum subjects</p>
        </div>

        <div className="bg-white border rounded-xl p-5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Materials</span>
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{materials.length}</p>
          <p className="text-xs text-slate-500">Notes & PDF documents</p>
        </div>

        <div className="bg-white border rounded-xl p-5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Quizzes</span>
            <ClipboardList className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{quizzes.length}</p>
          <p className="text-xs text-slate-500">Active test assessments</p>
        </div>
      </section>

      {/* 3. QUICK ACTIONS: Add Subject, Upload Material, Create Quiz */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 pt-1">Add Subject</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add, edit or update curriculum subjects for your class.
              </p>
            </div>
            <Link href="/admin/subjects">
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs gap-1.5">
                <PlusCircle className="h-4 w-4" />
                Add Subject
              </Button>
            </Link>
          </div>

          <div className="bg-white border rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 pt-1">Upload Material</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add study notes, chapter summaries, or PDF links for students.
              </p>
            </div>
            <Link href="/admin/materials">
              <Button size="sm" variant="outline" className="w-full font-semibold text-xs gap-1.5 border-slate-300">
                <PlusCircle className="h-4 w-4 text-emerald-700" />
                Upload Material
              </Button>
            </Link>
          </div>

          <div className="bg-white border rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="h-9 w-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <ClipboardList className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 pt-1">Create Quiz</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Create 4-option multiple-choice quizzes for any subject.
              </p>
            </div>
            <Link href="/admin/quizzes">
              <Button size="sm" variant="outline" className="w-full font-semibold text-xs gap-1.5 border-slate-300">
                <PlusCircle className="h-4 w-4 text-amber-700" />
                Create Quiz
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. RECENT STUDENT RESULTS: Student | Quiz | Score */}
      <section className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Student Results</h2>
            <p className="text-xs text-slate-500">Latest quiz test submissions by enrolled students</p>
          </div>
          <Link href="/admin/results">
            <Button variant="ghost" size="sm" className="text-xs text-blue-600 gap-1 font-semibold">
              View All Results <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {results.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed">
            No quiz submissions recorded yet. Once students take quizzes, their results appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b bg-slate-50 text-slate-600 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4">Quiz</th>
                  <th className="py-2.5 px-4 text-center">Score</th>
                  <th className="py-2.5 px-4">Reward</th>
                  <th className="py-2.5 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-800">
                {results.slice(0, 5).map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {r.studentName || "Student"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">{r.quizTitle || "Quiz"}</span>
                      <span className="text-slate-500 block text-[11px]">{r.subjectName || "Subject"}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold text-sm ${r.percentage >= 75 ? "text-emerald-700" : "text-slate-800"}`}>
                        {r.correctAnswers}/{r.totalQuestions} ({r.percentage}%)
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {r.rewardEarned && r.rewardEarned !== "None" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <Trophy className="h-3 w-3 text-amber-600" />
                          {r.rewardEarned}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-xs text-slate-500 whitespace-nowrap">
                      {new Date(r.completedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 5. CLASS PROGRESS & MONITORING */}
      <section className="bg-white border rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900">Student Progress & Class Overview</h2>
          <p className="text-xs text-slate-600">
            View detailed subject completion percentages and test score distributions.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/students">
            <Button variant="outline" size="sm" className="text-xs font-semibold">
              View Students
            </Button>
          </Link>
          <Link href="/admin/progress">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              Class Progress Report
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
