import Stall from "../models/Stall.js";
import QRCode from "qrcode";
import { auth } from "../config/firebase.js"; // Firebase admin instance
import User from "../models/User.js"; // Make sure your User model is imported
// import { sendTokenEmail } from "../config/emailConfig.js";

/* ------------------ CREATE STALL (Admin Only) ------------------ */
export const createStall = async (req, res, next) => {
  try {
    const { name, ownerUID, ownerName, email } = req.body;

    if (!name || !ownerUID || !email) {
      return res
        .status(400)
        .json({ message: "Stall name, ownerUID, and email are required." });
    }

    // ✅ Step 1: Create Stall
    const stall = new Stall(req.body);
    await stall.save();

    // ✅ Step 2: Generate QR Link
    const qrLink = `${process.env.FRONTEND_URL}/stall/${stall._id}`;
    stall.qrCodeDataUrl = await QRCode.toDataURL(qrLink);
    await stall.save();

    // ✅ Step 3: Assign Stall Owner Role in Firebase
    try {
      await auth.setCustomUserClaims(ownerUID, { role: "stallOwner" });
      console.log(`✅ Firebase: Assigned 'stallOwner' role to UID: ${ownerUID}`);
    } catch (err) {
      console.error("⚠️ Error setting Firebase custom claims:", err.message);
    }

    // ✅ Step 4: Assign Role in Database
    try {
      const user = await User.findOneAndUpdate(
        { email },
        { role: "stallOwner" },
        { new: true }
      );

      if (user) {
        console.log(`✅ MongoDB: Role updated to 'stallOwner' for ${email}`);
      } else {
        console.warn(`⚠️ No user found with email: ${email}`);
      }
    } catch (err) {
      console.error("⚠️ Error updating user role in database:", err.message);
    }

    // ✅ Step 5: Send Response
    res.status(201).json({
      success: true,
      message: `🧩 Stall created successfully and ${ownerName} is now a Stall Owner.`,
      stall,
    });
  } catch (error) {
    console.error("❌ Error in createStall:", error.message);
    next(error);
  }
};

/* ------------------ GET ALL STALLS ------------------ */
export const getStalls = async (req, res, next) => {
  try {
    const stalls = await Stall.find().sort({ createdAt: -1 });
    res.json(stalls);
  } catch (error) {
    next(error);
  }
};

/* ------------------ GET SINGLE STALL ------------------ */
export const getStallById = async (req, res, next) => {
  try {
    const stall = await Stall.findById(req.params.id);
    if (!stall) return res.status(404).json({ message: "Stall not found" });
    res.json(stall);
  } catch (error) {
    next(error);
  }
};

/* ------------------ DELETE STALL ------------------ */
export const deleteStall = async (req, res, next) => {
  try {
    const stall = await Stall.findByIdAndDelete(req.params.id);
    if (!stall) return res.status(404).json({ message: "Stall not found" });
    res.json({ success: true, message: "Stall deleted" });
  } catch (error) {
    next(error);
  }
};

/* ------------------ Generate Token with Visitor Info ------------------ */
export const generateToken = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { visitorName, mobile, email } = req.body;

    const stall = await Stall.findById(id);
    if (!stall) return res.status(404).json({ message: "Stall not found" });

    // Basic validation
    if (!visitorName || !mobile) {
      return res.status(400).json({ message: "Name and mobile number are required" });
    }

    // Increment token
    stall.currentToken += 1;
    const newToken = stall.currentToken;

    // Save visitor info
    stall.tokens.push({ tokenNumber: newToken, visitorName, mobile, email });
    await stall.save();

    // Send confirmation email (if provided)
    // if (email) {
    //   await sendTokenEmail(email, stall.name, newToken);
    // }

    res.json({
      success: true,
      stallName: stall.name,
      tokenNumber: newToken,
      visitorName,
      mobile,
      email,
      message: `🎟️ Token #${newToken} generated successfully for ${visitorName}`,
    });
  } catch (error) {
    next(error);
  }
};

/* ------------------ RESET TOKENS ------------------ */
export const resetTokens = async (req, res, next) => {
  try {
    const stall = await Stall.findById(req.params.id);
    if (!stall) return res.status(404).json({ message: "Stall not found" });

    stall.currentToken = 0;
    stall.tokens = [];
    await stall.save();

    res.json({ success: true, message: "Tokens reset successfully" });
  } catch (error) {
    next(error);
  }
};

/* ------------------ ADD ITEM ------------------ */
export const addItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, description, imageUrl } = req.body;
    const stall = await Stall.findById(id);
    if (!stall) return res.status(404).json({ message: "Stall not found" });

    // 🔒 Role-based check
    if (
      req.user.role !== "admin" &&
      req.user.uid !== stall.ownerUID
    ) {
      return res.status(403).json({ message: "Not authorized to modify this stall" });
    }

    stall.menu.push({ name, price, description, imageUrl });
    await stall.save();

    res.json({
      success: true,
      message: "Item added successfully",
      menu: stall.menu,
    });
  } catch (error) {
    next(error);
  }
};


/* ------------------ DELETE ITEM ------------------ */
export const deleteItem = async (req, res, next) => {
  try {
    const { id, itemId } = req.params;
    const stall = await Stall.findById(id);
    if (!stall) return res.status(404).json({ message: "Stall not found" });

    stall.menu = stall.menu.filter((i) => i._id.toString() !== itemId);
    await stall.save();

    res.json({ success: true, message: "Item deleted successfully", menu: stall.menu });
  } catch (error) {
    next(error);
  }
};

/* ------------------ UPDATE ITEM ------------------ */
export const updateItem = async (req, res, next) => {
  try {
    const { id, itemId } = req.params;
    const stall = await Stall.findById(id);
    if (!stall) return res.status(404).json({ message: "Stall not found" });

    const item = stall.menu.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    Object.assign(item, req.body);
    await stall.save();

    res.json({ success: true, message: "Item updated successfully", item });
  } catch (error) {
    next(error);
  }
};

/* ------------------ UPDATE STALL ------------------ */
export const updateStall = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const stall = await Stall.findByIdAndUpdate(id, updates, { new: true });
    if (!stall) return res.status(404).json({ message: "Stall not found" });

    res.json({ success: true, message: "Stall updated successfully", stall });
  } catch (error) {
    next(error);
  }
};