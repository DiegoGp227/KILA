# Internacionalización (i18n) - Kila

## 🌍 Sistema de Traducciones

Esta aplicación soporta múltiples idiomas usando un sistema de contexto de React.

### Idiomas Disponibles:
- 🇪🇸 **Español (es)** - Idioma predeterminado
- 🇬🇧 **Inglés (en)**

## 📁 Estructura de Archivos

```
app/i18n/
├── translations.ts       # Todas las traducciones
├── LanguageContext.tsx   # Context Provider
└── README.md            # Esta documentación
```

## 🚀 Cómo Usar las Traducciones

### 1. En Componentes Cliente ("use client")

```typescript
import { useTranslation } from "@/app/i18n/LanguageContext";

export default function MiComponente() {
  const t = useTranslation();

  return (
    <div>
      <h1>{t.dashboard.title}</h1>
      <p>{t.common.loading}</p>
    </div>
  );
}
```

### 2. Acceso al Contexto Completo

```typescript
import { useLanguage } from "@/app/i18n/LanguageContext";

export default function MiComponente() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div>
      <p>Idioma actual: {language}</p>
      <button onClick={() => setLanguage("en")}>English</button>
      <button onClick={() => setLanguage("es")}>Español</button>
      <h1>{t.dashboard.title}</h1>
    </div>
  );
}
```

## 📝 Estructura de Traducciones

Las traducciones están organizadas por secciones:

```typescript
translations = {
  es: {
    nav: { ... },           // Navegación
    common: { ... },        // Textos comunes
    dashboard: { ... },     // Dashboard
    validationHome: { ... },// Página de validación
    processing: { ... },    // Procesamiento
    results: { ... },       // Resultados
    errors: { ... },        // Mensajes de error
    time: { ... },          // Tiempo relativo
  },
  en: { ... } // Misma estructura en inglés
}
```

## ✨ Ejemplos de Uso

### Ejemplo 1: Título Simple

```typescript
const t = useTranslation();
<h1>{t.dashboard.title}</h1>

// Español: "Dashboard de Validaciones"
// Inglés: "Validation Dashboard"
```

### Ejemplo 2: Mensajes de Error

```typescript
const t = useTranslation();
<p className="error">{t.errors.invalidJSON}</p>

// Español: "El archivo no contiene JSON válido"
// Inglés: "File does not contain valid JSON"
```

### Ejemplo 3: Estadísticas

```typescript
const t = useTranslation();
<StatCard label={t.dashboard.stats.totalValidations} value={127} />

// Español: "Total Validaciones"
// Inglés: "Total Validations"
```

### Ejemplo 4: Estados

```typescript
const t = useTranslation();
const statusText = status === "approved"
  ? t.common.approved
  : t.common.rejected;

// Español: "Aprobada" / "Rechazada"
// Inglés: "Approved" / "Rejected"
```

## 🎨 Botón de Cambio de Idioma

El botón ya está implementado en el header:

```typescript
// Header muestra: 🇬🇧 EN (cuando está en español)
// Al hacer clic cambia a: 🇪🇸 ES (cuando está en inglés)
```

## 💾 Persistencia

El idioma seleccionado se guarda automáticamente en localStorage:

```typescript
localStorage.setItem("kila_language", "en");
```

Y se restaura al recargar la página.

## 📋 Agregar Nuevas Traducciones

### 1. Edita `translations.ts`

```typescript
export const translations = {
  es: {
    // ... traducciones existentes
    myNewSection: {
      title: "Mi Título",
      description: "Mi descripción",
    },
  },
  en: {
    // ... traducciones existentes
    myNewSection: {
      title: "My Title",
      description: "My description",
    },
  },
};
```

### 2. Usa en tu componente

```typescript
const t = useTranslation();
<h1>{t.myNewSection.title}</h1>
```

## 🔄 Migrar Componentes Existentes

Para migrar un componente que tiene textos hardcodeados:

### Antes:
```typescript
<h1>Dashboard de Validaciones</h1>
<button>Exportar CSV</button>
```

### Después:
```typescript
const t = useTranslation();

<h1>{t.dashboard.title}</h1>
<button>{t.dashboard.table.exportCSV}</button>
```

## 🛠️ Tips de Desarrollo

1. **Siempre usa TypeScript:** El sistema tiene tipos definidos
2. **Organiza por secciones:** Agrupa traducciones por página/feature
3. **Sé consistente:** Usa la misma estructura en ambos idiomas
4. **Textos cortos:** Para UI, usa textos concisos
5. **Testing:** Prueba en ambos idiomas

## 🌐 Agregar Más Idiomas

Para agregar francés, por ejemplo:

```typescript
export const translations = {
  es: { ... },
  en: { ... },
  fr: {
    nav: { ... },
    common: { ... },
    // ... todas las traducciones en francés
  },
};

export type Language = "es" | "en" | "fr";
```

## 📱 Detección Automática (Futuro)

Para detectar automáticamente el idioma del navegador:

```typescript
useEffect(() => {
  const browserLang = navigator.language.split("-")[0];
  if (browserLang === "en" || browserLang === "es") {
    setLanguage(browserLang);
  }
}, []);
```

## ✅ Checklist para Nuevas Páginas

- [ ] Agregar traducciones en `translations.ts` (español e inglés)
- [ ] Importar `useTranslation` en el componente
- [ ] Reemplazar textos hardcodeados con `t.section.key`
- [ ] Probar cambio de idioma
- [ ] Verificar que todo el texto cambie correctamente

---

**Documentación actualizada:** Noviembre 2025
