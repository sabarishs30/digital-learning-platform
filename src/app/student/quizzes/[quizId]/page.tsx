"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getQuiz, getSubject, submitQuizResult } from "@/lib/data-service";
import { calculateReward, getRewardMessage } from "@/lib/demo-data";
import { Quiz, Subject, QuizResult } from "@/types";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import {
  ArrowLeft, ArrowRight, CheckCircle2, XCircle, Trophy, RotateCcw,
  Sparkles, History, Award
} from "lucide-react";

export default function QuizTakingPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId as string;
  const { user } = useAuth();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  // Quiz taking state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadQuizData() {
      if (!quizId) return;
      try {
        const qz = await getQuiz(quizId);
        setQuiz(qz);
        if (qz?.subjectId) {
          const sub = await getSubject(qz.subjectId);
          setSubject(sub);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadQuizData();
  }, [quizId]);

  if (loading) {
    return <LoadingState message="Loading quiz questions..." />;
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <EmptyState
        title="Quiz Not Available"
        description="This quiz does not have any questions yet."
        action={
          <Link href="/student/quizzes">
            <Button variant="outline">Back to Quizzes</Button>
          </Link>
        }
      />
    );
  }

  const currentQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;
  const quizProgress = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  // Demo auto-fill helper for 8/10 (80%) demonstration
  const handleAutoFill80 = () => {
    const newAnswers: Record<number, number> = {};
    quiz.questions.forEach((q, idx) => {
      if (idx < 8) {
        // Correct answer for first 8 questions -> 8/10 = 80%
        newAnswers[idx] = q.correctAnswer;
      } else {
        // Wrong answer for last 2 questions
        newAnswers[idx] = (q.correctAnswer + 1) % 4;
      }
    });
    setAnswers(newAnswers);
  };

  const handleSubmitQuiz = async () => {
    if (!user || !quiz) return;
    setSubmitting(true);

    // Calculate score
    let correct = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correct++;
      }
    });

    const wrong = totalQuestions - correct;
    const percentage = Math.round((correct / totalQuestions) * 100);
    const rewardInfo = calculateReward(percentage);
    const rewardEarned = rewardInfo ? rewardInfo.badgeName : "None";

    const resultData: Omit<QuizResult, "id"> = {
      studentId: user.id,
      studentName: user.name,
      quizId: quiz.id,
      quizTitle: quiz.title,
      subjectId: quiz.subjectId,
      subjectName: subject?.name || "Science",
      totalQuestions,
      correctAnswers: correct,
      wrongAnswers: wrong,
      percentage,
      rewardEarned,
      completedAt: new Date().toISOString(),
    };

    try {
      const resultId = await submitQuizResult(resultData);
      setQuizResult({ id: resultId, ...resultData });
      setIsSubmitted(true);
    } catch (err) {
      console.error("Error submitting quiz:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
    setQuizResult(null);
  };

  // ================= RESULTS SCREEN (STEP 5 & 6) =================
  if (isSubmitted && quizResult) {
    const reward = calculateReward(quizResult.percentage);
    const appreciationMsg = getRewardMessage(quizResult.percentage);

    return (
      <div className="max-w-2xl mx-auto space-y-6 py-4">
        {/* Result Header Card */}
        <Card className="text-center p-6 sm:p-8 border shadow-sm bg-white rounded-xl">
          <CardContent className="space-y-5 pt-2">
            <div className="inline-flex p-3 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              <Trophy className="h-10 w-10 text-amber-600" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Quiz Completed!
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                {quiz.title} • {subject?.name || "Science"}
              </p>
            </div>

            {/* Big Score Display */}
            <div className="py-5 px-6 rounded-xl bg-slate-50 border max-w-sm mx-auto space-y-1">
              <div className="text-5xl font-black text-blue-700">
                {quizResult.percentage}%
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                Score: {quizResult.percentage}%
              </p>
            </div>

            {/* Score Breakdown Pills */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-xs sm:text-sm font-bold">Correct Answers: {quizResult.correctAnswers}</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-red-50 text-red-800 border border-red-200">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-xs sm:text-sm font-bold">Wrong Answers: {quizResult.wrongAnswers}</span>
              </div>
            </div>

            {/* Reward Notification Banner (STEP 6) */}
            {reward ? (
              <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/80 text-left space-y-1.5 max-w-lg mx-auto">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-600 shrink-0" />
                  <h3 className="text-base font-bold text-slate-900">
                    🏆 {reward.badgeName}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium pl-7">
                  &ldquo;{reward.message}&rdquo;
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl border bg-slate-50 text-center max-w-lg mx-auto">
                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  {appreciationMsg}
                </p>
              </div>
            )}

            {/* Action Buttons: [View My Rewards] [Continue Learning] */}
            <div className="flex flex-wrap justify-center gap-3 pt-4 border-t">
              <Link href="/student/rewards">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm gap-2">
                  <Trophy className="h-4 w-4 text-amber-300" />
                  View My Rewards
                </Button>
              </Link>
              <Link href="/student/dashboard">
                <Button variant="outline" className="font-semibold text-xs sm:text-sm gap-2 border-slate-300">
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                  Continue Learning
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleRetake} className="text-xs sm:text-sm gap-1.5 text-slate-600">
                <RotateCcw className="h-3.5 w-3.5" /> Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Question Review */}
        <div className="space-y-3 pt-2">
          <h2 className="text-base font-bold text-slate-900">Review Answers ({quizResult.correctAnswers}/{totalQuestions} Correct)</h2>
          {quiz.questions.map((q, idx) => {
            const studentAns = answers[idx];
            const isCorrect = studentAns === q.correctAnswer;
            return (
              <Card key={q.id} className={`border bg-white rounded-xl ${isCorrect ? "border-emerald-200" : "border-red-200"}`}>
                <CardHeader className="py-3 px-4 pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-500">
                      Question {idx + 1}
                    </span>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" /> Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        <XCircle className="h-3 w-3" /> Incorrect
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-sm font-semibold text-slate-900 mt-1">{q.question}</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4 space-y-1.5 text-xs pb-3">
                  {q.options.map((opt, optIdx) => {
                    const isStudentPick = studentAns === optIdx;
                    const isActualCorrect = q.correctAnswer === optIdx;
                    return (
                      <div
                        key={optIdx}
                        className={`p-2 rounded-lg flex items-center justify-between ${
                          isActualCorrect
                            ? "bg-emerald-50 font-semibold text-emerald-900 border border-emerald-200"
                            : isStudentPick
                            ? "bg-red-50 text-red-900 font-semibold border border-red-200"
                            : "bg-slate-50 text-slate-600"
                        }`}
                      >
                        <span>{opt}</span>
                        {isActualCorrect && <span className="text-[10px] text-emerald-700 font-bold">✓ Correct Answer</span>}
                        {isStudentPick && !isActualCorrect && <span className="text-[10px] text-red-700 font-bold">✗ Your Answer</span>}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // ================= TAKING SCREEN (STEP 5) =================
  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-8">
      {/* Quiz Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/student/quizzes" className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 hover:text-slate-900 font-medium">
          <ArrowLeft className="h-4 w-4" /> Exit Quiz
        </Link>
        <div className="flex items-center gap-2">
          {/* Quick 8/10 Demo helper button for evaluation */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoFill80}
            className="text-xs border-dashed border-blue-400 text-blue-700 hover:bg-blue-50"
            title="Auto-fills 8 correct and 2 wrong answers for quick 80% demonstration"
          >
            ⚡ Auto-fill 80% (Demo)
          </Button>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700 border">
            {answeredCount} of {totalQuestions} answered
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-600 font-medium">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <span>{quizProgress}%</span>
        </div>
        <ProgressBar value={quizProgress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="shadow-sm border bg-white rounded-xl">
        <CardHeader className="pb-3 pt-5">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span className="text-blue-700 font-bold uppercase">{subject?.name || "Science"}</span>
            <span>•</span>
            <span>{quiz.title}</span>
          </div>
          <CardTitle className="text-base sm:text-lg font-bold leading-snug text-slate-900">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5 pt-1">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = answers[currentIndex] === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-3.5 rounded-lg border transition-all text-xs sm:text-sm font-medium flex items-center gap-3 ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 text-blue-900 shadow-xs"
                    : "border-slate-200 hover:bg-slate-50 text-slate-800"
                }`}
              >
                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="flex-1 leading-relaxed">{option}</span>
              </button>
            );
          })}
        </CardContent>
        <CardFooter className="pt-3 pb-5 flex items-center justify-between border-t mt-3">
          <Button
            variant="outline"
            size="sm"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Previous
          </Button>

          {currentIndex === totalQuestions - 1 ? (
            <Button
              size="sm"
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 text-xs"
            >
              <CheckCircle2 className="h-4 w-4" />
              {submitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs"
            >
              Next <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Question palette jump navigation */}
      <div className="p-3.5 rounded-xl border bg-white shadow-xs space-y-2">
        <p className="text-xs font-semibold text-slate-600">Question Palette:</p>
        <div className="flex flex-wrap gap-1.5">
          {quiz.questions.map((_, idx) => {
            const isAnswered = answers[idx] !== undefined;
            const isCurrent = currentIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-7 w-7 rounded-md text-xs font-medium transition-all ${
                  isCurrent
                    ? "ring-2 ring-blue-600 bg-blue-600 text-white font-bold"
                    : isAnswered
                    ? "bg-blue-100 text-blue-900 border border-blue-300"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
