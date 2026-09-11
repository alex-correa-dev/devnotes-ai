import type { ListNotesQuery } from '@/lib/graphql/generated/graphql';

type Note = ListNotesQuery['notes'][number];

export function NoteCard({ note }: { note: Note }) {
  return (
    <article className="rounded border p-4 transition hover:border-blue-400">
      <h2 className="text-lg font-semibold">{note.title}</h2>
      <p className="mt-1 line-clamp-3 text-sm text-gray-700">{note.content}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {note.tags.map((tag) => (
          <span key={tag} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
