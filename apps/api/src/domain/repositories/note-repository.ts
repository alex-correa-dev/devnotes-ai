import type { Note } from '../entities/note.js';

export interface NoteRepository {
  findAll(): Promise<Note[]>;
  findById(id: string): Promise<Note | null>;
  save(note: Note): Promise<void>;
  delete(id: string): Promise<boolean>;
}