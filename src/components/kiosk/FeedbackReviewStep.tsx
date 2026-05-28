import { Loader2, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import KioskHeader from "@/components/kiosk/KioskHeader";
import type { Facility, FeedbackField, FeedbackTemplate } from "@/types/kiosk";
import { useTranslation } from "react-i18next";
import { I18NNAMESPACE } from "@/lib/contants";

type RatingAnswer = { rating: number; comment: string };

interface FeedbackReviewStepProps {
  facility: Facility | null;
  template: FeedbackTemplate;
  ratingFields: FeedbackField[];
  textFields: FeedbackField[];
  ratingAnswers: Record<number, RatingAnswer>;
  otherComment: string;
  setOtherComment: (value: string) => void;
  saving: boolean;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onSubmit: () => void;
}


export default function FeedbackReviewStep({
  facility, template, ratingFields, textFields,
  ratingAnswers, otherComment, setOtherComment,
  saving, currentStep, totalSteps, onBack, onSubmit,
}: FeedbackReviewStepProps) {
  const { t } = useTranslation(I18NNAMESPACE);
  const RATING_META: Record<number, { label: string; color: string; bg: string; border: string }> = {
  1: { label: t("very_poor"),  color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200"    },
  2: { label: t("poor"),       color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  3: { label: t("average"),    color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200"  },
  4: { label: t("good"),       color: "text-lime-700",   bg: "bg-lime-50",   border: "border-lime-200"   },
  5: { label:  t("excellent"),  color: "text-teal-700",   bg: "bg-teal-50",   border: "border-teal-200"   },
};
  const { title, description, submit } = template.template_body;

  return (
    <>
      <KioskHeader facility={facility} />
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">

        {/* TOP ROW */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t("rate_your_experience")}</h2>
            <p className="mt-1 text-sm text-gray-500">
            {t("step_of", { current: currentStep, total: totalSteps })} — {t("review_step_desc")}
            </p>
          </div>
          <div className="flex items-center gap-1.5 pt-0.5">
            {Array.from({ length: totalSteps }).map((_, i) => {
              const s = i + 1;
              const isLast = s === totalSteps;
              return (
                <div key={s} className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-[1.5px] text-xs font-medium transition-all",
                  s === currentStep ? "border-teal-700 bg-teal-700 text-white"
                    : s < currentStep ? "border-gray-200 bg-gray-50 text-gray-400"
                    : "border-gray-200 text-gray-400"
                )}>
                  {isLast ? "✓" : s}
                </div>
              );
            })}
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="mb-6 h-[5px] w-full overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-teal-700 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
        </div>

        {/* SECTION HEADER */}
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-11 w-11 min-w-[44px] items-center justify-center rounded-2xl bg-gray-100 text-xl">
            {"📋"}
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">{title ?? "Review & Submit"}</h3>
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          </div>
        </div>

        {/* RATING SUMMARY CARDS */}
        {ratingFields.length > 0 && (
          <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {ratingFields.map((field, i) => {
              const rating = ratingAnswers[i + 1]?.rating;
              const meta = rating ? RATING_META[rating] : null;
              return (
                <div key={field.id} className={cn(
                  "flex flex-col gap-1 rounded-2xl border p-3",
                  meta ? cn(meta.bg, meta.border) : "border-gray-200 bg-gray-50"
                )}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base leading-none">{field.icon ?? "⭐"}</span>
                    <span className="text-xs font-medium text-gray-500 truncate">{field.label}</span>
                  </div>
                  {meta && rating ? (
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className={cn("text-lg font-bold", meta.color)}>{rating}/5</span>
                      <span className={cn("text-xs font-medium", meta.color)}>{meta.label}</span>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-red-500 mt-0.5">{t("not_rated")}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TEXT FIELDS */}
        {textFields.map((field) => (
          <div key={field.id} className="mb-5 rounded-2xl border border-teal-100 bg-teal-50/40 p-4">
            <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <span>{field.icon ?? "💬"}</span>
              {field.label}
              {!field.required && <span className="ml-1 text-xs font-normal text-gray-400">({t("optional")})</span>}
            </label>
            <textarea
              value={otherComment}
              onChange={(e) => setOtherComment(e.target.value)}
              placeholder={field.comment_placeholder ?? "Tell us anything else…"}
              rows={4}
              maxLength={field.max_length}
              className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
            />
            {field.max_length && (
              <span className="mt-1 block text-right text-xs text-gray-400">
                {otherComment.length} / {field.max_length}
              </span>
            )}
          </div>
        ))}

        {/* FOOTER */}
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} disabled={saving}
            className="flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-gray-200 px-5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
            <ChevronLeft className="h-4 w-4" /> {t("back")}
          </button>
          <button type="button" disabled={saving} onClick={onSubmit}
            className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-teal-700 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-70">
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> {t("submitting")}</> : (submit?.label ?? "Submit Feedback ✓")}
          </button>
        </div>

      </div>
    </>
  );
}