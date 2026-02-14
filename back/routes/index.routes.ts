import { Router, type Router as RouterType } from "express";
import dbCheck from "../controllers/test/test.js";
import { login, signup } from "../controllers/auth/auth.controllers.js";
import { authMiddleware } from "../middleware/auth.js";
import { validationJson } from "../controllers/validation/validation.controllers.js";
import multer from "multer";

export const router: RouterType = Router();
const upload = multer();
//Auth routes
router.post("/api/signup", signup);
router.post("/api/login", login);

//Validation routes
router.post(
  "/api/validation",
  authMiddleware,
  upload.single("file"),
  validationJson
);

// Test routes
router.get("/api/db", dbCheck);
router.get("/api/back", (_req, res) => res.send("Test route is working"));