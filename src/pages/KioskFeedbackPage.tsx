import "@/style/index.css";
import Page from "@/components/ui/page";
import { useState } from "react";
import AuthStep from "@/components/kiosk/AuthStep";
import EncounterListStep from "@/components/kiosk/EncounterListStep";
import FeedbackFormStep from "@/components/kiosk/FeedbackFormStep";
import type { Encounter } from "@/lib/types";

export default function KioskFeedbackPage() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [selectedEncounter, setSelectedEncounter] = useState<Encounter | null>(
    null,
  );

  const handleAuthSuccess = (
    _patientId: string,
    _dob: string,
    data: Encounter[],
  ) => {
    setEncounters(data);
    setStep(1);
  };

  const handleAddFeedback = (encounter: Encounter) => {
    setSelectedEncounter(encounter);
    setStep(2);
  };

  const resetToStart = () => {
    setStep(0);
    setEncounters([]);
    setSelectedEncounter(null);
  };

  return (
    <Page
      title="Kiosk Feedback Form"
      className="p-0 care-communication-container"
      hideTitleOnPage
    >
      <div className="container mx-auto px-4 pb-12">
        {step === 0 && <AuthStep onSuccess={handleAuthSuccess} />}
        {step === 1 && (
          <EncounterListStep
            encounters={encounters}
            onAddFeedback={handleAddFeedback}
            onBack={resetToStart}
          />
        )}
        {step === 2 && selectedEncounter && (
          <FeedbackFormStep
            encounter={selectedEncounter}
            onBack={() => setStep(1)}
            onComplete={resetToStart}
          />
        )}
      </div>
    </Page>
  );
}
