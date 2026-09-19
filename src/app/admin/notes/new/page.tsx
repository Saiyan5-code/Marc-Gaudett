import React from "react";
import NoteForm from "@/components/admin/NoteForm";
import { createNote } from "@/actions/notes";

export default function NewNotePage() {
  return (
    <div>
      <h2 className="font-georgia text-3xl text-[#171714] mb-8">Create New Note</h2>
      <div className="bg-white p-8 border border-[#c5c1b9] shadow-sm">
        <NoteForm action={createNote} buttonText="Save Draft" />
      </div>
    </div>
  );
}
