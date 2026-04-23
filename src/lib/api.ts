import type { Encounter, FeedbackTemplate, FeedbackPayload } from "@/lib/types";

const BASE = "http://localhost:9000/api/care_communication/kiosk";

export async function fetchEncounters(
  patientId: string,
  dob: string,
): Promise<Encounter[]> {
  const res = await fetch(
    `${BASE}/encounters/?patient_id=${encodeURIComponent(patientId)}&date_of_birth=${encodeURIComponent(dob)}`,
  );
  if (!res.ok) throw new Error("Failed to fetch encounters");
  return res.json();
}

export async function fetchFeedbackTemplate(
  encounterId: string,
): Promise<FeedbackTemplate> {
  const res = await fetch(
    `${BASE}/feedback-template/?reference_id=${encodeURIComponent(encounterId)}&reference_type=ENCOUNTER&event_type=COMPLETED`,
  );
  if (!res.ok) throw new Error("Failed to fetch feedback template");
  return res.json();
}

export async function saveFeedback(payload: FeedbackPayload): Promise<void> {
  const res = await fetch(`${BASE}/save-feedback/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to save feedback");
}
