// Test file to verify error parsing
// This is just for demonstration - can be deleted after testing

const exampleServerError = {
  "error": "Invalid invoice JSON: 1 validation error for InvoiceData\n  Value error, Invalid Incoterm: must be one of ['FOB', 'EXW', 'CIF', 'DAP']. [type=value_error, input_value={'Fields': [{'Fields': 'S...rOfPackagesBoxes': ''}]}, input_type=dict]\n    For further information visit https://errors.pydantic.dev/2.11/v/value_error"
};

// Expected output after parsing:
const expectedParsedErrors = [
  {
    field: "Incoterm",
    message: "Incoterm inválido. Debe ser uno de: FOB, EXW, CIF, DAP",
    section: "Información de Transporte",
    severity: "error",
  }
];

console.log("Example server error:", exampleServerError);
console.log("Expected parsed result:", expectedParsedErrors);

// This will be parsed by the parseServerError function in validation.service.ts
// and converted into a structured error that can be displayed in the UI
