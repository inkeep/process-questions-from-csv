# Bulk Process Questions with Inkeep's Question Answer API

## Requirements

- Node.js v20+
- npm (or yarn/pnpm/bun)

## Quick Start

1. **Clone and install**

   ```bash
   git clone https://github.com/inkeep/process-questions-from-csv
   cd process-questions-from-csv
   npm install
   ```

2. **Create an Inkeep API Key**

https://docs.inkeep.com/cloud/ai-api/chat-completions-api#get-an-api-key

3. **Configure environment variables**

   Copy `.env.example` to `.env` and fill in your values:

   ```bash
   cp .env.example .env
   ```

   | Variable | Required | Default | Description |
   |----------|----------|---------|-------------|
   | `INKEEP_API_KEY` | Yes | - | Your Inkeep API key |
   | `FILE_PATH` | No | `./inputs/questions.csv` | Path to input CSV |
   | `TAGS` | No | - | Comma-separated tags for filtering in the dashboard |
   | `BATCH_SIZE` | No | `2` | Number of questions per batch. Questions are processed in batches (default: 2) to protect the service |

4. **Add your questions** to `./inputs/questions.csv`:

   ```csv
   question
   "How do I integrate Inkeep with my React application?"
   "What are the pricing options for Inkeep?"
   "Can Inkeep search through PDF documents?"
   ```

   A sample file is provided for reference. Quotes are required to maintain valid CSV format.

5. **Run**

   ```bash
   npm start
   ```

   This compiles the TypeScript and runs the script.

6. **Output**

It will take up to 15 minutes for your data to be processed on https://portal.inkeep.com. To find your processed question, go to "Projects" -> "Chat Sessions" under "AI Assistant", then apply a filter for the Assistant. 
