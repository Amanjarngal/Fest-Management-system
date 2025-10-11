import User from "../models/User.js";

/**
 * ✅ Register or Update User after Firebase signup/login
 * - Checks if the user exists by UID
 * - If exists → updates name/email (keeps roles and data synced)
 * - If not exists → creates a new user record
 */
export const registerUser = async (req, res) => {
  try {
    const { uid, name, email } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ message: "UID and Email are required." });
    }

    let user = await User.findOne({ uid });

    if (user) {
      // Update existing user info if changed
      user.name = name || user.name;
      user.email = email || user.email;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "User info updated successfully",
        user,
      });
    }

    // Create new user if not found
    user = await User.create({
      uid,
      name,
      email,
      role: "user", // default role
    });

    res.status(201).json({
      success: true,
      message: "New user registered successfully",
      user,
    });
  } catch (error) {
    console.error("❌ Error in registerUser:", error);
    res.status(500).json({
      success: false,
      message: "Server error while registering user",
      error: error.message,
    });
  }
};

/**
 * ✅ Fetch all users (Admin Panel)
 * - Returns all users sorted by creation date (newest first)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
      error: error.message,
    });
  }
};
