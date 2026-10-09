"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  BookOpen, GraduationCap, LogOut, Menu, X, Home,
  FileText, ClipboardList, Trophy, TrendingUp, User, Users,
  BarChart3,
} from "lucide-react";
import { useState } from "react";

const studentLinks = [
  { href: "/student/dashboard", label: "Home", icon: Home },
  { href: "/student/subjects", label: "Subjects", icon: BookOpen },
  { href: "/student/materials", label: "Materials", icon: FileText },
  { href: "/student/quizzes", label: "Quizzes", icon: ClipboardList },
  { href: "/student/progress", label: "Progress", icon: TrendingUp },
  { href: "/student/rewards", label: "Rewards", icon: Trophy },
  { href: "/student/profile", label: "Profile", icon: User },
];

const teacherLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Home },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/subjects", label: "Subjects", icon: BookOpen },
  { href: "/admin/materials", label: "Materials", icon: FileText },
  { href: "/admin/quizzes", label: "Quizzes", icon: ClipboardList },
  { href: "/admin/results", label: "Results", icon: BarChart3 },
  { href: "/admin/progress", label: "Progress", icon: TrendingUp },
];

export function Navbar() {
  const { user, signOut, isDemo } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const isTeacher = user.role === "admin";
  const links = isTeacher ? teacherLinks : studentLinks;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-14 items-center justify-between px-4 max-w-7xl mx-auto">
          {/* Brand Left */}
          <div className="flex items-center gap-2">
            <button
              className="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-700"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link
              href={isTeacher ? "/admin/dashboard" : "/student/dashboard"}
              className="flex items-center gap-2.5"
            >
              <div className="p-1.5 bg-blue-50 border border-blue-100 rounded-lg text-blue-700 flex items-center justify-center">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm sm:text-base leading-tight tracking-tight text-slate-900">
                  Digital Learning Platform
                </span>
                <span className="text-[10px] text-slate-500 hidden sm:inline leading-none font-medium">
                  {isTeacher ? "Teacher Portal" : "Rural School Student Portal"}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/student/dashboard" &&
                  link.href !== "/admin/dashboard" &&
                  pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Status & Action Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isDemo && (
              <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-800 border border-amber-200">
                Demo mode
              </span>
            )}
            <div className="text-right hidden sm:block leading-tight">
              <p className="text-xs font-semibold text-foreground">{user.name}</p>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                {isTeacher ? "Teacher" : "Student"}
              </span>
            </div>
            <span className="sm:hidden text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
              {isTeacher ? "Teacher" : "Student"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              aria-label="Log out"
              title="Log out"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <nav
            className="fixed left-0 top-14 bottom-0 w-64 bg-background border-r overflow-y-auto p-4 space-y-3"
            aria-label="Mobile navigation"
          >
            <div className="p-2 bg-muted/40 rounded-lg mb-2">
              <p className="text-xs font-semibold">{user.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {isTeacher ? "Teacher" : user.className || "Student"}
              </p>
            </div>
            <div className="space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
