import Pricing from "../models/Pricing.js";
import Event from "../models/Event.js";

/**
 * Create tier-based pricing (GOLDEN, SILVER, BRONZE)
 */
export const createTierPricings = async (req, res) => {
  try {
    const { eventId, tiers } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Example input for tiers:
    // [
    //   { ticketType: "GOLDEN", price: 1500, totalTickets: 50 },
    //   { ticketType: "SILVER", price: 1000, totalTickets: 100 },
    //   { ticketType: "BRONZE", price: 700, totalTickets: 200 }
    // ]

    const createdPricings = await Pricing.insertMany(
      tiers.map(t => ({ ...t, event: eventId }))
    );

    // Update total tickets in event
    const totalTickets = tiers.reduce((acc, t) => acc + t.totalTickets, 0);
    event.ticketsAvailable = totalTickets;
    await event.save();

    res.status(201).json({
      message: "Tier pricings created successfully",
      pricings: createdPricings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update ticket price or availability (Admin)
 */
export const updatePricing = async (req, res) => {
  try {
    const { pricingId } = req.params;
    const { price, totalTickets } = req.body;

    const pricing = await Pricing.findById(pricingId);
    if (!pricing) return res.status(404).json({ error: "Pricing not found" });

    if (price) pricing.price = price;
    if (totalTickets) pricing.totalTickets = totalTickets;

    await pricing.save();
    res.status(200).json({ message: "Pricing updated successfully", pricing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Apply or update an offer (discount %) for a ticket type
 */
export const applyOffer = async (req, res) => {
  try {
    const { pricingId } = req.params;
    const { offerPercentage, offerExpiry } = req.body;

    const pricing = await Pricing.findById(pricingId);
    if (!pricing) return res.status(404).json({ error: "Pricing not found" });

    pricing.offer = {
      percentage: offerPercentage,
      expiry: offerExpiry,
      active: true,
    };

    // Recalculate final price
    const discount = (pricing.price * offerPercentage) / 100;
    pricing.finalPrice = pricing.price - discount;

    await pricing.save();

    res.status(200).json({
      message: "Offer applied successfully",
      pricing,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Remove offer manually or after expiry
 */
export const removeOffer = async (req, res) => {
  try {
    const { pricingId } = req.params;

    const pricing = await Pricing.findById(pricingId);
    if (!pricing) return res.status(404).json({ error: "Pricing not found" });

    pricing.offer = null;
    pricing.finalPrice = pricing.price;

    await pricing.save();

    res.status(200).json({ message: "Offer removed successfully", pricing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Fetch pricing details for a specific event (User view)
 */
export const getEventPricings = async (req, res) => {
  try {
    const { eventId } = req.params;
    const pricings = await Pricing.find({ event: eventId });

    res.status(200).json(pricings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a pricing tier permanently
 */
export const deletePricing = async (req, res) => {
  try {
    const { pricingId } = req.params;

    const pricing = await Pricing.findById(pricingId);
    if (!pricing) return res.status(404).json({ error: "Pricing not found" });

    // Get the related event
    const event = await Event.findById(pricing.event);

    // Remove the pricing record
    await Pricing.findByIdAndDelete(pricingId);

    // Optional: update event tickets count
    if (event) {
      const remainingPricings = await Pricing.find({ event: event._id });
      const totalTickets = remainingPricings.reduce(
        (acc, p) => acc + (p.totalTickets || 0),
        0
      );
      event.ticketsAvailable = totalTickets;
      await event.save();
    }

    res.status(200).json({ message: "Pricing deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
