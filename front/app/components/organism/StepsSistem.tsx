interface IStepsSistem {
  StepActive: number;
}

export default function StepsSistem({ StepActive }: IStepsSistem) {
  return (
    <div className="flex justify-center items-center gap-8 my-8">
      <div className="step active">
        <div className="step-number">1</div>
        <div className="step-label">Cargar Factura</div>
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
  );
}
