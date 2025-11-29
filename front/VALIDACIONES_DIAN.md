# Validaciones DIAN - Requisitos de Facturación de Importación

Este documento detalla las **11 validaciones obligatorias** según la normativa DIAN (CT-COA-0124) implementadas en el sistema de validación de facturas de importación.

## Sistema de Validación

El sistema implementa una **validación dual**:
- ✅ **Validación Frontend (Prioritaria)**: Ejecutada en el navegador, siempre se ejecuta primero
- 🔄 **Validación Backend (Secundaria)**: Ejecutada en el servidor como respaldo
- 🎯 **Resolución de Conflictos**: En caso de discrepancia, **el frontend siempre tiene prioridad**

---

## Las 11 Reglas DIAN

### 1️⃣ Número de Factura
**Campo JSON**: `InvoiceNumber`
**Cumplimiento Parcial**: ❌ No permitido
**Descripción**: El número de factura debe estar presente y ser único.

**Validaciones**:
- Debe existir el campo
- No puede estar vacío
- Debe ser único en el sistema

**Ejemplo**:
```json
{
  "Fields": [
    { "Fields": "InvoiceNumber", "Value": "58846" }
  ]
}
```

---

### 2️⃣ Fecha de Expedición
**Campo JSON**: `InvoiceDate`
**Cumplimiento Parcial**: ✅ Permitido
**Descripción**: La fecha debe estar clara y ser válida. Permite formatos incompletos.

**Validaciones**:
- **Error**: Campo faltante
- **Advertencia**: Formato incorrecto o sin día exacto

**Formatos Aceptados**:
- `YYYY-MM-DD` (preferido)
- `MM/DD/YYYY` (convertido automáticamente)
- `YYYY-MM` (advertencia, pero aceptado)

**Ejemplo**:
```json
{
  "Fields": [
    { "Fields": "InvoiceDate", "Value": "12/23/2024" }
  ]
}
```

---

### 3️⃣ Lugar de Expedición
**Campo JSON**: `OriginCountryAddress`
**Cumplimiento Parcial**: ✅ Permitido
**Descripción**: Debe incluir ciudad y país desde donde se emite la factura.

**Validaciones**:
- **Error**: Ni ciudad ni país presentes
- **Advertencia**: Falta uno de los dos (ciudad o país)

**Ejemplo**:
```json
{
  "Fields": [
    { "Fields": "OriginCountryAddress", "Value": "Miami, FL USA" }
  ]
}
```

---

### 4️⃣ Nombre y Dirección del Vendedor
**Campos JSON**: `Supplier`, `SupplierAddress`
**Cumplimiento Parcial**: ✅ Permitido
**Descripción**: Información completa del proveedor/vendedor.

**Validaciones**:
- **Error**: Nombre del vendedor faltante
- **Advertencia**: Dirección, ciudad o país faltante

**Ejemplo**:
```json
{
  "Fields": [
    { "Fields": "Supplier", "Value": "Andes Global International LLC" },
    {
      "Fields": "SupplierAddress",
      "Value": "1011 Sunnybrook Road.\nPH Floor Suite 1110\nMiami, FL 33136\nPh: 305-290-3720"
    }
  ]
}
```

---

### 5️⃣ Nombre y Dirección del Comprador
**Campos JSON**: `Customer`, `CustomerAddress`
**Cumplimiento Parcial**: ✅ Permitido
**Descripción**: Información completa del importador/comprador.

**Validaciones**:
- **Error**: Nombre del comprador faltante
- **Advertencia**: Dirección, ciudad o país faltante

**Ejemplo**:
```json
{
  "Fields": [
    { "Fields": "Customer", "Value": "C.I. IBLU S.A.S." },
    {
      "Fields": "CustomerAddress",
      "Value": "CALLE 31 ΝΟ 44-1458\nMEDELLIN\nCOLOMBIA"
    }
  ]
}
```

---

### 6️⃣ Descripción Detallada de la Mercancía
**Campo JSON**: `Table[].Description`
**Cumplimiento Parcial**: ✅ Permitido
**Descripción**: La descripción no debe ser genérica ni ambigua.

