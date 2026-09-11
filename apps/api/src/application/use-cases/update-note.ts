import { NotFoundError } from '../../domain/errors/domain-error.js';
import type { Note } from '../../domain/entities/note.js';
import type { NoteRepository } from '../../domain/repositories/note-repository.js';

export type UpdateNoteInput = {
  title?: string;
  content?: string;
  tags?: string[];
};

export class UpdateNoteUseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  async execute(id: string, input: UpdateNoteInput): Promise<Note> {
    const existing = await this.noteRepository.findById(id);

    if (!existing) {
      throw new NotFoundError('Note', id);
    }

    const updated = existing.withUpdatedFields(input);

    await this.noteRepository.save(updated);

    return updated;
  }
}
