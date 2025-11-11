import express from "express";
import admin from "firebase-admin";

const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const list = await admin.auth().listUsers();
    const users = list.users.map((u) => ({
      uid: u.uid,
      email: u.email,
      createdAt: new Date(u.metadata.creationTime),
    }));

    // Daily signup summary
    const dailyData = {};
    users.forEach((u) => {
      const day = u.createdAt.toISOString().split("T")[0];
      dailyData[day] = (dailyData[day] || 0) + 1;
    });

    const formatted = Object.entries(dailyData).map(([date, users]) => ({
      date,
      users,
    }));

    res.json({
      success: true,
      totalUsers: users.length,
      dailyData: formatted.slice(-10), // last 10 days
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