**Validaciones**:
- **Error**: Descripción faltante o vacía
- **Advertencia**:
  - Descripción muy corta (< 10 caracteres)
  - Descripción genérica ("producto", "item", "mercancía", etc.)

**Ejemplo Correcto**:
```json
{
  "Table": [
    {
      "Description": "FROZEN PORK SIRLOINS FZ BNLS / PUNTA DE LOMO DE CERDO SIN HUESO CONGELADO"
    }
  ]
}
```

**Ejemplo Incorrecto** (genera advertencia):
```json
{
  "Table": [
    {
      "Description": "Producto"
    }
  ]
}
```

---

### 7️⃣ Cantidad de Unidades
**Campo JSON**: `Table[].Quantity`
**Cumplimiento Parcial**: ✅ Permitido
**Descripción**: La cantidad debe ser coherente con el valor total.

**Validaciones**:
- **Error**: Cantidad faltante o ≤ 0
- **Advertencia**: Cantidad × Precio Unitario ≠ Total (con tolerancia del 1%)

**Ejemplo**:
```json
{
  "Table": [
    {
      "Quantity": "24,486.53",
      "UnitPrice": "3.20",
      "NetValuePerItem": "78,356.90"
    }
  ]
}
```

---

### 8️⃣ Precio Unitario y Total
**Campos JSON**: `Table[].UnitPrice`, `Table[].NetValuePerItem`, `TotalInvoiceValue`
**Cumplimiento Parcial**: ✅ Permitido
**Descripción**: Los precios deben estar claramente discriminados.

**Validaciones**:
- **Error**: Ni precio unitario ni total presentes
- **Error**: Monto total de factura faltante o ≤ 0
- **Advertencia**: Solo uno está presente (unitario o total)

**Ejemplo**:
```json
{
  "Fields": [
    { "Fields": "TotalInvoiceValue", "Value": "78356.90" }
  ],
  "Table": [
    {
      "UnitPrice": "3.20",
      "NetValuePerItem": "78,356.90"
    }
  ]
}
```

---

### 9️⃣ Moneda de la Transacción
**Campo JSON**: `Currency`
**Cumplimiento Parcial**: ❌ No permitido
**Descripción**: Debe estar explícitamente indicada y ser válida.

**Monedas Válidas**:
- USD, EUR, COP, GBP, JPY, CNY, CAD, AUD, CHF, MXN

**Validaciones**:
- **Error**: Moneda faltante
- **Error**: Moneda no válida

**Ejemplo**:
```json
{
  "Fields": [
    { "Fields": "Currency", "Value": "USD" }
  ],
  "Table": [
    {
      "Currency": "USD"
    }
  ]
}
```

---

### 🔟 Condiciones de Entrega (Incoterm)
**Campo JSON**: `Incoterm`
**Cumplimiento Parcial**: ❌ No permitido
**Descripción**: Debe estar incluido y ser válido según ICC (International Chamber of Commerce).

**Incoterms Válidos**:
- FOB, CIF, EXW, FCA, CPT, CIP, DAP, DPU, DDP, FAS, CFR

**Validaciones**:
- **Error**: Incoterm faltante
- **Error**: Incoterm no válido

**Ejemplo**:
```json
{
  "Fields": [
    { "Fields": "Incoterm", "Value": "CIP" }
  ]
}
```

---

### 1️⃣1️⃣ Forma de Pago
**Campo JSON**: `PaymentTerms`
**Cumplimiento Parcial**: ✅ Permitido
**Descripción**: Debe poder determinarse si es directa o indirecta.

**Validaciones**:
- **Advertencia**: Forma de pago faltante
- **Advertencia**: Forma de pago no especifica claramente si es directa o indirecta

**Indicadores de Pago Directo/Indirecto**:
- "direct", "indirect"
- "carta de crédito", "letter of credit"
- "transferencia", "wire transfer"
- "contado", "cash"
- "days", "net", "BL" (Bill of Lading)

