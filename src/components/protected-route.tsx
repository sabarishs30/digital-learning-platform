"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingState } from "@/components/loading-state";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "student" | "admin";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (!loading && user && requiredRole && user.role !== requiredRole) {
      router.push(user.role === "admin" ? "/admin/dashboard" : "/student/dashboard");
    }
  }, [user, loading, requiredRole, router]);

  if (loading) return <LoadingState message="Checking authentication..." />;
  if (!user) return <LoadingState message="Redirecting to login..." />;
  if (requiredRole && user.role !== requiredRole) return <LoadingState message="Redirecting..." />;

  return <>{children}</>;
}
