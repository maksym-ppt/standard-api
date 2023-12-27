import { ApiHandler } from "sst/node/api";

export const handler = ApiHandler(async (event) => {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Session created and SMS sent."}),
  };
});
