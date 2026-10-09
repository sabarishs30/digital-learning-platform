"use client";

import {
  collection, doc, getDocs, getDoc, updateDoc, deleteDoc, query, where, addDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, isFirebaseConfigured } from "@/lib/firebase";
import { Subject, Material, Quiz, QuizResult, Progress, Reward, User } from "@/types";
import {
  demoSubjects, demoMaterials, demoQuizzes, demoQuizResults, demoProgress, demoRewards, demoUsers, calculateReward,
} from "@/lib/demo-data";

const isDemo = !isFirebaseConfigured();

// Helper to load and sync with localStorage so demo state persists across navigation and page refreshes
function loadFromStorage<T>(key: string, defaultVal: T): T {
  if (typeof window === "undefined") return defaultVal;
  try {
    const item = localStorage.getItem(`dlp_${key}`);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function saveToStorage(key: string, val: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`dlp_${key}`, JSON.stringify(val));
  } catch {
    // Ignore quota errors
  }
}

// In-memory demo store initialized from localStorage or fallback defaults
let _demoSubjects: Subject[] = loadFromStorage("subjects", demoSubjects);
let _demoMaterials: Material[] = loadFromStorage("materials", demoMaterials);
let _demoQuizzes: Quiz[] = loadFromStorage("quizzes", demoQuizzes);
let _demoQuizResults: QuizResult[] = loadFromStorage("quizResults", demoQuizResults);
let _demoProgress: Progress[] = loadFromStorage("progress", demoProgress);
let _demoRewards: Reward[] = loadFromStorage("rewards", demoRewards);

function ensureLoaded() {
  if (typeof window !== "undefined") {
    _demoSubjects = loadFromStorage("subjects", _demoSubjects);
    _demoMaterials = loadFromStorage("materials", _demoMaterials);
    _demoQuizzes = loadFromStorage("quizzes", _demoQuizzes);
    _demoQuizResults = loadFromStorage("quizResults", _demoQuizResults);
    _demoProgress = loadFromStorage("progress", _demoProgress);
    _demoRewards = loadFromStorage("rewards", _demoRewards);
  }
}

// ============ SUBJECTS ============

export async function getSubjects(): Promise<Subject[]> {
  if (isDemo) {
    ensureLoaded();
    return _demoSubjects;
  }
  if (!db) return [];
  const snap = await getDocs(collection(db, "subjects"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Subject));
}

export async function getSubject(id: string): Promise<Subject | null> {
  if (isDemo) {
    ensureLoaded();
    return _demoSubjects.find(s => s.id === id) || null;
  }
  if (!db) return null;
  const snap = await getDoc(doc(db, "subjects", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } as Subject : null;
}

export async function createSubject(data: Omit<Subject, "id">): Promise<string> {
  if (isDemo) {
    ensureLoaded();
    const id = `sub-${Date.now()}`;
    const newSubject = { id, ...data };
    _demoSubjects = [..._demoSubjects, newSubject];
    saveToStorage("subjects", _demoSubjects);
    return id;
  }
  if (!db) throw new Error("Firestore not available");
  const docRef = await addDoc(collection(db, "subjects"), data);
  return docRef.id;
}

export async function updateSubject(id: string, data: Partial<Subject>): Promise<void> {
  if (isDemo) {
    ensureLoaded();
    _demoSubjects = _demoSubjects.map(s => s.id === id ? { ...s, ...data } : s);
    saveToStorage("subjects", _demoSubjects);
    return;
  }
  if (!db) return;
  await updateDoc(doc(db, "subjects", id), data);
}

export async function deleteSubject(id: string): Promise<void> {
  if (isDemo) {
    ensureLoaded();
    _demoSubjects = _demoSubjects.filter(s => s.id !== id);
    saveToStorage("subjects", _demoSubjects);
    return;
  }
  if (!db) return;
  await deleteDoc(doc(db, "subjects", id));
}

// ============ MATERIALS ============

export async function getMaterials(subjectId?: string): Promise<Material[]> {
  if (isDemo) {
    ensureLoaded();
    return subjectId ? _demoMaterials.filter(m => m.subjectId === subjectId) : _demoMaterials;
  }
  if (!db) return [];
  let q;
  if (subjectId) {
    q = query(collection(db, "materials"), where("subjectId", "==", subjectId));
  } else {
    q = collection(db, "materials");
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Material));
}

