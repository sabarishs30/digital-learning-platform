import Link from "next/link";
import { Subject } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight } from "lucide-react";

interface SubjectCardProps {
  subject: Subject;
  href?: string;
  adminActions?: React.ReactNode;
}

export function SubjectCard({ subject, href, adminActions }: SubjectCardProps) {
  return (
    <Card className="flex flex-col justify-between hover:shadow-md transition-all duration-200 border-border/70 hover:border-primary/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="text-3xl p-2 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 w-12 h-12">
            {subject.image || "📚"}
          </div>
          {subject.className && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
              {subject.className}
            </span>
          )}
        </div>
        <CardTitle className="mt-3 text-lg font-bold line-clamp-1">{subject.name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {subject.description}
        </p>
      </CardContent>
      <CardFooter className="pt-0 flex items-center justify-between border-t border-border/50 pt-3 mt-auto">
        {adminActions ? (
          <div className="w-full flex items-center justify-between gap-2">{adminActions}</div>
        ) : href ? (
          <Link href={href} className="w-full">
            <Button variant="default" size="sm" className="w-full gap-2 font-medium">
              <BookOpen className="h-4 w-4" />
              <span>Explore Subject</span>
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
          </Link>
        ) : null}
      </CardFooter>
    </Card>
  );
}
