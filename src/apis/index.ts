import { HttpMethod } from "@/apis/types";
import { request } from "@/apis/query";
import type {
  Encounter,
  FeedbackTemplate,
  SaveFeedbackPayload,
} from "@/types/kiosk";

export const kioskApis = {
  encounters: {
    list: (patient_id: string, birth_year: string) =>
      request<Encounter[]>(
        "/api/care_communication/kiosk/encounters/",
        HttpMethod.GET,
        { patient_id, birth_year },
      ),
  },
  feedback: {
    getEncounterFeedbackTemplate: (
      reference_id: string,
      patient_id: string,
      birth_year: string,
    ) =>
      request<FeedbackTemplate>(
        "/api/care_communication/kiosk/feedback-template/",
        HttpMethod.GET,
        {
          reference_id,
          reference_type: "ENCOUNTER",
          event_type: "COMPLETED",
          patient_id,
          birth_year,
        },
      ),
    save: (data: SaveFeedbackPayload) =>
      request<void>(
        "/api/care_communication/kiosk/save-feedback/",
        HttpMethod.POST,
        data,
      ),
  },
};