export async function getMaterial(id: string): Promise<Material | null> {
  if (isDemo) {
    ensureLoaded();
    return _demoMaterials.find(m => m.id === id) || null;
  }
  if (!db) return null;
  const snap = await getDoc(doc(db, "materials", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } as Material : null;
}

export async function createMaterial(data: Omit<Material, "id">): Promise<string> {
  if (isDemo) {
    ensureLoaded();
    const id = `mat-${Date.now()}`;
    const newMaterial = { id, ...data };
    _demoMaterials = [..._demoMaterials, newMaterial];
    saveToStorage("materials", _demoMaterials);
    return id;
  }
  if (!db) throw new Error("Firestore not available");
  const docRef = await addDoc(collection(db, "materials"), data);
  return docRef.id;
}

export async function updateMaterial(id: string, data: Partial<Material>): Promise<void> {
  if (isDemo) {
    ensureLoaded();
    _demoMaterials = _demoMaterials.map(m => m.id === id ? { ...m, ...data } : m);
    saveToStorage("materials", _demoMaterials);
    return;
  }
  if (!db) return;
  await updateDoc(doc(db, "materials", id), data);
}

export async function deleteMaterial(id: string): Promise<void> {
  if (isDemo) {
    ensureLoaded();
    _demoMaterials = _demoMaterials.filter(m => m.id !== id);
    saveToStorage("materials", _demoMaterials);
    return;
  }
  if (!db) return;
  await deleteDoc(doc(db, "materials", id));
}

// ============ FILE UPLOAD ============

export async function uploadFile(file: File, path: string): Promise<string> {
  if (isDemo) return `demo://uploaded/${file.name}`;
  if (!storage) throw new Error("Storage not available");
  const storageRef = ref(storage, path);
  const snap = await uploadBytes(storageRef, file);
  return getDownloadURL(snap.ref);
}

// ============ QUIZZES ============

export async function getQuizzes(subjectId?: string): Promise<Quiz[]> {
  if (isDemo) {
    ensureLoaded();
    return subjectId ? _demoQuizzes.filter(q => q.subjectId === subjectId) : _demoQuizzes;
  }
  if (!db) return [];
  let q;
  if (subjectId) {
    q = query(collection(db, "quizzes"), where("subjectId", "==", subjectId));
  } else {
    q = collection(db, "quizzes");
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Quiz));
}

export async function getQuiz(id: string): Promise<Quiz | null> {
  if (isDemo) {
    ensureLoaded();
    return _demoQuizzes.find(q => q.id === id) || null;
  }
  if (!db) return null;
  const snap = await getDoc(doc(db, "quizzes", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } as Quiz : null;
}

export async function createQuiz(data: Omit<Quiz, "id">): Promise<string> {
  if (isDemo) {
    ensureLoaded();
    const id = `quiz-${Date.now()}`;
    const newQuiz = { id, ...data };
    _demoQuizzes = [..._demoQuizzes, newQuiz];
    saveToStorage("quizzes", _demoQuizzes);
    return id;
  }
  if (!db) throw new Error("Firestore not available");
  const docRef = await addDoc(collection(db, "quizzes"), data);
  return docRef.id;
}

export async function updateQuiz(id: string, data: Partial<Quiz>): Promise<void> {
  if (isDemo) {
    ensureLoaded();
    _demoQuizzes = _demoQuizzes.map(q => q.id === id ? { ...q, ...data } : q);
    saveToStorage("quizzes", _demoQuizzes);
    return;
  }
  if (!db) return;
  await updateDoc(doc(db, "quizzes", id), data);
}

export async function deleteQuiz(id: string): Promise<void> {
  if (isDemo) {
    ensureLoaded();
    _demoQuizzes = _demoQuizzes.filter(q => q.id !== id);
    saveToStorage("quizzes", _demoQuizzes);
    return;
  }
  if (!db) return;
  await deleteDoc(doc(db, "quizzes", id));
}

// ============ QUIZ RESULTS ============

export async function getQuizResults(studentId?: string): Promise<QuizResult[]> {
  if (isDemo) {
    ensureLoaded();
    return studentId ? _demoQuizResults.filter(r => r.studentId === studentId) : _demoQuizResults;
  }
  if (!db) return [];
  let q;
  if (studentId) {
    q = query(collection(db, "quizResults"), where("studentId", "==", studentId));
  } else {
    q = collection(db, "quizResults");
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as QuizResult));
}

