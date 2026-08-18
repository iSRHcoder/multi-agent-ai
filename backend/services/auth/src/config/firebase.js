import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// 1. Resolve credentials path
const secretPath = '/etc/secrets/serviceAccountKey.json';
const localPath = path.resolve(process.cwd(), 'services/auth/serviceAccountKey.json');

const finalPath = fs.existsSync(secretPath) ? secretPath : localPath;
const serviceAccount = JSON.parse(fs.readFileSync(finalPath, 'utf8'));

// 2. Initialize using default admin instance
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const app = admin.app();
export default admin;
