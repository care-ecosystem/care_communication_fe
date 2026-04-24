import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  ClipboardList,
  MessageSquarePlus,
  User,
} from "lucide-react";
import type { Encounter } from "@/types/kiosk";

interface EncounterListStepProps {
  encounters: Encounter[];
  onAddFeedback: (encounter: Encounter) => void;
  onBack: () => void;
}

const STATUS_BADGE: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  in_progress: "default",
  completed: "secondary",
  cancelled: "destructive",
  planned: "outline",
};

const STATUS_LABEL: Record<string, string> = {
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  planned: "Planned",
};

const CLASS_LABEL: Record<string, string> = {
  imp: "Inpatient",
  amb: "Ambulatory",
  emer: "Emergency",
  obs: "Observation",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EncounterListStep({
  encounters,
  onAddFeedback,
  onBack,
}: EncounterListStepProps) {
  console.log(encounters);
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 py-8">
      <div>
        <Button variant="ghost" onClick={onBack} className="mb-2 -ml-2 gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="pb-4 border-b border-gray-200">
          <h4 className="font-semibold text-lg">Your Encounters</h4>
          <span className="text-sm text-gray-700">
            Select an encounter to submit feedback
          </span>
        </div>
      </div>

      {encounters.length > 0 && (
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-md px-4 py-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-medium truncate">
              {encounters[0].patient.name}
            </p>
            <p className="text-sm text-gray-500">
              {Math.floor(
                new Date().getFullYear() - encounters[0].patient.year_of_birth,
              )}
              {" Y"} •{" "}
              {encounters[0].patient.gender?.toLocaleUpperCase()[0] +
                encounters[0].patient.gender?.slice(1)}
            </p>
          </div>
        </div>
      )}

      {encounters.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-gray-500">
          <ClipboardList className="h-10 w-10 text-gray-300" />
          <p className="text-sm">No encounters found for this patient.</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {encounters.map((encounter) => (
          // <div
          //   key={encounter.id}
          //   className="bg-white shadow rounded-md p-6 flex flex-col gap-4"
          // >
          //   <div className="flex items-start justify-between gap-4">
          //     <div className="flex flex-col gap-1 min-w-0">
          //       <div className="flex items-center gap-2 flex-wrap justify-between">
          //         <span className="font-semibold">
          //           {CLASS_LABEL[encounter.encounter_class] ??
          //             encounter.encounter_class}
          //         </span>
          //         <Badge
          //           variant={STATUS_BADGE[encounter.status] ?? "outline"}
          //           className="text-xs font-normal"
          //         >
          //           {STATUS_LABEL[encounter.status] ?? encounter.status}
          //         </Badge>
          //       </div>
          //     </div>
          //   </div>

          //   <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-gray-600">
          //     <div className="flex items-center gap-2 justify-between">
          //       <Building2 className="h-3.5 w-3.5 shrink-0 text-gray-400" />
          //       <span className="truncate">{encounter.facility.name}</span>
          //     </div>
          //     <div className="flex items-center gap-2">
          //       <CalendarDays className="h-3.5 w-3.5 shrink-0 text-gray-400" />
          //       <span>{formatDateTime(encounter.period.start)}</span>
          //     </div>
          //   </div>

          //   {encounter.discharge_summary_advice && (
          //     <p className="text-xs text-gray-500 italic border-t border-gray-100 pt-3 line-clamp-2">
          //       {encounter.discharge_summary_advice}
          //     </p>
          //   )}

          //   <div className="flex justify-end border-t border-gray-100 pt-3">
          //     <Button
          //       size="sm"
          //       onClick={() => onAddFeedback(encounter)}
          //       className="gap-2"
          //     >
          //       <MessageSquarePlus className="h-4 w-4" />
          //       Give Feedback
          //     </Button>
          //   </div>
          // </div>
          <div
            key={encounter.id}
            className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
          >
            {/* Header with title and status badge */}
            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold text-gray-900">
                {encounter.facility.name}
              </span>
              <Badge
                variant={STATUS_BADGE[encounter.status] ?? "outline"}
                className="text-xs font-medium shrink-0"
              >
                {STATUS_LABEL[encounter.status] ?? encounter.status}
              </Badge>
            </div>

            {/* Facility and date info */}
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 shrink-0 text-gray-400" />
                <span className="truncate">
                  {CLASS_LABEL[encounter.encounter_class] ??
                    encounter.encounter_class}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 shrink-0 text-gray-400" />
                <span>{formatDateTime(encounter.period.start)}</span>
              </div>
            </div>

            {/* Discharge summary */}
            {encounter.discharge_summary_advice && (
              <div className="bg-gray-50 rounded border border-gray-100 p-3">
                <p className="text-xs text-gray-600 line-clamp-3">
                  {encounter.discharge_summary_advice}
                </p>
              </div>
            )}

            {/* Action button */}
            <div className="flex justify-end pt-2 mt-auto">
              <Button
                size="sm"
                onClick={() => onAddFeedback(encounter)}
                className="gap-2"
              >
                <MessageSquarePlus className="h-4 w-4" />
                Give Feedback
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
