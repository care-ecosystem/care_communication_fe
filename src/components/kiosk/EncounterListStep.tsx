import { useTranslation } from "react-i18next";
import { I18NNAMESPACE } from "@/lib/contants";
import { Button } from "@/components/ui/button";
import EncounterCard from "@/components/kiosk/EncounterCard";
import type { Encounter } from "@/lib/types";

interface Props {
  encounters: Encounter[];
  onAddFeedback: (encounter: Encounter) => void;
  onBack: () => void;
}

export default function EncounterListStep({
  encounters,
  onAddFeedback,
  onBack,
}: Props) {
  const { t } = useTranslation(I18NNAMESPACE);

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {t("encounters_title") ?? "Your Encounters"}
          </h2>
          <p className="text-sm text-gray-500">
            {t("encounters_desc") ?? "Select an encounter to provide feedback."}
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          ← {t("back") ?? "Back"}
        </Button>
      </div>

      {encounters.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500 text-sm">
          {t("no_encounters") ?? "No encounters found."}
        </div>
      )}

      <div className="space-y-4">
        {encounters.map((enc) => (
          <EncounterCard
            key={enc.id}
            encounter={enc}
            onAddFeedback={onAddFeedback}
          />
        ))}
      </div>
    </div>
  );
}
