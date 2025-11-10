import Cart from "../models/Cart.js";
import Pricing from "../models/Pricing.js";

/**
 * Add ticket to cart (Firebase UID-based)
 */
export const addToCart = async (req, res) => {
  try {
    const { uid, eventId, pricingId, quantity = 1 } = req.body;

    if (!uid || !eventId || !pricingId)
      return res.status(400).json({ error: "Missing required fields" });

    // 🔹 Find pricing details
    const pricing = await Pricing.findById(pricingId).populate("event");
    if (!pricing)
      return res.status(404).json({ error: "Ticket type not found" });

    const price = pricing.finalPrice || pricing.price;

    // 🔹 Find or create a cart for this Firebase UID
    let cart = await Cart.findOne({ uid });
    if (!cart) {
      cart = new Cart({ uid, eventId, items: [], totalPrice: 0 });
    }

    // 🔹 Check if this ticket already exists
    const existingItem = cart.items.find(
      (i) => i.pricingId.toString() === pricingId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ pricingId, quantity });
    }

    // 🔹 Recalculate total
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
    const { uid, pricingId, action } = req.body;

    if (!uid || !pricingId || !action) {
      return res.status(400).json({ error: "uid, pricingId, and action are required" });
    }

    const cart = await Cart.findOne({ uid }).populate("items.pricingId");
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

/**
 * Delete cart item
 */
export const deleteCartItem = async (req, res) => {
  try {
    const { uid, pricingId } = req.body;
    if (!uid || !pricingId)
      return res.status(400).json({ error: "uid and pricingId are required" });

    const cart = await Cart.findOne({ uid }).populate("items.pricingId");
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const beforeCount = cart.items.length;
    cart.items = cart.items.filter(
      (i) => i.pricingId && i.pricingId._id.toString() !== pricingId
    );
    const afterCount = cart.items.length;

    if (beforeCount === afterCount)
      return res.status(404).json({ error: "Item not found in cart" });

    cart.totalPrice = cart.items.reduce((sum, i) => {
      const price = i.pricingId?.finalPrice || i.pricingId?.price || 0;
      return sum + i.quantity * price;
    }, 0);

    await cart.save();

    res.status(200).json({ message: "Item deleted successfully", cart });
  } catch (err) {
    console.error("❌ Error deleting item:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get user's cart by Firebase UID
 */
export const getCart = async (req, res) => {
  try {
    const { uid } = req.params;
    if (!uid)
      return res.status(400).json({ error: "Firebase UID is required" });

    const cart = await Cart.findOne({ uid })
      .populate({
        path: "items.pricingId",
        populate: {
          path: "event",
          model: "Event",
          select: "title date location imageUrl",
        },
      });

    if (!cart)
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        items: [],
        totalPrice: 0,
      });

    res.status(200).json({
      success: true,
      uid,
      items: cart.items,
      totalPrice: cart.totalPrice,
    });
  } catch (err) {
    console.error("❌ Error fetching cart:", err);
    res.status(500).json({ error: err.message });
  }
};
