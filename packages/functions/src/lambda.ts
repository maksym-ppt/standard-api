import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { ApiHandler } from "sst/node/api";

export const handler = ApiHandler(async (evt) => {
  return {
    statusCode: 200,
    body: `Hello world. The time is ${new Date().toISOString()}. Request time is: ${evt.requestContext.time}`,
  };
});
