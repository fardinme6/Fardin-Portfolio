import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { randomUUID } from 'node:crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const required = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY', 'ADMIN_UID', 'AWS_REGION', 'AWS_ENDPOINT_URL_S3', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'NEON_STORAGE_BUCKET'];
    if (required.some((key) => !process.env[key])) {
      console.error('Missing server environment variables');
      return res.status(500).json({ error: 'Server environment variables are incomplete.' });
    }

    if (!getApps().length) {
      initializeApp({ credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }) });
    }

    const authorization = req.headers.authorization || '';
    if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Please sign in.' });
    const decoded = await getAuth().verifyIdToken(authorization.slice(7));
    if (decoded.uid !== process.env.ADMIN_UID) return res.status(403).json({ error: 'Access denied.' });

    const { image, type } = req.body || {};
    const types = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
    if (!types[type] || typeof image !== 'string' || !/^[A-Za-z0-9+/]+={0,2}$/.test(image)) {
      return res.status(400).json({ error: 'Choose a JPG, PNG, or WebP image.' });
    }
    const buffer = Buffer.from(image, 'base64');
    if (!buffer.length || buffer.length > 2 * 1024 * 1024) {
      return res.status(413).json({ error: 'Image must be smaller than 2 MB.' });
    }
    const valid = type === 'image/jpeg'
      ? buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
      : type === 'image/png'
        ? buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        : buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';
    if (!valid) return res.status(400).json({ error: 'Image content is invalid.' });

    const bucket = process.env.NEON_STORAGE_BUCKET;
    const key = `projects/${randomUUID()}.${types[type]}`;
    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_ENDPOINT_URL_S3,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: type }));

    // The public bucket must allow anonymous GET requests at this URL.
    const endpoint = (process.env.NEON_PUBLIC_URL || process.env.AWS_ENDPOINT_URL_S3).replace(/\/$/, '');
    const url = process.env.NEON_PUBLIC_URL
      ? `${endpoint}/${key}`
      : `${endpoint}/${bucket}/${key}`;
    return res.status(200).json({ url, imagePath: key });
  } catch (error) {
    console.error('Neon image upload failed:', error);
    return res.status(500).json({ error: 'Upload failed. Check Vercel function logs.' });
  }
}
