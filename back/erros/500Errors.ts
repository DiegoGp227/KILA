// errors/catalog/5xx-errors.ts
// ============================================
// 5xx - ERRORES DEL SERVIDOR
// ============================================

import { AppError } from "./appError.js";

/**
 * 500 - Internal Server Error
 * Error genérico del servidor
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error', details?: any) {
    super(message, 500, 'INTERNAL_ERROR', false, details);
  }
}

/**
 * 501 - Not Implemented
 * Funcionalidad no implementada aún
 */
export class NotImplementedError extends AppError {
  constructor(message: string = 'Not implemented', details?: any) {
    super(message, 501, 'NOT_IMPLEMENTED', true, details);
  }
}

/**
 * 502 - Bad Gateway
 * Error al comunicarse con un servicio externo
 */
export class BadGatewayError extends AppError {
  constructor(message: string = 'Bad gateway', service?: string) {
    super(message, 502, 'BAD_GATEWAY', true, { service });
  }
}

/**
 * 503 - Service Unavailable
 * Servicio temporalmente no disponible
 */
export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Service temporarily unavailable', retryAfter?: number) {
    super(message, 503, 'SERVICE_UNAVAILABLE', true, { retryAfter });
  }
}

/**
 * 504 - Gateway Timeout
 * Timeout al comunicarse con servicio externo
 */
export class GatewayTimeoutError extends AppError {
  constructor(message: string = 'Gateway timeout', service?: string) {
    super(message, 504, 'GATEWAY_TIMEOUT', true, { service });
  }
}