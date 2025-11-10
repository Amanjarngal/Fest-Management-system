import StallCart from "../models/StallCart.js";
import Stall from "../models/Stall.js";

/* ➕ Add Item to Stall Cart */
export const addStallItemToCart = async (req, res) => {
  try {
    const uid = req.user?.uid; // verified from Firebase token
    const { stallId, itemId, name, price, imageUrl } = req.body;

    if (!uid || !stallId || !itemId)
      return res.status(400).json({ error: "Missing required fields" });

    // 🔍 Check Stall Exists
    const stall = await Stall.findById(stallId);
    if (!stall) return res.status(404).json({ error: "Stall not found" });

    // 🛒 Find or Create Cart
    let cart = await StallCart.findOne({ userId: uid, stallId });
    if (!cart) {
      cart = new StallCart({ userId: uid, stallId, items: [] });
    }

    // ✅ Check if Item Already Exists
    const existingItem = cart.items.find((i) => i.itemId.toString() === itemId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ itemId, name, price, imageUrl, quantity: 1 });
    }

    // 💰 Recalculate Total Price
    cart.totalPrice = cart.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      items: cart.items,
      totalPrice: cart.totalPrice,
    });
  } catch (err) {
    console.error("❌ Error adding to stall cart:", err);
    res.status(500).json({ error: err.message });
  }
};

/* 🔄 Update Item Quantity (Increase / Decrease) */
export const updateStallCartItem = async (req, res) => {
  try {
    const uid = req.user?.uid;
    const { stallId, itemId, delta } = req.body; // delta = +1 or -1
    if (!uid || !stallId || !itemId || !delta)
      return res.status(400).json({ error: "Missing required fields" });

    const cart = await StallCart.findOne({ userId: uid, stallId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find((i) => i.itemId.toString() === itemId);
    if (!item) return res.status(404).json({ error: "Item not found in cart" });

    item.quantity += delta;

    // ❌ Remove item if quantity <= 0
    if (item.quantity <= 0) {
      cart.items = cart.items.filter((i) => i.itemId.toString() !== itemId);
    }

    // 💰 Recalculate total
    cart.totalPrice = cart.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated",
      items: cart.items,
      totalPrice: cart.totalPrice,
    });
  } catch (err) {
    console.error("❌ Error updating stall cart:", err);
    res.status(500).json({ error: err.message });
  }
};

/* 🗑️ Delete Item from Cart */
export const deleteStallCartItem = async (req, res) => {
  try {
    const uid = req.user?.uid;
    const { stallId, itemId } = req.body;
    if (!uid || !stallId || !itemId)
      return res.status(400).json({ error: "Missing required fields" });

    const cart = await StallCart.findOne({ userId: uid, stallId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter((i) => i.itemId.toString() !== itemId);

    cart.totalPrice = cart.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed",
      items: cart.items,
      totalPrice: cart.totalPrice,
    });
  } catch (err) {
    console.error("❌ Error deleting item:", err);
    res.status(500).json({ error: err.message });
  }
};

/* 🧾 Get User's Cart */
export const getStallCart = async (req, res) => {
  try {
    const uid = req.user?.uid;
    const { stallId } = req.params;

    if (!uid || !stallId)
      return res.status(400).json({ error: "Missing uid or stallId" });

    const cart = await StallCart.findOne({ userId: uid, stallId });
    if (!cart)
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        items: [],
        totalPrice: 0,
      });

    res.status(200).json({
      success: true,
      items: cart.items,
      totalPrice: cart.totalPrice,
    });
  } catch (err) {
    console.error("❌ Error fetching stall cart:", err);
    res.status(500).json({ error: err.message });
  }
};

/* 🧹 Clear Cart (after payment) */
export const clearStallCart = async (req, res) => {
  try {
    const uid = req.user?.uid;
    const { stallId } = req.body;
    if (!uid || !stallId)
      return res.status(400).json({ error: "Missing required fields" });

    await StallCart.deleteOne({ userId: uid, stallId });

    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (err) {
    console.error("❌ Error clearing stall cart:", err);
    res.status(500).json({ error: err.message });
  }
};
