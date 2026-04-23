import { useState } from "react";
import { useTranslation } from "react-i18next";
import { I18NNAMESPACE } from "@/lib/contants";
import { useFeedbackTemplate } from "@/hooks/useFeedbackTemplate";
import { useSaveFeedback } from "@/hooks/useSaveFeedback";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import StarRating from "@/components/kiosk/StarRating";
import type { Encounter } from "@/lib/types";

interface Props {
  encounter: Encounter;
  onBack: () => void;
  onComplete: () => void;
}

export default function FeedbackFormStep({
  encounter,
  onBack,
  onComplete,
}: Props) {
  const { t } = useTranslation(I18NNAMESPACE);
  const [responses, setResponses] = useState<Record<string, string | number>>(
    {},
  );
  const [submitted, setSubmitted] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");

  const {
    data: template,
    isLoading,
    error: templateError,
  } = useFeedbackTemplate(encounter.id);

  const { mutate: submit, isPending } = useSaveFeedback(() => {
    setConfirmMsg(
      template?.template_body.submit.confirmation_message ?? "Thank you!",
    );
    setSubmitted(true);
    setTimeout(onComplete, 2500);
  });

  const handleSubmit = () => {
    if (!template) return;
    submit({
      encounter_id: encounter.id,
      template_id: template.external_id,
      responses,
    });
  };

  const isFormValid = () => {
    if (!template) return false;
    return template.template_body.fields
      .filter((f) => f.required)
      .every((f) => {
        const val = responses[f.id];
        if (f.input_type === "rating")
          return typeof val === "number" && val > 0;
        return typeof val === "string" && val.trim().length > 0;
      });
  };

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto mt-10 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card
            key={i}
            className="p-5 border border-gray-200 shadow-sm space-y-3"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-48" />
          </Card>
        ))}
      </div>
    );
  }

  if (templateError || !template) {
    return (
      <div className="max-w-lg mx-auto mt-10 text-center space-y-4">
        <p className="text-sm text-red-600">
          {t("feedback_template_error") ??
            "Failed to load feedback form. Please try again."}
        </p>
        <Button variant="outline" onClick={onBack}>
          ← {t("back") ?? "Back"}
        </Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{confirmMsg}</h2>
        <p className="text-sm text-gray-500">
          {t("redirecting") ?? "Redirecting…"}
        </p>
      </div>
    );
  }

  const {
    title,
    description,
    fields,
    submit: submitConfig,
  } = template.template_body;

  return (
    <div className="max-w-lg mx-auto mt-8 space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
          <p className="text-xs text-gray-400 mt-1">
            {t("for_encounter") ?? "For"}: {encounter.patient.name} ·{" "}
            {encounter.facility.name}
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          ← {t("back") ?? "Back"}
        </Button>
      </div>

      <Separator />

      <div className="space-y-4">
        {fields.map((field) => (
          <Card
            key={field.id}
            className="p-5 border border-gray-200 shadow-sm space-y-3"
          >
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-800">
                {field.label}
              </span>
              {field.required && (
                <span className="text-red-500 text-xs">*</span>
              )}
            </div>

            {field.input_type === "rating" && field.scale && (
              <StarRating
                value={(responses[field.id] as number) ?? 0}
                max={field.scale}
                onChange={(val) =>
                  setResponses((prev) => ({ ...prev, [field.id]: val }))
                }
              />
            )}

            {field.input_type === "textarea" && (
              <Textarea
                rows={3}
                maxLength={field.max_length}
                value={(responses[field.id] as string) ?? ""}
                onChange={(e) =>
                  setResponses((prev) => ({
                    ...prev,
                    [field.id]: e.target.value,
                  }))
                }
                placeholder={t("type_here") ?? "Type your response here…"}
              />
            )}
          </Card>
        ))}
      </div>

      <Button
        className="w-full"
        variant="default"
        onClick={handleSubmit}
        disabled={!isFormValid() || isPending}
      >
        {isPending ? (t("submitting") ?? "Submitting…") : submitConfig.label}
      </Button>
    </div>
  );
}
