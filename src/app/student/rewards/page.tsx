"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getRewards } from "@/lib/data-service";
import { Reward } from "@/types";
import { RewardBadge } from "@/components/reward-badge";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, HelpCircle, Award, Medal } from "lucide-react";

export default function StudentRewardsPage() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRewards() {
      if (!user) return;
      try {
        const data = await getRewards(user.id);
        // Sort newest first
        setRewards(data.sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime()));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadRewards();
  }, [user]);

  if (loading) {
    return <LoadingState message="Loading your honors and badges..." />;
  }

  const excellentCount = rewards.filter((r) => r.badgeName === "Excellent Learner").length;
  const greatCount = rewards.filter((r) => r.badgeName === "Great Achievement").length;
  const effortCount = rewards.filter((r) => r.badgeName === "Good Effort").length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-600" />
            My Rewards & Badges
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Appreciation rewards earned by scoring 75% or higher on chapter quizzes
          </p>
        </div>
        <Link href="/student/quizzes">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5 text-xs">
            <HelpCircle className="h-4 w-4" /> Take a Quiz
          </Button>
        </Link>
      </div>

      {/* Badges Summary Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-amber-200 bg-amber-50/50 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-100 text-amber-700">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-900">Excellent Learner</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900">{excellentCount}</span>
                <span className="text-xs text-slate-500">(90–100%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700">
              <Medal className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-900">Great Achievement</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900">{greatCount}</span>
                <span className="text-xs text-slate-500">(80–89%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/50 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-900">Good Effort</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900">{effortCount}</span>
                <span className="text-xs text-slate-500">(75–79%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rewards List */}
      {rewards.length === 0 ? (
        <EmptyState
          icon={<Trophy className="h-12 w-12 text-slate-400" />}
          title="No badges earned yet"
          description="Take quizzes and score 75% or higher to earn appreciation awards!"
          action={
            <Link href="/student/quizzes">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">Take a Quiz Now</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((reward) => (
            <RewardBadge key={reward.id} reward={reward} />
          ))}
        </div>
      )}
    </div>
  );
}
