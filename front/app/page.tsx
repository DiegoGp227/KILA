import StepsSistem from "./components/organism/StepsSistem";
import UploadSistem from "./components/organism/UploadSistem";
import HistoryValidationHome from "./components/organism/HistoryValidationHome";
import InfoBox from "./components/molecules/InfoBox";
import Actions from "./components/molecules/Actions";

export default function HomePage() {
  // Sample recent validations data

  return (
    <div className="main-content">
      {/* Breadcrumbs */}
      <div className="flex gap-0.5 mb-8 justify-center items-center text-var(--secondary-400)">
        <span className="breadcrumb-item active">Validación DIAN</span>
        <span>/</span>
        <span className="flex items-center gap-0.5">Nueva Validación</span>
      </div>

      {/* Timeline Steps */}
      <StepsSistem StepActive={1} />

      {/* Main Content */}
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="card fade-in">
          <div className="card-header">
            <div>
              <h1 className="card-title">
                Validador de Facturas de Importación
              </h1>
              <p
                className="text-muted"
                style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}
              >
                Verificación automática según normativa DIAN (CT-COA-0124)
              </p>
            </div>
          </div>

          <div className="card-body">
            {/* Upload Zone */}
            <UploadSistem />

            {/* Recent Files */}
            <div style={{ marginTop: "2rem" }}>
              <h3
                style={{
                  color: "white",
                  fontSize: "1rem",
                  marginBottom: "1rem",
                }}
              >
                📁 Validaciones Recientes
              </h3>

              <HistoryValidationHome />
            </div>

            {/* Info Box */}
            <InfoBox />
          </div>
        </div>

        {/* Quick Actions */}
        <Actions />
      </div>
    </div>
  );
}
