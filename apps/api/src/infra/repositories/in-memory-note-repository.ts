import type { Note } from '../../domain/entities/note.js';
import type {
  NoteRepository,
  SearchNotesParams,
  SearchNotesResult,
  SearchWithFacetsParams,
  SearchWithFacetsResult,
} from '../../domain/repositories/note-repository.js';
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

  async search(params: SearchNotesParams): Promise<SearchNotesResult> {
    const lower = params.query.toLowerCase();
    const filtered = Array.from(this.notes.values()).filter(
      (n) =>
        n.toObject().title.toLowerCase().includes(lower) ||
        n.toObject().content.toLowerCase().includes(lower),
    );

    return {
      notes: filtered.slice(params.skip ?? 0, (params.skip ?? 0) + (params.limit ?? 20)),
      total: filtered.length,
    };
  }

  async autocomplete(prefix: string, limit = 5): Promise<string[]> {
    const lower = prefix.toLowerCase();
    return Array.from(this.notes.values())
      .map((n) => n.toObject().title)
      .filter((title) => title.toLowerCase().startsWith(lower))
      .slice(0, limit);
  }

  async searchWithFacets(params: SearchWithFacetsParams): Promise<SearchWithFacetsResult> {
    const result = await this.search(params);
    const tagCounts = new Map<string, number>();

    for (const note of result.notes) {
      for (const tag of note.toObject().tags) {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      }
    }

    return {
      ...result,
      facets: {
        tags: Array.from(tagCounts.entries()).map(([value, count]) => ({ value, count })),
      },
    };
  }
}