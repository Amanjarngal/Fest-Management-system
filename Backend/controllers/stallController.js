import Stall from "../models/Stall.js";
import QRCode from "qrcode";
import { auth } from "../config/firebase.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js"; // ✅ for deleting or managing images

/* ------------------ CREATE STALL (Admin Only — Existing Owner Only) ------------------ */
export const createStall = async (req, res, next) => {
  try {
    const { name, email, ownerName, category, location, description } = req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "Stall name and owner email are required." });
    }

    // ✅ Check if the user exists in Firebase
    let firebaseUser;
    try {
      firebaseUser = await auth.getUserByEmail(email);
      console.log(`✅ Found existing Firebase user for ${email}`);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: `User with email ${email} not found. Ask them to sign up first.`,
      });
    }

    // ✅ Assign stallOwner role
    await auth.setCustomUserClaims(firebaseUser.uid, { role: "stallOwner" });

    // ✅ Update user in MongoDB
    await User.findOneAndUpdate(
      { email },
      {
        name: ownerName || firebaseUser.displayName || "Stall Owner",
        role: "stallOwner",
        uid: firebaseUser.uid,
      },
      { new: true }
    );

    // ✅ Handle image upload (from multer)
    const imageUrl = req.file?.path || "";

    // ✅ Create stall
    const stall = await Stall.create({
      name,
      ownerUID: firebaseUser.uid,
      ownerName: ownerName || firebaseUser.displayName || "Stall Owner",
      ownerEmail: email,
      category: category || "",
      location: location || "",
      description: description || "",
      imageUrl, // ✅ Cloudinary image URL
    });

    // ✅ Generate QR code for this stall
    const qrLink = `${process.env.FRONTEND_URL}/stall/${stall._id}`;
    stall.qrCodeDataUrl = await QRCode.toDataURL(qrLink);
    await stall.save();

    res.status(201).json({
      success: true,
      message: `🎪 Stall '${name}' created successfully with image.`,
      stall,
    });
  } catch (error) {
    console.error("❌ Error in createStall:", error.message);
    next(error);
  }
};

/* ------------------ UPDATE STALL (Admin — Reassign Owner if Changed, Existing User Only) ------------------ */
export const updateStall = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, location, description, ownerName, ownerEmail } = req.body;

    console.log("🛠️ Incoming Update:", req.body);
    const stall = await Stall.findById(id);
    if (!stall) return res.status(404).json({ message: "Stall not found" });

    const oldOwnerEmail = stall.ownerEmail;
    const ownerChanged = ownerEmail && ownerEmail !== oldOwnerEmail;

    // ✅ Handle owner change
    if (ownerChanged) {
      console.log(`🔄 Changing owner from ${oldOwnerEmail} → ${ownerEmail}`);

      // Demote old owner
      try {
        const oldUserRecord = await auth.getUserByEmail(oldOwnerEmail);
        await auth.setCustomUserClaims(oldUserRecord.uid, { role: "user" });
      } catch (err) {
        console.warn(`⚠️ Old owner ${oldOwnerEmail} not found in Firebase`);
      }

      await User.findOneAndUpdate({ email: oldOwnerEmail }, { role: "user" });

      // Promote new owner (must exist)
      let firebaseUser;
      try {
        firebaseUser = await auth.getUserByEmail(ownerEmail);
      } catch {
        return res.status(400).json({
          success: false,
          message: `User ${ownerEmail} must sign up before being assigned.`,
        });
      }

      await auth.setCustomUserClaims(firebaseUser.uid, { role: "stallOwner" });

      await User.findOneAndUpdate(
        { email: ownerEmail },
        {
          name: ownerName || firebaseUser.displayName || "Stall Owner",
          role: "stallOwner",
          uid: firebaseUser.uid,
        },
        { upsert: true }
      );

      stall.ownerUID = firebaseUser.uid;
      stall.ownerEmail = ownerEmail;
      stall.ownerName = ownerName || firebaseUser.displayName || "Stall Owner";
    }

    // ✅ Handle image upload (optional new image)
    if (req.file?.path) {
      // Delete old image if present
      if (stall.imageUrl) {
        const publicId = stall.imageUrl.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(`fest_stalls/${publicId}`);
        } catch (err) {
          console.warn("⚠️ Failed to delete old Cloudinary image:", err.message);
        }
      }
      stall.imageUrl = req.file.path;
    }

    stall.name = name || stall.name;
    stall.category = category || stall.category;
    stall.location = location || stall.location;
    stall.description = description || stall.description;

    await stall.save();

    res.status(200).json({
      success: true,
      message: ownerChanged
        ? `✅ Stall updated & ownership transferred to ${ownerEmail}`
        : "✅ Stall updated successfully",
      stall,
    });
  } catch (error) {
    console.error("❌ Error in updateStall:", error.message);
    next(error);
  }
};