export async function submitQuizResult(data: Omit<QuizResult, "id">): Promise<string> {
  if (isDemo) {
    ensureLoaded();
    const id = `result-${Date.now()}`;
    const newResult: QuizResult = { id, ...data };
    _demoQuizResults = [newResult, ..._demoQuizResults];
    saveToStorage("quizResults", _demoQuizResults);

    // Update or create progress for this student and subject
    const existingIndex = _demoProgress.findIndex(
      p => p.studentId === data.studentId && p.subjectId === data.subjectId
    );

    if (existingIndex >= 0) {
      const existing = _demoProgress[existingIndex];
      const prevTotal = (existing.averageScore || 0) * (existing.quizzesCompleted || 0);
      const newQuizzesCompleted = (existing.quizzesCompleted || 0) + 1;
      const newAverageScore = Math.round((prevTotal + data.percentage) / newQuizzesCompleted);
      // Increase progress percentage (cap at 100%)
      const newProgressPercentage = Math.min(100, Math.max(existing.progressPercentage, data.percentage >= 75 ? 85 : 60));

      _demoProgress[existingIndex] = {
        ...existing,
        quizzesCompleted: newQuizzesCompleted,
        averageScore: newAverageScore,
        progressPercentage: newProgressPercentage,
        updatedAt: new Date().toISOString(),
      };
    } else {
      _demoProgress.push({
        id: `prog-${Date.now()}`,
        studentId: data.studentId,
        subjectId: data.subjectId,
        subjectName: data.subjectName,
        materialsCompleted: 1,
        quizzesCompleted: 1,
        averageScore: data.percentage,
        progressPercentage: data.percentage >= 75 ? 85 : 50,
        updatedAt: new Date().toISOString(),
      });
    }
    saveToStorage("progress", _demoProgress);

    // Create reward if eligible (>= 75%)
    const rewardInfo = calculateReward(data.percentage);
    if (rewardInfo) {
      const newReward: Reward = {
        id: `reward-${Date.now()}`,
        studentId: data.studentId,
        quizId: data.quizId,
        quizTitle: data.quizTitle,
        subjectId: data.subjectId,
        subjectName: data.subjectName,
        percentage: data.percentage,
        badgeName: rewardInfo.badgeName,
        message: rewardInfo.message,
        earnedAt: new Date().toISOString(),
      };
      _demoRewards = [newReward, ..._demoRewards];
      saveToStorage("rewards", _demoRewards);
    }

    return id;
  }

  if (!db) throw new Error("Firestore not available");
  const docRef = await addDoc(collection(db, "quizResults"), data);

  // Update progress in Firestore
  const progressQuery = query(
    collection(db, "progress"),
    where("studentId", "==", data.studentId),
    where("subjectId", "==", data.subjectId)
  );
  const progressSnap = await getDocs(progressQuery);

  if (progressSnap.empty) {
    await addDoc(collection(db, "progress"), {
      studentId: data.studentId,
      subjectId: data.subjectId,
      subjectName: data.subjectName || "",
      materialsCompleted: 1,
      quizzesCompleted: 1,
      averageScore: data.percentage,
      progressPercentage: data.percentage >= 75 ? 85 : 50,
      updatedAt: new Date().toISOString(),
    });
  } else {
    const progressDoc = progressSnap.docs[0];
    const prev = progressDoc.data();
    const prevTotal = (prev.averageScore || 0) * (prev.quizzesCompleted || 0);
    const newCount = (prev.quizzesCompleted || 0) + 1;
    await updateDoc(progressDoc.ref, {
      quizzesCompleted: newCount,
      averageScore: Math.round((prevTotal + data.percentage) / newCount),
      progressPercentage: Math.min(100, Math.max(prev.progressPercentage || 0, data.percentage >= 75 ? 85 : 60)),
      updatedAt: new Date().toISOString(),
    });
  }

  // Save reward if score >= 75%
  const reward = calculateReward(data.percentage);
  if (reward) {
    await addDoc(collection(db, "rewards"), {
      studentId: data.studentId,
      quizId: data.quizId,
      quizTitle: data.quizTitle || "",
      subjectId: data.subjectId,
      subjectName: data.subjectName || "",
      percentage: data.percentage,
      badgeName: reward.badgeName,
      message: reward.message,
      earnedAt: new Date().toISOString(),
    });
  }

  return docRef.id;
}

