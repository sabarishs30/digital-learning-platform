import Link from "next/link";
import { Quiz } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, PlayCircle, Award } from "lucide-react";

interface QuizCardProps {
  quiz: Quiz;
  href?: string;
  adminActions?: React.ReactNode;
  lastScore?: number | null;
}

export function QuizCard({ quiz, href, adminActions, lastScore }: QuizCardProps) {
  return (
    <Card className="flex flex-col justify-between hover:shadow-md transition-all border-border/70 hover:border-primary/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant="secondary" className="gap-1 font-normal text-xs">
            <HelpCircle className="h-3 w-3" />
            {quiz.questions?.length || 0} Questions
          </Badge>
          {quiz.className && (
            <span className="text-xs text-muted-foreground font-medium">{quiz.className}</span>
          )}
        </div>
        <CardTitle className="text-lg font-bold line-clamp-1">{quiz.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {quiz.description}
        </p>
        {lastScore !== undefined && lastScore !== null && (
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md w-fit">
            <Award className="h-3.5 w-3.5" />
            <span>Latest Score: {lastScore}%</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex items-center justify-between border-t border-border/50 pt-3 mt-auto">
        {adminActions ? (
          <div className="w-full flex items-center justify-between gap-2">{adminActions}</div>
        ) : href ? (
          <Link href={href} className="w-full">
            <Button className="w-full gap-2 font-medium" size="sm">
              <PlayCircle className="h-4 w-4" />
              <span>Start Quiz</span>
            </Button>
          </Link>
        ) : null}
      </CardFooter>
    </Card>
  );
}
