import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { kioskApis } from "@/apis";
import { Button } from "@/components/ui/button";
import FeedbackReviewStep from "@/components/kiosk/FeedbackReviewStep";
import { ArrowLeft } from "lucide-react";
import RatingQuestion from "@/components/kiosk/RatingQuestion";
import type {
    Facility,
    FeedbackEntry,
    FeedbackField,
    PatientCredentials,
    SaveFeedbackPayload,
} from "@/types/kiosk";
import { useTranslation } from "react-i18next";
import { I18NNAMESPACE } from "@/lib/contants";


type RatingAnswer = { rating: number; comment: string };

interface FeedbackFormStepProps {
    facility: Facility | null;
    credentials: PatientCredentials;
    onBack: () => void;
    onComplete: () => void;
}

export default function FeedbackFormStep({
    facility,
    credentials,
    onBack,
    onComplete,
}: FeedbackFormStepProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [ratingAnswers, setRatingAnswers] = useState<Record<number, RatingAnswer>>({});
    const [otherComment, setOtherComment] = useState("");
    const { t } = useTranslation(I18NNAMESPACE);
    const { data: template, isLoading, error } = useQuery({
        queryKey: ["kiosk", "feedback-template", credentials.encounter_id],
        queryFn: () =>
            kioskApis.feedback.getEncounterFeedbackTemplate(
                credentials.encounter_id,
                credentials.birth_year,
                credentials.phone_number,
            ),
        enabled: !!credentials.encounter_id,
    });

    const ratingFields: FeedbackField[] =
        template?.template_body.fields.filter((f) => f.input_type === "rating") ?? [];

    const textFields: FeedbackField[] =
        template?.template_body.fields.filter(
            (f) => f.input_type === "textarea" || f.input_type === "text"
        ) ?? [];

    const totalSteps = ratingFields.length + (textFields.length > 0 ? 1 : 0);

    const { mutate: saveFeedback, isPending: saving, isSuccess } = useMutation({
        mutationFn: (data: SaveFeedbackPayload) => kioskApis.feedback.save(data),
        onError: (err: any) =>
            toast.error(err?.message || t("failed_to_submit")),
    });

    function handleSubmit() {
        if (!template) return;

        const feedback: FeedbackEntry[] = [
            // rating fields
            ...ratingFields.map((field, i) => ({
                issue_category: field.issue_category,
                rating: ratingAnswers[i + 1]?.rating,
                comment: ratingAnswers[i + 1]?.comment || undefined,
            })),
            // textarea fields
            ...textFields.map((field) => ({
                issue_category: field.issue_category,
                comment: otherComment.trim() || undefined,
            })),
        ];
        console.log("[FeedbackFormStep] Submitting feedback:", {
        ratingAnswers,
        otherComment,
        feedback,
        encounter_id: credentials.encounter_id,
    });

        saveFeedback({
            feedback,
            reference_type: "ENCOUNTER",
            encounter_id: credentials.encounter_id,
            birth_year: credentials.birth_year,
            phone_number: credentials.phone_number,
        });
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24 text-gray-400">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span className="text-sm">{t("loading_feedback_form")}</span>
            </div>
        );
    }

    // Error state
    if (error || !template) {
        return (
            <div className="max-w-lg mx-auto py-12 flex flex-col gap-4">
                <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700">
                    {(error as any)?.message || t("failed_to_load_form")}
                </div>
                <Button variant="outline" onClick={onBack} className="gap-2 w-fit">
                    <ArrowLeft className="h-4 w-4" />
                    {t("go_back")}
                </Button>
            </div>
        );
    }

    // Success state
    if (isSuccess) {
        return (
            <div className="max-w-lg mx-auto py-16 flex flex-col items-center gap-6 text-center">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-9 w-9 text-green-600" />
                </div>
                <div className="flex flex-col gap-1">
                    <h4 className="font-semibold text-lg">
                        {template.template_body.submit.confirmation_message}
                    </h4>
                </div>
                <Button variant="primary_gradient" size="lg" onClick={onComplete} className="min-w-40">
                {t("done")}
                </Button>
            </div>
        );
    }

    // Rating steps — one per rating field
    const currentRatingField = ratingFields[currentStep - 1];
    if (currentStep <= ratingFields.length && currentRatingField) {
        return (
            <RatingQuestion
                key={`step-${currentStep}`}
                facility={facility!}
                icon={currentRatingField.icon ?? "⭐"}
                title={currentRatingField.label}
                required={currentRatingField.required}
                currentStep={currentStep}
                totalSteps={totalSteps}
                description={currentRatingField.description}
                commentPlaceholder={currentRatingField.comment_placeholder}
                initialRating={ratingAnswers[currentStep]?.rating}
                initialComment={ratingAnswers[currentStep]?.comment}
                onRatingChange={(rating, comment) =>
                    setRatingAnswers((prev) => ({ ...prev, [currentStep]: { rating, comment } }))
                }
                onBack={() => currentStep === 1 ? onBack() : setCurrentStep(currentStep - 1)}
                onNext={(rating, comment) => {
                    setRatingAnswers((prev) => ({ ...prev, [currentStep]: { rating, comment } }));
                    setCurrentStep(currentStep + 1);
                }}
            />
        );
    }

    // replace the last return block (// Final step — textarea fields + submit)
return (
  <FeedbackReviewStep
    facility={facility}
    template={template}
    ratingFields={ratingFields}
    textFields={textFields}
    ratingAnswers={ratingAnswers}
    otherComment={otherComment}
    setOtherComment={setOtherComment}
    saving={saving}
    currentStep={currentStep}
    totalSteps={totalSteps}
    onBack={() => setCurrentStep(ratingFields.length)}
    onSubmit={handleSubmit}
  />
);
}

