interface IProcessingSpinner {
  icon?: string;
  size?: "sm" | "md" | "lg";
}

export default function ProcessingSpinner({
  icon = "🔍",
  size = "lg"
}: IProcessingSpinner) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-[120px] h-[120px]"
  };

  const iconSizes = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-[3rem]"
  };

  return (
    <div className={`processing-animation ${sizeClasses[size]} mx-auto mb-8 relative`}>
      <div className="spinner w-full h-full"></div>
      <div className={`spinner-icon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${iconSizes[size]}`}>
        {icon}
      </div>
    </div>
  );
}
