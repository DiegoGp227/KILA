# Descripción del Reto

## Nombre del Reto

**¿Cumple o no cumple? Inteligencia Artificial aplicada a la validación de facturas de importación**

## Objetivo del Reto

El objetivo de este reto es diseñar una solución que permita a una empresa importadora verificar si una factura comercial de importación cumple o no cumple con los requisitos exigidos por la normativa aduanera colombiana (según lineamientos de la DIAN), y visualizar de forma clara los resultados de la validación.

Los participantes recibirán una serie de facturas ya digitalizadas (datos estructurados en JSON o similar). Su tarea será:

- Comparar estos datos contra los requisitos legales de la DIAN.
- Detectar incumplimientos (campos faltantes, erróneos o mal estructurados).
- Mostrarle al usuario un resumen visual con:
  - **Estado general:** Cumple / No cumple
  - **Motivos específicos del incumplimiento**
  - **Acciones sugeridas para corregir**

La experiencia del usuario debe ser clara, guiada y sencilla, como si se tratara de una herramienta real utilizada por equipos de comercio exterior en una empresa importadora.

## Alcance Funcional Obligatorio

Los equipos participantes deberán desarrollar una solución que cumpla con los siguientes componentes mínimos:

### a. Motor de Validación

- Recibe como entrada un archivo estructurado (JSON) con los datos de una factura comercial internacional.
- Compara los datos recibidos frente a los requisitos mínimos establecidos por la DIAN (según la cartilla oficial CT-COA-0124). Ver Anexo 1
- Evalúa si la factura:
  - ✅ **Cumple completamente**
  - ❌ **No cumple** (por campos faltantes, mal diligenciados o inconsistencias)

### b. Identificación de Errores

Cuando no cumpla, la solución debe:
- Identificar los campos específicos que están incompletos o incorrectos.
- Indicar claramente el motivo del incumplimiento.

### c. Interfaz de Visualización

Interfaz gráfica simple que muestre al usuario:
- **Resultado general** (Cumple / No cumple).
- **Lista de validaciones por campo**, con íconos o colores que indiquen estado (ej. ✔️ / ❌).
- **Detalle explicativo** en caso de errores.

### d. Usabilidad

- La solución debe ser accesible para usuarios no técnicos.
- El lenguaje debe ser claro y orientado a un rol real (ej. analista de comercio exterior).

---

## Ideas Opcionales para Destacar

Las funcionalidades opcionales no son obligatorias, pero su implementación puede otorgar puntos extra y destacar al equipo frente al jurado.

### a. Validaciones Avanzadas

- **Validación cruzada de cálculos internos:** Verificar que los totales coincidan con la suma de subtotales, y que el precio unitario multiplicado por la cantidad coincida con el total por ítem.
- **Chequeo de consistencia entre campos:** Validar coherencia entre el país de origen, moneda, incoterm y el proveedor.
- **Verificación de formato y estructura de campos:** Confirmar que campos como fechas, códigos postales, y NITs tengan formatos válidos.

### b. Experiencia de Usuario

- **Visualización tipo semáforo o panel de alertas:** Mostrar el estado de cada campo con colores (verde, amarillo, rojo) o íconos que hagan fácil entender qué está bien y qué no.
- **Agrupación de errores por secciones:** Por ejemplo, mostrar primero los errores en la sección del proveedor, luego del importador, etc., para facilitar la lectura y corrección.
- **Soporte multilingüe:** Mostrar validaciones y mensajes en español e inglés para usuarios internacionales.

### c. Funcionalidades Técnicas

- Capacidad para **cargar múltiples facturas** y mostrar un dashboard de cumplimiento por lote.
- **Generación automática de un reporte PDF o JSON** con el resumen de validaciones.
- **Versión responsive** o app web funcional accesible desde celular.

### d. Enfoque en Cumplimiento Real

- **Referencia visible a la norma DIAN** aplicable en cada validación (por ejemplo: "Incumple requisito 2.4 de la cartilla CT-COA-0124").
- **Registro de auditoría** de las validaciones realizadas, útil para simulaciones corporativas o procesos de revisión interna.

---

## Entregables y Criterios de Evaluación

### a. Prototipo Funcional

1. Debe permitir cargar al menos una factura y mostrar el resultado de cumplimiento.
2. Interfaz simple y navegable (puede ser una app web, notebook o consola con visualización clara).
3. No es necesario que sea una solución 100% completa, pero sí debe ser demostrable y coherente.

### b. Repositorio de Código

1. En GitHub o similar (público o privado con acceso compartido).
2. Debe incluir instrucciones mínimas para ejecutar el prototipo (README).

### c. Reporte Corto (máx. 2 páginas o presentación de 5 slides)

1. Descripción de la solución.
2. Enfoque técnico (qué herramientas usaron y cómo).
3. Reglas de validación implementadas.
4. Supuestos realizados.
5. Limitaciones y posibles mejoras futuras.

---

## Anexos

**Anexo 1:** Cartilla oficial CT-COA-0124 de la DIAN
