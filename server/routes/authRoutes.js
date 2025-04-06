import express from "express";
import { signup, signin } from "../controllers/authController.js";
import { validateSignup, validateSignin } from "../middleware/validation.js";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/signin", validateSignin, signin);

export default router;
