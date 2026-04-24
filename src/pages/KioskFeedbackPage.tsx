import "@/style/index.css";
import Page from "@/components/ui/page";
import { useCallback, useState } from "react";
import AuthStep from "@/components/kiosk/AuthStep";
import EncounterListStep from "@/components/kiosk/EncounterListStep";
import FeedbackFormStep from "@/components/kiosk/FeedbackFormStep";
import type { Encounter, PatientCredentials } from "@/types/kiosk";

type Step = 0 | 1 | 2;

export default function KioskFeedbackPage() {
  const [step, setStep] = useState<Step>(0);
  const [credentials, setCredentials] = useState<PatientCredentials | null>(
    null,
  );
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [selectedEncounter, setSelectedEncounter] = useState<Encounter | null>(
    null,
  );

  const handleAuthSuccess = useCallback(
    (creds: PatientCredentials, fetchedEncounters: Encounter[]) => {
      setCredentials(creds);
      setEncounters(fetchedEncounters);
      setStep(1);
    },
    [],
  );

  const handleAddFeedback = useCallback((encounter: Encounter) => {
    setSelectedEncounter(encounter);
    setStep(2);
  }, []);

  const resetToStart = useCallback(() => {
    setStep(0);
    setCredentials(null);
    setEncounters([]);
    setSelectedEncounter(null);
  }, []);

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

        {step === 2 && selectedEncounter && credentials && (
          <FeedbackFormStep
            encounter={selectedEncounter}
            credentials={credentials}
            onBack={() => setStep(1)}
            onComplete={resetToStart}
          />
        )}
      </div>
    </Page>
  );
}
