import type { ListNotesQuery } from '@/lib/graphql/generated/graphql';
import { NoteCard } from './note-card';

type Note = ListNotesQuery['notes'][number];

export function NoteList({ notes }: { notes: Note[] }) {
  if (notes.length === 0) {
    return (
      <p className="rounded border border-dashed p-8 text-center text-gray-500">
        Nenhuma nota ainda. Que tal criar a primeira?
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {notes.map((note) => (
        <li key={note.id}>
          <NoteCard note={note} />
        </li>
      ))}
    </ul>
  );
}
