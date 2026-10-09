"use client";

import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, School, BookOpen, Mail, Calendar, LogOut, Shield } from "lucide-react";

export default function StudentProfilePage() {
  const { user, signOut, isDemo } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Student Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your educational profile and account details</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4 pb-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">{user.role}</Badge>
              {isDemo && <Badge variant="warning">Demo Account</Badge>}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email Address</p>
                <p className="text-sm font-semibold">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Enrolled Grade</p>
                <p className="text-sm font-semibold">{user.className || "Class 10"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
              <School className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">School / Institution</p>
                <p className="text-sm font-semibold">{user.school || "Rural Government School"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Enrolled Since</p>
                <p className="text-sm font-semibold">
                  {new Date(user.createdAt).toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span>Data Privacy & Low Bandwidth Optimization</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your profile data is protected. Pages and assets are compressed and cached to minimize mobile data usage in low connectivity rural environments.
            </p>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          <Button variant="destructive" size="sm" onClick={signOut} className="gap-2">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
