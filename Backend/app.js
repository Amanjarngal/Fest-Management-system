import express from "express";
import cors from "cors";
import mainRoutes from "./routes/main.routes.js";
import cartRoutes from "./routes/cart.Routes.js";

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
  cors({
    origin: "https://festomania0.netlify.app", // <-- exact origin of your frontend
    credentials: true,               // <-- allow cookies/credentials
    allowedHeaders: ["Content-Type", "Authorization"], // include Authorization
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

// ✅ API Routes
app.use("/api", mainRoutes);
// ✅ Mount cart routes directly
app.use("/api/cart", cartRoutes);

export default app;
