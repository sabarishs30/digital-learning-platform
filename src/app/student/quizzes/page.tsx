"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getQuizzes, getQuizResults, getSubjects } from "@/lib/data-service";
import { Quiz, QuizResult, Subject } from "@/types";
import { QuizCard } from "@/components/quiz-card";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { Search, History, HelpCircle } from "lucide-react";

export default function QuizzesListPage() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  useEffect(() => {
    async function loadData() {
      try {
        const [qzs, res, subs] = await Promise.all([
          getQuizzes(),
          user ? getQuizResults(user.id) : Promise.resolve([]),
          getSubjects(),
        ]);
        setQuizzes(qzs);
        setResults(res);
        setSubjects(subs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (loading) {
    return <LoadingState message="Loading quizzes..." />;
  }

  const filteredQuizzes = quizzes.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "all" || q.subjectId === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const getLatestScore = (quizId: string) => {
    const quizResults = results.filter((r) => r.quizId === quizId);
    if (quizResults.length === 0) return null;
    return quizResults[quizResults.length - 1].percentage;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Practice Quizzes & Tests</h1>
          <p className="text-sm text-muted-foreground">
            Test your knowledge, get instant scores, and earn reward badges
          </p>
        </div>
        <Link href="/student/quizzes/history">
          <Button variant="outline" className="gap-2 shrink-0">
            <History className="h-4 w-4" />
            <span>Quiz History</span>
          </Button>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quizzes..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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
      </div>

      {filteredQuizzes.length === 0 ? (
        <EmptyState
          icon={<HelpCircle className="h-12 w-12 text-muted-foreground" />}
          title="No quizzes found"
          description="Try selecting a different subject or changing search terms."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              href={`/student/quizzes/${quiz.id}`}
              lastScore={getLatestScore(quiz.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
