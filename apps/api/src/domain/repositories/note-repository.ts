import type { Note } from '../entities/note.js';

export type SearchNotesParams = {
  query: string;
  tags?: string[];
  limit?: number;
  skip?: number;
};

export type SearchNotesResult = {
  notes: Note[];
  total: number;
};

export interface NoteRepository {
  findAll(): Promise<Note[]>;
  findById(id: string): Promise<Note | null>;
  save(note: Note): Promise<void>;
  delete(id: string): Promise<boolean>;
  search(params: SearchNotesParams): Promise<SearchNotesResult>;
  autocomplete(prefix: string, limit?: number): Promise<string[]>;
}