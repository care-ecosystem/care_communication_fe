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

const formSchema = z.object({
  encounter_id: z.string().trim().nonempty("Encounter ID is required"),
  birth_year: z.string(),
  phone_number: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface AuthStepProps {
  facility: Facility | null;
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

export default function AuthStep({ facility, onSuccess }: AuthStepProps) {
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
        err?.error?.detail || "Something went wrong. Please try again.";
      toast.error(error);
    },
  });

  function onSubmit(values: FormValues) {
    authenticate({
      encounter_id: values.encounter_id,
      birth_year: values.birth_year,
      phone_number: values.phone_number,
    });
  }

  function handleQrPlaceholder() {
    toast.info("QR scanner coming soon. Please enter the Encounter ID manually.");
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
              <h4 className="text-xl font-bold text-gray-900">Patient Verification</h4>
              <p className="text-sm text-gray-500 mt-1">
                Enter your details below, or scan the QR code from your discharge summary to get started.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

              {/* Patient UHID */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-semibold uppercase tracking-wider text-gray-600"
                  htmlFor="patient-uuid"
                >
                  Patient UHID <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    id="patient-uuid"
                    {...register("encounter_id")}
                    placeholder="e.g. 23a72471e17f448c..."
                    disabled={isPending}
                    autoComplete="off"
                    spellCheck={false}
                    className="h-14 rounded-lg text-base font-mono flex-1 focus-visible:ring-[#0f766e]"
                  />
                  <button
                    type="button"
                    onClick={handleQrPlaceholder}
                    disabled={isPending}
                    title="Scan QR Code"
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
                  🔍 Where do I find my Encounter ID?
                </a>
              </div>

              {/* Birth Year */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-semibold uppercase tracking-wider text-gray-600"
                  htmlFor="patient-birth-year"
                >
                  Birth Year <span className="text-red-500">*</span>
                </label>
                <Input
                  id="patient-birth-year"
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 1985"
                  {...register("birth_year")}
                  disabled={isPending}
                  autoComplete="off"
                  className="h-14 rounded-lg text-base focus-visible:ring-[#0f766e]"
                />
                {errors.birth_year && (
                  <p className="text-xs text-red-500">{errors.birth_year.message}</p>
                )}
                <p className="text-xs text-gray-400">
                  This is used only to verify your identity — never shared
                </p>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <Separator className="w-full" />
                <span className="absolute bg-white px-4 text-xs text-gray-400">
                  or verify with phone number instead
                </span>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-semibold uppercase tracking-wider text-gray-600"
                  htmlFor="patient-phone-number"
                >
                  Phone Number
                </label>
                <Input
                  id="patient-phone-number"
                  type="tel"
                  inputMode="numeric"
                  placeholder="e.g. 9876543210"
                  {...register("phone_number")}
                  disabled={isPending}
                  autoComplete="off"
                  className="h-14 rounded-lg text-base focus-visible:ring-[#0f766e]"
                />
                {errors.phone_number && (
                  <p className="text-xs text-red-500">{errors.phone_number.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full h-14 rounded-xl bg-[#0f766e] hover:bg-[#0d6b63] text-white font-semibold text-base transition-colors disabled:opacity-70 flex items-center justify-center gap-2 mt-1"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying…
                  </>
                ) : (
                  "Continue to Feedback →"
                )}
              </button>
            </form>
          </div>

          {/* Quick emoji rating */}
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-sm text-gray-500">Or share a quick overall impression</p>
            <div className="flex items-center gap-3">
              {EMOJI_RATINGS.map((item) => (
                <button
                  key={item.line1}
                  type="button"
                  className="flex flex-col items-center gap-1.5 group"
                  onClick={() => toast.info(`Quick rating: ${item.line1} ${item.line2 ?? ""}`)}
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
              Tap an emoji to submit a quick rating without the full form
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}