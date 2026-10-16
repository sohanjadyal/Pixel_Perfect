import { useState } from "react";
import { Upload, X, Check, ChevronRight, ChevronLeft, MapPin, IndianRupee, Users, Image as ImageIcon, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useTurfs } from "../context/TurfContext";

const SPORTS = ["Cricket", "Football", "Badminton", "Pickleball", "Basketball", "Tennis", "Volleyball"];
const AMENITIES = ["Parking", "Washroom", "Cafeteria", "WiFi", "Changing Room", "First Aid", "Water", "Lights"];

const STEPS = [
  { id: 1, label: "Basic Info", icon: MapPin },
  { id: 2, label: "Sports & Amenities", icon: Users },
  { id: 3, label: "Pricing", icon: IndianRupee },
  { id: 4, label: "Photos & QR", icon: ImageIcon },
];

export function AddTurfForm() {
  const { addTurf } = useTurfs();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [turfImages, setTurfImages] = useState<string[]>([]);
  const [qrImage, setQrImage] = useState("");
  const [covered, setCovered] = useState<"covered" | "uncovered">("covered");
  const [formData, setFormData] = useState({ name: "", location: "", price: "", maxPlayers: "", description: "" });

  const update = (key: string, val: string) => setFormData((p) => ({ ...p, [key]: val }));

  const toggleSport = (s: string) => setSelectedSports((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);
  const toggleAmenity = (a: string) => setSelectedAmenities((p) => p.includes(a) ? p.filter((x) => x !== a) : [...p, a]);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) setTurfImages((p) => [...p, ...Array.from(files).map((f) => URL.createObjectURL(f))]);
  };

  const handleQR = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setQrImage(URL.createObjectURL(f));
  };

  const handleSubmit = () => {
    addTurf({
      name: formData.name,
      location: formData.location,
      price: Number(formData.price),
      sports: selectedSports,
      covered: covered === "covered",
      amenities: selectedAmenities,
      description: formData.description,
      maxPlayers: Number(formData.maxPlayers),
      qrCode: qrImage,
      image: turfImages[0] || "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800",
    });
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setStep(1);
      setFormData({ name: "", location: "", price: "", maxPlayers: "", description: "" });
      setSelectedSports([]);
      setSelectedAmenities([]);
      setTurfImages([]);
      setQrImage("");
    }, 3500);
  };

  const canNext = () => {
    if (step === 1) return formData.name && formData.location;
    if (step === 2) return selectedSports.length > 0;
    if (step === 3) return formData.price && formData.maxPlayers;
    return true;
  };

  if (done) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 rounded-full bg-[#00E676] flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(0,230,118,0.5)]">
            <Check className="w-10 h-10 text-[#121212]" strokeWidth={3} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Turf Listed!</h3>
          <p className="text-[#757575]">Your turf is now live and visible to players for booking.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">Add New Turf</h2>
        <p className="text-[#757575] mt-1">Fill in the details to list your turf on TurfBook</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const active = step === s.id;
          const done = step > s.id;
          return (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                active ? "bg-[#00E676] text-[#121212]" : done ? "bg-[#1B5E20]/40 text-[#00E676]" : "bg-[#1E1E1E] text-[#424242]"
              }`}>
                {done ? <Check className="w-4 h-4 flex-shrink-0" /> : <Icon className="w-4 h-4 flex-shrink-0" />}
                <span className="text-xs font-semibold hidden sm:block">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 rounded-full transition-all ${done ? "bg-[#00E676]/50" : "bg-[#1E1E1E]"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="bg-[#1E1E1E] border border-[#1B5E20] rounded-2xl p-6 space-y-5"
        >
          {/* Step 1 – Basic Info */}
          {step === 1 && (
            <>
              <h3 className="text-white font-semibold text-lg">Basic Information</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[#BDBDBD] text-sm">Turf Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="e.g., Sportobuddy Sports Arena"
                    className="bg-[#121212] border-[#2a2a2a] text-white placeholder:text-[#424242] focus:border-[#00E676] h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#BDBDBD] text-sm">Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#424242]" />
                    <Input
                      value={formData.location}
                      onChange={(e) => update("location", e.target.value)}
                      placeholder="e.g., Andheri West, Mumbai"
                      className="pl-10 bg-[#121212] border-[#2a2a2a] text-white placeholder:text-[#424242] focus:border-[#00E676] h-11 rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#BDBDBD] text-sm">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="Describe your turf — surface type, lighting, nearby landmarks..."
                    rows={3}
                    className="bg-[#121212] border-[#2a2a2a] text-white placeholder:text-[#424242] focus:border-[#00E676] rounded-xl resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#BDBDBD] text-sm">Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["covered", "uncovered"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setCovered(type)}
                        className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all capitalize ${
                          covered === type
                            ? "border-[#00E676] bg-[#00E676]/10 text-[#00E676]"
                            : "border-[#2a2a2a] text-[#757575] hover:border-[#1B5E20]"
                        }`}
                      >
                        {type === "covered" ? "🏛️ Covered" : "☀️ Open Air"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 2 – Sports & Amenities */}
          {step === 2 && (
            <>
              <h3 className="text-white font-semibold text-lg">Sports & Amenities</h3>
              <div className="space-y-5">
                <div>
                  <Label className="text-[#BDBDBD] text-sm mb-3 block">Sports Available *</Label>
                  <div className="flex flex-wrap gap-2">
                    {SPORTS.map((sport) => (
                      <button
                        key={sport}
                        type="button"
                        onClick={() => toggleSport(sport)}
                        className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                          selectedSports.includes(sport)
                            ? "bg-[#00E676] border-[#00E676] text-[#121212]"
                            : "bg-[#121212] border-[#2a2a2a] text-[#757575] hover:border-[#1B5E20] hover:text-white"
                        }`}
                      >
                        {sport}
                      </button>
                    ))}
                  </div>
                  {selectedSports.length === 0 && (
                    <p className="text-[#757575] text-xs mt-2">Select at least one sport</p>
                  )}
                </div>
                <div>
                  <Label className="text-[#BDBDBD] text-sm mb-3 block">Amenities</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {AMENITIES.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => toggleAmenity(a)}
                        className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${
                          selectedAmenities.includes(a)
                            ? "bg-[#1B5E20]/30 border-[#00E676]/50 text-[#00E676]"
                            : "bg-[#121212] border-[#2a2a2a] text-[#757575] hover:border-[#1B5E20]"
                        }`}
                      >
                        {selectedAmenities.includes(a) && <span className="mr-1">✓</span>}{a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 3 – Pricing */}
          {step === 3 && (
            <>
              <h3 className="text-white font-semibold text-lg">Pricing & Capacity</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[#BDBDBD] text-sm">Price per Hour (₹) *</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#424242]" />
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => update("price", e.target.value)}
                      placeholder="1500"
                      className="pl-10 bg-[#121212] border-[#2a2a2a] text-white placeholder:text-[#424242] focus:border-[#00E676] h-11 rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#BDBDBD] text-sm">Max Players *</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#424242]" />
                    <Input
                      type="number"
                      value={formData.maxPlayers}
                      onChange={(e) => update("maxPlayers", e.target.value)}
                      placeholder="22"
                      className="pl-10 bg-[#121212] border-[#2a2a2a] text-white placeholder:text-[#424242] focus:border-[#00E676] h-11 rounded-xl"
                    />
                  </div>
                </div>
                {formData.price && (
                  <div className="bg-[#121212] border border-[#1B5E20] rounded-xl p-4 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-[#00E676] font-bold text-lg">₹{formData.price}</p>
                      <p className="text-[#757575] text-xs">Per Hour</p>
                    </div>
                    <div>
                      <p className="text-[#00E676] font-bold text-lg">₹{Number(formData.price) * 6}</p>
                      <p className="text-[#757575] text-xs">Per Day (6h)</p>
                    </div>
                    <div>
                      <p className="text-[#00E676] font-bold text-lg">₹{Number(formData.price) * 30 * 6}</p>
                      <p className="text-[#757575] text-xs">Monthly Est.</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Step 4 – Photos & QR */}
          {step === 4 && (
            <>
              <h3 className="text-white font-semibold text-lg">Photos & Payment QR</h3>
              <div className="space-y-5">
                {/* Turf images */}
                <div>
                  <Label className="text-[#BDBDBD] text-sm mb-2 block">Turf Photos</Label>
                  <label
                    htmlFor="turf-images"
                    className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-[#2a2a2a] rounded-xl cursor-pointer hover:border-[#00E676] hover:bg-[#00E676]/5 transition-all"
                  >
                    <Upload className="w-6 h-6 text-[#424242] mb-1.5" />
                    <p className="text-[#757575] text-sm">Click to upload photos</p>
                    <p className="text-[#424242] text-xs">PNG, JPG up to 10MB</p>
                    <input id="turf-images" type="file" multiple accept="image/*" onChange={handleImages} className="hidden" />
                  </label>
                  {turfImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {turfImages.map((img, idx) => (
                        <div key={idx} className="relative group aspect-square">
                          <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => setTurfImages((p) => p.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* QR Code */}
                <div>
                  <Label className="text-[#BDBDBD] text-sm mb-2 block">Payment QR Code</Label>
                  {qrImage ? (
                    <div className="flex items-center gap-4 bg-[#121212] border border-[#1B5E20] rounded-xl p-4">
                      <img src={qrImage} alt="QR" className="w-24 h-24 object-contain rounded-lg bg-white p-1" />
                      <div>
                        <p className="text-white text-sm font-medium">QR uploaded</p>
                        <p className="text-[#757575] text-xs mb-2">Shown to players at payment step</p>
                        <button onClick={() => setQrImage("")} className="text-red-400 text-xs hover:text-red-300">Remove</button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="qr-upload"
                      className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-[#2a2a2a] rounded-xl cursor-pointer hover:border-[#00E676] hover:bg-[#00E676]/5 transition-all"
                    >
                      <QrCode className="w-6 h-6 text-[#424242] mb-1.5" />
                      <p className="text-[#757575] text-sm">Upload your PhonePe / UPI QR</p>
                      <input id="qr-upload" type="file" accept="image/*" onChange={handleQR} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex gap-3">
        {step > 1 && (
          <button
            onClick={() => setStep((p) => p - 1)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#2a2a2a] text-[#BDBDBD] hover:border-[#1B5E20] hover:text-white text-sm font-semibold transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        )}
        <button
          onClick={() => step < 4 ? setStep((p) => p + 1) : handleSubmit()}
          disabled={!canNext()}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#00E676] text-[#121212] font-bold text-sm hover:bg-[#00E676]/90 shadow-[0_0_20px_rgba(0,230,118,0.25)] hover:shadow-[0_0_32px_rgba(0,230,118,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {step === 4 ? (
            <><Check className="w-4 h-4" /> Submit Turf</>
          ) : (
            <>Continue <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}
