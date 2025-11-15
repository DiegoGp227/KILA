import { NextRequest, NextResponse } from "next/server";

const VALIDATION_ENDPOINT = "https://55c0112a5401.ngrok-free.app/validate_invoice";

export async function POST(request: NextRequest) {
  try {
    const invoiceData = await request.json();

    // Forward request to external validation API
    const response = await fetch(VALIDATION_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(invoiceData),
    });

    const result = await response.json();

    // Return the response
    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    console.error("Proxy validation error:", error);
    return NextResponse.json(
      { error: error.message || "Error al validar la factura" },
      { status: 500 }
    );
  }
}
