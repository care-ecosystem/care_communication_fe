import { Lock } from "lucide-react";

export default function HeroBanner() {
  return (
    <div className="relative bg-[#0f766e] rounded-xl overflow-hidden px-10 py-12 w-full">
      {/* Decorative circles */}
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#0d6b63] opacity-60 translate-x-1/3 -translate-y-1/4 pointer-events-none" />
      <div className="absolute right-24 bottom-0 h-52 w-52 rounded-full bg-[#0d6b63] opacity-40 translate-y-1/3 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-lg">
        {/* Security pill */}
        <div className="inline-flex items-center gap-2 bg-[#0d6b63] border border-[#1a8a80] rounded-full px-4 py-1.5 mb-6">
          <Lock className="h-3.5 w-3.5 text-amber-300" />
          <span className="text-xs text-white font-medium">
            Secure & Private · Your data is protected
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-white leading-tight mb-4">
          Help Us Improve
          <br />
          Your Care
        </h1>

        {/* Subtitle */}
        <p className="text-teal-100 text-sm leading-relaxed">
          Your honest feedback shapes the experience for every patient who walks
          through our doors. It takes less than 2 minutes.
        </p>
      </div>
    </div>
  );
}