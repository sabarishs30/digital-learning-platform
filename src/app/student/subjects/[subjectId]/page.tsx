"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  getSubject, getMaterials, getQuizzes, getProgress, markMaterialComplete
} from "@/lib/data-service";
import { Subject, Material, Quiz, Progress } from "@/types";
import { MaterialCard } from "@/components/material-card";
import { QuizCard } from "@/components/quiz-card";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, HelpCircle, ArrowLeft, CheckCircle2, FileText,
  Video, Eye, X, Award
} from "lucide-react";

export default function SubjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subjectId as string;
  const { user } = useAuth();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"materials" | "quizzes">("materials");
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  useEffect(() => {
    async function loadSubjectData() {
      if (!subjectId) return;
      try {
        const [sub, mats, qzs, progList] = await Promise.all([
          getSubject(subjectId),
          getMaterials(subjectId),
          getQuizzes(subjectId),
          user ? getProgress(user.id) : Promise.resolve([]),
        ]);
        setSubject(sub);
        setMaterials(mats);
        setQuizzes(qzs);
        const currentProg = progList.find(p => p.subjectId === subjectId) || null;
        setProgress(currentProg);
      } catch (err) {
        console.error("Error loading subject details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSubjectData();
  }, [subjectId, user]);

  const handleMarkComplete = async (mat: Material) => {
    if (!user || !subject) return;
    try {
      await markMaterialComplete(user.id, subject.id, subject.name);
      // Refresh progress
      const progList = await getProgress(user.id);
      setProgress(progList.find(p => p.subjectId === subjectId) || null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingState message="Loading subject details..." />;
  }

  if (!subject) {
    return (
      <EmptyState
        title="Subject Not Found"
        description="The subject you requested does not exist or has been removed."
        action={
          <Link href="/student/subjects">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Subjects
            </Button>
          </Link>
        }
      />
    );
  }

  const completionPct = progress?.progressPercentage || 0;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/student/subjects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to All Subjects
      </Link>

      {/* Header Card */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl p-3 bg-primary/10 rounded-2xl flex items-center justify-center">
              {subject.image || "📚"}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">{subject.name}</h1>
                <Badge variant="secondary">{subject.className || "Class 10"}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                {subject.description}
              </p>
            </div>
          </div>

          {/* Progress widget */}
          <div className="w-full md:w-56 p-3 bg-muted/40 rounded-xl space-y-2 border">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>Subject Progress</span>
              <span className="text-primary">{completionPct}%</span>
            </div>
            <ProgressBar value={completionPct} className="h-2" />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>{materials.length} Materials</span>
              <span>{quizzes.length} Quizzes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("materials")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "materials"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Learning Materials ({materials.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("quizzes")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "quizzes"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>Quizzes & Tests ({quizzes.length})</span>
        </button>
      </div>

      {/* Tab Content: Materials */}
      {activeTab === "materials" && (
        <div className="space-y-4">
          {materials.length === 0 ? (
            <EmptyState
              title="No materials available yet"
              description="Your teacher hasn't uploaded learning materials for this subject yet."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.map((mat) => (
                <MaterialCard
                  key={mat.id}
                  material={mat}
                  onView={(m) => setSelectedMaterial(m)}
                  onMarkComplete={handleMarkComplete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Quizzes */}
      {activeTab === "quizzes" && (
        <div className="space-y-4">
          {quizzes.length === 0 ? (
            <EmptyState
              title="No quizzes available"
              description="No tests are currently assigned for this subject."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  href={`/student/quizzes/${quiz.id}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Material Reader Modal / Dialog */}
      {selectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-background rounded-2xl border shadow-xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="uppercase text-[10px]">
                  {selectedMaterial.type}
                </Badge>
                <h3 className="font-bold text-base line-clamp-1">{selectedMaterial.title}</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setSelectedMaterial(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {selectedMaterial.description && (
                <p className="text-sm text-muted-foreground pb-2 border-b">
                  {selectedMaterial.description}
                </p>
              )}

              {/* Note Content */}
              {selectedMaterial.type === "note" && (
                <div className="prose dark:prose-invert max-w-none text-sm whitespace-pre-line leading-relaxed">
                  {selectedMaterial.content || "No text content available."}
                </div>
              )}

              {/* PDF Document */}
              {selectedMaterial.type === "pdf" && (
                <div className="text-center py-8 space-y-4">
                  <FileText className="h-16 w-16 mx-auto text-red-500" />
                  <div>
                    <h4 className="font-semibold">{selectedMaterial.title}</h4>
                    <p className="text-xs text-muted-foreground">PDF Document</p>
                  </div>
                  {selectedMaterial.fileUrl && (
                    <a
                      href={selectedMaterial.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button size="sm" className="gap-2">
                        Download / View PDF
                      </Button>
                    </a>
                  )}
                </div>
              )}

              {/* Video Lesson (No autoplay for low bandwidth) */}
              {selectedMaterial.type === "video" && (
                <div className="space-y-4">
                  <div className="aspect-video bg-muted rounded-xl flex flex-col items-center justify-center p-6 text-center border">
                    <Video className="h-12 w-12 text-primary mb-2" />
                    <p className="text-sm font-semibold">Video Lesson: {selectedMaterial.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-md">
                      (Video streaming is bandwidth-conscious. Play when on stable connection.)
                    </p>
                    {selectedMaterial.videoUrl && (
                      <a
                        href={selectedMaterial.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4"
                      >
                        <Button size="sm" className="gap-2">
                          Watch Video Link
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t flex flex-wrap items-center justify-between gap-2 bg-slate-50">
              {quizzes.length > 0 && (
                <Link href={`/student/quizzes/${quizzes[0].id}`}>
                  <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs">
                    <HelpCircle className="h-4 w-4" />
                    Take Quiz on this Topic
                  </Button>
                </Link>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMaterial(null)}
                  className="text-xs"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    handleMarkComplete(selectedMaterial);
                    setSelectedMaterial(null);
                  }}
                  className="gap-1.5 text-xs bg-slate-800 text-white hover:bg-slate-900"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark Completed
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
