# Bulk process questions on Inkeep for evaluation

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

- Node.js (v20+)
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
   Put your questions CSV in inputs/questions.csv. A sample file is provided at `/inputs/questions.csv` for reference.

4. **Configure Environment Variables**
   Make sure to create a `.env` file at the root of the project and define the following variables:

   ```env
    INKEEP_API_KEY=<your-api-key-id>
    FILE_PATH=inputs/<filename>.csv
    SHARE_URL_BASE_PATH=https://share.inkeep.com/<orgAlias>/<sandboxId>
    TAGS=123456789,234567891
   ```

See the `env.example` for a template. You can provide a value in `TAGS` so that the questions and resulting analytics (including thumbs up/down) are grouped together in our dashboard.

5. **Run the script**

```
npm start
```

The `npm start` command will automatically compile the TypeScript code and then run the script. No need to run a separate build step.

Note: the questions are batched in a batch size of three to protect our service. This might mean the process takes some time depending on the number of questions you have.
Let us know at help@inkeep.com that you plan to these batch tests so we can allow-list your org.
