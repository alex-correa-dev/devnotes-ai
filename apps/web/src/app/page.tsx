'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import {
  SearchNotesWithFacetsDocument,
  type SearchNotesWithFacetsQuery,
} from '@/lib/graphql/generated/graphql';
import { SearchBar } from '@/components/search-bar';
import { FacetSidebar } from '@/components/facet-sidebar';
import { NoteList } from '@/components/note-list';
import { Pagination } from '@/components/pagination';

const PAGE_SIZE = 10;

type SearchResult = SearchNotesWithFacetsQuery['searchNotesWithFacets'];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const skip = page * PAGE_SIZE;

  const { data, loading, error } = useQuery(SearchNotesWithFacetsDocument, {
    variables: {
      input: {
        query,
        tags: selectedTags,
        limit: PAGE_SIZE,
        skip,
      },
    },
    skip: !hasSearched || query.trim().length === 0,
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const result: SearchResult | null = data?.searchNotesWithFacets ?? null;
  const totalPages = result ? Math.ceil(result.total / PAGE_SIZE) : 0;

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setSelectedTags([]);
    setPage(0);
    setHasSearched(true);
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    );
    setPage(0);
  };

  return (
    <main className="mx-auto max-w-4xl p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">DevNotes AI</h1>
        <p className="text-sm text-gray-600">Base de conhecimento com busca full-text</p>
      </header>

      <SearchBar onSearch={handleSearch} />

      {!hasSearched && (
        <p className="mt-8 rounded border border-dashed p-8 text-center text-gray-500">
          Digite algo para buscar nas suas notas.
        </p>
      )}

      {error && <p className="mt-4 text-sm text-red-600">Erro ao buscar: {error.message}</p>}

      {hasSearched && result && (
        <div className="mt-8 flex gap-8">
          <FacetSidebar
            facets={result.facets}
            selectedTags={selectedTags}
            onToggleTag={handleToggleTag}
          />

          <section className="flex-1">
            <p className="mb-4 text-sm text-gray-600">
              {result.total} resultado(s) encontrado(s)
              {selectedTags.length > 0 && ` • filtrando por: ${selectedTags.join(', ')}`}
            </p>

            {loading && <p className="text-gray-500">Buscando...</p>}

            {!loading && result.notes.length === 0 && (
              <p className="rounded border border-dashed p-8 text-center text-gray-500">
                Nenhuma nota encontrada para essa busca.
              </p>
            )}

            {!loading && result.notes.length > 0 && (
              <>
                <NoteList notes={result.notes} />
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
