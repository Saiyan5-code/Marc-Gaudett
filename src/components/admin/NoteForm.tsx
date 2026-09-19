"use client";

import React, { useState, useTransition } from "react";

interface ContentBlock {
  type: "p" | "h2" | "quote" | "signoff";
  text: string;
}

interface NoteFormProps {
  initialData?: { title: string; slug: string; snippet: string; category: string; date: string; readTime: string; content: string; published: boolean };
  action: (formData: FormData) => Promise<void>;
  buttonText: string;
}

export default function NoteForm({ initialData, action, buttonText }: NoteFormProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const [content, setContent] = useState<ContentBlock[]>(
    initialData?.content ? JSON.parse(initialData.content) : []
  );

  const addBlock = (type: ContentBlock["type"]) => {
    setContent([...content, { type, text: "" }]);
  };

  const updateBlock = (index: number, text: string) => {
    const newContent = [...content];
    newContent[index].text = text;
    setContent(newContent);
  };

  const removeBlock = (index: number) => {
    setContent(content.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
      const intent = submitter?.value || "save";
      if (intent === "publish" && !window.confirm("Publish this note? It will become visible to everyone on your website.")) return;
      const data = new FormData(event.currentTarget);
      data.set("intent", intent);
      setError("");
      startTransition(async () => {
        try { await action(data); }
        catch (error) {
          // Let Next.js handle its redirect signal after a successful save.
          if (error && typeof error === "object" && "digest" in error && String(error.digest).startsWith("NEXT_REDIRECT")) throw error;
          setError("The note could not be saved. Your edits are still here; please try again.");
        }
      });
    }} className="space-y-6">
      <p role="status" className="text-sm text-[#6B6861]">{initialData?.published ? "Published — saved changes update the live note." : "Draft — only visible in your admin dashboard. Saving does not publish it."}</p>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold uppercase text-[#6B6861] mb-2 font-sans">Title</label>
          <input type="text" name="title" defaultValue={initialData?.title} required className="w-full border border-[#c5c1b9] p-2 bg-transparent text-sm font-sans" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-[#6B6861] mb-2 font-sans">Slug (URL)</label>
          <input type="text" name="slug" defaultValue={initialData?.slug} required className="w-full border border-[#c5c1b9] p-2 bg-transparent text-sm font-sans" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase text-[#6B6861] mb-2 font-sans">Snippet (Summary)</label>
        <textarea name="snippet" defaultValue={initialData?.snippet} required rows={3} className="w-full border border-[#c5c1b9] p-2 bg-transparent text-sm font-sans" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-semibold uppercase text-[#6B6861] mb-2 font-sans">Category</label>
          <input type="text" name="category" defaultValue={initialData?.category} required className="w-full border border-[#c5c1b9] p-2 bg-transparent text-sm font-sans" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-[#6B6861] mb-2 font-sans">Date (e.g. July 2026)</label>
          <input type="text" name="date" defaultValue={initialData?.date} required className="w-full border border-[#c5c1b9] p-2 bg-transparent text-sm font-sans" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-[#6B6861] mb-2 font-sans">Read Time (e.g. 4 min read)</label>
          <input type="text" name="readTime" defaultValue={initialData?.readTime} required className="w-full border border-[#c5c1b9] p-2 bg-transparent text-sm font-sans" />
        </div>
      </div>

      <div className="border-t border-[#c5c1b9] pt-6 mt-6">
        <label className="block text-sm font-bold text-[#171714] mb-4 font-georgia">Content Blocks</label>
        
        <input type="hidden" name="content" value={JSON.stringify(content)} />
        
        <div className="space-y-4 mb-6">
          {content.map((block, index) => (
            <div key={index} className="flex gap-4 items-start border border-[#e0dfdc] p-4 bg-white">
              <div className="w-24 shrink-0 font-sans text-xs uppercase font-semibold text-[#6B6861] pt-2">
                {block.type === 'p' ? 'Paragraph' : block.type === 'h2' ? 'Heading 2' : block.type === 'quote' ? 'Quote' : 'Signoff'}
              </div>
              <textarea 
                value={block.text}
                onChange={(e) => updateBlock(index, e.target.value)}
                className="w-full border border-[#c5c1b9] p-2 text-sm font-sans bg-transparent"
                rows={block.type === 'h2' ? 1 : 3}
              />
              <button type="button" onClick={() => removeBlock(index)} className="text-red-500 font-sans text-xs uppercase shrink-0 pt-2 hover:underline">
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pb-6">
          <button type="button" onClick={() => addBlock('h2')} className="px-4 py-2 border border-[#c5c1b9] text-xs font-semibold uppercase bg-white hover:bg-gray-50">+ Add Heading</button>
          <button type="button" onClick={() => addBlock('p')} className="px-4 py-2 border border-[#c5c1b9] text-xs font-semibold uppercase bg-white hover:bg-gray-50">+ Add Paragraph</button>
          <button type="button" onClick={() => addBlock('quote')} className="px-4 py-2 border border-[#c5c1b9] text-xs font-semibold uppercase bg-white hover:bg-gray-50">+ Add Quote</button>
          <button type="button" onClick={() => addBlock('signoff')} className="px-4 py-2 border border-[#c5c1b9] text-xs font-semibold uppercase bg-white hover:bg-gray-50">+ Add Signoff</button>
        </div>
      </div>

      {error && <p role="alert" className="text-red-700">{error}</p>}
      <button disabled={pending} name="intent" value="save" type="submit" className="w-full bg-black text-white font-semibold py-3 hover:bg-gray-800 transition-colors">
        {pending ? "Saving…" : buttonText}
      </button>
      {initialData && !initialData.published && <button disabled={pending} name="intent" value="publish" type="submit" className="w-full border border-black py-3 font-semibold">Publish Note</button>}
      <button type="button" onClick={() => setPreview(!preview)} className="underline text-sm">{preview ? "Hide Preview" : "Preview Content"}</button>
      {preview && <article className="space-y-5 border-t pt-6" aria-label="Private content preview">
        <p className="text-xs uppercase">Private preview — not published</p>
        {content.map((block, index) => block.type === "h2" ? <h2 key={index} className="font-georgia text-2xl">{block.text}</h2> : block.type === "quote" ? <blockquote key={index} className="border-l-2 pl-4 italic">{block.text}</blockquote> : <p key={index} className="font-georgia whitespace-pre-line leading-relaxed">{block.text}</p>)}
      </article>}
    </form>
  );
}
