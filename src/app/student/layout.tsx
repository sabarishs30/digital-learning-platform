"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { Navbar } from "@/components/navbar";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="student">
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container py-6 px-4 md:px-8 max-w-7xl">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
