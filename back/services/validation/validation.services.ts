import { validateDIANInvoice } from "../../utils/dianValidator.js";
import prisma from "../../db/prisma.js";
import {
  BadRequestError,
  PayloadTooLargeError,
} from "../../erros/400Errors.js";

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

interface ValidationResponse {
  success: true;
  status: 200;
  validation: {
    isValid: boolean;
    errors: any[];
    warnings: any[];
    source: string;
  };
  savedRecord: {
    id: number;
    invoiceId: string;
    userId: number | null;
    validationDate: Date;
    passed: boolean;
    errorCount: number;
    warningCount: number;
  };
}

export const validateInvoiceJson = async (
  file: MulterFile,
  userId?: number
): Promise<ValidationResponse> => {
  if (!file) {
    throw new BadRequestError("No se envió ningún archivo");
  }

  if (file.mimetype !== "application/json") {
    throw new BadRequestError("El archivo debe ser un JSON válido", {
      receivedMimetype: file.mimetype,
      expectedMimetype: "application/json",
    });
  }

  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
  if (file.size > MAX_SIZE) {
    throw new PayloadTooLargeError(
      `El archivo JSON supera el límite de 10MB. Tamaño: ${file.size} bytes, Máximo: ${MAX_SIZE} bytes`
    );
  }

  let jsonContent: any;

  try {
    jsonContent = JSON.parse(file.buffer.toString("utf-8"));
  } catch (parseError) {
    throw new BadRequestError("El archivo no contiene un JSON válido", {
      parseError:
        parseError instanceof Error ? parseError.message : "Unknown error",
    });
  }

  const validation = validateDIANInvoice(jsonContent);

  const saved = await prisma.invoiceValidation.create({
    data: {
      invoiceId:
        jsonContent?.invoice_number || jsonContent?.invoiceNumber || "UNKNOWN",
      userId: userId ?? null,
      passed: validation.isValid,
      errors: JSON.parse(JSON.stringify(validation.errors)),
      warnings: JSON.parse(JSON.stringify(validation.warnings)),
      invoiceData: JSON.parse(JSON.stringify(jsonContent)),
    },
  });

  return {
    success: true,
    status: 200,
    validation,
    savedRecord: {
      id: saved.id,
      invoiceId: saved.invoiceId,
      userId: saved.userId,
      validationDate: saved.validationDate,
      passed: saved.passed,
      errorCount: validation.errors.length,
      warningCount: validation.warnings.length,
    },
  };
};

export const resultValidateInvoiceJsonById = async (
  userId: number,
  InvoiceId: number
): Promise<ValidationResponse> => {
  if (!file) {
    throw new BadRequestError("No se envió ningún archivo");
  }

  if (file.mimetype !== "application/json") {
    throw new BadRequestError("El archivo debe ser un JSON válido", {
      receivedMimetype: file.mimetype,
      expectedMimetype: "application/json",
    });
  }

  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
  if (file.size > MAX_SIZE) {
    throw new PayloadTooLargeError(
      `El archivo JSON supera el límite de 10MB. Tamaño: ${file.size} bytes, Máximo: ${MAX_SIZE} bytes`
    );
  }

  let jsonContent: any;

  try {
    jsonContent = JSON.parse(file.buffer.toString("utf-8"));
  } catch (parseError) {
    throw new BadRequestError("El archivo no contiene un JSON válido", {
      parseError:
        parseError instanceof Error ? parseError.message : "Unknown error",
    });
  }

  const validation = validateDIANInvoice(jsonContent);

  const saved = await prisma.invoiceValidation.create({
    data: {
      invoiceId:
        jsonContent?.invoice_number || jsonContent?.invoiceNumber || "UNKNOWN",
      userId: userId ?? null,
      passed: validation.isValid,
      errors: JSON.parse(JSON.stringify(validation.errors)),
      warnings: JSON.parse(JSON.stringify(validation.warnings)),
      invoiceData: JSON.parse(JSON.stringify(jsonContent)),
    },
  });

  return {
    success: true,
    status: 200,
    validation,
    savedRecord: {
      id: saved.id,
      invoiceId: saved.invoiceId,
      userId: saved.userId,
      validationDate: saved.validationDate,
      passed: saved.passed,
      errorCount: validation.errors.length,
      warningCount: validation.warnings.length,
    },
  };
};