/* ------------------ ADD MENU ITEM ------------------ */
export const addItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;

    const stall = await Stall.findById(id);
    if (!stall) return res.status(404).json({ message: "Stall not found" });

    // Role check
    if (req.user.role !== "admin" && req.user.uid !== stall.ownerUID) {
      return res.status(403).json({ message: "Not authorized to modify this stall" });
    }

    // ✅ Uploaded image from multer
    const imageUrl = req.file?.path || "";

    stall.menu.push({ name, price, description, imageUrl });
    await stall.save();

    res.json({
      success: true,
      message: "Item added successfully with image",
      menu: stall.menu,
    });
  } catch (error) {
    next(error);
  }
};

/* ------------------ UPDATE MENU ITEM ------------------ */
export const updateItem = async (req, res, next) => {
  try {
    const { id, itemId } = req.params;
    const stall = await Stall.findById(id);
    if (!stall) return res.status(404).json({ message: "Stall not found" });

    const item = stall.menu.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // ✅ Delete old image if new one uploaded
    if (req.file?.path) {
      if (item.imageUrl) {
        const publicId = item.imageUrl.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(`fest_stalls/${publicId}`);
        } catch (err) {
          console.warn("⚠️ Failed to delete old item image:", err.message);
        }
      }
      item.imageUrl = req.file.path;
    }

    item.name = req.body.name || item.name;
    item.price = req.body.price || item.price;
    item.description = req.body.description || item.description;

    await stall.save();

    res.json({
      success: true,
      message: "Item updated successfully",
      item,
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

    const item = stall.menu.id(itemId);
    if (item?.imageUrl) {
      const publicId = item.imageUrl.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`fest_stalls/${publicId}`);
      } catch (err) {
        console.warn("⚠️ Failed to delete item image:", err.message);
      }
    }

    stall.menu = stall.menu.filter((i) => i._id.toString() !== itemId);
    await stall.save();

    res.json({
      success: true,
      message: "Item deleted successfully",
      menu: stall.menu,
    });
  } catch (error) {
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

    // ✅ Delete stall image
    if (stall.imageUrl) {
      const publicId = stall.imageUrl.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`fest_stalls/${publicId}`);
      } catch (err) {
        console.warn("⚠️ Failed to delete stall image:", err.message);
      }
    }

    // ✅ Delete all item images
    for (const item of stall.menu) {
      if (item.imageUrl) {
        const publicId = item.imageUrl.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(`fest_stalls/${publicId}`);
        } catch (err) {
          console.warn("⚠️ Failed to delete item image:", err.message);
        }
      }
    }

    res.json({ success: true, message: "Stall and associated images deleted" });
  } catch (error) {
    next(error);
  }
};

/* ------------------ GENERATE & RESET TOKENS ------------------ */
export const generateToken = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { visitorName, mobile, email } = req.body;

    const stall = await Stall.findById(id);
    if (!stall) return res.status(404).json({ message: "Stall not found" });
    if (!visitorName || !mobile)
      return res.status(400).json({ message: "Name & mobile are required" });

    stall.currentToken += 1;
    const newToken = stall.currentToken;
    stall.tokens.push({ tokenNumber: newToken, visitorName, mobile, email });
    await stall.save();

    res.json({
      success: true,
      message: `🎟️ Token #${newToken} generated successfully`,
      tokenNumber: newToken,
      visitorName,
      mobile,
    });
  } catch (error) {
    next(error);
  }
};

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

/* ------------------ GET MY STALLS ------------------ */
export const getMyStalls = async (req, res, next) => {
  try {
    const { uid, role } = req.user;

    if (role === "admin") {
      const allStalls = await Stall.find().sort({ createdAt: -1 });
      return res.json({ success: true, role, stalls: allStalls });
    }

    if (role === "stallOwner") {
      const myStalls = await Stall.find({ ownerUID: uid }).sort({ createdAt: -1 });
      return res.json({
        success: true,
        role,
        stalls: myStalls,
      });
    }

    res.status(403).json({
      success: false,
      message: "Unauthorized to view stalls",
    });
  } catch (error) {
    next(error);
  }
};
