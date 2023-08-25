import { gql } from '@urql/core';
import createInkeepClient from './helper/createInkeepClient';
import type { SearchInput, SearchQuery, SearchResult } from '../generated/graphql'; // Make sure to import the generated types
import * as defaultValues from './helper/apiConsts';  // Import all constants

const SEARCH_QUERY = gql`
  query Search($searchInput: SearchInput!) {
    search(searchInput: $searchInput) {
      searchHits {
        id
        url
        title
      }
      searchQuery
    }
  }
`;

export const search = async (searchInput: SearchInput, apiKey?: string): Promise<SearchQuery['search']['searchHits']> => {
  
  const client = createInkeepClient(apiKey);
  
  const enhancedSearchInput = {
    ...defaultValues.organizationId && { organizationId: defaultValues.organizationId },
    ...defaultValues.integrationId && { integrationId: defaultValues.integrationId },
    ...searchInput
  };

  const result = await client.query<SearchQuery, { searchInput: SearchInput }>(SEARCH_QUERY, { searchInput: enhancedSearchInput }).toPromise();

  if (result.error || !result.data) {
    console.error('Error in receiving the response:', result.error);
    throw new Error('Error in receiving the response');
  }

  return result.data.search.searchHits;
};
