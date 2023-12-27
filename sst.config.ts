import { SSTConfig } from "sst";
import { ApiStack } from "./stacks/ApiStack";


export default {
  config(_input) {
    return {
      name: "standard-api",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
			runtime: 'nodejs18.x',
			architecture: 'arm_64',
			memorySize: '2048 MB',
			timeout: 28,
			logRetention: 'one_week',
		})
    app.stack(ApiStack);
  }
} satisfies SSTConfig;
