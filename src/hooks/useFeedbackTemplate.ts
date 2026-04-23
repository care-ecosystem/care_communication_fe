import { useQuery } from "@tanstack/react-query";
import { fetchFeedbackTemplate } from "@/lib/api";

export function useFeedbackTemplate(encounterId: string) {
  return useQuery({
    queryKey: ["kiosk-feedback-template", encounterId],
    queryFn: () => fetchFeedbackTemplate(encounterId),
    enabled: !!encounterId,
  });
}
