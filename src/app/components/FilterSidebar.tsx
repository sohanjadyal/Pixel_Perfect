import { useState } from "react";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface FilterState {
  sortBy: string;
  offers: boolean;
  covered: boolean;
  uncovered: boolean;
  open24x7: boolean;
  availableOnly: boolean;
  sports: string[];
  amenities: string[];
}

interface FilterSidebarProps {
  filters: FilterState;
  onApply: (filters: FilterState) => void;
}

const SPORTS = ["Cricket", "Football", "Badminton", "Pickleball", "Basketball"];
const AMENITIES = ["Parking", "Washroom", "Cafeteria", "Changing Room", "First Aid"];

const DEFAULT_FILTERS: FilterState = {
  sortBy: "distance",
  offers: false,
  covered: false,
  uncovered: false,
  open24x7: false,
  availableOnly: false,
  sports: [],
  amenities: [],
};

export function FilterSidebar({ filters, onApply }: FilterSidebarProps) {
  const [draft, setDraft] = useState<FilterState>(filters);
  const [showAdvanced, setShowAdvanced] = useState(true);

  const toggleSport = (sport: string) => {
    setDraft((prev) => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter((s) => s !== sport)
        : [...prev.sports, sport],
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setDraft((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleReset = () => {
    setDraft(DEFAULT_FILTERS);
    onApply(DEFAULT_FILTERS);
  };

  const handleApply = () => {
    onApply(draft);
  };

  const activeCount = [
    draft.offers,
    draft.covered,
    draft.uncovered,
    draft.open24x7,
    draft.availableOnly,
    draft.sports.length > 0,
    draft.amenities.length > 0,
    draft.sortBy !== "distance",
  ].filter(Boolean).length;

  return (
    <div className="bg-[#1E1E1E] rounded-[14px] p-6 card-elevation sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-white">Filters</h3>
          {activeCount > 0 && (
            <span className="bg-[#00E676] text-[#121212] text-xs font-bold px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        <Button
          onClick={handleReset}
          variant="ghost"
          size="sm"
          className="text-[#00E676] hover:text-[#00E676]/80"
        >
          Reset All
        </Button>
      </div>

      {/* Sorting */}
      <div className="mb-6">
        <Label className="text-white font-semibold mb-3 block">Sort By</Label>
        <div className="space-y-2">
          {[
            { value: "distance", label: "Distance (Nearest First)" },
            { value: "price-high", label: "Price: High to Low" },
            { value: "price-low", label: "Price: Low to High" },
            { value: "rating", label: "Rating (Highest First)" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setDraft((p) => ({ ...p, sortBy: value }))}
              className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${
                draft.sortBy === value
                  ? "bg-[#00E676]/15 border-[#00E676] text-[#00E676] font-semibold"
                  : "border-[#1B5E20] text-[#BDBDBD] hover:border-[#00E676]/50 hover:text-white"
              }`}
            >
              {draft.sortBy === value && <span className="mr-2">✓</span>}{label}
            </button>
          ))}
        </div>
      </div>

      <Separator className="my-6 bg-[#1B5E20]" />

      {/* Advanced Filters */}
      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full mb-4"
        >
          <Label className="text-white font-semibold cursor-pointer">Advanced Filters</Label>
          {showAdvanced ? (
            <ChevronUp className="h-5 w-5 text-[#00E676]" />
          ) : (
            <ChevronDown className="h-5 w-5 text-[#00E676]" />
          )}
        </button>

        {showAdvanced && (
          <div className="space-y-4">
            {/* Quick Filters */}
            <div className="space-y-3">
              {[
                { id: "offers", label: "Offers Available", key: "offers" as const },
                { id: "covered", label: "Covered", key: "covered" as const },
                { id: "uncovered", label: "Uncovered", key: "uncovered" as const },
                { id: "24x7", label: "24/7 Open", key: "open24x7" as const },
                { id: "available", label: "Available Turf Only", key: "availableOnly" as const },
              ].map(({ id, label, key }) => (
                <div key={id} className="flex items-center space-x-2">
                  <Checkbox
                    id={id}
                    checked={draft[key]}
                    onCheckedChange={(checked) =>
                      setDraft((p) => ({ ...p, [key]: checked as boolean }))
                    }
                    className="border-[#1B5E20]"
                  />
                  <Label htmlFor={id} className="text-[#BDBDBD] cursor-pointer">{label}</Label>
                </div>
              ))}
            </div>

            <Separator className="my-4 bg-[#1B5E20]" />

            {/* Sports */}
            <div>
              <Label className="text-white font-semibold mb-3 block">Type of Sport</Label>
              <div className="space-y-2">
                {SPORTS.map((sport) => (
                  <div key={sport} className="flex items-center space-x-2">
                    <Checkbox
                      id={`sport-${sport}`}
                      checked={draft.sports.includes(sport)}
                      onCheckedChange={() => toggleSport(sport)}
                      className="border-[#1B5E20]"
                    />
                    <Label htmlFor={`sport-${sport}`} className="text-[#BDBDBD] cursor-pointer">
                      {sport}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-4 bg-[#1B5E20]" />

            {/* Amenities */}
            <div>
              <Label className="text-white font-semibold mb-3 block">Amenities</Label>
              <div className="space-y-2">
                {AMENITIES.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={draft.amenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                      className="border-[#1B5E20]"
                    />
                    <Label htmlFor={`amenity-${amenity}`} className="text-[#BDBDBD] cursor-pointer">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Separator className="my-6 bg-[#1B5E20]" />

      <Button
        onClick={handleApply}
        className="w-full bg-[#00E676] text-[#121212] hover:bg-[#00E676]/90 neon-glow-hover font-semibold"
      >
        Apply Filters {activeCount > 0 ? `(${activeCount})` : ""}
      </Button>
    </div>
  );
}
