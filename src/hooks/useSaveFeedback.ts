import { useMutation } from "@tanstack/react-query";
import { saveFeedback } from "@/lib/api";
import type { FeedbackPayload } from "@/lib/types";

export function useSaveFeedback(onSuccess: () => void) {
  return useMutation({
    mutationFn: (payload: FeedbackPayload) => saveFeedback(payload),
    onSuccess,
  });
}
