import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

console.log("AWS S3 Client Configured:", {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID ? "Provided" : "Not Provided",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ? "Provided" : "Not Provided",
});

const startServer = async () => {
  try {
    await connectDB();
  // Change this line in your server.js
app.listen(PORT, '0.0.0.0', () => {
    console.log(`API running on port ${PORT}`);
});
  } catch (error) {
    console.error("Failed to start API:", error.message);
    process.exit(1);
  }
};

startServer();
