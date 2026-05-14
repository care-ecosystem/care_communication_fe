import { HttpMethod } from "@/apis/types";
import { request } from "@/apis/query";
import type {
  Encounter,
  FeedbackTemplate,
  SaveFeedbackPayload,
} from "@/types/kiosk";

export const kioskApis = {
  encounters: {
    list: (encounter_id: string, birth_year?: string, phone_number?: string) =>
      request<Encounter[]>(
        "/api/care_communication/kiosk/encounters/",
        HttpMethod.GET,
        { encounter_id, birth_year, phone_number },
      ),
  },
  feedback: {
    getEncounterFeedbackTemplate: (
      encounter_id: string,
      birth_year?: string,
      phone_number?: string,
    ) =>
      request<FeedbackTemplate>(
        "/api/care_communication/kiosk/feedback-template/",
        HttpMethod.GET,
        {
          reference_type: "ENCOUNTER",
          event_type: "COMPLETED",
          encounter_id,
          birth_year,
          phone_number,
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
