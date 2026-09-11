import { Note } from '../../domain/entities/note.js';
import type { NoteRepository } from '../../domain/repositories/note-repository.js';

export type CreateNoteInput = {
  title: string;
  content: string;
  tags?: string[];
};

export class CreateNoteUseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  async execute(input: CreateNoteInput): Promise<Note> {
    const note = Note.create(input);

    const id = await this.noteRepository.save(note);

    return note.withId(id);
  }
}
