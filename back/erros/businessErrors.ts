// errors/catalog/business-errors.ts
// ============================================
// ERRORES DE LÓGICA DE NEGOCIO
// ============================================

import { AppError } from "./appError.js";

/**
 * Error de base de datos
 */
export class DatabaseError extends AppError {
  constructor(message: string = 'Database error', details?: any) {
    super(message, 500, 'DATABASE_ERROR', false, details);
  }
}

/**
 * Error de conexión a base de datos
 */
export class DatabaseConnectionError extends AppError {
  constructor(message: string = 'Database connection failed', details?: any) {
    super(message, 503, 'DATABASE_CONNECTION_ERROR', false, details);
  }
}

/**
 * Email ya en uso
 */
export class EmailAlreadyInUseError extends AppError {
  constructor(email?: string) {
    super('Email already in use', 409, 'EMAIL_ALREADY_IN_USE', true, { email });
  }
}

/**
 * Username ya en uso
 */
export class UsernameAlreadyTakenError extends AppError {
  constructor(username?: string) {
    super('Username already taken', 409, 'USERNAME_ALREADY_TAKEN', true, { username });
  }
}

/**
 * Credenciales inválidas
 */
export class InvalidCredentialsError extends AppError {
  constructor(message: string = 'Invalid credentials') {
    super(message, 401, 'INVALID_CREDENTIALS', true);
  }
}

/**
 * Cuenta no verificada
 */
export class AccountNotVerifiedError extends AppError {
  constructor(message: string = 'Account not verified') {
    super(message, 403, 'ACCOUNT_NOT_VERIFIED', true);
  }
}

/**
 * Cuenta suspendida
 */
export class AccountSuspendedError extends AppError {
  constructor(reason?: string) {
    super('Account suspended', 403, 'ACCOUNT_SUSPENDED', true, { reason });
  }
}

/**
 * Cuenta eliminada
 */
export class AccountDeletedError extends AppError {
  constructor(message: string = 'Account has been deleted') {
    super(message, 410, 'ACCOUNT_DELETED', true);
  }
}

/**
 * Operación no permitida en este estado
 */
export class InvalidStateError extends AppError {
  constructor(message: string, currentState?: string, requiredState?: string) {
    super(
      message,
      409,
      'INVALID_STATE',
      true,
      { currentState, requiredState }
    );
  }
}

/**
 * Saldo insuficiente (para apps financieras)
 */
export class InsufficientBalanceError extends AppError {
  constructor(required: number, available: number) {
    super(
      'Insufficient balance',
      422,
      'INSUFFICIENT_BALANCE',
      true,
      { required, available }
    );
  }
}

/**
 * Límite excedido
 */
export class LimitExceededError extends AppError {
  constructor(limitType: string, limit: number, current: number) {
    super(
      `${limitType} limit exceeded`,
      429,
      'LIMIT_EXCEEDED',
      true,
      { limitType, limit, current }
    );
  }
}

/**
 * Archivo demasiado grande
 */
export class FileTooLargeError extends AppError {
  constructor(maxSize: number, actualSize: number) {
    super(
      'File too large',
      413,
      'FILE_TOO_LARGE',
      true,
      { maxSize, actualSize, maxSizeFormatted: `${maxSize / 1024 / 1024}MB` }
    );
  }
}

/**
 * Tipo de archivo no permitido
 */
export class InvalidFileTypeError extends AppError {
  constructor(fileType: string, allowedTypes: string[]) {
    super(
      `File type not allowed: ${fileType}`,
      415,
      'INVALID_FILE_TYPE',
      true,
      { fileType, allowedTypes }
    );
  }
}

/**
 * Servicio externo no disponible
 */
export class ExternalServiceError extends AppError {
  constructor(serviceName: string, originalError?: any) {
    super(
      `External service error: ${serviceName}`,
      502,
      'EXTERNAL_SERVICE_ERROR',
      true,
      { serviceName, originalError: originalError?.message }
    );
  }
}

/**
 * Error de envío de email
 */
export class EmailSendError extends AppError {
  constructor(recipient?: string, details?: any) {
    super('Failed to send email', 500, 'EMAIL_SEND_ERROR', false, { recipient, ...details });
  }
}

/**
 * Error de verificación
 */
export class VerificationError extends AppError {
  constructor(message: string = 'Verification failed', details?: any) {
    super(message, 400, 'VERIFICATION_ERROR', true, details);
  }
}

/**
 * Código de verificación inválido
 */
export class InvalidVerificationCodeError extends AppError {
  constructor(message: string = 'Invalid verification code') {
    super(message, 400, 'INVALID_VERIFICATION_CODE', true);
  }
}

/**
 * Código de verificación expirado
 */
export class VerificationCodeExpiredError extends AppError {
  constructor(message: string = 'Verification code expired') {
    super(message, 400, 'VERIFICATION_CODE_EXPIRED', true);
  }
}

/**
 * Operación duplicada
 */
export class DuplicateOperationError extends AppError {
  constructor(operation: string, identifier?: string) {
    super(
      `Duplicate operation: ${operation}`,
      409,
      'DUPLICATE_OPERATION',
      true,
      { operation, identifier }
    );
  }
}

/**
 * Recurso bloqueado
 */
export class ResourceLockedError extends AppError {
  constructor(resource: string, lockedBy?: string) {
    super(
      `${resource} is locked`,
      423,
      'RESOURCE_LOCKED',
      true,
      { resource, lockedBy }
    );
  }
}

/**
 * Dependencia faltante
 */
export class MissingDependencyError extends AppError {
  constructor(dependency: string, details?: any) {
    super(
      `Missing dependency: ${dependency}`,
      424,
      'MISSING_DEPENDENCY',
      true,
      { dependency, ...details }
    );
  }
}