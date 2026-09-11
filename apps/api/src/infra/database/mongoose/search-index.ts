import { NoteModel } from './models/note-model.js';

const SEARCH_INDEX_NAME = 'notes_search';

const searchIndexDefinition = {
  name: SEARCH_INDEX_NAME,
  definition: {
    mappings: {
      dynamic: false,
      fields: {
        title: { type: 'string', analyzer: 'lucene.standard' },
        content: { type: 'string', analyzer: 'lucene.standard' },
        tags: { type: 'token', normalizer: 'lowercase' },
        createdAt: { type: 'date' },
      },
    },
  },
} as const;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const ensureSearchIndex = async (): Promise<void> => {
  const maxAttempts = 10;
  const delayMs = 3000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const existing = await NoteModel.collection.listSearchIndexes().toArray();
      const alreadyExists = existing.some((idx) => idx.name === SEARCH_INDEX_NAME);

      if (alreadyExists) {
        console.log(`🔍 Search index "${SEARCH_INDEX_NAME}" already exists`);
        
        return;
      }

      await NoteModel.collection.createSearchIndex(searchIndexDefinition);

      console.log(`✅ Search index "${SEARCH_INDEX_NAME}" created`);

      return;
    } catch (error) {
      const isTransient =
        error instanceof Error &&
        (error.message.includes('not in primary') ||
          error.message.includes('not master') ||
          error.message.includes('NamespaceNotFound') ||
          error.message.includes('Error connecting to Search Index Management'));

      if (isTransient && attempt < maxAttempts) {
        console.warn(
          `⏳ Search index not ready (attempt ${attempt}/${maxAttempts}), retrying in ${delayMs}ms...`,
        );

        await sleep(delayMs);

        continue;
      }

      console.error('⚠️  Failed to ensure search index after retries:', error);

      return;
    }
  }
};