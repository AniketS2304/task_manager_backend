import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectTodb from "./db.js";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Load env variables first
dotenv.config();

// Connect to DB
connectTodb();

const app = express();

// Allow both production and local development
const corsOptions = {
    origin: [
        "https://task-manager-frontend-0l1z.onrender.com",
        "http://localhost:5173"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", taskRoutes);
app.use("/api/auth", authRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error:
            process.env.NODE_ENV === "development"
                ? err.message
                : "Server error",
    });
});

// Use PORT from env (important for Render)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
