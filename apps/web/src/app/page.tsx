import Link from 'next/link';
import { query } from '@/lib/apollo/client';
import { ListNotesDocument } from '@/lib/graphql/generated/graphql';
import { NoteList } from '@/components/note-list';

export default async function HomePage() {
  const { data } = await query({
    query: ListNotesDocument,
  });

  return (
    <main className="mx-auto max-w-3xl p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">DevNotes AI</h1>
          <p className="text-sm text-gray-600">
            Base de conhecimento com busca full-text
          </p>
        </div>
        <Link
          href="/notes/new"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Nova nota
        </Link>
      </header>

      <NoteList notes={data.notes} />
    </main>
  );
}