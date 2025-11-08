import express from "express";
import cors from "cors";
import mainRoutes from "./routes/main.routes.js";

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
  cors({
    origin: "http://localhost:5173", // <-- exact origin of your frontend
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

export default app;
