export default function MainInformation() {
  return (
    <div className="flex flex-col w-[50%] items-center justify-center p-12 bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-500)] relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-[10%] -right-[10%] w-[300px] h-[300px] rounded-full bg-white/10 blur-[60px]" />
      <div className="absolute -bottom-[15%] -left-[15%] w-[400px] h-[400px] rounded-full bg-white/5 blur-[80px]" />

      {/* Content */}
      <div className="z-10 text-center">
        <div className="inline-flex items-center justify-center w-[120px] h-[120px] rounded-3xl bg-white/20 backdrop-blur-md text-6xl font-bold text-white mb-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          K
        </div>
        <h1 className="text-5xl font-bold text-white mb-4 tracking-wider">
          KILA
        </h1>
        <p className="text-xl text-white/90 mb-12 max-w-[400px]">
          Sistema de Validación de Facturas de Importación
        </p>

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
  )
}
