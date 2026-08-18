import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // Local fallback
  const filePath = path.resolve(process.cwd(), 'services/auth/serviceAccountKey.json');
  serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
