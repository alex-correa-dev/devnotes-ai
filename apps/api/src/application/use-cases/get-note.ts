import { NotFoundError } from '../../domain/errors/domain-error.js';
import type { Note } from '../../domain/entities/note.js';
import type { NoteRepository } from '../../domain/repositories/note-repository.js';

export class GetNoteUseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  async execute(id: string): Promise<Note> {
    const note = await this.noteRepository.findById(id);

    if (!note) {
      throw new NotFoundError('Note', id);
    }

    return note;
  }
}
