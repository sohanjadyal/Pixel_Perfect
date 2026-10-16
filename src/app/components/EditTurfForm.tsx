import { useState } from "react";
import { Check, MapPin, IndianRupee, Users, ArrowLeft, Save } from "lucide-react";
import { motion } from "motion/react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useTurfs, Turf } from "../context/TurfContext";

const SPORTS = ["Cricket", "Football", "Badminton", "Pickleball", "Basketball", "Tennis", "Volleyball"];
const AMENITIES = ["Parking", "Washroom", "Cafeteria", "WiFi", "Changing Room", "First Aid", "Water", "Lights"];

interface EditTurfFormProps {
  turf: Turf;
  onBack: () => void;
}

export function EditTurfForm({ turf, onBack }: EditTurfFormProps) {
  const { updateTurf } = useTurfs();
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: turf.name,
    location: turf.location,
    price: String(turf.price),
    maxPlayers: String(turf.maxPlayers ?? 22),
    description: turf.description ?? "",
  });
  const [selectedSports, setSelectedSports] = useState<string[]>(turf.sports);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(turf.amenities);
  const [covered, setCovered] = useState<"covered" | "uncovered">(turf.covered ? "covered" : "uncovered");

  const update = (key: string, val: string) => setFormData((p) => ({ ...p, [key]: val }));
  const toggleSport = (s: string) => setSelectedSports((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);
  const toggleAmenity = (a: string) => setSelectedAmenities((p) => p.includes(a) ? p.filter((x) => x !== a) : [...p, a]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTurf(turf.id, {
      name: formData.name,
      location: formData.location,
      price: Number(formData.price),
      maxPlayers: Number(formData.maxPlayers),
      description: formData.description,
      sports: selectedSports,
      amenities: selectedAmenities,
      covered: covered === "covered",
    });
    setSaved(true);
    setTimeout(() => { setSaved(false); onBack(); }, 1800);
  };

  if (saved) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#00E676] flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(0,230,118,0.5)]">
            <Check className="w-10 h-10 text-[#121212]" strokeWidth={3} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">Changes Saved!</h3>
          <p className="text-[#757575]">Returning to My Turfs…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} className="p-2 rounded-xl border border-[#1B5E20] text-[#757575] hover:text-white hover:border-[#00E676] transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">Edit Turf</h2>
          <p className="text-[#757575] text-sm">{turf.name}</p>
        </div>
      </div>

      {/* Basic info */}
      <div className="bg-[#1E1E1E] border border-[#1B5E20] rounded-2xl p-5 space-y-4">
        <h3 className="text-white font-semibold">Basic Information</h3>

        <div className="space-y-1.5">
          <Label className="text-[#BDBDBD] text-sm">Turf Name</Label>
          <Input value={formData.name} onChange={(e) => update("name", e.target.value)} required
            className="bg-[#121212] border-[#2a2a2a] text-white focus:border-[#00E676] h-11 rounded-xl" />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[#BDBDBD] text-sm">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#424242]" />
            <Input value={formData.location} onChange={(e) => update("location", e.target.value)} required
              className="pl-10 bg-[#121212] border-[#2a2a2a] text-white focus:border-[#00E676] h-11 rounded-xl" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[#BDBDBD] text-sm">Description</Label>
          <Textarea value={formData.description} onChange={(e) => update("description", e.target.value)} rows={3}
            className="bg-[#121212] border-[#2a2a2a] text-white focus:border-[#00E676] rounded-xl resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(["covered", "uncovered"] as const).map((type) => (
            <button key={type} type="button" onClick={() => setCovered(type)}
              className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all capitalize ${
                covered === type ? "border-[#00E676] bg-[#00E676]/10 text-[#00E676]" : "border-[#2a2a2a] text-[#757575] hover:border-[#1B5E20]"
              }`}
            >
              {type === "covered" ? "🏛️ Covered" : "☀️ Open Air"}
            </button>
          ))}
        </div>
      </div>

      {/* Sports */}
      <div className="bg-[#1E1E1E] border border-[#1B5E20] rounded-2xl p-5 space-y-3">
        <h3 className="text-white font-semibold">Sports Available</h3>
        <div className="flex flex-wrap gap-2">
          {SPORTS.map((sport) => (
            <button key={sport} type="button" onClick={() => toggleSport(sport)}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                selectedSports.includes(sport)
                  ? "bg-[#00E676] border-[#00E676] text-[#121212]"
                  : "bg-[#121212] border-[#2a2a2a] text-[#757575] hover:border-[#1B5E20] hover:text-white"
              }`}
            >{sport}</button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-[#1E1E1E] border border-[#1B5E20] rounded-2xl p-5 space-y-3">
        <h3 className="text-white font-semibold">Amenities</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {AMENITIES.map((a) => (
            <button key={a} type="button" onClick={() => toggleAmenity(a)}
              className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                selectedAmenities.includes(a)
                  ? "bg-[#1B5E20]/30 border-[#00E676]/50 text-[#00E676]"
                  : "bg-[#121212] border-[#2a2a2a] text-[#757575] hover:border-[#1B5E20]"
              }`}
            >
              {selectedAmenities.includes(a) && "✓ "}{a}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-[#1E1E1E] border border-[#1B5E20] rounded-2xl p-5 space-y-4">
        <h3 className="text-white font-semibold">Pricing & Capacity</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[#BDBDBD] text-sm">Price per Hour (₹)</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#424242]" />
              <Input type="number" value={formData.price} onChange={(e) => update("price", e.target.value)} required
                className="pl-10 bg-[#121212] border-[#2a2a2a] text-white focus:border-[#00E676] h-11 rounded-xl" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[#BDBDBD] text-sm">Max Players</Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#424242]" />
              <Input type="number" value={formData.maxPlayers} onChange={(e) => update("maxPlayers", e.target.value)} required
                className="pl-10 bg-[#121212] border-[#2a2a2a] text-white focus:border-[#00E676] h-11 rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <button type="submit"
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#00E676] text-[#121212] font-bold text-base hover:bg-[#00E676]/90 shadow-[0_0_20px_rgba(0,230,118,0.25)] hover:shadow-[0_0_32px_rgba(0,230,118,0.4)] transition-all"
      >
        <Save className="w-5 h-5" /> Save Changes
      </button>
    </form>
  );
}
