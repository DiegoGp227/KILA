import { recentValidations } from "@/src/test/data";

export default function HistoryValidationHome() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      {recentValidations.map((validation) => (
        <div
          key={validation.id}
          className="card"
          style={{ padding: "1rem", cursor: "pointer" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div className={`status-icon ${validation.status}`}>
                {validation.status === "error"
                  ? "✕"
                  : validation.status === "success"
                  ? "✓"
                  : "⚠"}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: "white" }}>
                  {validation.name}
                </div>
                <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                  {validation.time} • {validation.message}
                </div>
              </div>
            </div>
            <button className="btn btn-ghost">
              <span>↻</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
