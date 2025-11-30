// errors/catalog/4xx-errors.ts
// ============================================
// 4xx - ERRORES DEL CLIENTE
// ============================================

import { AppError } from "./appError.js";

/**
 * 400 - Bad Request
 * La solicitud es malformada o contiene parámetros inválidos
 */
export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request', details?: any) {
    super(message, 400, 'BAD_REQUEST', true, details);
  }
}

/**
 * 401 - Unauthorized
 * Usuario no autenticado (falta token o es inválido)
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required', details?: any) {
    super(message, 401, 'UNAUTHORIZED', true, details);
  }
}

/**
 * 401 - Token expirado (caso específico de unauthorized)
 */
export class TokenExpiredError extends AppError {
  constructor(message: string = 'Token has expired', details?: any) {
    super(message, 401, 'TOKEN_EXPIRED', true, details);
  }
}

/**
 * 401 - Token inválido
 */
export class InvalidTokenError extends AppError {
  constructor(message: string = 'Invalid token', details?: any) {
    super(message, 401, 'INVALID_TOKEN', true, details);
  }
}

/**
 * 403 - Forbidden
 * Usuario autenticado pero sin permisos suficientes
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied', details?: any) {
    super(message, 403, 'FORBIDDEN', true, details);
  }
}

/**
 * 403 - Permisos insuficientes (caso específico)
 */
export class InsufficientPermissionsError extends AppError {
  constructor(message: string = 'Insufficient permissions', requiredPermissions?: string[]) {
    super(message, 403, 'INSUFFICIENT_PERMISSIONS', true, { requiredPermissions });
  }
}

/**
 * 404 - Not Found
 * Recurso no encontrado
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource', details?: any) {
    super(`${resource} not found`, 404, 'NOT_FOUND', true, details);
  }
}

/**
 * 405 - Method Not Allowed
 * Método HTTP no permitido para este endpoint
 */
export class MethodNotAllowedError extends AppError {
  constructor(method: string, allowedMethods: string[] = []) {
    super(
      `Method ${method} not allowed`,
      405,
      'METHOD_NOT_ALLOWED',
      true,
      { method, allowedMethods }
    );
  }
}

/**
 * 406 - Not Acceptable
 * El servidor no puede producir una respuesta en el formato solicitado
 */
export class NotAcceptableError extends AppError {
  constructor(message: string = 'Not acceptable', details?: any) {
    super(message, 406, 'NOT_ACCEPTABLE', true, details);
  }
}

/**
 * 408 - Request Timeout
 * El cliente tardó demasiado en enviar la solicitud
 */
export class RequestTimeoutError extends AppError {
  constructor(message: string = 'Request timeout', details?: any) {
    super(message, 408, 'REQUEST_TIMEOUT', true, details);
  }
}

/**
 * 409 - Conflict
 * Conflicto con el estado actual del recurso
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Conflict', details?: any) {
    super(message, 409, 'CONFLICT', true, details);
  }
}

/**
 * 409 - Recurso ya existe (caso específico)
 */
export class ResourceAlreadyExistsError extends AppError {
  constructor(resource: string = 'Resource', identifier?: any) {
    super(
      `${resource} already exists`,
      409,
      'RESOURCE_ALREADY_EXISTS',
      true,
      { identifier }
    );
  }
}

/**
 * 410 - Gone
 * El recurso ya no está disponible y no volverá a estarlo
 */
export class GoneError extends AppError {
  constructor(message: string = 'Resource no longer available', details?: any) {
    super(message, 410, 'GONE', true, details);
  }
}

/**
 * 413 - Payload Too Large
 * El cuerpo de la solicitud es demasiado grande
 */
export class PayloadTooLargeError extends AppError {
  constructor(message: string = 'Payload too large', maxSize?: number) {
    super(message, 413, 'PAYLOAD_TOO_LARGE', true, { maxSize });
  }
}

/**
 * 415 - Unsupported Media Type
 * Tipo de contenido no soportado
 */
export class UnsupportedMediaTypeError extends AppError {
  constructor(mediaType?: string, supportedTypes?: string[]) {
    super(
      `Unsupported media type${mediaType ? `: ${mediaType}` : ''}`,
      415,
      'UNSUPPORTED_MEDIA_TYPE',
      true,
      { mediaType, supportedTypes }
    );
  }
}

/**
 * 422 - Unprocessable Entity
 * La solicitud está bien formada pero contiene errores semánticos
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', fields?: Record<string, string | string[]>) {
    super(message, 422, 'VALIDATION_ERROR', true, fields);
  }
}

/**
 * 429 - Too Many Requests
 * El usuario ha enviado demasiadas solicitudes en un período de tiempo
 */
export class TooManyRequestsError extends AppError {
  constructor(message: string = 'Too many requests', retryAfter?: number) {
    super(message, 429, 'TOO_MANY_REQUESTS', true, { retryAfter });
  }
}