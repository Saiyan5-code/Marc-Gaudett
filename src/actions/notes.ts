"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createNote(formData: FormData) {
  const title = formData.get("title") as string;
  let slug = formData.get("slug") as string;
  const snippet = formData.get("snippet") as string;
  const category = formData.get("category") as string;
  const date = formData.get("date") as string;
  const readTime = formData.get("readTime") as string;
  const content = formData.get("content") as string; // JSON string
  const status = (formData.get("status") as string) || "draft";

  // Sanitize the slug: remove 'notes/', replace spaces/special chars with hyphens, lowercase
  slug = slug.replace(/^notes\//i, '').replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').toLowerCase();

  await prisma.note.create({
    data: { title, slug, snippet, category, date, readTime, content, status },
  });

  revalidatePath("/admin");
  revalidatePath("/notes");
  redirect("/admin");
}

export async function updateNote(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  let slug = formData.get("slug") as string;
  const snippet = formData.get("snippet") as string;
  const category = formData.get("category") as string;
  const date = formData.get("date") as string;
  const readTime = formData.get("readTime") as string;
  const content = formData.get("content") as string;
  const status = (formData.get("status") as string) || "draft";

  // Sanitize the slug
  slug = slug.replace(/^notes\//i, '').replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').toLowerCase();

  await prisma.note.update({
    where: { id },
    data: { title, slug, snippet, category, date, readTime, content, status },
  });

  revalidatePath("/admin");
  revalidatePath("/notes");
  revalidatePath(`/notes/${slug}`);
  redirect("/admin");
}

export async function deleteNote(id: string) {
  await prisma.note.delete({
    where: { id },
  });
  revalidatePath("/admin");
  revalidatePath("/notes");
  redirect("/admin");
}

export async function publishNote(id: string) {
  await prisma.note.update({
    where: { id },
    data: { status: "published" },
  });
  revalidatePath("/admin");
  revalidatePath("/notes");
}

export async function unpublishNote(id: string) {
  await prisma.note.update({
    where: { id },
    data: { status: "draft" },
  });
  revalidatePath("/admin");
  revalidatePath("/notes");
}
