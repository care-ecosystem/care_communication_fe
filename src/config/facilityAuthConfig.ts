type FacilityAuthConfig = {
  requireDob: boolean;
  requirePhone: boolean;
};

export const facilityAuthConfig: Record<string, FacilityAuthConfig> = {
  "13efd12a-2148-4615-9dec-0303df48466c": {
    requireDob: true,
    requirePhone: false,
  },

  "fbdef672-9d6b-4d6e-aa54-99fd866b0c9d": {
    requireDob: false,
    requirePhone: true,
  },
};