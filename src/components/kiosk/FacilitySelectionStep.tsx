import { useEffect, useState } from "react";
import { kioskApis } from "@/apis";
import type { Facility } from "@/types/kiosk";
import { Loader2, ChevronDown, Search, Building2 } from "lucide-react";

type Props = {
  onSelect: (facility: Facility) => void;
};

export default function FacilitySelectionStep({ onSelect }: Props) {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Facility | null>(null);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await kioskApis.facilities.list();
        setFacilities(response.results);
      } catch (error) {
        console.error("Failed to fetch facilities", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  const filtered = facilities.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-sm rounded-xl p-10 flex flex-col gap-8">

        {/* Header */}
        <div className="text-center flex flex-col gap-2">
          <div className="h-14 w-14 rounded-xl bg-teal-700 flex items-center justify-center mx-auto mb-2">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Select Facility
          </h1>
          <p className="text-sm text-gray-500">
            Choose your healthcare facility to continue
          </p>
        </div>

        {/* Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Facility
          </label>

          <div className="relative">
            {/* Trigger */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full h-12 px-4 flex items-center justify-between border border-gray-200 rounded-lg bg-white text-sm text-gray-700 hover:border-teal-500 focus:outline-none focus:border-teal-500 transition-colors"
            >
              <span className={selected ? "text-gray-900" : "text-gray-400"}>
                {selected ? selected.name : "Search or select a facility..."}
              </span>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                {/* Search */}
                <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                  <Search className="h-4 w-4 text-gray-400 shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search facilities..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 text-sm outline-none placeholder:text-gray-400"
                  />
                </div>

                {/* Options */}
                <div className="max-h-60 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-6 gap-2 text-gray-400">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Loading...</span>
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="py-6 text-center text-sm text-gray-400">
                      No facilities found
                    </div>
                  ) : (
                    filtered.map((facility) => (
                      <button
                        key={facility.id}
                        type="button"
                        onClick={() => {
                          setSelected(facility);
                          setIsOpen(false);
                          setSearch("");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-teal-50 transition-colors"
                      >
                        <div className="h-8 w-8 rounded-lg bg-teal-700 flex items-center justify-center shrink-0 overflow-hidden">
                          {facility.read_cover_image_url ? (
                            <img
                              src={facility.read_cover_image_url}
                              alt={facility.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <span className="text-gray-800 font-medium">
                          {facility.name}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <button
          type="button"
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
          className="w-full h-12 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
        >
          Continue to Feedback 
        </button>

      </div>
    </div>
  );
}