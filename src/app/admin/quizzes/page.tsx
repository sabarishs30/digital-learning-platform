"use client";

import { useState, useEffect } from "react";
import { getQuizzes, getSubjects, createQuiz, updateQuiz, deleteQuiz } from "@/lib/data-service";
import { Quiz, Subject, QuizQuestion } from "@/types";
import { QuizCard } from "@/components/quiz-card";
import { LoadingState } from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { Plus, Edit2, Trash2, X, PlusCircle, Search, HelpCircle, Check } from "lucide-react";

export default function AdminQuizzesPage() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal and form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subjectId: "",
    className: "Class 10",
    questions: [] as QuizQuestion[],
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      const [qzs, subs] = await Promise.all([getQuizzes(), getSubjects()]);
      setQuizzes(qzs);
      setSubjects(subs);
      if (subs.length > 0 && !formData.subjectId) {
        setFormData((prev) => ({ ...prev, subjectId: subs[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingQuiz(null);
    setFormData({
      title: "",
      description: "",
      subjectId: subjects[0]?.id || "",
      className: "Class 10",
      questions: [
        {
          id: `q-${Date.now()}-1`,
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
        },
      ],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description,
      subjectId: quiz.subjectId,
      className: quiz.className,
      questions: quiz.questions || [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await deleteQuiz(id);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: `q-${Date.now()}-${prev.questions.length + 1}`,
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
        },
      ],
    }));
  };

  const handleRemoveQuestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleQuestionTextChange = (index: number, text: string) => {
    setFormData((prev) => {
      const updated = [...prev.questions];
      updated[index].question = text;
      return { ...prev, questions: updated };
    });
  };

  const handleOptionChange = (qIndex: number, optIndex: number, text: string) => {
    setFormData((prev) => {
      const updated = [...prev.questions];
      updated[qIndex].options[optIndex] = text;
      return { ...prev, questions: updated };
    });
  };

  const handleCorrectAnswerChange = (qIndex: number, correctIdx: number) => {
    setFormData((prev) => {
      const updated = [...prev.questions];
      updated[qIndex].correctAnswer = correctIdx;
      return { ...prev, questions: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (formData.questions.length === 0) {
      alert("Please add at least one question to the quiz.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        subjectId: formData.subjectId,
        className: formData.className,
        questions: formData.questions,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
      };

      if (editingQuiz) {
        await updateQuiz(editingQuiz.id, payload);
      } else {
        await createQuiz(payload);
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading quizzes..." />;
  }

  const filtered = quizzes.filter(
    (q) =>
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Quizzes & Tests</h1>
          <p className="text-sm text-muted-foreground">
            Author 4-option multiple choice quizzes and tests for rural students
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Create New Quiz
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search quizzes..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((quiz) => (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            adminActions={
              <div className="flex items-center justify-end gap-2 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(quiz)}
                  className="gap-1.5 text-xs flex-1"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(quiz.id)}
                  className="gap-1.5 text-xs flex-1"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            }
          />
        ))}
      </div>

      {/* Quiz Authoring Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-background rounded-2xl border shadow-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg">
                {editingQuiz ? "Edit Quiz" : "Create New Quiz"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="qz-subject">Subject *</Label>
                  <select
                    id="qz-subject"
                    required
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 py-1 text-sm"
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qz-class">Class Grade *</Label>
                  <Input
                    id="qz-class"
                    required
                    placeholder="Class 10"
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qz-title">Quiz Title *</Label>
                <Input
                  id="qz-title"
                  required
                  placeholder="e.g. Human Body Quiz"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qz-desc">Description</Label>
                <Input
                  id="qz-desc"
                  placeholder="Brief test summary or syllabus coverage"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Dynamic Questions Builder */}
              <div className="pt-2 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">
                    Questions ({formData.questions.length})
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddQuestion}
                    className="gap-1 text-xs"
                  >
                    <PlusCircle className="h-3.5 w-3.5" /> Add Question
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.questions.map((q, qIndex) => (
                    <Card key={qIndex} className="p-4 border bg-muted/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-primary">Question {qIndex + 1}</span>
                        {formData.questions.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveQuestion(qIndex)}
                            className="h-7 text-xs text-destructive hover:bg-destructive/10"
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Input
                          placeholder={`Enter question ${qIndex + 1}...`}
                          required
                          value={q.question}
                          onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                        />

                        <div className="space-y-2 pt-1">
                          <p className="text-xs text-muted-foreground font-medium">
                            Options (Select the radio button for the correct answer):
                          </p>
                          {q.options.map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={q.correctAnswer === optIdx}
                                onChange={() => handleCorrectAnswerChange(qIndex, optIdx)}
                                className="h-4 w-4 text-primary cursor-pointer"
                                title="Set as correct answer"
                              />
                              <span className="text-xs font-semibold w-4">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <Input
                                placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                                required
                                value={opt}
                                onChange={(e) => handleOptionChange(qIndex, optIdx, e.target.value)}
                                className="h-9 text-xs"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : editingQuiz ? "Save Changes" : "Create Quiz"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
