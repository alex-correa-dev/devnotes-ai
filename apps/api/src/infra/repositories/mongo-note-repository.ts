import { Note } from '../../domain/entities/note.js';
import type { NoteRepository } from '../../domain/repositories/note-repository.js';
import { NoteModel } from '../database/mongoose/models/note-model.js';

export class MongoNoteRepository implements NoteRepository {
  async findAll(): Promise<Note[]> {
    const docs = await NoteModel.find().sort({ createdAt: -1 }).lean();
    
    return docs.map((doc) => this.toDomain(doc));
  }

  async findById(id: string): Promise<Note | null> {
    const doc = await NoteModel.findById(id).lean();

    return doc ? this.toDomain(doc) : null;
  }

  async save(note: Note): Promise<void> {
    const obj = note.toObject();

    await NoteModel.findByIdAndUpdate(
      obj.id,
      {
        title: obj.title,
        content: obj.content,
        tags: obj.tags,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  async delete(id: string): Promise<boolean> {
    const result = await NoteModel.findByIdAndDelete(id);

    return result !== null;
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