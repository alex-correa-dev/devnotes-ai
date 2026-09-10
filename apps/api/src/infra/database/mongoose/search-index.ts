import { NoteModel } from './models/note-model.js';

const SEARCH_INDEX_NAME = 'notes_search';

const searchIndexDefinition = {
  name: 'notes_search',
  definition: {
    mappings: {
      dynamic: false,
      fields: {
        title: { type: 'string', analyzer: 'lucene.standard' },
        content: { type: 'string', analyzer: 'lucene.standard' },
        tags: {
          type: 'token',
          normalizer: 'lowercase',
        },
        createdAt: { type: 'date' },
      },
    },
  },
};

export const ensureSearchIndex = async (): Promise<void> => {
  try {
    const existing = await NoteModel.collection.listSearchIndexes().toArray();
    const alreadyExists = existing.some((idx) => idx.name === SEARCH_INDEX_NAME);

    if (alreadyExists) {
      console.log(`🔍 Search index "${SEARCH_INDEX_NAME}" already exists`);
      
      return;
    }

    await NoteModel.collection.createSearchIndex(searchIndexDefinition);

    console.log(`✅ Search index "${SEARCH_INDEX_NAME}" created`);
  } catch (error) {
    console.error('Failed to ensure search index:', error);

    throw error;
  }
};