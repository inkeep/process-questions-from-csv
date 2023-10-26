import fetch from 'node-fetch-commonjs';
import { printSchema, buildClientSchema, GraphQLSchema, getIntrospectionQuery } from 'graphql';
import fs from 'fs';

const introspectionQuery = getIntrospectionQuery();

async function fetchSchema(endpoint: string): Promise<string> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: introspectionQuery }),
  });

  const jsonResponse: any = await response.json();

  if (!jsonResponse.data) {
    throw new Error('No data received from endpoint.');
  }

  const schema: GraphQLSchema = buildClientSchema(jsonResponse.data);

  return printSchema(schema);
}

// Get domain from command line arguments and construct endpoint and filename
const domain = process.argv[2];
const endpoint = `https://${domain}/graphql`;
const filename = `${domain.replace(/\./g, '-')}-sdl.graphql`;

fetchSchema(endpoint).then((schemaSDL) => {
  fs.writeFileSync(filename, schemaSDL);
  console.log(`Schema has been saved to ${filename}`);
}).catch((error) => {
  console.error('An error occurred:', error);
});