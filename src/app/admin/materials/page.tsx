"use client";

import { useState, useEffect, useRef } from "react";
import {
  getMaterials, getSubjects, createMaterial, updateMaterial, deleteMaterial, uploadFile
} from "@/lib/data-service";
import { Material, Subject } from "@/types";
import { MaterialCard } from "@/components/material-card";
import { LoadingState } from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import {
  Plus, Edit2, Trash2, X, UploadCloud, Search, FileText, Video, BookOpen
} from "lucide-react";

export default function AdminMaterialsPage() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

  // Modal and form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    subjectId: "",
    title: "",
    description: "",
    type: "note" as "note" | "pdf" | "video",
    content: "",
    fileUrl: "",
    videoUrl: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      const [mats, subs] = await Promise.all([getMaterials(), getSubjects()]);
      setMaterials(mats);
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
    setEditingMaterial(null);
    setSelectedFile(null);
    setFormData({
      subjectId: subjects[0]?.id || "",
      title: "",
      description: "",
      type: "note",
      content: "",
      fileUrl: "",
      videoUrl: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (material: Material) => {
    setEditingMaterial(material);
    setSelectedFile(null);
    setFormData({
      subjectId: material.subjectId,
      title: material.title,
      description: material.description,
      type: material.type,
      content: material.content || "",
      fileUrl: material.fileUrl || "",
      videoUrl: material.videoUrl || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this learning material?")) return;
    try {
      await deleteMaterial(id);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setUploading(true);

    try {
      let finalFileUrl = formData.fileUrl;

      // Handle PDF/file upload if selected
      if (selectedFile) {
        finalFileUrl = await uploadFile(
          selectedFile,
          `materials/${Date.now()}_${selectedFile.name}`
        );
      }

      const payload = {
        subjectId: formData.subjectId,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        content: formData.content,
        fileUrl: finalFileUrl,
        videoUrl: formData.videoUrl,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
      };

      if (editingMaterial) {
        await updateMaterial(editingMaterial.id, payload);
      } else {
        await createMaterial(payload);
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Error saving material:", err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading learning materials..." />;
  }

  const filtered = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "all" || m.subjectId === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Learning Materials</h1>
          <p className="text-sm text-muted-foreground">
            Publish study notes, upload textbooks / PDFs, or link educational videos for students
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Add New Material
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search materials..."
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

      {/* Materials List with Admin Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((mat) => (
          <MaterialCard
            key={mat.id}
            material={mat}
            adminActions={
              <div className="flex items-center justify-end gap-2 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(mat)}
                  className="gap-1.5 text-xs flex-1"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(mat.id)}
                  className="gap-1.5 text-xs flex-1"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            }
          />
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-background rounded-2xl border shadow-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg">
                {editingMaterial ? "Edit Material" : "Add New Learning Material"}
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
                  <Label htmlFor="mat-subject">Subject *</Label>
                  <select
                    id="mat-subject"
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
                  <Label htmlFor="mat-type">Format Type *</Label>
                  <select
                    id="mat-type"
                    required
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 py-1 text-sm"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  >
                    <option value="note">Study Notes (Text / Markdown)</option>
                    <option value="pdf">PDF Document / Book</option>
                    <option value="video">Video Lesson (Link)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mat-title">Title *</Label>
                <Input
                  id="mat-title"
                  required
                  placeholder="e.g. The Human Body - Organ Systems"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mat-desc">Description</Label>
                <Input
                  id="mat-desc"
                  placeholder="Brief summary of what students will learn"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Dynamic field based on format */}
              {formData.type === "note" && (
                <div className="space-y-2">
                  <Label htmlFor="mat-content">Study Note Content (Markdown supported)</Label>
                  <Textarea
                    id="mat-content"
                    rows={8}
                    placeholder="# Major Headings&#10;Key points, bullet points, explanations..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                </div>
              )}

              {formData.type === "pdf" && (
                <div className="space-y-3 p-4 rounded-xl border bg-muted/20">
                  <Label>Upload PDF File to Firebase Storage</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept=".pdf"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <UploadCloud className="h-4 w-4" />
                      {selectedFile ? selectedFile.name : "Select PDF Document"}
                    </Button>
                    {selectedFile && (
                      <span className="text-xs text-muted-foreground">
                        ({Math.round(selectedFile.size / 1024)} KB)
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="mat-pdf-url" className="text-xs text-muted-foreground">
                      Or paste an existing PDF URL:
                    </Label>
                    <Input
                      id="mat-pdf-url"
                      placeholder="https://..."
                      value={formData.fileUrl}
                      onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {formData.type === "video" && (
                <div className="space-y-2">
                  <Label htmlFor="mat-video">Video Link / URL *</Label>
                  <Input
                    id="mat-video"
                    placeholder="https://www.youtube.com/... or video link"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Note: Videos will not autoplay to save cellular data for rural students.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? "Uploading & Saving..." : editingMaterial ? "Save Changes" : "Create Material"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
