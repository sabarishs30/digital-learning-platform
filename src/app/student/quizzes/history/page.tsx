"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getQuizResults } from "@/lib/data-service";
import { QuizResult } from "@/types";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, PlayCircle, Award, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";

export default function QuizHistoryPage() {
  const { user } = useAuth();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const data = await getQuizResults(user.id);
        // Sort newest first
        setResults(data.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (loading) {
    return <LoadingState message="Loading your quiz history..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/student/quizzes" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Quiz History</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Review your past test scores, dates, and rewards earned
          </p>
        </div>
        <Link href="/student/quizzes">
          <Button size="sm" className="gap-2">
            <PlayCircle className="h-4 w-4" /> Take a Quiz
          </Button>
        </Link>
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon={<History className="h-12 w-12 text-muted-foreground" />}
          title="No quizzes taken yet"
          description="You haven't attempted any quizzes yet. Start a quiz to track your progress and test your skills!"
          action={
            <Link href="/student/quizzes">
              <Button>Explore Quizzes</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {results.map((res) => (
            <Card key={res.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-foreground">{res.quizTitle || "Quiz"}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {res.subjectName || "General"}
                    </Badge>
                    {res.rewardEarned && res.rewardEarned !== "None" && (
                      <Badge variant="success" className="gap-1 text-xs">
                        <Award className="h-3 w-3" /> {res.rewardEarned}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {res.correctAnswers} correct
                    </span>
                    <span className="flex items-center gap-1 text-red-600 font-medium">
                      <XCircle className="h-3.5 w-3.5" /> {res.wrongAnswers} wrong
                    </span>
                    <span>
                      Completed on {new Date(res.completedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="text-right">
                    <div className="text-2xl font-black text-primary">{res.percentage}%</div>
                    <span className="text-[11px] text-muted-foreground">Final Score</span>
                  </div>
                  <Link href={`/student/quizzes/${res.quizId}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      Retake
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
