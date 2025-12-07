# KILA Backend - API Documentation

## Estructura del Proyecto

```
back/
├── controllers/          # Controladores de rutas
│   ├── auth/
│   │   └── auth.controllers.ts
│   ├── validation/
│   │   └── validation.controllers.ts
│   └── test/
├── services/            # Lógica de negocio
│   ├── auth/
│   │   └── auth.services.ts
│   └── validation/
│       └── validation.services.ts
├── routes/              # Definición de rutas
│   └── index.routes.ts
├── middleware/          # Middlewares
│   └── auth.js
├── prisma/             # Base de datos
│   └── schema.prisma
├── utils/              # Utilidades
├── validators/         # Validadores
└── erros/              # Manejo de errores
```

## Buenas Prácticas - Organización de Código

### ¿Un archivo o múltiples archivos?

**✅ Un solo archivo cuando:**
- El archivo tiene menos de 300-400 líneas
- Todos los controllers/services pertenecen al mismo dominio
- La complejidad es manejable
- Ejemplo actual: `validation.controllers.ts` (~82 líneas) ✅

**❌ Separar en múltiples archivos cuando:**
- El archivo supera 400 líneas
- Hay múltiples sub-dominios (ej: validations, reports, analytics)
- Cada endpoint tiene lógica compleja

**Ejemplo de separación:**
```
validation/
├── validation.create.controller.ts
├── validation.get.controller.ts
├── validation.list.controller.ts
├── validation.stats.controller.ts
└── index.ts  // Re-exporta todo
```

## API Endpoints

### Base URL
```
Desarrollo: http://localhost:3000/api
Producción: https://api-kila.devdiego.work/api
```

---

## Autenticación

