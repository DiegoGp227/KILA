import { Request, Response } from "express";
import * as ValidationService from "../../services/validation/validation.services.js";
import { AppError } from "../../erros/appError.js";
import { InternalServerError } from "../../erros/500Errors.js";

export const validationJson = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const result = await ValidationService.validateInvoiceJson(
      req.file!,
      userId
    );

    res.status(200).json({
      status: "success",
      message: result.validation.isValid
        ? "Validación DIAN completada: Factura válida ✓"
        : "Validación DIAN completada: Se encontraron errores",
      data: {
        validation: {
          isValid: result.validation.isValid,
          errors: result.validation.errors,
          warnings: result.validation.warnings,
          source: result.validation.source,
        },
        savedRecord: result.savedRecord,
      },
    });
  } catch (error) {
    console.error("❌ Error en validación DIAN:", error);

    if (error instanceof AppError) {
      res.status(error.statusCode).json(error.toJSON());
      return;
    }

    const internalError = new InternalServerError("Internal server error");
    res.status(internalError.statusCode).json(internalError.toJSON());
  }
};
