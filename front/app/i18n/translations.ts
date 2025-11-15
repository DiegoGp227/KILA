export const translations = {
  es: {
    // Navigation & Header
    nav: {
      dashboard: "Dashboard",
      newValidation: "Nueva Validación",
      history: "Historial",
      settings: "Configuración",
    },

    // Common
    common: {
      save: "Guardar",
      cancel: "Cancelar",
      delete: "Eliminar",
      edit: "Editar",
      close: "Cerrar",
      search: "Buscar",
      filter: "Filtrar",
      export: "Exportar",
      loading: "Cargando...",
      noData: "No hay datos",
      error: "Error",
      success: "Éxito",
      warning: "Advertencia",
      approved: "Aprobada",
      approvedPlural: "Aprobadas",
      rejected: "Rechazada",
      rejectedPlural: "Rechazadas",
      pending: "Pendiente",
      withWarnings: "Con Advertencias",
      all: "Todas",
      total: "Total",
    },

    // Dashboard
    dashboard: {
      title: "Dashboard de Validaciones",
      subtitle: "Monitoreo y gestión de facturas de importación - Normativa DIAN",
      stats: {
        totalValidations: "Total Validaciones",
        approvalRate: "Tasa de Aprobación",
        rejected: "Rechazadas",
        withWarnings: "Con Advertencias",
      },
      charts: {
        validationsOverTime: "Validaciones en el Tiempo",
        distributionByStatus: "Distribución por Estado",
        days7: "7D",
        weeks4: "4S",
        months3: "3M",
      },
      table: {
        title: "Historial de Validaciones",
        exportCSV: "Exportar CSV",
        exportSummary: "Exportar Resumen",
        exportDetailed: "Exportar Detallado",
        filters: "Filtros",
        noValidations: "No hay validaciones aún",
        startValidating: "Comienza validando tu primera factura de importación",
        newValidation: "Nueva Validación",
      },
    },

    // Validation Home
    validationHome: {
      breadcrumb: "Validación DIAN",
      newValidation: "Nueva Validación",
      title: "Validador de Facturas de Importación",
      subtitle: "Verificación automática según normativa DIAN (CT-COA-0124)",
      upload: {
        title: "Arrastra tu archivo JSON aquí",
        subtitle: "o haz clic para seleccionar un archivo",
        button: "Seleccionar Archivo",
        processing: "Procesando archivo...",
        validating: "Validando con DIAN...",
        formats: "Formatos aceptados: JSON",
        maxSize: "Tamaño máximo:",
      },
      recentValidations: "Validaciones Recientes",
      noRecentValidations: "No hay validaciones recientes",
      uploadFirstFile: "Sube tu primer archivo JSON para comenzar",
      infoBox: {
        title: "Información Importante",
        items: [
          "El archivo debe estar en formato JSON válido",
          "Todos los campos requeridos deben estar presentes",
          "Los montos deben coincidir con los totales declarados",
          "La validación toma entre 10-30 segundos",
        ],
      },
    },

    // Processing
    processing: {
      breadcrumb: "Procesando",
      title: "Validando Factura",
      subtitle: "Este proceso puede tomar entre 10 a 30 segundos",
      cancel: "Cancelar Validación",
      steps: {
        jsonStructure: "Estructura del archivo JSON",
        supplierData: "Datos del proveedor",
        customerData: "Datos del importador",
        invoiceInfo: "Información de factura",
        itemsDetail: "Detalle de items",
        transportInfo: "Información de transporte",
        numericValidations: "Validaciones numéricas",
      },
      validationsInProcess: "Validaciones en Proceso",
    },

    // Results
    results: {
      breadcrumb: "Resultados",
      originalInvoice: "Factura Original",
      validationResults: "Resultados de Validación",
      legend: {
        errors: "Errores",
        warnings: "Advertencias",
      },
      status: {
        complies: "Cumple",
        doesNotComply: "No Cumple",
        withWarnings: "Con Advertencias",
      },
      description: {
        hasErrors: "La factura presenta errores que deben corregirse",
        hasWarnings: "La factura tiene advertencias que deberían revisarse",
        success: "La factura cumple con todas las validaciones",
      },
      errorsFound: "Errores Encontrados",
      warnings: "Advertencias",
      successfulValidations: "Validaciones Exitosas",
      metrics: {
        errors: "Errores",
        warnings: "Advertencias",
        passed: "Aprobadas",
        total: "Total",
      },
    },

    // Errors & Messages
    errors: {
      fileNotJSON: "Por favor, selecciona un archivo JSON válido",
      fileTooLarge: "El archivo es demasiado grande. Máximo",
      invalidJSON: "El archivo no contiene JSON válido",
      validationError: "Error al validar el archivo",
      processingError: "Error al procesar el archivo",
      connectionError: "Error de conexión: No se puede conectar al servidor de validación. Verifica que el endpoint esté activo y accesible.",
      noValidationFound: "No se encontró la validación",
    },

    // Time
    time: {
      now: "Ahora",
      today: "Hoy",
      yesterday: "Ayer",
      ago: "Hace",
      minute: "minuto",
      minutes: "minutos",
      hour: "hora",
      hours: "horas",
      day: "día",
      days: "días",
      week: "semana",
      weeks: "semanas",
    },
  },

  en: {
    // Navigation & Header
    nav: {
      dashboard: "Dashboard",
      newValidation: "New Validation",
      history: "History",
      settings: "Settings",
    },

    // Common
    common: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      search: "Search",
      filter: "Filter",
      export: "Export",
      loading: "Loading...",
      noData: "No data",
      error: "Error",
      success: "Success",
      warning: "Warning",
      approved: "Approved",
      approvedPlural: "Approved",
      rejected: "Rejected",
      rejectedPlural: "Rejected",
      pending: "Pending",
      withWarnings: "With Warnings",
      all: "All",
      total: "Total",
    },

    // Dashboard
    dashboard: {
      title: "Validation Dashboard",
      subtitle: "Import invoice monitoring and management - DIAN Regulations",
      stats: {
        totalValidations: "Total Validations",
        approvalRate: "Approval Rate",
        rejected: "Rejected",
        withWarnings: "With Warnings",
      },
      charts: {
        validationsOverTime: "Validations Over Time",
        distributionByStatus: "Distribution by Status",
        days7: "7D",
        weeks4: "4W",
        months3: "3M",
      },
      table: {
        title: "Validation History",
        exportCSV: "Export CSV",
        exportSummary: "Export Summary",
        exportDetailed: "Export Detailed",
        filters: "Filters",
        noValidations: "No validations yet",
        startValidating: "Start by validating your first import invoice",
        newValidation: "New Validation",
      },
    },

    // Validation Home
    validationHome: {
      breadcrumb: "DIAN Validation",
      newValidation: "New Validation",
      title: "Import Invoice Validator",
      subtitle: "Automatic verification according to DIAN regulations (CT-COA-0124)",
      upload: {
        title: "Drag your JSON file here",
        subtitle: "or click to select a file",
        button: "Select File",
        processing: "Processing file...",
        validating: "Validating with DIAN...",
        formats: "Accepted formats: JSON",
        maxSize: "Maximum size:",
      },
      recentValidations: "Recent Validations",
      noRecentValidations: "No recent validations",
      uploadFirstFile: "Upload your first JSON file to begin",
      infoBox: {
        title: "Important Information",
        items: [
          "File must be in valid JSON format",
          "All required fields must be present",
          "Amounts must match declared totals",
          "Validation takes between 10-30 seconds",
        ],
      },
    },

    // Processing
    processing: {
      breadcrumb: "Processing",
      title: "Validating Invoice",
      subtitle: "This process may take between 10 to 30 seconds",
      cancel: "Cancel Validation",
      steps: {
        jsonStructure: "JSON file structure",
        supplierData: "Supplier data",
        customerData: "Customer data",
        invoiceInfo: "Invoice information",
        itemsDetail: "Items detail",
        transportInfo: "Transport information",
        numericValidations: "Numeric validations",
      },
      validationsInProcess: "Validations in Process",
    },

    // Results
    results: {
      breadcrumb: "Results",
      originalInvoice: "Original Invoice",
      validationResults: "Validation Results",
      legend: {
        errors: "Errors",
        warnings: "Warnings",
      },
      status: {
        complies: "Complies",
        doesNotComply: "Does Not Comply",
        withWarnings: "With Warnings",
      },
      description: {
        hasErrors: "The invoice has errors that must be corrected",
        hasWarnings: "The invoice has warnings that should be reviewed",
        success: "The invoice complies with all validations",
      },
      errorsFound: "Errors Found",
      warnings: "Warnings",
      successfulValidations: "Successful Validations",
      metrics: {
        errors: "Errors",
        warnings: "Warnings",
        passed: "Passed",
        total: "Total",
      },
    },

    // Errors & Messages
    errors: {
      fileNotJSON: "Please select a valid JSON file",
      fileTooLarge: "File is too large. Maximum",
      invalidJSON: "File does not contain valid JSON",
      validationError: "Error validating file",
      processingError: "Error processing file",
      connectionError: "Connection error: Cannot connect to validation server. Verify that the endpoint is active and accessible.",
      noValidationFound: "Validation not found",
    },

    // Time
    time: {
      now: "Now",
      today: "Today",
      yesterday: "Yesterday",
      ago: "",
      minute: "minute",
      minutes: "minutes",
      hour: "hour",
      hours: "hours",
      day: "day",
      days: "days",
      week: "week",
      weeks: "weeks",
    },
  },
};

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations.es;
