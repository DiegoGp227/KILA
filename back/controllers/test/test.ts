import { Request, Response } from "express";
import prisma from "../../db/prisma.js";

const dbCheck = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await prisma.$queryRaw`SELECT 1 AS ok`;

    res.status(200).json({
      status: "success",
      message: "Conexión a base de datos exitosa (Prisma)",
      result,
    });
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
    res.status(500).json({
      status: "error",
      message: "No se pudo conectar a la base de datos",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

export default dbCheck;
