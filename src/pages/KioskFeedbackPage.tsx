import "@/style/index.css";
import Page from "@/components/ui/page";
import { useCallback, useState } from "react";
import AuthStep from "@/components/kiosk/AuthStep";
import FeedbackFormStep from "@/components/kiosk/FeedbackFormStep";
import FacilitySelectionStep from "@/components/kiosk/FacilitySelectionStep";
import { facilityAuthConfig } from "@/config/facilityAuthConfig";
import type { Encounter, Facility, PatientCredentials } from "@/types/kiosk";

type Step = -1 | 0 | 1;

export default function KioskFeedbackPage() {
  const [step, setStep] = useState<Step>(-1);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [credentials, setCredentials] = useState<PatientCredentials | null>(null);

  const handleAuthSuccess = useCallback(
    (creds: PatientCredentials, _encounters: Encounter[]) => {
      setCredentials(creds);
      setStep(1);
    },
    [],
  );

  const resetToStart = useCallback(() => {
    setStep(0);
    setCredentials(null);
  }, []);

  const authConfig = selectedFacility
    ? facilityAuthConfig[selectedFacility.id]
    : null;

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

        {step === 0 && (
          <AuthStep
            facility={selectedFacility}
            authConfig={authConfig}
            onSuccess={handleAuthSuccess}
          />
        )}

        {step === 1 && credentials && (
          <FeedbackFormStep
            facility={selectedFacility}
            credentials={credentials}
            onBack={() => setStep(0)}
            onComplete={resetToStart}
          />
        )}
      </div>
    </Page>
  );
}