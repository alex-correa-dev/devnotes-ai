'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import {
  ListNotesDocument,
  type SearchNotesQuery,
} from '@/lib/graphql/generated/graphql';
import { SearchBar } from '@/components/search-bar';
import { NoteList } from '@/components/note-list';

export default function HomePage() {
  const { data: initialData } = useQuery(ListNotesDocument);

  const [searchResult, setSearchResult] = useState<
    SearchNotesQuery['searchNotes'] | null
  >(null);

  const notes = searchResult?.notes ?? initialData?.notes ?? [];

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-3xl font-bold">DevNotes AI</h1>

      <SearchBar onResults={setSearchResult} />

      {searchResult && (
        <p className="mt-4 text-sm text-gray-600">
          {searchResult.total} resultado(s) encontrado(s)
        </p>
      )}

      <div className="mt-6">
        <NoteList notes={notes} />
      </div>
    </main>
  );
}