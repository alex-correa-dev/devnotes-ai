'use client';

import type { SearchNotesWithFacetsQuery } from '@/lib/graphql/generated/graphql';

type Facets = SearchNotesWithFacetsQuery['searchNotesWithFacets']['facets'];
type FacetBucket = Facets['tags'][number];

type FacetSidebarProps = {
  facets: Facets;
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
};

export function FacetSidebar({ facets, selectedTags, onToggleTag }: FacetSidebarProps) {
  if (facets.tags.length === 0) return null;

  return (
    <aside className="w-48 shrink-0">
      <h3 className="mb-2 text-sm font-semibold">Tags</h3>
      <ul className="space-y-1">
        {facets.tags.map((bucket: FacetBucket) => {
          const isSelected = selectedTags.includes(bucket.value);
          return (
            <li key={bucket.value}>
              <button
                type="button"
                onClick={() => onToggleTag(bucket.value)}
                className={`flex w-full justify-between rounded px-2 py-1 text-sm hover:bg-gray-100 ${
                  isSelected ? 'bg-blue-50 font-medium text-blue-700' : ''
                }`}
              >
                <span>{bucket.value}</span>
                <span className="text-gray-500">{bucket.count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}