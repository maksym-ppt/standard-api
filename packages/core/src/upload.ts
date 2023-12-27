export * as Upload from "./upload";
import { z } from "zod";
import crypto from "crypto";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand
} from "@aws-sdk/client-s3";
import { Bucket } from "sst/node/bucket";


const s3 = new S3Client({});

function getExtension(contentType: string): string {
  switch (contentType) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/gif':
      return '.gif';
    default:
      return '';
  }
}

export async function process(imageData: Buffer, contentType: string) {
  const bucketName = Bucket.public.bucketName;
  const filename = crypto.randomUUID() + getExtension(contentType); // Generate a unique filename

  // Upload the image to S3
  const putCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: filename,
    Body: imageData,
    ContentType: contentType,
    ACL: 'public-read', // Set ACL to public-read for public access
  });

  await s3.send(putCommand);

  // Generate the public URL for the uploaded image
  const imageUrl = `https://${bucketName}.s3.amazonaws.com/${filename}`;

  return { props: { loaded: true, imageUrl: imageUrl } };

}
