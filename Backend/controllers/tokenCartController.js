import Stall from "../models/Stall.js";
import Order from "../models/TokenOrder.js";
import cloudinary from "../config/cloudinary.js";
import Tesseract from "tesseract.js";

/* ---------------------- 🧾 CREATE ORDER + PAYMENT ---------------------- */
export const createOrder = async (req, res, next) => {
  try {
    const { id } = req.params; // stallId
    const stall = await Stall.findById(id);
    if (!stall) return res.status(404).json({ message: "Stall not found" });

    const {
      items,
      totalAmount,
      paymentMode,
      upiId,
      transactionNumber,
      paymentTime,
      uploadTime,
    } = req.body;

    if (!items || !totalAmount || !paymentMode)
      return res.status(400).json({ message: "Incomplete order details" });

    let paymentScreenshot = "";
    if (req.file?.path) paymentScreenshot = req.file.path;

    let verificationStatus = "pending";
    let verified = false;

    /* ✅ Counter Payment – skip OCR, auto-approve */
    if (paymentMode === "counter") {
      verificationStatus = "done";
      verified = true;
    }

    /* 🔍 Online Payment Verification using OCR */
    if (paymentMode === "online" && paymentScreenshot) {
      try {
        const ocrResult = await Tesseract.recognize(paymentScreenshot, "eng");
        const text = ocrResult.data.text.toLowerCase();

        const matchUpi =
          upiId && text.includes(upiId.toLowerCase().split("@")[0]);
        const matchTxn =
          transactionNumber &&
          text.replace(/\s/g, "").includes(transactionNumber.toLowerCase());
        const matchTime =
          paymentTime &&
          text.includes(paymentTime.split("T")[1]?.slice(0, 5)); // match HH:MM part

        if (matchUpi && matchTxn && matchTime) {
          verificationStatus = "done";
          verified = true;
        } else {
          verificationStatus = "rejected";
        }
      } catch (err) {
        console.warn("⚠️ OCR failed:", err.message);
        verificationStatus = "error";
      }
    }

    // 🧾 Create order
    const order = await Order.create({
      stallId: stall._id,
      items: JSON.parse(items),
      totalAmount,
      paymentMode,
      upiId,
      transactionNumber,
      paymentTime,
      uploadTime,
      paymentScreenshot,
      status: verificationStatus,
      verified,
    });

    /* 🎟️ Auto Token Generation if verified or on-counter */
    if (verified) {
      stall.currentToken += 1;
      const newToken = stall.currentToken;

      stall.tokens.push({
        tokenNumber: newToken,
        visitorName: req.user?.name || "Customer",
        mobile: req.user?.phone || "N/A",
        email: req.user?.email || "",
      });

      order.tokenNumber = newToken;
      await Promise.all([stall.save(), order.save()]);
    }

    res.status(201).json({
      success: true,
      message:
        verified && paymentMode === "online"
          ? "✅ Payment verified and token generated!"
          : paymentMode === "counter"
          ? "✅ On-counter payment, token generated."
          : "⚠️ Payment pending or rejected, token not generated.",
      order,
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    next(error);
  }
};
