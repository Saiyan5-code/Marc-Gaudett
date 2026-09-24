import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { publishNote, unpublishNote } from "@/actions/notes";

export default async function AdminDashboard() {
  const allNotes = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
  });

  const drafts = allNotes.filter((n) => n.status !== "published");
  const published = allNotes.filter((n) => n.status === "published");

  return (
    <div className="space-y-10">

      {/* ── DRAFTS ── */}
      <section>
        <div className="flex justify-between items-center mb-5 border-b border-[#c5c1b9] pb-4">
          <div className="flex items-center gap-3">
            <h2 className="font-georgia text-2xl text-[#171714]">Drafts</h2>
            {drafts.length > 0 && (
              <span className="bg-amber-100 text-amber-800 text-xs font-semibold font-sans px-2.5 py-0.5 rounded-full border border-amber-200">
                {drafts.length}
              </span>
            )}
          </div>
          <Link
            href="/admin/notes/new"
            className="bg-black text-white px-5 py-2 text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            + Create New Note
          </Link>
        </div>

        <div className="bg-white border border-[#c5c1b9] shadow-sm">
          {drafts.length === 0 ? (
            <div className="p-10 text-center text-[#6B6861] font-sans text-sm">
              No drafts. New notes saved as draft will appear here.
            </div>
          ) : (
            <div className="divide-y divide-[#c5c1b9]">
              {drafts.map((note) => {
                const publishAction = publishNote.bind(null, note.id);
                return (
                  <div key={note.id} className="p-5 flex justify-between items-center hover:bg-amber-50/40 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                        <h3 className="font-georgia text-lg text-[#171714]">{note.title}</h3>
                      </div>
                      <div className="flex gap-3 text-xs font-sans uppercase tracking-wider text-[#6B6861] pl-4">
                        <span>{note.category}</span>
                        <span>&bull;</span>
                        <span>{note.date}</span>
                        <span>&bull;</span>
                        <span>{note.readTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Link
                        href={`/admin/notes/${note.id}`}
                        className="text-sm font-semibold bg-[#e0dfdc] px-4 py-2 hover:bg-[#d0cfcc] transition-colors text-[#171714]"
                      >
                        Edit
                      </Link>
                      <form action={publishAction}>
                        <button
                          type="submit"
                          className="text-sm font-semibold bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors"
                        >
                          Publish →
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── PUBLISHED ── */}
      <section>
        <div className="flex justify-between items-center mb-5 border-b border-[#c5c1b9] pb-4">
          <div className="flex items-center gap-3">
            <h2 className="font-georgia text-2xl text-[#171714]">Published</h2>
            {published.length > 0 && (
              <span className="bg-green-100 text-green-800 text-xs font-semibold font-sans px-2.5 py-0.5 rounded-full border border-green-200">
                {published.length}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white border border-[#c5c1b9] shadow-sm">
          {published.length === 0 ? (
            <div className="p-10 text-center text-[#6B6861] font-sans text-sm">
              No published notes yet. Publish a draft to make it live.
            </div>
          ) : (
            <div className="divide-y divide-[#c5c1b9]">
              {published.map((note) => {
                const unpublishAction = unpublishNote.bind(null, note.id);
                return (
                  <div key={note.id} className="p-5 flex justify-between items-center hover:bg-black/5 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 shrink-0" />
                        <h3 className="font-georgia text-lg text-[#171714]">{note.title}</h3>
                      </div>
                      <div className="flex gap-3 text-xs font-sans uppercase tracking-wider text-[#6B6861] pl-4">
                        <span>{note.category}</span>
                        <span>&bull;</span>
                        <span>{note.date}</span>
                        <span>&bull;</span>
                        <span>{note.readTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Link
                        href={`/notes/${note.slug}`}
                        target="_blank"
                        className="text-sm text-blue-600 hover:underline font-sans"
                      >
                        View Live ↗
                      </Link>
                      <Link
                        href={`/admin/notes/${note.id}`}
                        className="text-sm font-semibold bg-[#e0dfdc] px-4 py-2 hover:bg-[#d0cfcc] transition-colors text-[#171714]"
                      >
                        Edit
                      </Link>
                      <form action={unpublishAction}>
                        <button
                          type="submit"
                          className="text-sm text-[#6B6861] hover:text-black font-sans underline underline-offset-2"
                        >
                          Unpublish
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
