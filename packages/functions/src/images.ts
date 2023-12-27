import { Lens } from "@standard-api/core/Lens";
import { Upload } from "@standard-api/core/Upload";
import { ApiHandler } from "sst/node/api";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Config } from "sst/node/config";
import { createConnection } from "@standard-api/core/mongo";
import { userImages } from "@standard-api/core/models/userImages"

interface UserJwtPayload extends JwtPayload {
  userId: string;
}

export const upload = ApiHandler(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  await createConnection()

  const token = event.headers.Authorization || event.headers.authorization;

  if (!token) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  const decoded = jwt.verify(token.replace("Bearer ", ""), Config.JWT_SECRET) as UserJwtPayload;
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

  const imageResult = await Upload.process(imageData, contentType)

  const url = imageResult.props.imageUrl;
  if (!url) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Image public URL is broken, upload failed" }),
    };
  }

  const metadata = await Lens.search(url);

  await userImages.createIfUserExists({
    user_id: decoded.userId,
    image_url: url,
    metadata: metadata.props.result
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(metadata, null, " "),
  };

});


export const list = ApiHandler(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  await createConnection()

  const token = event.headers.Authorization || event.headers.authorization;

  if (!token) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  const decoded = jwt.verify(token.replace("Bearer ", ""), Config.JWT_SECRET) as UserJwtPayload;

  const result = await userImages.getAllUserImages(decoded.userId);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result, null, " "),
  };
});

export const id = ApiHandler(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  await createConnection()

  const token = event.headers.Authorization || event.headers.authorization;

  if (!token) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  const decoded = jwt.verify(token.replace("Bearer ", ""), Config.JWT_SECRET) as UserJwtPayload;

  const result = await userImages.find({_id: event.pathParameters?.id, user_id: decoded.userId});

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result, null, " "),
  };
});