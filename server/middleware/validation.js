import { body } from "express-validator";

export const validateSignup = [
  body("username").notEmpty().withMessage("Username is required."),
  body("email").isEmail().withMessage("Please provide a valid email address."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];

export const validateSignin = [
  body("email").isEmail().withMessage("Please provide a valid email address."),
  body("password").notEmpty().withMessage("Password is required."),
];
