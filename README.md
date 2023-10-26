# Quick Start Guide for Inkeep Search and Chat API

This repo is a sample of how to batch process questions from a CSV into an output csv.

This is helpful for batch processing a set of evaluation questions that are then sharable with your team via the share links or via our dashboard.

The format of the input csv should be:

```
question
"<question1>"
"<question2>"
```

Quotes are needed in order to keep valid CSV format.

The file name of the output csv will be:

`./outputs/output_${count}_${timestamp}.csv`

Format of the output file will be:

```
question,answer,view_chat_url
"What sources...","Inkeep supports....", https://share.inkeep.com/<orgAlias>/<sandboxId>
```

You can view the chat response in the web view by using the given url.

You can also view all the questions in the Inkeep Dashboard. By providing a tag in the config, you can filter by that Tag in the Inkeep Admin UX to view all the questions, including positive or negative feedback, for that tag.

## Requirements

- Node.js (v14+)
- npn (or yarn/pnpm/bun equivalents)

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
    INKEEP_ORGANIZATION_ID=<your-organization-id>
    INKEEP_INTEGRATION_ID=<your-integration-id>
    INKEEP_API_KEY=<your-api-key-id>
    FILE_PATH=inputs/<filename>.csv
    SHARE_URL_BASE_PATH=https://share.inkeep.com/<orgAlias>/<sandboxId>
    CHAT_MODE=AUTO
    TAGS=123456789,234567891
   ```

See the `env.sample` for a template.

4. Run the script

```
npm start
```

Note: the questions are batched in a batch size of three to protect our service. This might mean the process takes some time depending on the number of questions you have.
Let us know at help@inkeep.com that you plan to these batch tests so we can allow-list your org.
