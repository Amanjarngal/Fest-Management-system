import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/admin.routes.js";
import mainRoutes from "./routes/main.routes.js";

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

// ✅ API Routes
app.use("/api", mainRoutes);

export default app;
