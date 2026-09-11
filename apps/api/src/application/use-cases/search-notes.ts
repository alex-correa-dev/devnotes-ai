import type {
  NoteRepository,
  SearchNotesParams,
  SearchNotesResult,
} from '../../domain/repositories/note-repository.js';

export class SearchNotesUseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  async execute(params: SearchNotesParams): Promise<SearchNotesResult> {
    const trimmedQuery = params.query.trim();

    if (trimmedQuery.length === 0) {
      return { notes: [], total: 0 };
    }

    return this.noteRepository.search({
      ...params,
      query: trimmedQuery,
    });
  }
}
