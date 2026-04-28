export interface PatientCredentials {
  patient_id: string;
  birth_year: string;
}

export interface Patient {
  id: string;
  name: string;
  gender: string;
  phone_number: string;
  date_of_birth: string;
  blood_group: string;
  year_of_birth: number;
}

export interface Facility {
  id: string;
  name: string;
}

export interface Encounter {
  id: string;
  status: string;
  encounter_class: string;
  period: { start: string };
  priority: string;
  external_identifier: string | null;
  discharge_summary_advice: string | null;
  patient: Patient;
  facility: Facility;
  created_date: string;
  modified_date: string;
  tags: string[];
  current_location: string | null;
  care_team: unknown[];
}

export type FeedbackInputType = "rating" | "textarea" | "text";

export interface FeedbackField {
  id: string;
  label: string;
  input_type: FeedbackInputType;
  scale?: number;
  required: boolean;
  max_length?: number;
  issue_category: string;
}

export interface FeedbackTemplateBody {
  template_type: string;
  title: string;
  description: string;
  fields: FeedbackField[];
  submit: {
    label: string;
    confirmation_message: string;
  };
}

export interface FeedbackTemplate {
  name: string;
  channel: string;
  template_id: string;
  template_body: FeedbackTemplateBody;
  reference_type: string;
  event_type: string;
  language: string;
  active: boolean;
  version: number;
}

export interface FeedbackEntry {
  issue_category: string;
  rating?: number;
  comment?: string;
}

export interface SaveFeedbackPayload {
  feedback: FeedbackEntry[];
  reference_id: string;
  reference_type: string;
  patient_id: string;
  birth_year: string;
}
