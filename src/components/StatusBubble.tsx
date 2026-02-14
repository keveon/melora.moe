import { cn } from "@/lib/utils";

interface StatusBubbleProps {
  status: string;
}

export function StatusBubble({ status }: StatusBubbleProps) {
  const isOnline = status === "online";
  
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-3 w-3">
        {isOnline && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        )}
        <span className={cn(
          "relative inline-flex rounded-full h-3 w-3",
          isOnline ? "bg-green-500" : "bg-gray-400"
        )}></span>
      </span>
      <span className="text-sm font-medium text-muted-foreground capitalize">
        {status || "Unknown"}
      </span>
    </div>
  );
}
