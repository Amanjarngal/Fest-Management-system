import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config({ path: "./env" });

// ✅ Connect MongoDB
connectDB();

// ✅ Create HTTP server from Express app
const server = http.createServer(app);

// ✅ Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      "https://festomania0.netlify.app",  // your frontend on netlify
      "http://localhost:5173",           // vite dev frontend
    ], // your frontend origin  
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// ✅ Store io instance in app (so controllers can access it)
app.set("io", io);

// ✅ Socket event listeners
io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
  });
});

app.use(notFound);
app.use(errorHandler);

// ✅ Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
