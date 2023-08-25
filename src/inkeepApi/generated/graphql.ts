/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Date with time (isoformat) */
  DateTime: { input: any; output: any; }
};

export type BotMessage = ChatMessage & {
  __typename?: 'BotMessage';
  citations: Array<ChatCitation>;
  codeBlocks?: Maybe<Array<CodeBlock>>;
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type ChatCitation = {
  __typename?: 'ChatCitation';
  citationNumber: Scalars['Int']['output'];
  rootRecordId?: Maybe<Scalars['ID']['output']>;
  rootRecordType?: Maybe<RecordType>;
  title?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};

export type ChatMessage = {
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export enum ChatMode {
  Auto = 'AUTO',
  Turbo = 'TURBO'
}

export type ChatResult = {
  __typename?: 'ChatResult';
  isEnd: Scalars['Boolean']['output'];
  message: BotMessage;
  sessionId: Scalars['ID']['output'];
};

export type ChatSession = {
  __typename?: 'ChatSession';
  chatMode: ChatMode;
  id: Scalars['ID']['output'];
  isSharedSession: Scalars['Boolean']['output'];
  messages: Array<ChatMessage>;
  organizationId: Scalars['String']['output'];
  outputMode: OutputMode;
  product?: Maybe<Scalars['String']['output']>;
  productVersion?: Maybe<Scalars['String']['output']>;
};

export type CodeBlock = {
  __typename?: 'CodeBlock';
  code: Scalars['String']['output'];
  language: CodeLanguage;
};

export enum CodeLanguage {
  Python = 'PYTHON',
  Sql = 'SQL',
  Undefined = 'UNDEFINED'
}

export type ContinueChatResultInput = {
  messageInput: Scalars['String']['input'];
  sessionId: Scalars['ID']['input'];
};

export type DiscourseHit = SearchHit & {
  __typename?: 'DiscourseHit';
  hitOnRoot: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  preview?: Maybe<Scalars['String']['output']>;
  rootRecord: DiscourseRecord;
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type DiscourseRecord = SearchRootRecord & {
  __typename?: 'DiscourseRecord';
  body?: Maybe<Scalars['String']['output']>;
  bodyHtml?: Maybe<Scalars['String']['output']>;
  categoryBreadcrumbs: Array<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  preview?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type DocumentationContentLevel = {
  __typename?: 'DocumentationContentLevel';
  anchor?: Maybe<Scalars['String']['output']>;
  content: Scalars['String']['output'];
  contentHtml: Scalars['String']['output'];
  htmlTag: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type DocumentationHit = SearchHit & {
  __typename?: 'DocumentationHit';
  content: DocumentationContentLevel;
  hitOnRoot: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  pathHeadings: Array<DocumentationContentLevel>;
  preview?: Maybe<Scalars['String']['output']>;
  rootRecord: SearchRootRecord;
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type DocumentationRecord = SearchRootRecord & {
  __typename?: 'DocumentationRecord';
  contentType: Scalars['String']['output'];
  firstContent: Scalars['String']['output'];
  firstContentPath: Array<DocumentationContentLevel>;
  id: Scalars['ID']['output'];
  pathBreadcrumbs?: Maybe<Array<Scalars['String']['output']>>;
  preview?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  topLevelHeadings: Array<DocumentationContentLevel>;
  url?: Maybe<Scalars['String']['output']>;
};

export type GitHubIssueComment = {
  __typename?: 'GitHubIssueComment';
  body?: Maybe<Scalars['String']['output']>;
  commentDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  reactions: Array<GitHubReaction>;
  url: Scalars['String']['output'];
};

export type GitHubIssueHit = SearchHit & {
  __typename?: 'GitHubIssueHit';
  hitOnRoot: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  preview?: Maybe<Scalars['String']['output']>;
  rootRecord: GitHubIssueRecord;
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type GitHubIssueRecord = SearchRootRecord & {
  __typename?: 'GitHubIssueRecord';
  body?: Maybe<Scalars['String']['output']>;
  commentsWithMostPositiveReactions: Array<GitHubIssueComment>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  preview?: Maybe<Scalars['String']['output']>;
  reactions: Array<GitHubReaction>;
  state: GitHubIssueState;
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export enum GitHubIssueState {
  Closed = 'CLOSED',
  Open = 'OPEN'
}

export type GitHubReaction = {
  __typename?: 'GitHubReaction';
  count: Scalars['Int']['output'];
  reactionType: ReactionType;
};

export type Mutation = {
  __typename?: 'Mutation';
  copyChatSession: Scalars['ID']['output'];
};


export type MutationCopyChatSessionArgs = {
  isSharedSession: Scalars['Boolean']['input'];
  sessionId: Scalars['ID']['input'];
};

export type NewSessionChatResultInput = {
  chatMode?: InputMaybe<ChatMode>;
  integrationId?: InputMaybe<Scalars['ID']['input']>;
  messageInput: Scalars['String']['input'];
  organizationId?: InputMaybe<Scalars['ID']['input']>;
  outputMode?: InputMaybe<OutputMode>;
  product?: InputMaybe<Scalars['String']['input']>;
  productVersion?: InputMaybe<Scalars['String']['input']>;
};

export enum OutputMode {
  Code = 'CODE',
  Default = 'DEFAULT',
  Python = 'PYTHON',
  Sql = 'SQL'
}

export type Query = {
  __typename?: 'Query';
  getChatSession: ChatSession;
  getSearchRootRecords: Array<SearchRootRecord>;
  hello?: Maybe<Scalars['String']['output']>;
  search: SearchResult;
};


export type QueryGetChatSessionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetSearchRootRecordsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QuerySearchArgs = {
  searchInput: SearchInput;
};

export enum ReactionType {
  Confused = 'CONFUSED',
  Eyes = 'EYES',
  Heart = 'HEART',
  Hooray = 'HOORAY',
  Laugh = 'LAUGH',
  MinusOne = 'MINUS_ONE',
  PlusOne = 'PLUS_ONE',
  Rocket = 'ROCKET'
}

export enum RecordType {
  Discourse = 'DISCOURSE',
  Documentation = 'DOCUMENTATION',
  GithubIssue = 'GITHUB_ISSUE',
  Stackoverflow = 'STACKOVERFLOW'
}

export type SearchFiltersInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  product?: InputMaybe<Scalars['String']['input']>;
  productVersion?: InputMaybe<Scalars['String']['input']>;
  sources?: InputMaybe<Array<RecordType>>;
};

export type SearchHit = {
  hitOnRoot: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  preview?: Maybe<Scalars['String']['output']>;
  rootRecord: SearchRootRecord;
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type SearchInput = {
  filters?: InputMaybe<SearchFiltersInput>;
  integrationId?: InputMaybe<Scalars['ID']['input']>;
  organizationId?: InputMaybe<Scalars['ID']['input']>;
  searchMode?: InputMaybe<SearchMode>;
  searchQuery: Scalars['String']['input'];
};

export enum SearchMode {
  Auto = 'AUTO',
  Intelligent = 'INTELLIGENT',
  Keyword = 'KEYWORD'
}

export type SearchResult = {
  __typename?: 'SearchResult';
  searchHits: Array<SearchHit>;
  searchQuery: Scalars['String']['output'];
};

export type SearchRootRecord = {
  id: Scalars['ID']['output'];
  preview?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type StackOverflowAnswer = {
  __typename?: 'StackOverflowAnswer';
  content: Scalars['String']['output'];
  contentHtml: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  score: Scalars['Int']['output'];
  url: Scalars['String']['output'];
};

export type StackOverflowHit = SearchHit & {
  __typename?: 'StackOverflowHit';
  hitOnRoot: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  preview?: Maybe<Scalars['String']['output']>;
  rootRecord: StackOverflowRecord;
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type StackOverflowRecord = SearchRootRecord & {
  __typename?: 'StackOverflowRecord';
  body?: Maybe<Scalars['String']['output']>;
  bodyHtml?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  markedAsCorrectAnswer?: Maybe<StackOverflowAnswer>;
  preview?: Maybe<Scalars['String']['output']>;
  score: Scalars['Int']['output'];
  tags: Array<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  topVotedAnswer?: Maybe<StackOverflowAnswer>;
  url?: Maybe<Scalars['String']['output']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  continueChatResult: ChatResult;
  newSessionChatResult: ChatResult;
};


export type SubscriptionContinueChatResultArgs = {
  input: ContinueChatResultInput;
};


export type SubscriptionNewSessionChatResultArgs = {
  input: NewSessionChatResultInput;
};

export type UserMessage = ChatMessage & {
  __typename?: 'UserMessage';
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type ContinueExistingChatSubscriptionVariables = Exact<{
  input: ContinueChatResultInput;
}>;


export type ContinueExistingChatSubscription = { __typename?: 'Subscription', continueChatResult: { __typename?: 'ChatResult', isEnd: boolean, sessionId: string, message: { __typename?: 'BotMessage', content: string, id: string, citations: Array<{ __typename?: 'ChatCitation', title?: string | null, url: string }> } } };

export type NewChatSubscriptionVariables = Exact<{
  input: NewSessionChatResultInput;
}>;


export type NewChatSubscription = { __typename?: 'Subscription', newSessionChatResult: { __typename?: 'ChatResult', isEnd: boolean, sessionId: string, message: { __typename?: 'BotMessage', content: string, id: string, citations: Array<{ __typename?: 'ChatCitation', title?: string | null, url: string }> } } };

export type SearchQueryVariables = Exact<{
  searchInput: SearchInput;
}>;


export type SearchQuery = { __typename?: 'Query', search: { __typename?: 'SearchResult', searchQuery: string, searchHits: Array<{ __typename?: 'DiscourseHit', id: string, url?: string | null, title?: string | null } | { __typename?: 'DocumentationHit', id: string, url?: string | null, title?: string | null } | { __typename?: 'GitHubIssueHit', id: string, url?: string | null, title?: string | null } | { __typename?: 'StackOverflowHit', id: string, url?: string | null, title?: string | null }> } };


export const ContinueExistingChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"ContinueExistingChat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ContinueChatResultInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"continueChatResult"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isEnd"}},{"kind":"Field","name":{"kind":"Name","value":"message"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"citations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}}]}}]}}]} as unknown as DocumentNode<ContinueExistingChatSubscription, ContinueExistingChatSubscriptionVariables>;
export const NewChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NewChat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NewSessionChatResultInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newSessionChatResult"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isEnd"}},{"kind":"Field","name":{"kind":"Name","value":"message"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"citations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}}]}}]}}]} as unknown as DocumentNode<NewChatSubscription, NewChatSubscriptionVariables>;
export const SearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Search"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchHits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"searchQuery"}}]}}]}}]} as unknown as DocumentNode<SearchQuery, SearchQueryVariables>;