import User from "../models/User.js";
import { auth } from "../config/firebase.js";

export const getAllUsers = async (req, res) => {
  try {
    // Fetch users from Firebase Admin SDK
    const firebaseUsers = [];
    let nextPageToken;

    do {
      const result = await auth.listUsers(1000, nextPageToken);
      firebaseUsers.push(...result.users);
      nextPageToken = result.pageToken;
    } while (nextPageToken);

    // Fetch all MongoDB users (optional merge)
    const dbUsers = await User.find();

    // Merge both
    const merged = firebaseUsers.map((fbUser) => {
      const dbUser = dbUsers.find((u) => u.uid === fbUser.uid);

      const claims = fbUser.customClaims || {};
      const role =
        claims.role ||
        (claims.admin ? "admin" : claims.stallOwner ? "stallOwner" : "user");

      return {
        uid: fbUser.uid,
        name: fbUser.displayName || dbUser?.name || "Unknown",
        email: fbUser.email || dbUser?.email,
        role,
        emailVerified: fbUser.emailVerified,
        photoURL: fbUser.photoURL,
        createdAt: fbUser.metadata.creationTime,
        lastSignIn: fbUser.metadata.lastSignInTime,
      };
    });

    return res.status(200).json({
      success: true,
      count: merged.length,
      users: merged.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    });
  } catch (error) {
    console.error("❌ Error fetching Firebase users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Firebase users",
      error: error.message,
    });
  }
};
