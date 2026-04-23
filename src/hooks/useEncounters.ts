import { useQuery } from "@tanstack/react-query";
import { fetchEncounters } from "@/lib/api";

export function useEncounters(patientId: string, dob: string) {
  return useQuery({
    queryKey: ["kiosk-encounters", patientId, dob],
    queryFn: () => fetchEncounters(patientId, dob),
    enabled: false,
    retry: false,
  });
}
