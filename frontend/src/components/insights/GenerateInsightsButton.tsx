import { Button } from "@/components/ui/Button";

interface GenerateInsightsButtonProps {
  loading: boolean;
  hasExisting: boolean;
  onClick: () => void;
}

export function GenerateInsightsButton({ loading, hasExisting, onClick }: GenerateInsightsButtonProps) {
  return (
    <Button onClick={onClick} loading={loading}>
      {loading ? "Generating…" : hasExisting ? "Regenerate insights" : "Generate insights"}
    </Button>
  );
}
