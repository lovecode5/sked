import express from "express";
import {
  registerUser,
  loginUser,
  validateProfile,
  updateProfile,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", auth(), validateProfile);
router.put("/profile", auth(), updateProfile);

export default router;
