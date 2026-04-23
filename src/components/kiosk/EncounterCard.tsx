import { useTranslation } from "react-i18next";
import { I18NNAMESPACE } from "@/lib/contants";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Encounter } from "@/lib/types";

function statusLabel(status: string) {
  const map: Record<string, string> = {
    in_progress: "In Progress",
    completed: "Completed",
    planned: "Planned",
    cancelled: "Cancelled",
  };
  return map[status] ?? status;
}

function statusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "completed") return "default";
  if (status === "cancelled") return "destructive";
  return "secondary";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface Props {
  encounter: Encounter;
  onAddFeedback: (encounter: Encounter) => void;
}

export default function EncounterCard({ encounter, onAddFeedback }: Props) {
  const { t } = useTranslation(I18NNAMESPACE);

  return (
    <Card className="p-5 border border-gray-200 bg-white shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-gray-900">
            {encounter.patient.name}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {encounter.facility.name}
          </p>
        </div>
        <Badge variant={statusVariant(encounter.status)}>
          {statusLabel(encounter.status)}
        </Badge>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Class
          </p>
          <p className="capitalize">{encounter.encounter_class}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Priority
          </p>
          <p>{encounter.priority}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Started
          </p>
          <p>{formatDate(encounter.period.start)}</p>
        </div>
        {encounter.period.end && (
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Ended
            </p>
            <p>{formatDate(encounter.period.end)}</p>
          </div>
        )}
      </div>

      {encounter.discharge_summary_advice && (
        <p className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-500 line-clamp-2">
          {encounter.discharge_summary_advice}
        </p>
      )}

      <div className="flex justify-end">
        <Button
          variant="default"
          onClick={() => onAddFeedback(encounter)}
        >
          {t("add_feedback") ?? "Add Feedback"}
        </Button>
      </div>
    </Card>
  );
}
