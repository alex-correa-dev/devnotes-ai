import type { PipelineStage } from 'mongoose';
import { Note } from '../../domain/entities/note.js';
import type {
  NoteRepository,
  SearchNotesParams,
  SearchNotesResult,
  SearchWithFacetsParams,
  SearchWithFacetsResult,
} from '../../domain/repositories/note-repository.js';
import { NoteModel } from '../database/mongoose/models/note-model.js';

const SEARCH_INDEX_NAME = 'notes_search';

export class MongoNoteRepository implements NoteRepository {
  async findAll(): Promise<Note[]> {
    const docs = await NoteModel.find().sort({ createdAt: -1 }).lean();

    return docs.map((doc) => this.toDomain(doc));
  }

  async findById(id: string): Promise<Note | null> {
    const doc = await NoteModel.findById(id).lean();

    return doc ? this.toDomain(doc) : null;
  }

  async save(note: Note): Promise<string> {
    const obj = note.toObject();

    if (obj.id === null) {
      const created = await NoteModel.create({
        title: obj.title,
        content: obj.content,
        tags: obj.tags,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
      });

      return created._id.toString();
    }

    await NoteModel.findByIdAndUpdate(
      obj.id,
      {
        title: obj.title,
        content: obj.content,
        tags: obj.tags,
        updatedAt: obj.updatedAt,
      },
      { new: true },
    );

    return obj.id;
  }

  async delete(id: string): Promise<boolean> {
    const result = await NoteModel.findByIdAndDelete(id);

    return result !== null;
  }

  async search(params: SearchNotesParams): Promise<SearchNotesResult> {
    const { query, tags, limit = 20, skip = 0 } = params;

    const mustClauses = [
      {
        text: {
          query,
          path: ['title', 'content'],
          fuzzy: { maxEdits: 1, prefixLength: 2 },
          score: { boost: { value: 3 } },
        },
      },
    ];

    const filterClauses = tags?.length ? [{ text: { query: tags, path: 'tags' } }] : [];

    const pipeline = [
      {
        $search: {
          index: SEARCH_INDEX_NAME,
          compound: {
            must: mustClauses,
            filter: filterClauses,
          },
          count: { type: 'total' },
        },
      },
      { $addFields: { score: { $meta: 'searchScore' } } },
      { $skip: skip },
      { $limit: limit },
    ];

    const results = await NoteModel.aggregate(pipeline);

    const total = results[0]?.__count ?? results.length;

    return {
      notes: results.map((doc) => this.toDomain(doc)),
      total,
    };
  }

  async autocomplete(prefix: string, limit = 5): Promise<string[]> {
    const pipeline = [
      {
        $search: {
          index: SEARCH_INDEX_NAME,
          compound: {
            should: [
              {
                autocomplete: {
                  query: prefix,
                  path: 'title',
                  tokenOrder: 'sequential',
                },
              },
            ],
            minimumShouldMatch: 1,
          },
        },
      },
      { $limit: limit },
      { $project: { _id: 0, title: 1 } },
    ];

    const results = await NoteModel.aggregate(pipeline);
    return results.map((doc) => doc.title);
  }

  async searchWithFacets(params: SearchWithFacetsParams): Promise<SearchWithFacetsResult> {
    const { query, tags, limit = 20, skip = 0 } = params;

    const mustClauses = [
      {
        text: {
          query,
          path: ['title', 'content'],
          fuzzy: { maxEdits: 1, prefixLength: 2 },
          score: { boost: { value: 3 } },
        },
      },
    ];

    const filterClauses = tags?.length ? [{ text: { query: tags, path: 'tags' } }] : [];

    const searchPipeline: PipelineStage[] = [
      {
        $search: {
          index: SEARCH_INDEX_NAME,
          compound: {
            must: mustClauses,
            filter: filterClauses,
          },
          count: { type: 'total' },
        },
      } as PipelineStage,
      { $addFields: { score: { $meta: 'searchScore' } } },
      { $sort: { score: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const facetPipeline: PipelineStage[] = [
      {
        $searchMeta: {
          index: SEARCH_INDEX_NAME,
          facet: {
            operator: {
              compound: {
                must: mustClauses,
                filter: filterClauses,
              },
            },
            facets: {
              tagsFacet: { type: 'string', path: 'tags', numBuckets: 20 },
            },
          },
        },
      } as PipelineStage,
    ];

    const [docs, meta] = await Promise.all([
      NoteModel.aggregate(searchPipeline),
      NoteModel.aggregate(facetPipeline),
    ]);

    const total = docs[0]?.__count ?? docs.length;
    const tagsFacet = meta[0]?.facet?.tagsFacet?.buckets ?? [];

    return {
      notes: docs.map((doc) => this.toDomain(doc)),
      total,
      facets: {
        tags: tagsFacet.map((bucket: { _id: string; count: number }) => ({
          value: bucket._id,
          count: bucket.count,
        })),
      },
    };
  }

  private toDomain(doc: {
    _id: { toString(): string };
    title: string;
    content: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
  }): Note {
    return Note.restore({
      id: doc._id.toString(),
      title: doc.title,
      content: doc.content,
      tags: doc.tags,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
