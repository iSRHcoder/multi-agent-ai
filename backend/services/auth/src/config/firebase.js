import { cert, getApps, initializeApp, getApp } from 'firebase-admin/app';

import fs from 'fs';
import path from 'path';

// Resolve service account credentials
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  const secretPath = '/etc/secrets/serviceAccountKey.json';
  const localPath = path.resolve(process.cwd(), 'services/auth/serviceAccountKey.json');

  const finalPath = fs.existsSync(secretPath) ? secretPath : localPath;

  serviceAccount = JSON.parse(fs.readFileSync(finalPath, 'utf8'));
}

// Initialize Firebase Admin safely
const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount),
      })
    : getApp();

export { app };
export default app;
