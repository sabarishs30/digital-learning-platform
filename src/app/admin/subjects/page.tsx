"use client";

import { useState, useEffect } from "react";
import { getSubjects, createSubject, updateSubject, deleteSubject } from "@/lib/data-service";
import { Subject } from "@/types";
import { SubjectCard } from "@/components/subject-card";
import { LoadingState } from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, X, BookOpen, Search } from "lucide-react";

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    className: "Class 10",
    image: "📚",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setFormData({
      name: "",
      description: "",
      className: "Class 10",
      image: "📚",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      description: subject.description,
      className: subject.className || "Class 10",
      image: subject.image || "📚",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;
    try {
      await deleteSubject(id);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingSubject) {
        await updateSubject(editingSubject.id, formData);
      } else {
        await createSubject({
          ...formData,
          createdAt: new Date().toISOString(),
        });
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
    return <LoadingState message="Loading subjects catalog..." />;
  }

  const filtered = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Subjects</h1>
          <p className="text-sm text-muted-foreground">
            Create, update, or remove academic curriculum subjects
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Add New Subject
        </Button>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filter subjects..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Subjects Grid with Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            adminActions={
              <div className="flex items-center justify-end gap-2 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(subject)}
                  className="gap-1.5 text-xs flex-1"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(subject.id)}
                  className="gap-1.5 text-xs flex-1"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            }
          />
        ))}
      </div>

      {/* Add/Edit Subject Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-background rounded-2xl border shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg">
                {editingSubject ? "Edit Subject" : "Create New Subject"}
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
              <div className="space-y-2">
                <Label htmlFor="sub-name">Subject Name *</Label>
                <Input
                  id="sub-name"
                  required
                  placeholder="e.g. Science, Mathematics"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="sub-class">Class / Grade *</Label>
                  <Input
                    id="sub-class"
                    required
                    placeholder="e.g. Class 10"
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sub-icon">Icon / Emoji *</Label>
                  <Input
                    id="sub-icon"
                    required
                    placeholder="e.g. 🔬, 📐, 📖"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sub-desc">Description *</Label>
                <Textarea
                  id="sub-desc"
                  required
                  rows={3}
                  placeholder="Brief overview of the subject curriculum..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : editingSubject ? "Save Changes" : "Create Subject"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
