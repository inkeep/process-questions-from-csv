# Quick Start Guide for Inkeep Search and Chat API

This repo is a sample of how to batch process questions from a CSV into an output csv.

This is helpful for batch processing a set of evaluation questions that are then sharable with your team via the share links or via our dashboard.

The format of the input csv should be:

```
question
"How do I get started?"
```

Quotes are needed in order to keep valid CSV format.

The file name of the output csv will be:

`./outputs/integration_${integrationId}-count_${count}-time_${timestamp}.csv`

Format of the output file will be:

```
question,answer,view_chat_url
"What sources...","Inkeep supports....", https://share.inkeep.com/<orgAlias>/<sandboxId>
```

You can view the chat response in the web view by using the given url.

If you provide a `SHARE_URL_BASE_PATH`, you'll get a link to a sandbox that shows all questions asked in the batch.

You can also view all the questions in the Inkeep Dashboard. By providing a tag in the config, you can filter by that Tag in the Inkeep Admin UX to view all the questions, including positive or negative feedback, for that tag.

## Requirements

- Node.js (v14+)
- npm (or yarn/pnpm/bun equivalents)

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/inkeep/process-questions-from-csv
   cd process-questions-from-csv
   ```

2. **Install the dependencies**

   ```bash
   npm install
   ```

3. **Add your questions**
   Put your questions CSV in inputs/questions.csv

4. **Configure Environment Variables**
   Make sure to create a `.env` file at the root of the project and define the following variables:

   ```env
   INKEEP_API_KEY={apiKey}
   INKEEP_INTEGRATION_ID={integrationId}
   FILE_PATH=inputs/questions.csv
   SHARE_URL_BASE_PATH=https://share.inkeep.com/{orgName}/{sandboxId}
   TAGS=testing-1
   CHAT_MODE=AUTO
   BATCH_SIZE=2
   ```

See the `.env.example` for a template. You can provide a value in `TAGS` so that the questions and resulting analytics (including thumbs up/down) are grouped together in our dashboard.

4. Run the script

```
npm start
```

Note: the questions are batched in a batch size of two to not get throttled by our service. This might mean the process takes some time depending on the number of questions you have. If you need higher throughput, contact our team.