import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const noteSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3 },
    content: { type: String, required: true },
    tags: { type: [String], default: [], index: true },
  },
  {
    timestamps: true,
    collection: 'notes',
    versionKey: false,
  },
);

noteSchema.index({ title: 'text', content: 'text', tags: 'text' });

export type NoteDocument = InferSchemaType<typeof noteSchema>;

// Guard against model re-registration on hot reload.
export const NoteModel = mongoose.models.Note ?? mongoose.model('Note', noteSchema);
