import { requireAdmin } from "@/lib/auth";
import React from "react";
import NoteForm from "@/components/admin/NoteForm";
import { updateNote, deleteNote } from "@/actions/notes";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditNotePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const resolvedParams = await params;
  
  const note = await prisma.note.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!note) {
    notFound();
  }

  const updateAction = updateNote.bind(null, note.id);
  const deleteAction = deleteNote.bind(null, note.id);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-georgia text-3xl text-[#171714]">Edit Note</h2>
        <form action={deleteAction}>
          <button type="submit" className="text-red-500 font-semibold text-sm underline font-sans hover:text-red-700">
            Delete Note
          </button>
        </form>
      </div>
      <div className="bg-white p-8 border border-[#c5c1b9] shadow-sm">
        <NoteForm initialData={note} action={updateAction} buttonText={note.published ? "Save Live Changes" : "Save Draft"} />
      </div>
    </div>
  );
}
