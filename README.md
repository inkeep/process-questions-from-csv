# Bulk Process Questions on Inkeep for Evaluation

Batch process questions from a CSV file through Inkeep's AI service and export results with shareable links.

Use this to evaluate Inkeep's question-answering capabilities and share results with your team via the generated URLs or the Inkeep dashboard.

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

2. **Configure environment variables**

   Copy `.env.example` to `.env` and fill in your values:

   ```bash
   cp .env.example .env
   ```

   | Variable | Required | Default | Description |
   |----------|----------|---------|-------------|
   | `INKEEP_API_KEY` | Yes | - | Your Inkeep API key |
   | `SHARE_URL_BASE_PATH` | Yes | - | Base URL for shareable links (e.g., `https://share.inkeep.com/<orgAlias>/<sandboxId>`) |
   | `FILE_PATH` | No | `./inputs/questions.csv` | Path to input CSV |
   | `TAGS` | No | - | Comma-separated tags for filtering in the dashboard |
   | `BATCH_SIZE` | No | `2` | Number of questions per batch |
   | `INKEEP_INTEGRATION_ID` | No | `evaluation` | Integration identifier (used in output filename) |
   | `CHAT_MODE` | No | - | Chat mode setting |

3. **Add your questions** to `./inputs/questions.csv`:

   ```csv
   question
   "How do I integrate Inkeep with my React application?"
   "What are the pricing options for Inkeep?"
   "Can Inkeep search through PDF documents?"
   ```

   A sample file is provided for reference. Quotes are required to maintain valid CSV format.

4. **Run**

   ```bash
   npm start
   ```

   This compiles the TypeScript and runs the script.

## Output

Results are written to `./outputs/` with the filename:

```
integration_<INKEEP_INTEGRATION_ID>-count_<count>-time_<timestamp>.csv
```

Output columns:

| Column | Description |
|--------|-------------|
| `question` | Original question |
| `answer` | AI response (citations like `[^1]` are removed) |
| `view_chat_url` | Shareable link to view the conversation |

Example:

```csv
question,answer,view_chat_url
"What sources...","Inkeep supports...",https://share.inkeep.com/org/sandbox?conversationId=abc123&tags=tag1,tag2
```

## Features

- **Shareable links**: Each response includes a URL to view the full conversation
- **Dashboard integration**: Use `TAGS` to filter and group questions in the Inkeep Admin dashboard (including thumbs up/down feedback)
- **Citation stripping**: Removes citation markers from answers for cleaner output
- **Failure handling**: Processing stops if more than 2 failures occur in a single batch

## Rate Limiting

Questions are processed in batches (default: 2) to protect the service. Processing time scales with the number of questions.

**Important**: Contact help@inkeep.com before running batch tests so we can allow-list your organization for higher request rates.
