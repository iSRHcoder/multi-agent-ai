import { cert, getApps, initializeApp, getApp } from 'firebase-admin/app';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Production / Render
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // Local development
  const secretPath = '/etc/secrets/serviceAccountKey.json';

  const localPath = path.resolve(__dirname, '../../serviceAccountKey.json');

  const finalPath = fs.existsSync(secretPath) ? secretPath : localPath;

  serviceAccount = JSON.parse(fs.readFileSync(finalPath, 'utf8'));
}

// Initialize Firebase Admin only once
const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount),
      })
    : getApp();

export { app };
