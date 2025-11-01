import Cart from "../models/Cart.js";
import Pricing from "../models/Pricing.js";

/**
 * Add a ticket to the cart
 */
export const addToCart = async (req, res) => {
  try {
    const { userId, pricingId, quantity } = req.body;

    const pricing = await Pricing.findById(pricingId);
    if (!pricing) return res.status(404).json({ error: "Ticket type not found" });

    const pricePerTicket = pricing.finalPrice || pricing.price;
    const totalPrice = pricePerTicket * quantity;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId,
        items: [{ pricing: pricingId, quantity, totalPrice }],
        totalAmount: totalPrice,
      });
    } else {
      // Check if ticket type already in cart
      const existingItem = cart.items.find(
        item => item.pricing.toString() === pricingId
      );

      if (existingItem) {
        // Update quantity
        existingItem.quantity += quantity;
        existingItem.totalPrice = existingItem.quantity * pricePerTicket;
      } else {
        // Add new item
        cart.items.push({ pricing: pricingId, quantity, totalPrice });
      }

      // Recalculate total
      cart.totalAmount = cart.items.reduce((sum, i) => sum + i.totalPrice, 0);
    }

    await cart.save();
    res.status(200).json({ message: "Added to cart", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update ticket quantity (increase or decrease)
 */
export const updateCartItem = async (req, res) => {
  try {
    const { userId, pricingId, action } = req.body; // action: "increase" or "decrease"
    const cart = await Cart.findOne({ userId }).populate("items.pricing");
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(i => i.pricing._id.toString() === pricingId);
    if (!item) return res.status(404).json({ error: "Item not found in cart" });

    if (action === "increase") item.quantity += 1;
    if (action === "decrease") item.quantity -= 1;

    if (item.quantity <= 0) {
      // Remove item if quantity becomes zero
      cart.items = cart.items.filter(i => i.pricing._id.toString() !== pricingId);
    } else {
      item.totalPrice = item.quantity * (item.pricing.finalPrice || item.pricing.price);
    }

    cart.totalAmount = cart.items.reduce((sum, i) => sum + i.totalPrice, 0);
    await cart.save();

    res.status(200).json({ message: "Cart updated", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Delete a ticket type from cart
 */
export const deleteCartItem = async (req, res) => {
  try {
    const { userId, pricingId } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(i => i.pricing.toString() !== pricingId);
    cart.totalAmount = cart.items.reduce((sum, i) => sum + i.totalPrice, 0);

    await cart.save();
    res.status(200).json({ message: "Item removed", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get user's cart
 */
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.pricing",
      populate: { path: "event", select: "title date location" },
    });

    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
