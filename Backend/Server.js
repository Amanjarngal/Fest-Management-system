import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import QRCode from "qrcode";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/festDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// GatePass schema
const gatePassSchema = new mongoose.Schema({
  name: String,
  email: String,
  event: String,
  passId: String,
  qrCodeData: String,
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const GatePass = mongoose.model("GatePass", gatePassSchema);

// Generate Gate Pass
app.post("/api/gatepass", async (req, res) => {
  try {
    const { name, email, event } = req.body;
    const passId = "GATE-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const verifyUrl = `http://localhost:5173/verify/${passId}`; // Frontend verification URL

    const qrCodeData = await QRCode.toDataURL(verifyUrl);

    const gatePass = new GatePass({ name, email, event, passId, qrCodeData });
    await gatePass.save();

    res.json({ qrCodeData, passId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verify Gate Pass
app.get("/api/verify/:passId", async (req, res) => {
  try {
    const { passId } = req.params;
    const gatePass = await GatePass.findOne({ passId });

    if (!gatePass) return res.status(404).json({ valid: false });

    // Mark as verified
    gatePass.verified = true;
    await gatePass.save();

    res.json({ valid: true, gatePass });
  } catch (err) {
    console.error(err);
    res.status(500).json({ valid: false });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
