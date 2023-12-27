import { ApiHandler } from "sst/node/api";
import { Upload } from "@standard-api/core/Upload";

export const handler = ApiHandler(async (event) => {
  // Check if the Content-Type header indicates an image
  const contentType = event.headers['Content-Type'] || event.headers['content-type'];
  if (!contentType) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Content type is not supported" }),
    }
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(contentType)) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Only image uploads are allowed" }),
    };
  }

  if (typeof event.body !== 'string') {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Image data is not empty" }),
    };
  }

  // The image data is the raw body of the request
  const imageData = Buffer.from(event.body, 'base64');
  if (!imageData) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Image data is required" }),
    };
  }

  const result = await Upload.process(imageData, contentType)

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result, null, " "),
  };
});
