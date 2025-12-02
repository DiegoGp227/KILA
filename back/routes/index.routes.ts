import { Router } from "express";
import dbCheck from "../controllers/test/test.js";
import { login, signup } from "../controllers/auth/auth.controllers.js";
import { authMiddleware } from "../middleware/auth.js";
import { validationJson } from "../controllers/validation/validation.controllers.js";
import multer from "multer";

export const router = Router();
const upload = multer();
//Auth routes
router.post("/signup", signup);
router.post("/login", login);

//Validation routes
router.post(
  "/validation",
  authMiddleware,
  upload.single("file"),
  validationJson
);

// Test routes
router.get("/db", dbCheck);
router.get("/back", (_req, res) => res.send("Test route is working"));
