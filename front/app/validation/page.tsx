import Actions from "../components/molecules/Actions";
import InfoBox from "../components/molecules/InfoBox";
import HistoryValidationHome from "../components/organism/HistoryValidationHome";
import StepsSistem from "../components/organism/StepsSistem";
import UploadSistem from "../components/organism/UploadSistem";

export default function ValidationPage() {
  return (
    <div className="main-content">
      {/* Breadcrumbs */}
      <div className="flex gap-0.5 mb-8 justify-center items-center text-var(--secondary-400)">
        <span className="breadcrumb-item active">Validación DIAN</span>
        <span>/</span>
        <span className="flex items-center gap-0.5">Nueva Validación</span>
      </div>

      {/* Timeline Steps */}
      <StepsSistem StepActive={2} />

      {/* Main Content */}
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div>
          <div className="card fade-in">
            <div className="timeline-steps">
              <div className="step completed">
                <div className="step-number">✓</div>
                <div className="step-label">Cargar Factura</div>
              </div>

              <div
                className="step-connector"
                style={{
                  width: "100px",
                  height: "2px",
                  background: "var(--success)",
                  margin: "0 -1rem",
                }}
              ></div>

              <div className="step active">
                <div className="step-number">2</div>
                <div className="step-label">Validando</div>
              </div>

              <div
                className="step-connector"
                style={{
                  width: "100px",
                  height: "2px",
                  background: "var(--secondary-700)",
                  margin: "0 -1rem",
                }}
              ></div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-label">Resultados</div>
              </div>
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
