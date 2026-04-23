export interface Period {
  start: string;
  end?: string;
}

export interface Patient {
  id: string;
  name: string;
  gender: string;
  phone_number: string;
  date_of_birth: string;
  blood_group: string;
  address: string;
}

export interface Facility {
  id: string;
  name: string;
}

export interface Encounter {
  id: string;
  status: string;
  encounter_class: string;
  period: Period;
  priority: string;
  external_identifier: string | null;
  discharge_summary_advice: string;
  patient: Patient;
  facility: Facility;
}

export interface FeedbackField {
  id: string;
  label: string;
  scale?: number;
  required: boolean;
  input_type: "rating" | "textarea";
  issue_category: string;
  max_length?: number;
}

export interface FeedbackTemplate {
  id: number;
  external_id: string;
  template_body: {
    title: string;
    fields: FeedbackField[];
    submit: {
      label: string;
      confirmation_message: string;
    };
    description: string;
  };
  reference_type: string;
  event_type: string;
}

export interface FeedbackPayload {
  encounter_id: string;
  template_id: string;
  responses: Record<string, string | number>;
}
