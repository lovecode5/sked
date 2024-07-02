import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export const createProduct = async (req, res) => {
  const { name, price, description, category, stock } = req.body;

  const newProduct = {
    name,
    price,
    description,
    category,
    stock,
  };

  const db = getDB();
  const result = await db.collection("products").insertOne(newProduct);
  res.json(result.ops[0]);
};

export const getProducts = async (req, res) => {
  const db = getDB();
  const products = await db.collection("products").find().toArray();
  res.json(products);
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  const db = getDB();
  const product = await db
    .collection("products")
    .findOne({ _id: new ObjectId(id) });

  if (!product) {
    return res.status(404).json({ msg: "Product not found" });
  }

  res.json(product);
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, category, stock } = req.body;

  const updatedProduct = {};
  if (name) updatedProduct.name = name;
  if (price) updatedProduct.price = price;
  if (description) updatedProduct.description = description;
  if (category) updatedProduct.category = category;
  if (stock) updatedProduct.stock = stock;

  const db = getDB();
  const result = await db
    .collection("products")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedProduct },
      { returnOriginal: false }
    );

  if (!result.value) {
    return res.status(404).json({ msg: "Product not found" });
  }

  res.json(result.value);
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const db = getDB();
  const result = await db
    .collection("products")
    .deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return res.status(404).json({ msg: "Product not found" });
  }

  res.json({ msg: "Product removed" });
};
