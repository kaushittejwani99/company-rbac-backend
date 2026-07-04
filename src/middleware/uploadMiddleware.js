import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// 1. Configure the S3 Client using your .env variables
const s3 = new S3Client({
  region: process.env.AWS_REGION, // e.g., 'eu-north-1'
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

console.log("AWS S3 Client Configured:", {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID ? "Provided" : "Not Provided",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ? "Provided" : "Not Provided",
});

// 2. Keep your existing file filter
const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// 3. Helper function to generate S3 storage for a specific bucket
const createS3Storage = (bucketName) => multerS3({
  s3: s3,
  bucket: bucketName,
  // Removed acl: "public-read" to resolve the AccessControlListNotSupported error
  contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically sets the correct MIME type so images display in the browser instead of downloading
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

// 4. Export distinct upload middlewares for each bucket
export const uploadLogo = multer({
  storage: createS3Storage("venture-register-platform-logo"),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const uploadEmployerImage = multer({
  storage: createS3Storage("venture-employer-image"),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const uploadEmployeeImage = multer({
  storage: createS3Storage("venture-employee-image"),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});