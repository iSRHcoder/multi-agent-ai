import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

const secretPath = '/etc/secrets/serviceAccountKey.json';
const localPath = path.resolve(process.cwd(), 'services/auth/serviceAccountKey.json');

const finalPath = fs.existsSync(secretPath) ? secretPath : localPath;
const serviceAccount = JSON.parse(fs.readFileSync(finalPath, 'utf8'));

let app;
if (!admin.apps.length) {
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  app = admin.app();
}

export { app };
export default admin;
