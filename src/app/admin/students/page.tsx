"use client";

import { useState, useEffect } from "react";
import { getStudents, getQuizResults, getProgress } from "@/lib/data-service";
import { User, QuizResult, Progress } from "@/types";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Search, School, BookOpen, Calendar, Award } from "lucide-react";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [progressList, setProgressList] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [studs, res, prog] = await Promise.all([
          getStudents(),
          getQuizResults(),
          getProgress(),
        ]);
        setStudents(studs);
        setResults(res);
        setProgressList(prog);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <LoadingState message="Loading student directory..." />;
  }

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.school && s.school.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Student Directory</h1>
          <p className="text-sm text-muted-foreground">
            View enrolled rural students, schools, classes, and participation stats
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students or schools..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="h-12 w-12 text-muted-foreground" />}
          title="No students found"
          description="Try modifying your search criteria."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((student) => {
            const studentResults = results.filter((r) => r.studentId === student.id);
            const studentProg = progressList.filter((p) => p.studentId === student.id);
            const completedMats = studentProg.reduce((acc, p) => acc + (p.materialsCompleted || 0), 0);
            const avgScore = studentResults.length > 0
              ? Math.round(studentResults.reduce((acc, r) => acc + r.percentage, 0) / studentResults.length)
              : 0;

            return (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                      {student.name.charAt(0)}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {student.className || "Class 10"}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold mt-2">{student.name}</CardTitle>
                  <CardDescription className="text-xs">{student.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <School className="h-3.5 w-3.5 shrink-0" />
                    <span className="line-clamp-1">{student.school || "Rural Government School"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      Joined {new Date(student.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t text-center">
                    <div className="bg-muted/40 p-2 rounded-lg">
                      <span className="text-[10px] text-muted-foreground block">Materials</span>
                      <span className="font-bold text-sm">{completedMats}</span>
                    </div>
                    <div className="bg-muted/40 p-2 rounded-lg">
                      <span className="text-[10px] text-muted-foreground block">Quizzes</span>
                      <span className="font-bold text-sm">{studentResults.length}</span>
                    </div>
                    <div className="bg-muted/40 p-2 rounded-lg">
                      <span className="text-[10px] text-muted-foreground block">Avg Score</span>
                      <span className="font-bold text-sm text-primary">{avgScore}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
