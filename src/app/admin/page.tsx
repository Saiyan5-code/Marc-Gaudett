import { requireAdmin } from "@/lib/auth";
import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  await requireAdmin();
  // Fetch all notes from database, sorted by newest first
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8 border-b border-[#c5c1b9] pb-4">
        <h2 className="font-georgia text-3xl text-[#171714]">Operator Notes</h2>
        <Link 
          href="/admin/notes/new" 
          className="bg-black text-white px-5 py-2 text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          + Create New Note
        </Link>
      </div>

      <div className="bg-white border border-[#c5c1b9] shadow-sm">
        {notes.length === 0 ? (
          <div className="p-10 text-center text-[#6B6861] font-sans">
            No notes found. Create your first one!
          </div>
        ) : (
          <div className="divide-y divide-[#c5c1b9]">
            {notes.map((note) => (
              <div key={note.id} className="p-6 flex justify-between items-center hover:bg-black/5 transition-colors">
                <div>
                  <h3 className="font-georgia text-xl text-[#171714] mb-1">{note.title}</h3>
                  <div className="flex gap-4 text-xs font-sans uppercase tracking-wider text-[#6B6861]">
                    <span className={note.published ? "text-green-700" : "text-amber-800"}>{note.published ? "Published" : "Draft — private"}</span>
                    <span>{note.category}</span>
                    <span>&bull;</span>
                    <span>{note.date}</span>
                    <span>&bull;</span>
                    <span>{note.readTime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {note.published && <Link
                    href={`/notes/${note.slug}`} 
                    target="_blank"
                    className="text-sm text-blue-600 hover:underline font-sans"
                  >
                    View Live
                  </Link>}
                  <Link 
                    href={`/admin/notes/${note.id}`} 
                    className="text-sm font-semibold bg-[#e0dfdc] px-4 py-2 hover:bg-[#d0cfcc] transition-colors text-[#171714]"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
