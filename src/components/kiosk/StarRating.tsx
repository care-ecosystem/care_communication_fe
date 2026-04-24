import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  scale: number;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function StarRating({
  scale,
  value,
  onChange,
  disabled = false,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const active = hovered > 0 ? hovered : value;

  return (
    <div className="flex gap-1" role="group" aria-label="Star rating">
      {Array.from({ length: scale }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => !disabled && setHovered(star)}
          onMouseLeave={() => !disabled && setHovered(0)}
          className={cn(
            "rounded transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            disabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:scale-110",
          )}
        >
          <Star
            className={cn(
              "h-8 w-8 transition-colors duration-100",
              star <= active
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-gray-300",
            )}
          />
        </button>
      ))}
    </div>
  );
}
