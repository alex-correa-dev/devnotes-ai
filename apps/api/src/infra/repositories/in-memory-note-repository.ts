import type { Note } from '../../domain/entities/note.js';
import type { NoteRepository } from '../../domain/repositories/note-repository.js';

export class InMemoryNoteRepository implements NoteRepository {
  private readonly notes = new Map<string, Note>();

  async findAll(): Promise<Note[]> {
    return Array.from(this.notes.values());
  }

  async findById(id: string): Promise<Note | null> {
    return this.notes.get(id) ?? null;
  }

  async save(note: Note): Promise<void> {
    this.notes.set(note.id, note);
  }

  async delete(id: string): Promise<boolean> {
    return this.notes.delete(id);
  }
}