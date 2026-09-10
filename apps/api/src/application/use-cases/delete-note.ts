import { NotFoundError } from '../../domain/errors/domain-error.js';
import type { NoteRepository } from '../../domain/repositories/note-repository.js';

export class DeleteNoteUseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  async execute(id: string): Promise<boolean> {
    const deleted = await this.noteRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError('Note', id);
    }

    return true;
  }
}