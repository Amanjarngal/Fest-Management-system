import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccount;

// ✅ 1. Try to load from ENV (Render, Production)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log("🔥 Loaded Firebase service account from ENV");
  } catch (err) {
    console.error("❌ Invalid FIREBASE_SERVICE_ACCOUNT JSON", err);
    process.exit(1);
  }
}

// ✅ 2. Fall back to local file (Local development only)
else {
  const filePath = path.join(__dirname, "./serviceAccountKey.json");
  if (!fs.existsSync(filePath)) {
    console.error(
      "❌ serviceAccountKey.json not found AND FIREBASE_SERVICE_ACCOUNT not set"
    );
    process.exit(1);
  }

  try {
    serviceAccount = JSON.parse(fs.readFileSync(filePath, "utf8"));
    console.log("📁 Loaded Firebase service account from local file");
  } catch (err) {
    console.error("❌ Failed to read local serviceAccountKey.json", err);
    process.exit(1);
  }
}

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Export
const auth = admin.auth();
export { admin, auth };
