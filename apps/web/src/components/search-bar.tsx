'use client';

import { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import {
  AutocompleteNotesDocument,
  SearchNotesDocument,
  type SearchNotesQuery,
} from '@/lib/graphql/generated/graphql';

type SearchBarProps = {
  onResults: (result: SearchNotesQuery['searchNotes']) => void;
};

export function SearchBar({ onResults }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [runSearch, { loading }] = useLazyQuery(SearchNotesDocument, {
    fetchPolicy: 'network-only',
  });

  const [runAutocomplete] = useLazyQuery(AutocompleteNotesDocument, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const { data } = await runAutocomplete({
        variables: { prefix: query, limit: 5 },
      });

      if (data) {
        setSuggestions(data.autocompleteNotes);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, runAutocomplete]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);

    const { data } = await runSearch({
      variables: { input: { query, limit: 20 } },
    });

    if (data) {
      onResults(data.searchNotes);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
        }}
        placeholder="Buscar notas..."
        className="w-full rounded border px-4 py-2"
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded border bg-white shadow">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion}
              onClick={() => {
                setQuery(suggestion);
                setShowSuggestions(false);
              }}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      <button
        type="submit"
        disabled={loading || query.length === 0}
        className="mt-2 w-full rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
    </form>
  );
}