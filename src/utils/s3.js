import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const parseS3Url = (url) => {
  try {
    const u = new URL(url);
    // hostname: <bucket>.s3.<region>.amazonaws.com or <bucket>.s3.amazonaws.com
    const hostParts = u.hostname.split(".");
    const bucket = hostParts[0];
    const key = u.pathname.replace(/^\//, "");
    if (!bucket || !key) return null;
    return { bucket, key };
  } catch (e) {
    return null;
  }
};

export const deleteObjectByUrl = async (url) => {
  const parsed = parseS3Url(url);
  if (!parsed) return;

  const { bucket, key } = parsed;
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  } catch (err) {
    // Log and continue; deletion failing should not block main flow
    console.error("Failed to delete S3 object", { bucket, key, err: err.message || err });
  }
};

export default s3;
