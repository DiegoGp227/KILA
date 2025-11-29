import { Router } from "express";
import dbCheck from "../controllers/test/test.js";

export const router = Router();

// Test routes
router.get("/api/db", dbCheck);
router.get("/api/back", (_req, res) => res.send("Test route is working"));
