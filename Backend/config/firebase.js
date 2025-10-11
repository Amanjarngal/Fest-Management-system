const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Path to JSON

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

module.exports = { auth };