// ============ PROGRESS ============

export async function getProgress(studentId?: string): Promise<Progress[]> {
  if (isDemo) {
    ensureLoaded();
    return studentId ? _demoProgress.filter(p => p.studentId === studentId) : _demoProgress;
  }
  if (!db) return [];
  let q;
  if (studentId) {
    q = query(collection(db, "progress"), where("studentId", "==", studentId));
  } else {
    q = collection(db, "progress");
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Progress));
}

export async function markMaterialComplete(studentId: string, subjectId: string, subjectName: string): Promise<void> {
  if (isDemo) {
    ensureLoaded();
    const existing = _demoProgress.find(p => p.studentId === studentId && p.subjectId === subjectId);
    if (existing) {
      existing.materialsCompleted += 1;
      existing.progressPercentage = Math.min(100, existing.progressPercentage + 15);
      existing.updatedAt = new Date().toISOString();
    } else {
      _demoProgress.push({
        id: `prog-${Date.now()}`,
        studentId,
        subjectId,
        subjectName,
        materialsCompleted: 1,
        quizzesCompleted: 0,
        averageScore: 0,
        progressPercentage: 40,
        updatedAt: new Date().toISOString(),
      });
    }
    saveToStorage("progress", _demoProgress);
    return;
  }

  if (!db) return;
  const progressQuery = query(
    collection(db, "progress"),
    where("studentId", "==", studentId),
    where("subjectId", "==", subjectId)
  );
  const snap = await getDocs(progressQuery);
  if (snap.empty) {
    await addDoc(collection(db, "progress"), {
      studentId, subjectId, subjectName,
      materialsCompleted: 1, quizzesCompleted: 0,
      averageScore: 0, progressPercentage: 40,
      updatedAt: new Date().toISOString(),
    });
  } else {
    const docSnap = snap.docs[0];
    const prev = docSnap.data();
    await updateDoc(docSnap.ref, {
      materialsCompleted: (prev.materialsCompleted || 0) + 1,
      progressPercentage: Math.min(100, (prev.progressPercentage || 0) + 15),
      updatedAt: new Date().toISOString(),
    });
  }
}

// ============ REWARDS ============

export async function getRewards(studentId?: string): Promise<Reward[]> {
  if (isDemo) {
    ensureLoaded();
    return studentId ? _demoRewards.filter(r => r.studentId === studentId) : _demoRewards;
  }
  if (!db) return [];
  let q;
  if (studentId) {
    q = query(collection(db, "rewards"), where("studentId", "==", studentId));
  } else {
    q = collection(db, "rewards");
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Reward));
}

// ============ USERS (Admin) ============

export async function getStudents(): Promise<User[]> {
  if (isDemo) {
    return demoUsers.filter(u => u.role === "student");
  }
  if (!db) return [];
  const q = query(collection(db, "users"), where("role", "==", "student"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as User));
}

export async function getAllUsers(): Promise<User[]> {
  if (isDemo) return demoUsers;
  if (!db) return [];
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as User));
}

// ============ ADMIN STATS ============

export async function getAdminStats() {
  const [students, subjects, materials, quizzes, results, rewards] = await Promise.all([
    getStudents(),
    getSubjects(),
    getMaterials(),
    getQuizzes(),
    getQuizResults(),
    getRewards(),
  ]);

  return {
    totalStudents: students.length,
    totalSubjects: subjects.length,
    totalMaterials: materials.length,
    totalQuizzes: quizzes.length,
    totalAttempts: results.length,
    totalRewards: rewards.length,
  };
}
