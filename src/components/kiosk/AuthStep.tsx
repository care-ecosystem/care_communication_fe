import { Input } from "@/components/ui/input";
import { Loader2, QrCode } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { kioskApis } from "@/apis";
import type { Encounter, Facility, PatientCredentials } from "@/types/kiosk";
import { Separator } from "@/components/ui/separator";
import KioskHeader from "@/components/kiosk/KioskHeader";
import HeroBanner from "@/components/kiosk/HeroBanner";
import { useTranslation } from "react-i18next";
import { I18NNAMESPACE } from "@/lib/contants";



interface AuthStepProps {
  facility: Facility | null;
  authConfig: {
    requireDob: boolean;
    requirePhone: boolean;
  } | null;
  onSuccess: (credentials: PatientCredentials, encounters: Encounter[]) => void;
}

interface EmojiRating {
  emoji: string;
  line1: string;
  line2?: string;
}

const EMOJI_RATINGS: EmojiRating[] = [
  { emoji: "😞", line1: "Very", line2: "poor" },
  { emoji: "😟", line1: "Below", line2: "average" },
  { emoji: "😐", line1: "Average" },
  { emoji: "😊", line1: "Good" },
  { emoji: "🤩", line1: "Excellent" },
];

export default function AuthStep({ facility, authConfig, onSuccess }: AuthStepProps) {
  const { t } = useTranslation(I18NNAMESPACE);
  const formSchema = z.object({
    encounter_id: z
      .string()
      .trim()
      .nonempty(t("patient_uhid_required")),

    birth_year: authConfig?.requireDob
      ? z.string().trim().nonempty(t("birth_year_required"))
      : z.string().optional(),

    phone_number: authConfig?.requirePhone
      ? z.string().trim().nonempty(t("phone_number_required"))
      : z.string().optional(),
  });
  type FormValues = z.infer<typeof formSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { encounter_id: "", birth_year: "", phone_number: "" },
  });
  
  const { mutate: authenticate, isPending } = useMutation({
    mutationFn: (credentials: PatientCredentials) => {
      return kioskApis.encounters.list(
        credentials.encounter_id,
        credentials.birth_year,
        credentials.phone_number,
      );
    },
    onSuccess: (encounters, credentials) => {
      onSuccess(credentials, encounters);
    },
    onError: (err: any) => {
      const error =
        err?.error?.detail || t("failed_to_submit");
      toast.error(error);
    },
  });

  function onSubmit(values: FormValues) {
    const payload: PatientCredentials = {
      encounter_id: values.encounter_id,
    };

    if (values.birth_year?.trim()) {
      payload.birth_year = values.birth_year.trim();
    }

    if (values.phone_number?.trim()) {
      payload.phone_number = values.phone_number.trim();
    }

    authenticate(payload);
  }

  function handleQrPlaceholder() {
    toast.info(t("qr_coming_soon"))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <KioskHeader facility={facility} />
      <div className="flex-1 flex flex-col items-center py-12 px-4">
        <div className="w-full max-w-3xl flex flex-col gap-6">
          <HeroBanner />

          {/* Form Card */}
          <div className="w-full bg-white rounded-2xl p-8 flex flex-col gap-6">
            <div>
              <h4 className="text-xl font-bold text-gray-900">{t("patient_verification")}</h4>
              <p className="text-sm text-gray-500 mt-1">
               {t("patient_verification_desc")}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

              {/* Patient UHID */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-semibold uppercase tracking-wider text-gray-600"
                  htmlFor="patient-uuid"
                >
                  {t("patient_uhid")} <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    id="patient-uuid"
                    {...register("encounter_id")}
                    placeholder={t("patient_uhid_placeholder")}
                    disabled={isPending}
                    autoComplete="off"
                    spellCheck={false}
                    className="h-14 rounded-lg text-base font-mono flex-1 focus-visible:ring-[#0f766e]"
                  />
                  <button
                    type="button"
                    onClick={handleQrPlaceholder}
                    title={t("scan_qr")}
                    className="h-14 w-14 shrink-0 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <QrCode className="h-5 w-5" />
                  </button>
                </div>
                {errors.encounter_id && (
                  <p className="text-xs text-red-500">{errors.encounter_id.message}</p>
                )}
                <a
                  href="#"
                  className="text-xs text-[#0f766e] hover:underline w-fit"
                  onClick={(e) => e.preventDefault()}
                >
                  🔍 {t("where_encounter_id")}
                </a>
              </div>

              {/* Birth Year */}
              {authConfig?.requireDob && (
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs font-semibold uppercase tracking-wider text-gray-600"
                    htmlFor="patient-birth-year"
                  >
                    {t("birth_year")} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="patient-birth-year"
                    type="text"
                    inputMode="numeric"
                    placeholder={t("birth_year_placeholder")}
                    {...register("birth_year")}
                    disabled={isPending}
                    autoComplete="off"
                    className="h-14 rounded-lg text-base focus-visible:ring-[#0f766e]"
                  />
                  {errors.birth_year && (
                    <p className="text-xs text-red-500">{errors.birth_year.message}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    {t("birth_year_hint")}
                  </p>
                </div>
              )}
              {/* Divider */}
              {authConfig?.requireDob && authConfig?.requirePhone && (
                <div className="relative flex items-center justify-center">
                  <Separator className="w-full" />
                  <span className="absolute bg-white px-4 text-xs text-gray-400">
                    {t("or_verify_phone")}
                  </span>
                </div>
              )}

              {/* Phone Number */}
              {authConfig?.requirePhone && (
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs font-semibold uppercase tracking-wider text-gray-600"
                    htmlFor="patient-phone-number"
                  >
                   {t("phone_number")}
                  </label>
                  <Input
                    id="patient-phone-number"
                    type="tel"
                    inputMode="numeric"
                    placeholder={t("phone_number_placeholder")}
                    {...register("phone_number")}
                    disabled={isPending}
                    autoComplete="off"
                    className="h-14 rounded-lg text-base focus-visible:ring-[#0f766e]"
                  />
                  {errors.phone_number && (
                    <p className="text-xs text-red-500">{errors.phone_number.message}</p>
                  )}
                </div>
              )}
              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full h-14 rounded-xl bg-[#0f766e] hover:bg-[#0d6b63] text-white font-semibold text-base transition-colors disabled:opacity-70 flex items-center justify-center gap-2 mt-1"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("verifying")}
                  </>
                ) : (
                  t("continue_to_feedback")
                )}
              </button>
            </form>
          </div>

          {/* Quick emoji rating */}
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-sm text-gray-500">{t("quick_impression")}</p>
            <div className="flex items-center gap-3">
              {EMOJI_RATINGS.map((item) => (
                <button
                  key={item.line1}
                  type="button"
                  className="flex flex-col items-center gap-1.5 group"
                  onClick={() => toast.info(`${t("quick_rating")}: ${item.line1} ${item.line2 ?? ""}`)}
                >
                  <span className="text-3xl h-14 w-14 rounded-xl border border-gray-200 bg-white flex items-center justify-center group-hover:border-[#0f766e] group-hover:bg-teal-50 transition-colors">
                    {item.emoji}
                  </span>
                  <span className="text-xs text-gray-400 text-center leading-tight">
                    {item.line1}
                    {item.line2 && (
                      <span className="block">{item.line2}</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              {t("tap_emoji")}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}