import { admin } from "../config/firebase.js";

export const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const idToken = header.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);

    // ✅ Extract key info
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: decoded.role || "user", // fallback role
    };

    // Debugging
    // console.log(`✅ Authenticated: ${req.user.email} [${req.user.role}]`);

    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};
