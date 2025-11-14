import { Router } from "express";
import dbCheck from "../controllers/test/test.js";
import signup from "../controllers/auth/signup.controller.js";
import login from "../controllers/auth/login.contoller.js";

export const router = Router();

// Auth routes
router.post("/api/signup", signup);
router.post("/api/login", login);

// Test routes
router.get("/api/db", dbCheck);
router.get("/api/back", (req, res) => res.send("Test route is working"));
