import Cart from "../models/Cart.js";
import Pricing from "../models/Pricing.js";
import User from "../models/User.js";

/**
 * Add ticket to cart (multi-event support)
 */
export const addToCart = async (req, res) => {
  try {
    const { uid, eventId, pricingId, quantity = 1 } = req.body;

    if (!uid || !eventId || !pricingId)
      return res.status(400).json({ error: "Missing required fields" });

    // 🔹 Find user by Firebase UID
    const user = await User.findOne({ uid });
    if (!user)
      return res.status(404).json({ error: "User not found in database" });

    // 🔹 Find pricing details
    const pricing = await Pricing.findById(pricingId).populate("event");
    if (!pricing)
      return res.status(404).json({ error: "Ticket type not found" });

    const price = pricing.finalPrice || pricing.price;

    // 🔹 Find or create a user cart
    let cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      cart = new Cart({ userId: user._id, items: [], totalPrice: 0 });
    }

    // 🔹 Check if this specific event + ticket type exists
    const existingItem = cart.items.find(
      (i) =>
        i.pricingId.toString() === pricingId &&
        i.eventId.toString() === eventId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ eventId, pricingId, quantity });
    }

    // 🔹 Recalculate total cart price
    const pricingDocs = await Pricing.find({
      _id: { $in: cart.items.map((i) => i.pricingId) },
    });

    cart.totalPrice = cart.items.reduce((sum, item) => {
      const ticket = pricingDocs.find(
        (p) => p._id.toString() === item.pricingId.toString()
      );
      const price = ticket?.finalPrice || ticket?.price || 0;
      return sum + item.quantity * price;
    }, 0);

    await cart.save();

    res.status(200).json({ success: true, message: "Added to cart", cart });
  } catch (err) {
    console.error("❌ Cart Add Error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update cart item (increase or decrease quantity)
 */
export const updateCartItem = async (req, res) => {
  try {
    const { uid, pricingId, action } = req.body; // ✅ FIXED: using uid

    if (!uid || !pricingId || !action) {
      return res.status(400).json({ error: "uid, pricingId, and action are required" });
    }

    // 🔍 Find user by Firebase UID
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    // 🛒 Find cart
    const cart = await Cart.findOne({ userId: user._id }).populate("items.pricingId");
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(i => i.pricingId._id.toString() === pricingId);
    if (!item) return res.status(404).json({ error: "Item not found in cart" });

    // ⚙️ Update quantity
    if (action === "increase") item.quantity += 1;
    if (action === "decrease") item.quantity -= 1;

    if (item.quantity <= 0) {
      cart.items = cart.items.filter(i => i.pricingId._id.toString() !== pricingId);
    }

    // 💰 Recalculate total
    cart.totalPrice = cart.items.reduce(
      (sum, i) => sum + i.quantity * (i.pricingId.finalPrice || i.pricingId.price),
      0
    );

    await cart.save();
    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    console.log("🗑 Delete Request Body:", req.body); // ✅ Debug log

    const { uid, pricingId } = req.body;
    if (!uid || !pricingId) {
      return res.status(400).json({ error: "uid and pricingId are required" });
    }

    // 🔍 Find user by Firebase UID
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    // 🛒 Find cart and populate for price access
    const cart = await Cart.findOne({ userId: user._id }).populate("items.pricingId");
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    // 🗑 Remove item
    const beforeCount = cart.items.length;
    cart.items = cart.items.filter(
      (i) => i.pricingId && i.pricingId._id.toString() !== pricingId
    );
    const afterCount = cart.items.length;

    if (beforeCount === afterCount) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    // 💰 Recalculate total safely
    cart.totalPrice = cart.items.reduce((sum, i) => {
      const price = i.pricingId?.finalPrice || i.pricingId?.price || 0;
      return sum + i.quantity * price;
    }, 0);

    await cart.save();

    console.log("✅ Item deleted successfully for user:", user.uid);
    res.status(200).json({ message: "Item deleted successfully", cart });
  } catch (err) {
    console.error("❌ Error deleting item:", err);
    res.status(500).json({ error: err.message });
  }
};


/**
 * Get user's cart
 */
export const getCart = async (req, res) => {
  try {
    const { uid } = req.params;

    if (!uid)
      return res.status(400).json({ error: "Firebase UID is required" });

    const user = await User.findOne({ uid });
    if (!user)
      return res.status(404).json({ error: "User not found in database" });

    const cart = await Cart.findOne({ userId: user._id })
      .populate({
        path: "items.pricingId",
        populate: {
          path: "event",
          model: "Event",
          select: "title date location imageUrl",
        },
      })
      .populate("userId", "name email");

    if (!cart)
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        items: [],
        totalPrice: 0,
      });

    res.status(200).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
      items: cart.items,
      totalPrice: cart.totalPrice,
    });
  } catch (err) {
    console.error("❌ Error fetching cart:", err);
    res.status(500).json({ error: err.message });
  }
};
