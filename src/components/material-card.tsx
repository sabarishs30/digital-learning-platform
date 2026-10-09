import { Material } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Video, BookOpen, CheckCircle, ExternalLink } from "lucide-react";

interface MaterialCardProps {
  material: Material;
  onView?: (material: Material) => void;
  onMarkComplete?: (material: Material) => void;
  isCompleted?: boolean;
  adminActions?: React.ReactNode;
}

export function MaterialCard({
  material,
  onView,
  onMarkComplete,
  isCompleted,
  adminActions,
}: MaterialCardProps) {
  const getTypeBadge = (type: Material["type"]) => {
    switch (type) {
      case "pdf":
        return (
          <Badge variant="outline" className="border-red-300 text-red-700 bg-red-50 gap-1 text-xs">
            <FileText className="h-3 w-3" /> PDF Document
          </Badge>
        );
      case "video":
        return (
          <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50 gap-1 text-xs">
            <Video className="h-3 w-3" /> Video Lesson
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-emerald-300 text-emerald-700 bg-emerald-50 gap-1 text-xs">
            <BookOpen className="h-3 w-3" /> Study Notes
          </Badge>
        );
    }
  };

  return (
    <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          {getTypeBadge(material.type)}
          {isCompleted && (
            <Badge variant="success" className="gap-1">
              <CheckCircle className="h-3 w-3" /> Done
            </Badge>
          )}
        </div>
        <CardTitle className="text-base font-semibold line-clamp-1">{material.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {material.description}
        </p>
      </CardContent>
      <CardFooter className="pt-0 flex items-center justify-between gap-2 border-t border-border/50 pt-3 mt-auto">
        {adminActions ? (
          adminActions
        ) : (
          <div className="flex items-center justify-between w-full gap-2">
            {onView && (
              <Button variant="outline" size="sm" onClick={() => onView(material)} className="flex-1 text-xs">
                Open Material
              </Button>
            )}
            {onMarkComplete && !isCompleted && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onMarkComplete(material)}
                className="text-xs shrink-0"
              >
                Mark Read
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
