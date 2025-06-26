import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  className?: string;
}

export const LoadingSpinner = ({ 
  text = "Carregando...", 
  size = "md", 
  fullScreen = false,
  className = ""
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  const containerClasses = fullScreen 
    ? "flex flex-col items-center justify-center min-h-screen"
    : "flex flex-col items-center justify-center h-40";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        <p className={`${textSizeClasses[size]} text-muted-foreground`}>
          {text}
        </p>
      </div>
    </div>
  );
}; 