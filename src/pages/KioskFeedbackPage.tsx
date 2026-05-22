import "@/style/index.css";
import Page from "@/components/ui/page";
import { useCallback, useState } from "react";
import AuthStep from "@/components/kiosk/AuthStep";
import EncounterListStep from "@/components/kiosk/EncounterListStep";
import FeedbackFormStep from "@/components/kiosk/FeedbackFormStep";
import type { Encounter, Facility, PatientCredentials } from "@/types/kiosk";
import FacilitySelectionStep from "@/components/kiosk/FacilitySelectionStep";

type Step = -1 | 0 | 1 | 2;

export default function KioskFeedbackPage() {
  const [step, setStep] = useState<Step>(-1);
  const [selectedFacility, setSelectedFacility] =
    useState<Facility | null>(null);
  const [credentials, setCredentials] = useState<PatientCredentials | null>(
    null,
  );
  const [encounters, setEncounters] = useState<Encounter[]>([]);

  const handleAuthSuccess = useCallback(
    (creds: PatientCredentials, fetchedEncounters: Encounter[]) => {
      setCredentials(creds);
      setEncounters(fetchedEncounters);
      setStep(1);
    },
    [],
  );

  const handleAddFeedback = useCallback(() => {
    setStep(2);
  }, []);

  const resetToStart = useCallback(() => {
    setStep(0);
    setCredentials(null);
    setEncounters([]);
  }, []);

  return (
    <Page
      title="Kiosk Feedback Form"
      className="p-0 care-communication-container"
      hideTitleOnPage
    >
      <div className="container mx-auto px-4 pb-12">
        {step === -1 && (
          <FacilitySelectionStep
            onSelect={(facility) => {
              setSelectedFacility(facility);
              setStep(0);
            }}
          />
        )}
        {step === 0 && <AuthStep facility={selectedFacility} onSuccess={handleAuthSuccess} />}

        {step === 1 && (
          <EncounterListStep
            facility={selectedFacility}
            encounters={encounters}
            onAddFeedback={handleAddFeedback}
            onBack={resetToStart}
          />
        )}

        {step === 2 && credentials && (
          <FeedbackFormStep
            facility={selectedFacility}
            credentials={credentials}
            onBack={() => setStep(1)}
            onComplete={resetToStart}
          />
        )}
      </div>
    </Page>
  );
}
