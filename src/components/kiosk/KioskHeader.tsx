import { useEffect, useState } from "react";
import type { Facility } from "@/types/kiosk";

type Props = {
  facility: Facility | null;
};

export default function KioskHeader({ facility }: Props) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full border-b border-gray-200 pb-5 mb-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between">

          {/* Left Section */}
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-[#0f766e] flex items-center justify-center shadow-sm overflow-hidden">
              {facility?.read_cover_image_url ? (
                <img
                  src={facility.read_cover_image_url}
                  alt={facility.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2967/2967350.png"
                  alt="Healthcare"
                  className="w-8 h-8 object-contain"
                />
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#115e59] leading-tight">
                {facility?.name ?? "Healthcare Facility"}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Patient Feedback Kiosk
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-700">{time}</p>
            <p className="text-sm text-gray-400">Secure Session</p>
          </div>

        </div>
      </div>
    </div>
  );
}