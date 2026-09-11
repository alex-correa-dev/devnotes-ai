/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query ListNotes {\n  notes {\n    id\n    title\n    content\n    tags\n    createdAt\n    updatedAt\n  }\n}\n\nquery GetNote($id: ID!) {\n  note(id: $id) {\n    id\n    title\n    content\n    tags\n    createdAt\n    updatedAt\n  }\n}\n\nquery SearchNotes($input: SearchNotesInput!) {\n  searchNotes(input: $input) {\n    total\n    notes {\n      id\n      title\n      content\n      tags\n      createdAt\n      updatedAt\n    }\n  }\n}\n\nquery SearchNotesWithFacets($input: SearchNotesWithFacetsInput!) {\n  searchNotesWithFacets(input: $input) {\n    total\n    facets {\n      tags {\n        value\n        count\n      }\n    }\n    notes {\n      id\n      title\n      content\n      tags\n      createdAt\n      updatedAt\n    }\n  }\n}\n\nquery AutocompleteNotes($prefix: String!, $limit: Int) {\n  autocompleteNotes(prefix: $prefix, limit: $limit)\n}\n\nmutation CreateNote($input: CreateNoteInput!) {\n  createNote(input: $input) {\n    id\n    title\n    content\n    tags\n    createdAt\n    updatedAt\n  }\n}\n\nmutation DeleteNote($id: ID!) {\n  deleteNote(id: $id)\n}": typeof types.ListNotesDocument,
};
const documents: Documents = {
    "query ListNotes {\n  notes {\n    id\n    title\n    content\n    tags\n    createdAt\n    updatedAt\n  }\n}\n\nquery GetNote($id: ID!) {\n  note(id: $id) {\n    id\n    title\n    content\n    tags\n    createdAt\n    updatedAt\n  }\n}\n\nquery SearchNotes($input: SearchNotesInput!) {\n  searchNotes(input: $input) {\n    total\n    notes {\n      id\n      title\n      content\n      tags\n      createdAt\n      updatedAt\n    }\n  }\n}\n\nquery SearchNotesWithFacets($input: SearchNotesWithFacetsInput!) {\n  searchNotesWithFacets(input: $input) {\n    total\n    facets {\n      tags {\n        value\n        count\n      }\n    }\n    notes {\n      id\n      title\n      content\n      tags\n      createdAt\n      updatedAt\n    }\n  }\n}\n\nquery AutocompleteNotes($prefix: String!, $limit: Int) {\n  autocompleteNotes(prefix: $prefix, limit: $limit)\n}\n\nmutation CreateNote($input: CreateNoteInput!) {\n  createNote(input: $input) {\n    id\n    title\n    content\n    tags\n    createdAt\n    updatedAt\n  }\n}\n\nmutation DeleteNote($id: ID!) {\n  deleteNote(id: $id)\n}": types.ListNotesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ListNotes {\n  notes {\n    id\n    title\n    content\n    tags\n    createdAt\n    updatedAt\n  }\n}\n\nquery GetNote($id: ID!) {\n  note(id: $id) {\n    id\n    title\n    content\n    tags\n    createdAt\n    updatedAt\n  }\n}\n\nquery SearchNotes($input: SearchNotesInput!) {\n  searchNotes(input: $input) {\n    total\n    notes {\n      id\n      title\n      content\n      tags\n      createdAt\n      updatedAt\n    }\n  }\n}\n\nquery SearchNotesWithFacets($input: SearchNotesWithFacetsInput!) {\n  searchNotesWithFacets(input: $input) {\n    total\n    facets {\n      tags {\n        value\n        count\n      }\n    }\n    notes {\n      id\n      title\n      content\n      tags\n      createdAt\n      updatedAt\n    }\n  }\n}\n\nquery AutocompleteNotes($prefix: String!, $limit: Int) {\n  autocompleteNotes(prefix: $prefix, limit: $limit)\n}\n\nmutation CreateNote($input: CreateNoteInput!) {\n  createNote(input: $input) {\n    id\n    title\n    content\n    tags\n    createdAt\n    updatedAt\n  }\n}\n\nmutation DeleteNote($id: ID!) {\n  deleteNote(id: $id)\n}"): (typeof documents)["query ListNotes {\n  notes {\n    id\n    title\n    content\n    tags\n    createdAt\n    updatedAt\n  }\n}\n\nquery GetNote($id: ID!) {\n  note(id: $id) {\n    id\n    title\n    content\n    tags\n    createdAt\n    updatedAt\n  }\n}\n\nquery SearchNotes($input: SearchNotesInput!) {\n  searchNotes(input: $input) {\n    total\n    notes {\n      id\n      title\n      content\n      tags\n      createdAt\n      updatedAt\n    }\n  }\n}\n\nquery SearchNotesWithFacets($input: SearchNotesWithFacetsInput!) {\n  searchNotesWithFacets(input: $input) {\n    total\n    facets {\n      tags {\n        value\n        count\n      }\n    }\n    notes {\n      id\n      title\n      content\n      tags\n      createdAt\n      updatedAt\n    }\n  }\n}\n\nquery AutocompleteNotes($prefix: String!, $limit: Int) {\n  autocompleteNotes(prefix: $prefix, limit: $limit)\n}\n\nmutation CreateNote($input: CreateNoteInput!) {\n  createNote(input: $input) {\n    id\n    title\n    content\n    tags\n    createdAt\n    updatedAt\n  }\n}\n\nmutation DeleteNote($id: ID!) {\n  deleteNote(id: $id)\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;