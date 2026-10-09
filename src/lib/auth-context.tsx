"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import { User } from "@/types";
import { demoUsers } from "@/lib/demo-data";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, name: string, className?: string, school?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemo = !isFirebaseConfigured();

  const fetchUserProfile = useCallback(async (uid: string, email: string | null): Promise<User | null> => {
    if (!db) return null;
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return { id: uid, ...userDoc.data() } as User;
      }
    } catch {
      console.warn("Could not fetch user profile from Firestore");
    }
    return null;
  }, []);

  useEffect(() => {
    if (isDemo) {
      // Check sessionStorage or localStorage for demo login
      const stored = typeof window !== "undefined"
        ? (sessionStorage.getItem("demoUser") || localStorage.getItem("demoUser"))
        : null;
      if (stored) {
        try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
      }
      setLoading(false);
      return;
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const profile = await fetchUserProfile(fbUser.uid, fbUser.email);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDemo, fetchUserProfile]);

  const signIn = async (email: string, password: string): Promise<User> => {
    if (isDemo) {
      // Demo mode authentication
      const cleanEmail = email.trim().toLowerCase();
      if (
        (cleanEmail === "student@example.com" && (password === "demo123" || password === "student123")) ||
        cleanEmail === "student@example.com" ||
        cleanEmail.startsWith("student")
      ) {
        const demoStudent = demoUsers.find(u => u.role === "student") || demoUsers[0];
        setUser(demoStudent);
        try {
          sessionStorage.setItem("demoUser", JSON.stringify(demoStudent));
          localStorage.setItem("demoUser", JSON.stringify(demoStudent));
        } catch { /* ignore */ }
        return demoStudent;
      }
      if (
        (cleanEmail === "admin@example.com" && (password === "admin123" || password === "demo123")) ||
        (cleanEmail === "teacher@example.com" && (password === "admin123" || password === "teacher123" || password === "demo123")) ||
        cleanEmail.startsWith("admin") ||
        cleanEmail.startsWith("teacher")
      ) {
        const demoAdmin = demoUsers.find(u => u.role === "admin") || demoUsers[4];
        setUser(demoAdmin);
        try {
          sessionStorage.setItem("demoUser", JSON.stringify(demoAdmin));
          localStorage.setItem("demoUser", JSON.stringify(demoAdmin));
        } catch { /* ignore */ }
        return demoAdmin;
      }
      throw new Error("Invalid demo credentials. Use student@example.com / demo123 or admin@example.com / admin123");
    }

    if (!auth) throw new Error("Firebase not configured");
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const profile = await fetchUserProfile(cred.user.uid, cred.user.email);
    if (!profile) {
      throw new Error("User profile not found");
    }
    setUser(profile);
    return profile;
  };

  const signUp = async (email: string, password: string, name: string, className?: string, school?: string) => {
    if (isDemo) {
      const newUser: User = {
        id: `student-${Date.now()}`,
        name,
        email,
        role: "student",
        className: className || "Class 10",
        school: school || "",
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      sessionStorage.setItem("demoUser", JSON.stringify(newUser));
      return;
    }

    if (!auth || !db) throw new Error("Firebase not configured");
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });

    const userData: Omit<User, "id"> = {
      name,
      email,
      role: "student",
      className: className || "Class 10",
      school: school || "",
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "users", cred.user.uid), userData);
    setUser({ id: cred.user.uid, ...userData });
  };

  const signOutUser = async () => {
    if (isDemo) {
      setUser(null);
      try {
        sessionStorage.removeItem("demoUser");
        localStorage.removeItem("demoUser");
      } catch { /* ignore */ }
      return;
    }
    if (auth) await firebaseSignOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, isDemo, signIn, signUp, signOut: signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
