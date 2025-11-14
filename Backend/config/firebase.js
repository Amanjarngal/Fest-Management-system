import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load service account key
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, process.env.FIREBASE_SERVICE_ACCOUNT), "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

export { admin, auth }; // 👈 Export both
