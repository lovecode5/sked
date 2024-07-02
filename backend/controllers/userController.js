import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

// @route    POST api/auth/register
// @desc     Register user
// @access   Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const db = getDB();
  const existingUser = await db.collection("users").findOne({ email });

  if (existingUser) {
    return res.status(400).json({ msg: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    name,
    email,
    password: hashedPassword,
    role: "customer",
  };

  await db.collection("users").insertOne(newUser);

  const payload = {
    user: {
      id: newUser._id,
    },
  };

  jwt.sign(payload, "Is1807", { expiresIn: "5h" }, (err, token) => {
    if (err) throw err;
    res.json({ token });
  });
};

// @route    POST api/auth/login
// @desc     Authenticate user & get token
// @access   Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const db = getDB();
  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return res.status(400).json({ msg: "Invalid Credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid Credentials" });
  }

  const payload = {
    user: {
      id: user._id,
    },
  };

  jwt.sign(payload, "Is1807", { expiresIn: "5h" }, (err, token) => {
    if (err) throw err;
    res.json({ token });
  });
};

// @route    GET api/auth/profile
// @desc     Get user profile
// @access   Private
const validateProfile = async (req, res) => {
  const db = getDB();
  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(req.user.id) });

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  res.json(user);
};

// @route    PUT api/auth/profile
// @desc     Update user profile
// @access   Private
const updateProfile = async (req, res) => {
  const { name, email, password } = req.body;
  const updatedUser = {};

  if (name) updatedUser.name = name;
  if (email) updatedUser.email = email;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    updatedUser.password = await bcrypt.hash(password, salt);
  }

  const db = getDB();
  const result = await db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(req.user.id) },
      { $set: updatedUser },
      { returnOriginal: false }
    );

  if (!result.value) {
    return res.status(404).json({ msg: "User not found" });
  }

  res.json(result.value);
};

export { registerUser, loginUser, validateProfile, updateProfile };
