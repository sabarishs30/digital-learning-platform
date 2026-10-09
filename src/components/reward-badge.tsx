import { Reward } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";

interface RewardBadgeProps {
  reward: Reward;
  size?: "sm" | "md" | "lg";
}

export function RewardBadge({ reward, size = "md" }: RewardBadgeProps) {
  const getBadgeDetails = (badgeName: string) => {
    switch (badgeName) {
      case "Excellent Learner":
        return {
          icon: Trophy,
          bgColor: "bg-amber-50",
          textColor: "text-amber-800",
          borderColor: "border-amber-300",
          tier: "Gold Award (90–100%)",
        };
      case "Great Achievement":
        return {
          icon: Medal,
          bgColor: "bg-blue-50",
          textColor: "text-blue-800",
          borderColor: "border-blue-300",
          tier: "Silver Award (80–89%)",
        };
      case "Good Effort":
      default:
        return {
          icon: Award,
          bgColor: "bg-emerald-50",
          textColor: "text-emerald-800",
          borderColor: "border-emerald-300",
          tier: "Bronze Award (75–79%)",
        };
    }
  };

  const details = getBadgeDetails(reward.badgeName);
  const Icon = details.icon;

  if (size === "sm") {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${details.borderColor} ${details.bgColor} ${details.textColor} text-xs font-semibold`}>
        <Icon className="h-3.5 w-3.5" />
        <span>{reward.badgeName}</span>
      </div>
    );
  }

  return (
    <Card className={`border ${details.borderColor} shadow-xs bg-white rounded-xl`}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${details.bgColor} ${details.textColor} shrink-0 border ${details.borderColor}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h4 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                {reward.badgeName}
              </h4>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${details.bgColor} ${details.textColor} border ${details.borderColor}`}>
                {reward.percentage}% Score
              </span>
            </div>
            {reward.quizTitle && (
              <p className="text-xs font-medium text-slate-600">
                Quiz: <span className="text-slate-900 font-semibold">{reward.quizTitle}</span>
              </p>
            )}
            {reward.subjectName && (
              <p className="text-xs text-slate-600">
                Subject: <span className="font-medium text-slate-800">{reward.subjectName}</span>
              </p>
            )}
            <p className="text-xs text-slate-700 mt-2 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
              &ldquo;{reward.message}&rdquo;
            </p>
            <p className="text-[11px] text-slate-400 pt-1">
              Earned on {new Date(reward.earnedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
