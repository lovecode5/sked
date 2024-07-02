// routes/product.js

import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create a product (admin and superadmin only)
router.post("/", auth(["admin", "superadmin"]), createProduct);

// Get all products (public)
router.get("/", getProducts);

// Get product by ID (public)
router.get("/:id", getProductById);

// Update a product (admin and superadmin only)
router.put("/:id", auth(["admin", "superadmin"]), updateProduct);

// Delete a product (superadmin only)
router.delete("/:id", auth("superadmin"), deleteProduct);

export default router;
