import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GraphQLContext } from '../presentation/graphql/context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type CreateNoteInput = {
  content: Scalars['String']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createNote: Note;
  deleteNote: Scalars['Boolean']['output'];
  updateNote: Note;
};


export type MutationCreateNoteArgs = {
  input: CreateNoteInput;
};


export type MutationDeleteNoteArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateNoteArgs = {
  id: Scalars['ID']['input'];
  input: UpdateNoteInput;
};

export type Note = {
  __typename?: 'Note';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  tags: Array<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type NoteSearchResult = {
  __typename?: 'NoteSearchResult';
  notes: Array<Note>;
  total: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  autocompleteNotes: Array<Scalars['String']['output']>;
  note?: Maybe<Note>;
  notes: Array<Note>;
  searchNotes: NoteSearchResult;
};


export type QueryAutocompleteNotesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  prefix: Scalars['String']['input'];
};


export type QueryNoteArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySearchNotesArgs = {
  input: SearchNotesInput;
};

export type SearchNotesInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
  skip?: InputMaybe<Scalars['Int']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateNoteInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateNoteInput: CreateNoteInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Note: ResolverTypeWrapper<Note>;
  NoteSearchResult: ResolverTypeWrapper<NoteSearchResult>;
  Query: ResolverTypeWrapper<{}>;
  SearchNotesInput: SearchNotesInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateNoteInput: UpdateNoteInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  CreateNoteInput: CreateNoteInput;
  DateTime: Scalars['DateTime']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Note: Note;
  NoteSearchResult: NoteSearchResult;
  Query: {};
  SearchNotesInput: SearchNotesInput;
  String: Scalars['String']['output'];
  UpdateNoteInput: UpdateNoteInput;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationCreateNoteArgs, 'input'>>;
  deleteNote?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteNoteArgs, 'id'>>;
  updateNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationUpdateNoteArgs, 'id' | 'input'>>;
}>;

export type NoteResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Note'] = ResolversParentTypes['Note']> = ResolversObject<{
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NoteSearchResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['NoteSearchResult'] = ResolversParentTypes['NoteSearchResult']> = ResolversObject<{
  notes?: Resolver<Array<ResolversTypes['Note']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  autocompleteNotes?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryAutocompleteNotesArgs, 'prefix'>>;
  note?: Resolver<Maybe<ResolversTypes['Note']>, ParentType, ContextType, RequireFields<QueryNoteArgs, 'id'>>;
  notes?: Resolver<Array<ResolversTypes['Note']>, ParentType, ContextType>;
  searchNotes?: Resolver<ResolversTypes['NoteSearchResult'], ParentType, ContextType, RequireFields<QuerySearchNotesArgs, 'input'>>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  DateTime?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Note?: NoteResolvers<ContextType>;
  NoteSearchResult?: NoteSearchResultResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;

