import type { Note } from '../../domain/entities/note.js';
import type { NoteRepository } from '../../domain/repositories/note-repository.js';

export class ListNotesUseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  async execute(): Promise<Note[]> {
    return this.noteRepository.findAll();
  }
}