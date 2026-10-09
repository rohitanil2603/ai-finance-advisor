import { Button } from "@/components/ui/Button";

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span>{message}</span>
      {onRetry && (
        <Button variant="danger" onClick={onRetry} className="shrink-0">
          Retry
        </Button>
      )}
    </div>
  );
}
