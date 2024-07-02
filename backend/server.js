import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(morgan("dev"));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
