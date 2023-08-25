import dotenv from 'dotenv';
import { ChatMode } from '../../generated/graphql';

// Load environment variables from a .env file
dotenv.config();

// Define the constants
export const organizationId = process.env.INKEEP_ORGANIZATION_ID;
export const integrationId = process.env.INKEEP_INTEGRATION_ID;
export const chatMode = ChatMode.Turbo;  // This can be changed as needed

if (!organizationId || !integrationId) {
  console.error('Error: INKEEP_ORGANIZATION_ID and/or INKEEP_INTEGRATION_ID environment variables are not defined');
  process.exit(1);
}