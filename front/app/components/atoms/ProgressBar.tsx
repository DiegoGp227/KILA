interface IProgressBar {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export default function ProgressBar({
  progress,
  label = "Progreso",
  showPercentage = true,
  animated = true
}: IProgressBar) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="mb-8">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-secondary-400 text-sm">{label}</span>
          )}
          {showPercentage && (
            <span className="text-primary-500 font-semibold text-sm">
              {clampedProgress}%
            </span>
          )}
        </div>
      )}
      <div className="progress-bar">
        <div
          className={`progress-fill ${animated ? 'progress-fill-animated' : ''}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
