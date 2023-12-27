pnpm sst secrets set SERP_API_KEY sk_test_abc123
pnpm sst secrets set SERP_API_KEY 7489544de7b22aecac3785b74e139a305606ec628a203f213cc1040ad83df680 --stage local
pnpm sst secrets set SERP_API_KEY sk_live_xyz789 --stage bar

pnpm sst secrets set --fallback SERP_API_KEY sk_test_abc123

pnpm sst secrets set MONGO_URI mongodb://localhost:27017/sortberry-backend-local --stage local
pnpm sst secrets set JWT_SECRET 64X1Isp6QuPjyzdBKVI3xH0+tLYc02jaop2URrolenza31OI --stage local

pnpm remove --stage local
