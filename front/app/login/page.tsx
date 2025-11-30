"use client"

import FormLogin from "@/src/login/forms/FormLogin";
import useAuthUser from "@/src/login/services/hooks/useAuthUser";
import { LoginInput } from "@/src/validators/user.validator";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login: loginUser, isLoading, error } = useAuthUser();
  const router = useRouter();


 const handleLogin = async (data: LoginInput) => {

    const response = await loginUser(data);
    if (response) {
      console.log("Usuario registrado/logueado:", response);
      router.push("/");
    } else {
      console.error("Error al registrar/loguear usuario:", error);
    }
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
          background:
            "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%)",
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
                <h3
                  style={{
                    color: "white",
                    fontWeight: "600",
                    marginBottom: "0.25rem",
                  }}
                >
                  Validación Automática
                </h3>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "0.875rem",
                  }}
                >
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
                <h3
                  style={{
                    color: "white",
                    fontWeight: "600",
                    marginBottom: "0.25rem",
                  }}
                >
                  Reportes Detallados
                </h3>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "0.875rem",
                  }}
                >
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
                <h3
                  style={{
                    color: "white",
                    fontWeight: "600",
                    marginBottom: "0.25rem",
                  }}
                >
                  Resultados Rápidos
                </h3>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "0.875rem",
                  }}
                >
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
                background:
                  "linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)",
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

          <FormLogin onSubmit={handleLogin}  />

          {/* Login Button
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
            </button> */}
        </div>
      </div>
    </div>
  );
}
