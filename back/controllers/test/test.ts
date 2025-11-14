import { Request, Response } from "express";
import pool from "../../db/db.js";

const dbCheck = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.status(200).json({ status: "success", result: rows });
  } catch (error) {
    console.error("❌ Error al conectar con MySQL:", error);
    res.status(500).json({ status: "error", message: "No se pudo conectar a la base de datos" });
  }
};

export default dbCheck;
