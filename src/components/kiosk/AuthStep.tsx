import { useState } from "react";
import { useTranslation } from "react-i18next";
import { I18NNAMESPACE } from "@/lib/contants";
import { useEncounters } from "@/hooks/useEncounters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ScanLine } from "lucide-react";
import type { Encounter } from "@/lib/types";

interface Props {
  onSuccess: (patientId: string, dob: string, encounters: Encounter[]) => void;
}

export default function AuthStep({ onSuccess }: Props) {
  const { t } = useTranslation(I18NNAMESPACE);
  const [patientId, setPatientId] = useState("");
  const [dob, setDob] = useState("");

  const { refetch, isFetching, error } = useEncounters(patientId, dob);

  const handleSubmit = async () => {
    if (!patientId.trim() || !dob) return;
    const result = await refetch();
    if (result.data) {
      onSuccess(patientId, dob, result.data);
    }
  };

  const handleScan = () => {
    // TODO: integrate barcode / QR scanner
    alert("Scanner not yet implemented");
  };

  const submitEnabled = !!patientId.trim() && !!dob;

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="mb-6 space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">
          {t("kiosk_feedback_title")}
        </h2>
        <p className="text-sm text-gray-500">{t("kiosk_feedback_desc")}</p>
      </div>

      <Card className="p-6 space-y-5 border border-gray-200 shadow-sm">
        <div className="space-y-1.5">
          <Label htmlFor="patient-id">
            {t("patient_uuid") ?? "Patient ID"}
          </Label>
          <div className="flex gap-2">
            <Input
              id="patient-id"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="e.g. 23a72471-e17f-448c-83ca-dc3d260d1f05"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleScan}
              title="Scan QR / Barcode"
            >
              <ScanLine className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dob">{t("patient_dob") ?? "Date of Birth"}</Label>
          <Input
            id="dob"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {t("fetch_encounters_error") ??
              "Could not find encounters. Please check details and try again."}
          </p>
        )}

        <Button
          className="w-full"
          variant="default"
          onClick={handleSubmit}
          disabled={!submitEnabled || isFetching}
        >
          {isFetching
            ? (t("loading") ?? "Loading…")
            : (t("verify_patient") ?? "Verify Patient")}
        </Button>
      </Card>
    </div>
  );
}
