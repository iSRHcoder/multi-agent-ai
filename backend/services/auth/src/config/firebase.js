import admin from 'firebase-admin';
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

// Check initialized apps safely across CJS/ESM wrappers
const apps = admin.apps || admin.default?.apps || [];

if (apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const app = admin.app();
export default admin;
