# Quick Start Guide for Inkeep Search and Chat API

This repo is a sample of how to batch process questions from a CSV into an output csv.

The format of the input csv should be:

```
question
"What sources does Inkeep support?"
"What value does Inkeep provide compared to other retrieval and chat services?"
```

The file name of the output csv will be:

`./outputs/output_${count}_${timestamp}.csv`

Format of the output file will be:

```
question,answer,view_chat_url
"What sources...","Inkeep supports....",https://share.inkeep.com/<orgAlias>/<sandboxId>
```

You can view the chat response in the web view by using the given url.

## Requirements

- Node.js (v14+)
- Yarn (or npm/pnpm equivalents)

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/inkeep/process-questions-from-csv
   cd process-questions-from-csv
   ```

2. **Install the dependencies**

   ```bash
   yarn install
   ```

3. **Configure Environment Variables**
   Make sure to create a `.env` file at the root of the project and define the following variables:

   ```env
    INKEEP_ORGANIZATION_ID=<your-organization-id>
    INKEEP_INTEGRATION_ID=<your-integration-id>
    INKEEP_INTEGRATION_ID=<your-api-key-id>
    FILE_PATH=inputs/<filename>.csv
    SHARE_URL_BASE_PATH=https://share.inkeep.com/<orgAlias>/<sandboxId>
    INKEEP_API_KEY=62a0400e7d809a97958caf7bbc5eec142587deefb81e5543
   CHAT_MODE=AUTO
   ```

4. Run

```
yarn dev
```
