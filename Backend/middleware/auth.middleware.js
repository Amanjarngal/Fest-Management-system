const { auth } = require("../config/firebase");

async function verifyToken(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer "))
      return res.status(401).json({ error: "Unauthorized" });

    const idToken = header.split(" ")[1]; // <-- fixed
    const decoded = await auth.verifyIdToken(idToken);

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      claims: decoded // claims now include custom claims like role/admin
    };

    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = verifyToken;
