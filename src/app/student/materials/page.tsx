"use client";

import { useState, useEffect } from "react";
import { getMaterials, getSubjects, markMaterialComplete } from "@/lib/data-service";
import { Material, Subject } from "@/types";
import { MaterialCard } from "@/components/material-card";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { Search, Filter, BookOpen, X, FileText, Video, CheckCircle2 } from "lucide-react";

export default function MaterialsPage() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [mats, subs] = await Promise.all([getMaterials(), getSubjects()]);
        setMaterials(mats);
        setSubjects(subs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleMarkComplete = async (mat: Material) => {
    if (!user) return;
    const sub = subjects.find(s => s.id === mat.subjectId);
    await markMaterialComplete(user.id, mat.subjectId, sub?.name || "Subject");
  };

  const filteredMaterials = materials.filter((mat) => {
    const matchesSearch =
      mat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mat.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "all" || mat.subjectId === selectedSubject;
    const matchesType = selectedType === "all" || mat.type === selectedType;
    return matchesSearch && matchesSubject && matchesType;
  });

  if (loading) {
    return <LoadingState message="Loading study materials..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Study Materials</h1>
        <p className="text-sm text-muted-foreground">
          Access notes, textbook summaries, PDFs, and video lessons
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search materials..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Subject selector */}
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

          {/* Type selector */}
          <select
            className="h-10 rounded-lg border border-input bg-background px-3 py-1 text-sm ring-offset-background"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Formats</option>
            <option value="note">Notes</option>
            <option value="pdf">PDFs</option>
            <option value="video">Videos</option>
          </select>
        </div>
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-12 w-12 text-muted-foreground" />}
          title="No materials found"
          description="Try changing your search keywords or filters."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((mat) => (
            <MaterialCard
              key={mat.id}
              material={mat}
              onView={(m) => setSelectedMaterial(m)}
              onMarkComplete={handleMarkComplete}
            />
          ))}
        </div>
      )}

      {/* Material Reader Modal */}
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

              {selectedMaterial.type === "note" && (
                <div className="prose dark:prose-invert max-w-none text-sm whitespace-pre-line leading-relaxed">
                  {selectedMaterial.content || "No text content available."}
                </div>
              )}

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

              {selectedMaterial.type === "video" && (
                <div className="aspect-video bg-muted rounded-xl flex flex-col items-center justify-center p-6 text-center border">
                  <Video className="h-12 w-12 text-primary mb-2" />
                  <p className="text-sm font-semibold">Video Lesson: {selectedMaterial.title}</p>
                  {selectedMaterial.videoUrl && (
                    <a
                      href={selectedMaterial.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4"
                    >
                      <Button size="sm">Open Video Lesson</Button>
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t flex justify-end gap-2 bg-muted/20">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedMaterial(null)}
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  handleMarkComplete(selectedMaterial);
                  setSelectedMaterial(null);
                }}
                className="gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark Completed
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
