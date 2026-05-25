export interface Organization{
  name: string;
}

export interface PatientCredentials{
  encounter_id: string;
  birth_year?: string;
  phone_number?: string;
}


export interface Patient{
  id: string;
  name: string;
  gender: string;
  phone_number: string;
  date_of_birth: string;
  blood_group: string;
  year_of_birth: number;
}

export interface Facility{
  id: string;
  name: string;
  cover_image_url?: string | null;
  read_cover_image_url?: string | null;
}

export interface Encounter{
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
  organizations?: Organization[];
  feedback_given?: boolean;
}

export type FeedbackInputType = "rating" | "textarea" | "text";

export interface FeedbackField {
  id: string;
  label: string;
  icon?: string; 
  description?: string;        
  comment_placeholder?: string;
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

export interface SaveFeedbackPayload{
  feedback: FeedbackEntry[];
  reference_type: string;
  encounter_id: string;
  birth_year?: string;
  phone_number?: string;
}

export type RatingOption = {
  value: number;
  label: string;
  color: string;
  bg: string;
  border: string;
};

export type RatingQuestionProps = {
  facility: Facility;
  title: string;
  description?: string;
  icon?: string;
  currentStep: number;
  totalSteps: number;
  commentPlaceholder?: string;
  initialRating?: number;
  initialComment?: string;
  required?: boolean; 
  onRatingChange?: (rating: number, comment: string) => void;
  onNext: (rating: number, comment: string) => void;
  onBack: () => void;
};
