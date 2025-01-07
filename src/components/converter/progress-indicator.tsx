import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConversionStatus } from "@/types";

interface ProgressIndicatorProps {
  status: ConversionStatus;
  progress: number;
}

export function ProgressIndicator({
  status,
  progress,
}: ProgressIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "preparing":
        return {
          label: "Preparing...",
          icon: Loader2,
          iconClass: "text-blue-500 animate-spin",
          message: "Setting up conversion parameters...",
        };
      case "converting":
        return {
          label: "Converting...",
          icon: Loader2,
          iconClass: "text-blue-500 animate-spin",
          message: "Please wait while we process your file...",
        };
      case "done":
        return {
          label: "Conversion complete!",
          icon: CheckCircle2,
          iconClass: "text-green-500",
          message: "Your file is ready to download",
        };
      case "error":
        return {
          label: "Error during conversion",
          icon: AlertCircle,
          iconClass: "text-red-500",
          message: "Something went wrong. Please try again.",
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4", config.iconClass)} />
          <span className="text-sm font-medium">{config.label}</span>
        </div>
        <span className="text-sm text-muted-foreground">{progress}%</span>
      </div>

      <Progress
        value={progress}
        className={cn(
          "h-2",
          status === "error" && "bg-red-100 [&>div]:bg-red-500",
          status === "done" && "bg-green-100 [&>div]:bg-green-500"
        )}
      />

      {(status === "converting" || status === "preparing") && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{config.message}</span>
        </div>
      )}
    </div>
  );
}
