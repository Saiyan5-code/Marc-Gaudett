import { Metadata } from "next";
import NotesClient from "./NotesClient";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Operator Notes | Marc Gaudett",
  description: "Practical notes on SaaS partnerships, data products, integrations, distribution, outbound and revenue systems.",
};

export const revalidate = 0;

export default async function NotesPage() {
  const notes = await prisma.note.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  });
  return <NotesClient initialNotes={notes} />;
}
