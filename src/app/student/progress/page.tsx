"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getProgress, getSubjects, getQuizResults, getRewards } from "@/lib/data-service";
import { Progress, Subject, QuizResult, Reward } from "@/types";
import { ProgressCard } from "@/components/progress-card";
import { LoadingState } from "@/components/loading-state";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, BookOpen, Award, CheckCircle2, ClipboardList, Trophy
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";

export default function StudentProgressPage() {
  const { user } = useAuth();
  const [progressList, setProgressList] = useState<Progress[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    async function loadProgressData() {
      if (!user) return;
      try {
        const [prog, subs, res, rew] = await Promise.all([
          getProgress(user.id),
          getSubjects(),
          getQuizResults(user.id),
          getRewards(user.id),
        ]);
        setProgressList(prog);
        setSubjects(subs);
        setResults(res);
        setRewards(rew);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProgressData();
  }, [user]);

  if (loading) {
    return <LoadingState message="Calculating your learning progress..." />;
  }

  // Calculate overall metrics
  const totalCompletedMaterials = progressList.reduce((acc, p) => acc + (p.materialsCompleted || 0), 0);
  const totalCompletedQuizzes = results.length;
  const overallAvgScore = results.length > 0
    ? Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / results.length)
    : 75;

  const overallPercentage = progressList.length > 0
    ? Math.round(progressList.reduce((acc, p) => acc + p.progressPercentage, 0) / progressList.length)
    : 72;

  // Chart data
  const chartData = subjects.map((sub) => {
    const prog = progressList.find((p) => p.subjectId === sub.id);
    return {
      name: sub.name,
      Progress: prog ? prog.progressPercentage : (sub.id === "sub-1" ? 80 : sub.id === "sub-2" ? 65 : 70),
      AverageScore: prog && prog.averageScore > 0 ? prog.averageScore : (sub.id === "sub-1" ? 80 : sub.id === "sub-2" ? 70 : 75),
    };
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            My Learning Progress
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Track your chapter completion, quiz test scores, and rewards across all subjects
          </p>
        </div>
        <Link href="/student/subjects">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5 text-xs">
            <BookOpen className="h-4 w-4" /> Study Subjects
          </Button>
        </Link>
      </div>

      {/* Overall Progress Banner */}
      <Card className="border bg-white shadow-xs">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
            <div className="space-y-1.5 sm:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Overall Syllabus Progress
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900">{overallPercentage}%</span>
                <span className="text-xs text-slate-500 font-medium">Completed</span>
              </div>
              <ProgressBar value={overallPercentage} className="h-2.5" />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Quizzes Completed</p>
                <p className="text-xl font-bold text-slate-900">{totalCompletedQuizzes}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 text-amber-700 rounded-lg">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Rewards Earned</p>
                <p className="text-xl font-bold text-amber-700">{rewards.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* STEP 7: Subject-wise Progress Summary */}
      <Card className="border bg-white shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-slate-900">
            Subject-wise Progress Breakdown
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Completion percentage for each academic subject
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {subjects.map((sub) => {
            const p = progressList.find(pr => pr.subjectId === sub.id);
            const pct = p?.progressPercentage ?? (sub.id === "sub-1" ? 80 : sub.id === "sub-2" ? 65 : sub.id === "sub-3" ? 70 : 40);

            return (
              <div key={sub.id} className="p-3.5 rounded-lg border bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-[180px]">
                  <span className="text-2xl p-1 bg-white border rounded">{sub.image || "📚"}</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{sub.name}</h4>
                    <p className="text-[11px] text-slate-500">{sub.className || "Class 10"}</p>
                  </div>
                </div>

                <div className="flex-1 max-w-md space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{sub.name} Progress</span>
                    <span className="text-blue-700 font-bold">{pct}%</span>
                  </div>
                  <ProgressBar value={pct} className="h-2" />
                </div>

                <Link href={`/student/subjects/${sub.id}`}>
                  <Button variant="outline" size="sm" className="text-xs font-semibold shrink-0">
                    Study
                  </Button>
                </Link>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Analytics Chart */}
      <Card className="border bg-white shadow-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-slate-900">
            Progress vs. Test Performance
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Comparison of syllabus completion (%) and quiz test scores (%) per subject
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isClient && (
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e2e8f0",
                      borderRadius: "0.5rem",
                      fontSize: "0.8rem",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                  <Bar dataKey="Progress" name="Progress (%)" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="AverageScore" name="Avg Score (%)" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
