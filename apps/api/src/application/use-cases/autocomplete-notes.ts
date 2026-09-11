import type { NoteRepository } from '../../domain/repositories/note-repository.js';

export class AutocompleteNotesUseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  async execute(prefix: string, limit = 5): Promise<string[]> {
    const trimmed = prefix.trim();

    if (trimmed.length < 2) {
      return [];
    }

    return this.noteRepository.autocomplete(trimmed, limit);
  }
}
