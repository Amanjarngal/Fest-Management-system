import { auth } from "../config/firebase.js";

// 1️⃣ Make a user an admin
export const makeAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await auth.getUserByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });

    await auth.setCustomUserClaims(user.uid, { role: "admin" });
    res.json({ message: `Admin role successfully granted to ${email}` });
  } catch (err) {
    console.error("Error in makeAdmin:", err);
    res.status(500).json({
      error: "Failed to make user admin",
      details: err.message,
    });
  }
};


// 2️⃣ Get all users with admin role
export const getAdmins = async (req, res) => {
  try {
    let users = [];
    let nextPageToken;
    do {
      const listUsersResult = await auth.listUsers(1000, nextPageToken);
      listUsersResult.users.forEach((userRecord) => {
        if (userRecord.customClaims?.role === "admin") {
          users.push({
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName || "",
          });
        }
      });
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    res.json({ admins: users });
  } catch (err) {
    console.error("Error in getAdmins:", err);
    res.status(500).json({
      error: "Failed to fetch admins",
      details: err.message,
    });
  }
};


// 3️⃣ Remove admin access
export const removeAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await auth.getUserByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });

    await auth.setCustomUserClaims(user.uid, { role: null });
    res.json({ message: `Admin access removed from ${email}` });
  } catch (err) {
    console.error("Error in removeAdmin:", err);
    res.status(500).json({ error: "Failed to remove admin access", details: err.message });
  }
};


