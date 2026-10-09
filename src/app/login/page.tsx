"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { GraduationCap, Loader2, AlertCircle, UserCheck, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { signIn, isDemo } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "student@example.com",
      password: "demo123",
    },
  });

  const handleSelectRole = (newRole: "student" | "teacher") => {
    setRole(newRole);
    setError("");
    if (newRole === "student") {
      setValue("email", "student@example.com");
      setValue("password", "demo123");
    } else {
      setValue("email", "admin@example.com");
      setValue("password", "admin123");
    }
  };

  const onSubmit = async (data: LoginForm) => {
    setError("");
    setLoading(true);
    try {
      const loggedInUser = await signIn(data.email, data.password);
      if (loggedInUser.role === "admin" || role === "teacher") {
        router.push("/admin/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md border shadow-sm bg-white rounded-xl">
        <CardHeader className="text-center pb-4 pt-6 space-y-2">
          <div className="flex justify-center mb-1">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
              <GraduationCap className="h-7 w-7" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Digital Learning Platform
          </h1>
          <p className="text-sm text-slate-600">
            Learning made simple for every student.
          </p>

          {/* Role Selection Tabs */}
          <div className="pt-3">
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => handleSelectRole("student")}
                className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  role === "student"
                    ? "bg-white text-blue-700 shadow-sm border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UserCheck className="h-4 w-4" />
                Student Login
              </button>
              <button
                type="button"
                onClick={() => handleSelectRole("teacher")}
                className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  role === "teacher"
                    ? "bg-white text-blue-700 shadow-sm border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Teacher Login
              </button>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 pt-1">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs sm:text-sm" role="alert">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={role === "student" ? "student@example.com" : "admin@example.com"}
                {...register("email")}
                className="bg-white"
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="bg-white"
                aria-invalid={!!errors.password}
              />
              {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
            </div>

            {isDemo && (
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg text-xs space-y-1 text-slate-700">
                <p className="font-semibold text-blue-900">
                  {role === "student" ? "Demo Student Account:" : "Demo Teacher Account:"}
                </p>
                <p className="font-mono text-[11px] text-slate-600">
                  {role === "student" ? "student@example.com • demo123 (Arun Kumar)" : "admin@example.com • admin123 (Mrs. Priya Sharma)"}
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2 pb-6">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
            <div className="flex items-center justify-between w-full text-xs text-slate-600 pt-1">
              <span>Need an account?</span>
              <Link href="/register" className="text-blue-600 hover:underline font-semibold">
                Register
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
