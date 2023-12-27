import { ApiHandler } from "sst/node/api";
import { Lens } from "@standard-api/core/Lens";

export const search = ApiHandler(async (event) => {
  const url = event.queryStringParameters?.url;
  if (!url) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "URL parameter is required" }),
    };
  }

  const result = await Lens.search(url);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result, null, " "),
  };
});
