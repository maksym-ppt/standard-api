import { StackContext, Api, Bucket, Config } from "sst/constructs";

export function ApiStack({ stack }: StackContext) {

  const VERSION = new Config.Parameter(stack, "VERSION", { value: "1.0.0"});
  const SERP_API_KEY = new Config.Secret(stack, "SERP_API_KEY");
  const TWILLIO_API_KEY = new Config.Secret(stack, "TWILLIO_API_KEY");
  const MONGO_URI = new Config.Secret(stack, "MONGO_URI");
  const JWT_SECRET = new Config.Secret(stack, "JWT_SECRET");

  
  const bucket = new Bucket(stack, "public")

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [bucket, VERSION, SERP_API_KEY, MONGO_URI, JWT_SECRET],
      },
    },
    routes: {
      // test
      "GET /": "packages/functions/src/lambda.handler",
      // login
      "POST /auth/sendCode": "packages/functions/src/sendCode.handler",
      "POST /auth/verify": "packages/functions/src/verifyCode.handler",
      // parsing img.url by SerpAPI
      "GET /lens": "packages/functions/src/lens.search",
      // upload img to s3
      "POST /upload": "packages/functions/src/upload.handler",
      // sync upload img and parsing api request
      "POST /images/upload": "packages/functions/src/images.upload",
      "GET /images/list": "packages/functions/src/images.list"
    },
  });
  
  api.bind([bucket]);

  stack.addOutputs({
    ApiEndpoint: api.url,
    BucketName: bucket.bucketName,
  });

  return { api }
}
