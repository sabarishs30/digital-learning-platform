"use client";

import { useState, useEffect } from "react";
import { getQuizResults, getSubjects } from "@/lib/data-service";
import { QuizResult, Subject } from "@/types";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Trophy, CheckCircle2, BarChart3, Filter } from "lucide-react";

export default function AdminResultsPage() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedBadge, setSelectedBadge] = useState("all");

  useEffect(() => {
    async function loadData() {
      try {
        const [res, subs] = await Promise.all([getQuizResults(), getSubjects()]);
        // Sort newest first
        setResults(res.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()));
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
    return <LoadingState message="Loading student quiz results..." />;
  }

  const filtered = results.filter((r) => {
    const studentName = r.studentName || "";
    const quizTitle = r.quizTitle || "";
    const matchesSearch =
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quizTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "all" || r.subjectId === selectedSubject;
    const matchesBadge =
      selectedBadge === "all" ||
      (selectedBadge === "none" ? !r.rewardEarned || r.rewardEarned === "None" : r.rewardEarned === selectedBadge);

    return matchesSearch && matchesSubject && matchesBadge;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quiz Results</h1>
        <p className="text-sm text-muted-foreground">
          See student scores and recent test submissions across your classroom
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student or quiz name..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            className="h-10 rounded-lg border border-input bg-background px-3 py-1 text-sm ring-offset-background"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="all">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            className="h-10 rounded-lg border border-input bg-background px-3 py-1 text-sm ring-offset-background"
            value={selectedBadge}
            onChange={(e) => setSelectedBadge(e.target.value)}
          >
            <option value="all">All Awards</option>
            <option value="Excellent Learner">Excellent Learner (90-100%)</option>
            <option value="Great Achievement">Great Achievement (80-89%)</option>
            <option value="Good Effort">Good Effort (75-79%)</option>
            <option value="none">No Reward (&lt;75%)</option>
          </select>
        </div>
      </div>

      {/* Results Table */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<BarChart3 className="h-12 w-12 text-muted-foreground" />}
                title="No results found"
                description="No quiz attempts match your selected search or filter options."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Quiz Title</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4 text-center">Correct / Total</th>
                    <th className="py-3 px-4 text-center">Percentage</th>
                    <th className="py-3 px-4">Reward Badge</th>
                    <th className="py-3 px-4">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        {r.studentName || "Ravi Kumar"}
                      </td>
                      <td className="py-3.5 px-4 font-medium">{r.quizTitle || "Quiz"}</td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {r.subjectName || "Subject"}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                          {r.correctAnswers} / {r.totalQuestions}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-extrabold text-primary text-base">
                          {r.percentage}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {r.rewardEarned && r.rewardEarned !== "None" ? (
                          <Badge
                            variant={
                              r.rewardEarned === "Excellent Learner"
                                ? "warning"
                                : r.rewardEarned === "Great Achievement"
                                ? "default"
                                : "success"
                            }
                            className="gap-1 text-xs"
                          >
                            <Trophy className="h-3 w-3" />
                            {r.rewardEarned}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Keep Practicing</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(r.completedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
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
        </CardContent>
      </Card>
    </div>
  );
}