**Ejemplo**:
```json
{
  "Fields": [
    { "Fields": "PaymentTerms", "Value": "45 Days BL" }
  ]
}
```

---

## Adaptador de Formato

El sistema incluye un **adaptador automático** que transforma el formato `Fields/Table` al formato normalizado esperado por las validaciones:

```typescript
// Formato Original (Fields/Table)
{
  "Fields": [
    { "Fields": "InvoiceNumber", "Value": "58846" },
    { "Fields": "Supplier", "Value": "Andes Global International LLC" }
  ],
  "Table": [
    {
      "Description": "FROZEN PORK SIRLOINS",
      "Quantity": "24,486.53",
      "UnitPrice": "3.20"
    }
  ]
}

// ⬇️ Transformado automáticamente a ⬇️

// Formato Normalizado
{
  "invoice_number": "58846",
  "supplier": {
    "name": "Andes Global International LLC",
    "address": "...",
    "city": "Miami",
    "country": "USA"
  },
  "items": [
    {
      "description": "FROZEN PORK SIRLOINS",
      "quantity": 24486.53,
      "unit_price": 3.20
    }
  ]
}
```

---

## Prioridad de Validación

Cuando hay conflictos entre las validaciones de frontend y backend:

```
┌─────────────────┐
│   Frontend      │ ◄── SIEMPRE GANA
│   Validation    │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Merged        │
│   Result        │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Backend       │ ◄── Solo si no hay conflicto
│   Validation    │
└─────────────────┘
```

**Ejemplo de Resolución de Conflictos**:

```typescript
// Frontend detecta error en Incoterm
frontend_errors: [
  { field: "Incoterm", message: "El Incoterm 'XYZ' no es válido" }
]

// Backend dice que está OK
backend_errors: []

// ✅ RESULTADO FINAL: Se usa el error del frontend
final_errors: [
  { field: "Incoterm", message: "El Incoterm 'XYZ' no es válido" }
]
```

---

## Uso en el Código

### Validar una factura:

```typescript
import { validateInvoiceIntegrated } from "@/app/services/validation.integration.service";

const result = await validateInvoiceIntegrated(file);

console.log(result.source); // "frontend" | "backend" | "merged"
console.log(result.errors); // Errores finales (frontend prioritario)
console.log(result.warnings); // Advertencias finales
console.log(result.conflict_resolution); // Info sobre conflictos resueltos
```

### Solo validación frontend:

```typescript
import { validateDIANInvoice } from "@/app/services/dian.validation.service";

const invoiceData = JSON.parse(fileContent);
const result = validateDIANInvoice(invoiceData);

console.log(result.isValid); // true si pasa todas las validaciones
console.log(result.errors); // Lista de errores
console.log(result.warnings); // Lista de advertencias
```

---

## Visualización en UI

Los resultados se muestran en la página de resultados con:

- 🔍 **Fuente de validación**: Indica si fue frontend, backend o merged
- 📋 **Número de requisito DIAN**: Cada error/advertencia muestra el requisito #1-11
- ✅/❌ **Cumplimiento parcial**: Indica si el requisito permite cumplimiento parcial
- ⚡ **Conflictos resueltos**: Muestra cuántos conflictos fueron resueltos priorizando frontend

---

## Notas Técnicas

1. **Tolerancia en cálculos numéricos**: Se permite 1% de diferencia en validaciones de cantidad × precio = total para manejar redondeos
2. **Normalización de campos**: Los nombres de campo se normalizan para comparación (ej: "InvoiceNumber" = "invoice_number")
3. **Parsing de direcciones**: El sistema extrae automáticamente ciudad y país de direcciones en formato texto
4. **Conversión de fechas**: Las fechas se convierten automáticamente de MM/DD/YYYY a YYYY-MM-DD

---

## Referencias

- **Normativa**: DIAN CT-COA-0124
- **Incoterms**: International Chamber of Commerce (ICC)
- **Validación**: Frontend prioritario, Backend como respaldo
