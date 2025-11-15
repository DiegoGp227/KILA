"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "../i18n/LanguageContext";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple redirect to dashboard without authentication
    router.push("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "var(--bg-primary)",
      }}
    >
      {/* Left Side - Branding */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem",
          background: "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-10%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-15%",
            left: "-15%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.05)",
            filter: "blur(80px)",
          }}
        />

        {/* Content */}
        <div style={{ zIndex: 1, textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "120px",
              height: "120px",
              borderRadius: "24px",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              fontSize: "4rem",
              fontWeight: "bold",
              color: "white",
              marginBottom: "2rem",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
          >
            K
          </div>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              color: "white",
              marginBottom: "1rem",
              letterSpacing: "0.05em",
            }}
          >
            KILA
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              color: "rgba(255, 255, 255, 0.9)",
              marginBottom: "3rem",
              maxWidth: "400px",
            }}
          >
            Sistema de Validación de Facturas de Importación
          </p>

          {/* Features */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              textAlign: "left",
              maxWidth: "400px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                ✓
              </div>
              <div>
                <h3 style={{ color: "white", fontWeight: "600", marginBottom: "0.25rem" }}>
                  Validación Automática
                </h3>
                <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                  Según normativa DIAN CT-COA-0124
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                📊
              </div>
              <div>
                <h3 style={{ color: "white", fontWeight: "600", marginBottom: "0.25rem" }}>
                  Reportes Detallados
                </h3>
                <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                  Análisis completo de errores y advertencias
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                ⚡
              </div>
              <div>
                <h3 style={{ color: "white", fontWeight: "600", marginBottom: "0.25rem" }}>
                  Resultados Rápidos
                </h3>
                <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                  Validación en 10-30 segundos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem",
          background: "var(--bg-primary)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "480px",
          }}
        >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)",
              fontSize: "2rem",
              fontWeight: "bold",
              color: "white",
              marginBottom: "1rem",
            }}
          >
            K
          </div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: "bold",
              color: "white",
              marginBottom: "0.5rem",
            }}
          >
            KILA
          </h1>
          <p className="text-secondary-400" style={{ fontSize: "0.875rem" }}>
            Validador de Facturas DIAN
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "var(--secondary-300)",
                marginBottom: "0.5rem",
              }}
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--border-radius)",
                color: "white",
                fontSize: "0.875rem",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--primary-500)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border-color)";
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "var(--secondary-300)",
                marginBottom: "0.5rem",
              }}
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--border-radius)",
                color: "white",
                fontSize: "0.875rem",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--primary-500)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border-color)";
              }}
            />
          </div>

          {/* Remember & Forgot */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
                color: "var(--secondary-300)",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                style={{
                  width: "16px",
                  height: "16px",
                  cursor: "pointer",
                }}
              />
              Recordarme
            </label>
            <a
              href="#"
              style={{
                fontSize: "0.875rem",
                color: "var(--primary-500)",
                textDecoration: "none",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: "100%",
              padding: "0.875rem",
              fontSize: "1rem",
              fontWeight: "600",
            }}
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Sign Up Link */}
        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.875rem",
            color: "var(--secondary-400)",
          }}
        >
          ¿No tienes una cuenta?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              router.push("/dashboard");
            }}
            style={{
              color: "var(--primary-500)",
              textDecoration: "none",
              fontWeight: "600",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            Regístrate
          </a>
        </p>
        </div>
      </div>
    </div>
  );
}
