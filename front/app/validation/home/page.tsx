import Actions from "@/app/components/molecules/Actions";
import InfoBox from "@/app/components/molecules/InfoBox";
import HistoryValidationHome from "@/app/components/organism/HistoryValidationHome";
import StepsSistem from "@/app/components/organism/StepsSistem";
import UploadSistem from "@/app/validation/components/organisms/UploadSistem";

export default function HomePage() {
  return (
    <div className="main-content">
      {/* Breadcrumbs */}
      <div className="flex gap-1 mb-8 justify-center items-center text-secondary-400">
        <span className="breadcrumb-item active">Validación DIAN</span>
        <span>/</span>
        <span className="flex items-center gap-1">Nueva Validación</span>
      </div>

      {/* Timeline Steps */}
      <StepsSistem StepActive={1} />

      {/* Main Wrapper */}
      <div className="max-w-[800px] mx-auto">
        <div className="card fade-in">
          {/* Header */}
          <div className="card-header">
            <div>
              <h1 className="card-title">Validador de Facturas de Importación</h1>

              <p className="text-muted text-sm mt-2">
                Verificación automática según normativa DIAN (CT-COA-0124)
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="card-body">
            {/* Upload Section */}
            <UploadSistem />

            {/* Recent Files */}
            <div className="mt-8">
              <h3 className="text-white text-base mb-4">
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
