import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import KioskHeader from "@/components/kiosk/KioskHeader";
import type { RatingOption, RatingQuestionProps } from "@/types/kiosk";

const ratingOptions: RatingOption[] = [
  { value: 1, label: "Very poor", color: "text-red-700", bg: "bg-red-50", border: "border-red-300" },
  { value: 2, label: "Poor", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-300" },
  { value: 3, label: "Average", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-300" },
  { value: 4, label: "Good", color: "text-lime-700", bg: "bg-lime-50", border: "border-lime-300" },
  { value: 5, label: "Excellent", color: "text-teal-700", bg: "bg-teal-50", border: "border-teal-300" },
];

export default function RatingQuestion({
  title,
  description,
  icon,
  currentStep,
  totalSteps,
  commentPlaceholder = "Tell us more...",
  
  initialRating,
  initialComment = "",
  required = true,
  facility,
  onRatingChange,
  onNext,
  onBack,
}: RatingQuestionProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(
    initialRating ?? null,
  );
  const [comment, setComment] = useState(initialComment ?? "");
  const canProceed = !required || selectedRating !== null;


  const activeRating = ratingOptions.find((r) => r.value === selectedRating) ?? null;

  return (
    <><KioskHeader facility={facility} /><div className="mx-auto w-full max-w-3xl rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">

      {/* TOP ROW */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Rate Your Experience
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Step {currentStep} of {totalSteps} — Rate each area, then add
            optional comments
          </p>
        </div>

        {/* STEP CIRCLES */}
        <div className="flex items-center gap-1.5 pt-0.5">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const s = i + 1;
            const isActive = s === currentStep;
            const isDone = s < currentStep;
            const isLast = s === totalSteps;
            return (
              <div
                key={s}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-[1.5px] text-xs font-medium transition-all",
                  isActive
                    ? "border-teal-700 bg-teal-700 text-white"
                    : isDone
                      ? "border-gray-200 bg-gray-50 text-gray-400"
                      : "border-gray-200 text-gray-400"
                )}
              >
                {isLast ? "✓" : s}
              </div>
            );
          })}
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="mb-6 h-[5px] w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-teal-700 transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
      </div>

      {/* QUESTION */}
      <div className="mb-5 flex items-start gap-3">
        {icon && (
          <div className="flex h-11 w-11 min-w-[44px] items-center justify-center rounded-2xl bg-gray-100 text-xl">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>

      {/* STAR RATINGS */}
      <div className="mb-2 grid grid-cols-5 gap-2">
        {ratingOptions.map((option) => {
          const isFilled = selectedRating !== null && option.value <= selectedRating;
          const activeColor = ratingOptions.find((r) => r.value === selectedRating);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setSelectedRating(option.value);
                onRatingChange?.(option.value, comment);
              }}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-2xl border-[1.5px] p-4 transition-all duration-150",
                isFilled
                  ? cn(activeColor?.border, activeColor?.bg)
                  : "border-gray-200 bg-white hover:border-gray-300",
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className={cn(
                  "h-6 w-6 transition-colors",
                  isFilled ? cn("fill-current stroke-current", activeColor?.color) : "fill-none stroke-gray-300",
                )}
                strokeWidth={1.5}
              >
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
              <span
                className={cn(
                  "text-sm font-medium",
                  isFilled ? activeColor?.color : "text-gray-500",
                )}
              >
                {option.value}
              </span>
            </button>
          );
        })}
      </div>

      {/* RATING BADGE */}
      <div className="mb-4 flex h-7 items-center">
        {activeRating && (
          <span
            className={cn(
              "rounded-full border-[1.5px] px-4 py-0.5 text-sm font-medium transition-all",
              activeRating.bg,
              activeRating.color,
              activeRating.border
            )}
          >
            {activeRating.label}
          </span>
        )}
      </div>

      {/* SCALE LABELS */}
      <div className="mb-5 flex justify-between">
        <span className="text-xs text-gray-400">Very poor</span>
        <span className="text-xs text-gray-400">Average</span>
        <span className="text-xs text-gray-400">Excellent</span>
      </div>

      {/* COMMENT */}
      <textarea
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
          onRatingChange?.(selectedRating ?? 0, e.target.value);
        }}
        placeholder={commentPlaceholder}
        rows={3}
        className="mb-5 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20" />

      {/* FOOTER */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-gray-200 px-5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          disabled={!canProceed}
          onClick={() => onNext(selectedRating ?? 0, comment)}
          className={cn(
            "flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl text-sm font-semibold transition-all",
            canProceed
              ? "bg-teal-700 text-white hover:opacity-90"
              : "cursor-not-allowed bg-gray-100 text-gray-400",
          )}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div></>
  );
}