### 1. Registro de Usuario
```http
POST /api/signup
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response 201:**
```json
{
  "status": "success",
  "message": "Usuario creado exitosamente",
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Inicio de Sesión
```http
POST /api/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

**Response 200:**
```json
{
  "status": "success",
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Validación de Facturas DIAN

### 3. Crear Nueva Validación
```http
POST /api/validation
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  file: File (application/json, max 10MB)
```

**Response 200:**
```json
{
  "status": "success",
  "message": "Validación DIAN completada: Factura válida ✓",
  "data": {
    "validation": {
      "isValid": true,
      "errors": [],
      "warnings": [],
      "source": "backend"
    },
    "savedRecord": {
      "id": 123,
      "invoiceId": "FACT-2024-001",
      "userId": 1,
      "validationDate": "2024-12-01T10:30:00.000Z",
      "passed": true,
      "errorCount": 0,
      "warningCount": 0
    }
  }
}
```

**Response 400 - Errores:**
```json
{
  "status": "error",
  "message": "No se envió ningún archivo",
  "statusCode": 400
}
```

```json
{
  "status": "error",
  "message": "El archivo debe ser un JSON válido",
  "statusCode": 400,
  "details": {
    "receivedMimetype": "text/plain",
    "expectedMimetype": "application/json"
  }
}
```

**Response 413 - Payload Too Large:**
```json
{
  "status": "error",
  "message": "El archivo JSON supera el límite de 10MB",
  "statusCode": 413
}
```

---

### 4. Obtener Validación por ID ⚠️ BUGS ENCONTRADOS
```http
GET /api/validation/:id
Authorization: Bearer <token>
```

**🚨 BUGS A CORREGIR:**

1. **En `routes/index.routes.ts` línea 22:**
   ```typescript
   // ❌ INCORRECTO
   router.get("validation/:id", authMiddleware, resultValidationJsonById);

   // ✅ CORRECTO
   router.get("/validation/:id", authMiddleware, resultValidationJsonById);
   ```

2. **En `validation.services.ts` líneas 100-161:**
   ```typescript
   // ❌ INCORRECTO - Función mal implementada
   export const resultValidateInvoiceJsonById = async (
     userId: number,
     InvoiceId: number
   ): Promise<ValidationResponse> => {
     // Código copiado de validateInvoiceJson
     // No busca en la base de datos
   }

   // ✅ CORRECTO - Implementación necesaria
   export const resultValidateInvoiceJsonById = async (
     validationId: number,
     userId?: number
   ) => {
     const validation = await prisma.invoiceValidation.findFirst({
       where: {
         id: validationId,
         ...(userId && { userId }), // Opcional: filtrar por usuario
       },
     });

     if (!validation) {
       throw new NotFoundError("Validación no encontrada");
     }

     return validation;
   };
   ```

3. **En `validation.controllers.ts` línea 54:**
   ```typescript
   // ❌ INCORRECTO
   const result = await ValidationService.resultValidateInvoiceJsonById(userId);

   // ✅ CORRECTO
   const invoiceId = parseInt(req.params.id);
   const result = await ValidationService.resultValidateInvoiceJsonById(
     invoiceId,
     userId
   );
   ```

**Response Esperado 200:**
```json
{
  "id": 123,
  "invoiceId": "FACT-2024-001",
  "userId": 1,
  "validationDate": "2024-12-01T10:30:00.000Z",
  "passed": true,
  "errors": [],
  "warnings": [],
  "invoiceData": {
    "invoice_number": "FACT-2024-001",
    "supplier": "...",
    "customer": "..."
  }
}
```

---

## Endpoints Propuestos (Por Implementar)

### 5. Listar Validaciones del Usuario
```http
GET /api/validation?page=1&limit=10&status=approved
Authorization: Bearer <token>

Query Parameters:
  - page: número de página (default: 1)
  - limit: elementos por página (default: 10, max: 100)
  - status: approved | rejected | warning (opcional)
```

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "validations": [
      {
        "id": 123,
        "invoiceId": "FACT-2024-001",
        "validationDate": "2024-12-01T10:30:00.000Z",
        "passed": true,
        "errorCount": 0,
        "warningCount": 0
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

### 6. Obtener Estadísticas del Usuario
```http
GET /api/validation/stats
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "total": 150,
    "approved": 120,
    "rejected": 20,
    "warning": 10,
    "approvalRate": 80
  }
}
```

---

### 7. Eliminar Validación
```http
DELETE /api/validation/:id
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "status": "success",
  "message": "Validación eliminada exitosamente"
}
```

---

### 8. Revalidar Factura Existente
```http
POST /api/validation/:id/revalidate
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "status": "success",
  "message": "Revalidación completada",
  "data": {
    "validation": { ... },
    "savedRecord": { ... }
  }
}
```

---

## Modelos de Datos

### User
```typescript
{
  id: number
  username: string
  email: string
  passwordHash: string
  currency: string (default: "USD")
  budgetResetDay: number (default: 1)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### InvoiceValidation
```typescript
{
  id: number
  invoiceId: string
  userId: number | null
  validationDate: DateTime
  passed: boolean
  errors: Json (array)
  warnings: Json (array)
  invoiceData: Json (objeto completo de la factura)
}
```

---

## Manejo de Errores

### Códigos de Error
- `400` - Bad Request (datos inválidos)
- `401` - Unauthorized (sin token o token inválido)
- `404` - Not Found (recurso no encontrado)
- `413` - Payload Too Large (archivo muy grande)
- `500` - Internal Server Error

### Formato de Error
```json
{
  "status": "error",
  "message": "Descripción del error",
  "statusCode": 400,
  "details": { /* información adicional */ }
}
```

---

## Autenticación

Todas las rutas protegidas requieren un token JWT en el header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

El token se obtiene después de login/signup y contiene:
```json
{
  "id": 1,
  "email": "user@example.com",
  "iat": 1638360000,
  "exp": 1638446400
}
```

---

## Variables de Entorno

```env
DATABASE_URL=postgresql://user:password@localhost:5432/kila
JWT_SECRET=your-secret-key
PORT=3000
NODE_ENV=development
```

---

## Comandos Útiles

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start

# Prisma
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

---

## Validaciones DIAN

El validador DIAN verifica:
- Estructura del archivo JSON
- Datos del proveedor
- Datos del importador
- Información de factura
- Detalle de items
- Información de transporte
- Validaciones numéricas

Basado en normativa DIAN (CT-COA-0124)

---

## Próximos Pasos

### Bugs Prioritarios
1. ✅ Corregir ruta `/validation/:id` (falta `/`)
2. ✅ Implementar correctamente `resultValidateInvoiceJsonById` service
3. ✅ Pasar `invoiceId` al service en el controller

### Features Sugeridas
1. Implementar endpoint `GET /api/validation` (listar)
2. Implementar endpoint `GET /api/validation/stats`
3. Implementar endpoint `DELETE /api/validation/:id`
4. Agregar paginación a listados
5. Agregar filtros por fecha
6. Implementar búsqueda por `invoiceId`

---

## Contacto

Para más información o reportar bugs, contacta al equipo de desarrollo.
