"use client";

import { useState, useEffect } from "react";
import { getProgress, getStudents, getSubjects } from "@/lib/data-service";
import { Progress, User, Subject } from "@/types";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { TrendingUp, Search, BookOpen, Award, CheckCircle2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";

export default function AdminProgressPage() {
  const [progressList, setProgressList] = useState<Progress[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    async function loadData() {
      try {
        const [prog, studs, subs] = await Promise.all([
          getProgress(),
          getStudents(),
          getSubjects(),
        ]);
        setProgressList(prog);
        setStudents(studs);
        setSubjects(subs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <LoadingState message="Aggregating student progress analytics..." />;
  }

  // Chart data: overall subject progress across students
  const subjectAverages = subjects.map((sub) => {
    const records = progressList.filter((p) => p.subjectId === sub.id);
    const avgProg = records.length > 0
      ? Math.round(records.reduce((acc, r) => acc + r.progressPercentage, 0) / records.length)
      : 0;
    const avgScore = records.length > 0
      ? Math.round(records.reduce((acc, r) => acc + r.averageScore, 0) / records.length)
      : 0;

    return {
      name: sub.name,
      AvgProgress: avgProg,
      AvgScore: avgScore,
    };
  });

  const filteredProgress = progressList.filter((p) => {
    const student = students.find((s) => s.id === p.studentId);
    const studentName = student?.name || "Student";
    const subName = p.subjectName || "";
    return (
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Class Progress</h1>
        <p className="text-sm text-muted-foreground">
          See how your students are progressing across each subject and topic
        </p>
      </div>

      {/* Aggregate Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Class-wide Subject Performance</CardTitle>
          <CardDescription>
            Average syllabus completion and test scores across all rural school students
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isClient && (
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectAverages} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.5rem",
                      fontSize: "0.85rem",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                  <Bar dataKey="AvgProgress" name="Average Progress (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="AvgScore" name="Average Score (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Progress Detail Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
          <div>
            <CardTitle className="text-lg">Student Progress Records</CardTitle>
            <CardDescription>Individual subject completion breakdown</CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search progress..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredProgress.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<TrendingUp className="h-12 w-12 text-muted-foreground" />}
                title="No progress data found"
                description="As students complete materials and quizzes, their progress records will appear here."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Materials Read</th>
                    <th className="py-3 px-4">Quizzes Taken</th>
                    <th className="py-3 px-4">Average Score</th>
                    <th className="py-3 px-4 w-48">Completion (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProgress.map((p) => {
                    const student = students.find((s) => s.id === p.studentId);
                    return (
                      <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-foreground">
                          {student?.name || "Ravi Kumar"}
                        </td>
                        <td className="py-3.5 px-4">{p.subjectName || "Subject"}</td>
                        <td className="py-3.5 px-4 text-muted-foreground">
                          {p.materialsCompleted} completed
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground">
                          {p.quizzesCompleted} tests
                        </td>
                        <td className="py-3.5 px-4 font-bold text-primary">
                          {p.averageScore}%
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <ProgressBar value={p.progressPercentage} className="h-2 flex-1" />
                            <span className="text-xs font-semibold w-9 text-right">
                              {p.progressPercentage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
