'use client';

import { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { AutocompleteNotesDocument } from '@/lib/graphql/generated/graphql';

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(query);
  };

  const handlePickSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="Buscar notas..."
          className="flex-1 rounded border px-4 py-2"
        />
        <button
          type="submit"
          disabled={query.trim().length === 0}
          className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Buscar
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded border bg-white shadow">
          {suggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handlePickSuggestion(suggestion)}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
