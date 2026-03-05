import {
  collection, doc, getDocs, getDoc, addDoc,
  updateDoc, deleteDoc, query, orderBy, serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";
import type { Project } from "@/types";

const COL = "projects";

export async function getProjects(): Promise<Project[]> {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const all = await getProjects();
  return all.find(p => p.slug === slug) ?? null;
}

export async function addProject(data: Omit<Project, "id" | "createdAt">): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    createdAt: Date.now(),
  });
  return ref.id;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<void> {
  await updateDoc(doc(db, COL, id), data);
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}