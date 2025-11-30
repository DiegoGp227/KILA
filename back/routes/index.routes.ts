import { Router } from "express";
import dbCheck from "../controllers/test/test.js";
import { login, signup } from "../controllers/auth/auth.controllers.js";
import { authMiddleware } from "../middleware/auth.js";
import { validationJson } from "../controllers/validation/validation.controllers.js";

export const router = Router();

//Auth routes
router.post("/api/signup", signup);
router.post("/api/login", login);

//Validation routes
router.post("/api/validation", authMiddleware, validationJson);


// Test routes
router.get("/api/db", dbCheck);
router.get("/api/back", (_req, res) => res.send("Test route is working"));
