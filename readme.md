Example of commands:

pnpm sst secrets set SERP_API_KEY test-key --stage local

pnpm sst secrets set --fallback SERP_API_KEY test-key

pnpm sst secrets set MONGO_URI test-url --stage local
pnpm sst secrets set JWT_SECRET test-secret --stage local

pnpm remove --stage local
