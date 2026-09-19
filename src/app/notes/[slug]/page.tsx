import { Metadata } from "next";
import NoteClient from "./NoteClient";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const note = await prisma.note.findFirst({ where: { slug: resolvedParams.slug, published: true } });
  return {
    title: note ? `${note.title} | Operator Notes` : "Note Not Found",
  };
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const note = await prisma.note.findFirst({
    where: { slug: resolvedParams.slug, published: true }
  });

  if (!note) {
    notFound();
  }

  // Parse the JSON content
  const parsedNote = {
    ...note,
    content: JSON.parse(note.content as string)
  };

  return <NoteClient note={parsedNote} />;
}
