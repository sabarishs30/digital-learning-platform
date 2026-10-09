import { Progress } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { BookOpen, CheckCircle2, Award } from "lucide-react";

interface ProgressCardProps {
  progress: Progress;
}

export function ProgressCard({ progress }: ProgressCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">{progress.subjectName || "Subject"}</CardTitle>
          <span className="text-sm font-bold text-primary">{progress.progressPercentage}%</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProgressBar value={progress.progressPercentage} className="h-2" />
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="bg-muted/40 p-2 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <BookOpen className="h-3.5 w-3.5" />
              <span className="text-[11px]">Notes</span>
            </div>
            <p className="text-sm font-bold">{progress.materialsCompleted}</p>
          </div>
          <div className="bg-muted/40 p-2 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="text-[11px]">Quizzes</span>
            </div>
            <p className="text-sm font-bold">{progress.quizzesCompleted}</p>
          </div>
          <div className="bg-muted/40 p-2 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Award className="h-3.5 w-3.5" />
              <span className="text-[11px]">Avg Score</span>
            </div>
            <p className="text-sm font-bold text-primary">{progress.averageScore}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
