import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Marc Gaudett | Operator Notes on SaaS Growth and Distribution",
  description: "Practical Operator Notes from Marc Gaudett on SaaS partnerships, integrations, data, affiliates, outbound and sustainable revenue systems.",
};

export const revalidate = 0; // Ensure data is always fresh

export default async function Page() {
  const notes = await prisma.note.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3
  });
  return <HomeClient initialNotes={notes} />;
}
