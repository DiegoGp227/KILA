import Image from "next/image";
import kila from "@/public/Lika Corto.png";

export default function MainInformation() {
  return (
    <div className="flex flex-col w-[50%] items-center justify-center p-12 bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-500)] relative overflow-hidden">
      {/* Content */}
      <div className="text-center justify-center items-center">
        <div className="flex justify-center items-center flex-col gap-5">
          <Image src={kila} alt="Kila" width={100} height={100} />

          <h1 className="text-5xl font-bold text-white mb-4 tracking-wider">
            KILA
          </h1>
          <p className="text-xl text-white/90 mb-12 max-w-[400px]">
            Sistema de Validación de Facturas de Importación
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-6 text-left max-w-[400px]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
              ✓
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">
                Validación Automática
              </h3>
              <p className="text-white/80 text-sm">
                Según normativa DIAN CT-COA-0124
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
              📊
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">
                Reportes Detallados
              </h3>
              <p className="text-white/80 text-sm">
                Análisis completo de errores y advertencias
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
              ⚡
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">
                Resultados Rápidos
              </h3>
              <p className="text-white/80 text-sm">
                Validación en 10-30 segundos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
