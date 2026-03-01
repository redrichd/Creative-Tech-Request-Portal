import { ToolRequest } from "@/lib/types";
import { RequestList } from "@/components/ui/RequestList";
import { Loader2 } from "lucide-react";

interface CardListViewProps {
  requests: ToolRequest[];
  loading: boolean;
  onSelect: (r: ToolRequest) => void;
}

export function CardListView({ requests, loading, onSelect }: CardListViewProps) {
  if (loading) {
     return (
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
     );
  }

  return (
    <div className="w-full">
      <RequestList
        requests={requests}
        loading={loading}
        onSelect={onSelect}
      />
    </div>
  );
}
