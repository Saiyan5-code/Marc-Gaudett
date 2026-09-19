"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function readNote(formData: FormData) {
  const read = (key: string) => {
    const value = formData.get(key);
    if (typeof value !== "string" || !value.trim()) throw new Error(`Missing ${key}`);
    return value.trim();
  };
  const slug = read("slug").replace(/^notes\//i, "").replace(/[^a-zA-Z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").toLowerCase();
  if (!slug) throw new Error("Invalid slug");
  const content = read("content");
  const blocks = JSON.parse(content);
  if (!Array.isArray(blocks) || !blocks.length || blocks.some((block) =>
    !block || !["p", "h2", "quote", "signoff"].includes(block.type) || typeof block.text !== "string" || !block.text.trim()
  )) throw new Error("Add content before saving");
  return { title: read("title"), slug, snippet: read("snippet"), category: read("category"), date: read("date"), readTime: read("readTime"), content };
}

function refresh(slug: string, previousSlug?: string) {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/notes");
  revalidatePath(`/notes/${slug}`);
  if (previousSlug && previousSlug !== slug) revalidatePath(`/notes/${previousSlug}`);
}

export async function createNote(formData: FormData) {
  await requireAdmin();
  // Creation always saves privately, even if a caller submits a publish intent.
  const note = await prisma.note.create({ data: { ...readNote(formData), published: false } });
  revalidatePath("/admin");
  redirect(`/admin/notes/${note.id}`);
}

export async function updateNote(id: string, formData: FormData) {
  await requireAdmin();
  const previous = await prisma.note.findUniqueOrThrow({ where: { id } });
  const data = readNote(formData);
  // A normal save never changes publication status. Publishing is an explicit action.
  const note = await prisma.note.update({
    where: { id },
    data: { ...data, ...(formData.get("intent") === "publish" ? { published: true } : {}) },
  });
  refresh(note.slug, previous.slug);
  redirect("/admin");
}

export async function deleteNote(id: string) {
  await requireAdmin();
  const note = await prisma.note.delete({ where: { id } });
  refresh(note.slug);
  redirect("/admin");
}
