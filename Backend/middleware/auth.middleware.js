import { admin } from "../config/firebase.js";

export const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token" });
  }

  const idToken = header.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    // console.log("✅ Verified token:", decoded.email, decoded.admin); // Debug
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};
