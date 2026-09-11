import type {
  NoteRepository,
  SearchWithFacetsParams,
  SearchWithFacetsResult,
} from '../../domain/repositories/note-repository.js';

export class SearchNotesWithFacetsUseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  async execute(params: SearchWithFacetsParams): Promise<SearchWithFacetsResult> {
    const trimmedQuery = params.query.trim();

    if (trimmedQuery.length === 0) {
      return { notes: [], total: 0, facets: { tags: [] } };
    }

    return this.noteRepository.searchWithFacets({
      ...params,
      query: trimmedQuery,
    });
  }
}
