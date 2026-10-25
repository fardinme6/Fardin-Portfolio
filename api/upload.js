import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { randomUUID } from "node:crypto";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await getAuth().verifyIdToken(token);

    if (user.uid !== process.env.ADMIN_UID) {
      return res.status(403).json({ error: "Access denied" });
    }

    const { image, type } = req.body || {};

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!image || !allowedTypes.includes(type)) {
      return res.status(400).json({ error: "Invalid image" });
    }

    const buffer = Buffer.from(image, "base64");

    if (buffer.length > 4 * 1024 * 1024) {
      return res.status(400).json({ error: "Image is too large" });
    }
    const extension = type.split("/")[1];
    const fileName = `projects/${randomUUID()}.${extension}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: "portfolio-public",
        Key: fileName,
        Body: buffer,
        ContentType: type,
      })
    );

    const endpoint = process.env.AWS_ENDPOINT_URL_S3.replace(/\/$/, "");

    const imageUrl =
      `${endpoint}/portfolio-public/${fileName}`;

    return res.status(200).json({
      url: imageUrl,
      imagePath: fileName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Image upload failed" });
  }
}