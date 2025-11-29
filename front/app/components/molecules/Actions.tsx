"use client";
import { useRouter } from "next/navigation";

export default function Actions() {
  const router = useRouter();

  return (
    <div
      style={{
        marginTop: "2rem",
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <button
        className="btn btn-outline"
        onClick={() => router.push("/dashboard")}
      >
        <span>📊</span>
        Ver Dashboard
      </button>
      <button
        className="btn btn-outline"
        onClick={() => router.push("/settings")}
      >
        <span>⚙️</span>
        Configuración
      </button>
      <button className="btn btn-ghost">
        <span>📖</span>
        Documentación DIAN
      </button>
    </div>
  );
}
