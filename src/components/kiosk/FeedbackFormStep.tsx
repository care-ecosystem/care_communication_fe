import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import StarRating from "./StarRating";
import { useQuery, useMutation } from "@tanstack/react-query";
import { kioskApis } from "@/apis";
import type {
  Encounter,
  FeedbackEntry,
  FeedbackField,
  PatientCredentials,
  SaveFeedbackPayload,
} from "@/types/kiosk";

interface FeedbackFormStepProps {
  encounter: Encounter;
  credentials: PatientCredentials;
  onBack: () => void;
  onComplete: () => void;
}

function buildSchema(fields: FeedbackField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of fields) {
    if (field.input_type === "rating") {
      shape[field.id] = field.required
        ? z.number().min(1, "Please select a rating")
        : z.number().optional();
      shape[`${field.id}_comment`] = z.string().optional();
    } else {
      shape[field.id] = field.required
        ? z.string().trim().nonempty("This field is required")
        : z.string().optional();
    }
  }
  return z.object(shape);
}

function buildDefaults(fields: FeedbackField[]): Record<string, unknown> {
  return Object.fromEntries(
    fields.flatMap((f) =>
      f.input_type === "rating"
        ? [
            [f.id, 0],
            [`${f.id}_comment`, ""],
          ]
        : [[f.id, ""]],
    ),
  );
}

export default function FeedbackFormStep({
  encounter,
  credentials,
  onBack,
  onComplete,
}: FeedbackFormStepProps) {
  const {
    data: template,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["kiosk", "feedback-template", encounter.id],
    queryFn: () =>
      kioskApis.feedback.getEncounterFeedbackTemplate(
        encounter.id,
        credentials.patient_id,
        credentials.birth_year,
      ),
    enabled: !!encounter.id,
  });

  const fields = template?.template_body.fields ?? [];

  const schema = useMemo(() => buildSchema(fields), [fields]);
  const defaults = useMemo(() => buildDefaults(fields), [fields]);

  const {
    handleSubmit,
    watch,
    setValue,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  useEffect(() => {
    if (template) {
      reset(buildDefaults(template.template_body.fields));
    }
  }, [template?.template_id]);

  const {
    mutate: saveFeedback,
    isPending: saving,
    isSuccess,
  } = useMutation({
    mutationFn: (data: SaveFeedbackPayload) => kioskApis.feedback.save(data),
    onError: (err: any) =>
      toast.error(err?.message || "Failed to submit. Please try again."),
  });

  function onSubmit(values: Record<string, unknown>) {
    if (!template) return;

    const feedback: FeedbackEntry[] = fields.map((field) => {
      const entry: FeedbackEntry = { issue_category: field.issue_category };

      if (field.input_type === "rating") {
        entry.rating = values[field.id] as number;
        const comment = values[`${field.id}_comment`] as string | undefined;
        if (comment?.trim()) entry.comment = comment.trim();
      } else {
        const comment = values[field.id] as string | undefined;
        if (comment?.trim()) entry.comment = comment.trim();
      }

      return entry;
    });

    saveFeedback({
      feedback,
      reference_id: encounter.id,
      reference_type: "ENCOUNTER",
      patient_id: credentials.patient_id,
      birth_year: credentials.birth_year,
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span className="text-sm">Loading feedback form…</span>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="max-w-lg mx-auto py-12 flex flex-col gap-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700">
          {(error as any)?.message || "Failed to load the feedback form."}
        </div>
        <Button variant="outline" onClick={onBack} className="gap-2 w-fit">
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

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
          <span className="text-sm text-gray-700">
            Your feedback helps us improve patient care.
          </span>
        </div>
        <Button
          variant="primary_gradient"
          size="lg"
          onClick={onComplete}
          className="min-w-40"
        >
          Done
        </Button>
      </div>
    );
  }

  const { title, description, submit } = template.template_body;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 py-8">
      <div>
        <Button
          variant="outline"
          onClick={onBack}
          disabled={saving}
          className="mb-2 -ml-2 gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="pb-4 border-b border-gray-200">
          <h4 className="font-semibold text-lg">{title}</h4>
          <span className="text-sm text-gray-700">{description}</span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow rounded-md p-6 flex flex-col gap-8"
      >
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-col gap-4">
            {field.input_type === "rating" && (
              <>
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <label className="text-sm font-medium">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    {(watch(field.id) as number) > 0 && (
                      <span className="text-xs text-gray-400">
                        {watch(field.id) as number} / {field.scale}
                      </span>
                    )}
                  </div>
                  <StarRating
                    scale={field.scale ?? 5}
                    value={(watch(field.id) as number) ?? 0}
                    onChange={(val) =>
                      setValue(field.id, val, { shouldValidate: true })
                    }
                    disabled={saving}
                  />
                  {errors[field.id] && (
                    <p className="text-xs text-red-500">
                      {errors[field.id]?.message as string}
                    </p>
                  )}
                </div>
                <Textarea
                  {...register(`${field.id}_comment`)}
                  placeholder="Add a comment (optional)"
                  disabled={saving}
                  rows={2}
                  className="resize-none text-sm"
                />
              </>
            )}

            {(field.input_type === "textarea" ||
              field.input_type === "text") && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <Textarea
                  {...register(field.id)}
                  placeholder={
                    field.required
                      ? "Your answer…"
                      : "Optional — leave blank to skip"
                  }
                  disabled={saving}
                  maxLength={field.max_length}
                  rows={3}
                  className="resize-none"
                />
                {field.max_length && (
                  <span className="text-xs text-gray-400 text-right">
                    {((watch(field.id) as string) ?? "").length} /{" "}
                    {field.max_length}
                  </span>
                )}
                {errors[field.id] && (
                  <p className="text-xs text-red-500">
                    {errors[field.id]?.message as string}
                  </p>
                )}
              </div>
            )}

            {index < fields.length - 1 && (
              <hr className="border-gray-100 mt-2" />
            )}
          </div>
        ))}

        <div className="border-t border-gray-200 pt-4">
          <Button
            type="submit"
            variant="primary_gradient"
            className="w-full"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              submit.label
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
