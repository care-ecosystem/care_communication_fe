type FacilityAuthConfig = {
  requireDob: boolean;
  requirePhone: boolean;
};

export const facilityAuthConfig: Record<string, FacilityAuthConfig> = {
  "baf1571c-bc1b-4c25-9d42-3c3361c58d54": {
    requireDob: true,
    requirePhone: false,
  },
  "cba196f0-bbda-42cb-bdd4-bcac8528484c": {
    requireDob: false,
    requirePhone: true,
  },
};