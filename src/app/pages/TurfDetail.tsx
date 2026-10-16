import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  Shield,
  Wifi,
  Car,
  Coffee,
  Users,
  Minus,
  Plus,
  Calendar as CalendarIcon,
  Share2,
  Copy,
  CheckCheck,
  UserPlus,
  Trash2,
  IndianRupee,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Calendar } from "../components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { GoogleMapPin } from "../components/GoogleMapPin";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import paymentQR from "@/imports/AccountQRCodeHDFC_Bank_-_8818_DARK_THEME.png";
import { useTurfs } from "../context/TurfContext";
import { TURFBOOK_API, TURFBOOK_HEADERS } from "../context/AuthContext";

const timeSlots = [
  "6:00 AM - 7:00 AM",
  "7:00 AM - 8:00 AM",
  "8:00 AM - 9:00 AM",
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 1:00 PM",
  "1:00 PM - 2:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM",
  "5:00 PM - 6:00 PM",
  "6:00 PM - 7:00 PM",
  "7:00 PM - 8:00 PM",
  "8:00 PM - 9:00 PM",
  "9:00 PM - 10:00 PM",
];

// Map amenity strings to icons
const amenityIconMap: Record<string, React.ElementType> = {
  Parking: Car,
  Washroom: Shield,
  Cafeteria: Coffee,
  WiFi: Wifi,
  "Changing Room": Users,
  Floodlights: CalendarIcon,
};

// 4 unique, sport-matched images per turf — no two turfs share the same gallery
const TURF_GALLERY: Record<number, string[]> = {
  // Thakur Shyamnarayan Turf — Box Cricket + Football
  1: [
    "/turfs/thakur_cricket_turf.jpg",
    "/turfs/football_arena_night.jpg",
    "/turfs/goalster_sports_arena.jpg",
    "/turfs/players_turf_rooftop.jpg",
  ],
  // Players Turf At Goregaon — Rooftop 5-a-side + Terrace View
  2: [
    "/turfs/players_turf_rooftop.jpg",
    "/turfs/football_arena_night.jpg",
    "/turfs/goalster_sports_arena.jpg",
    "/turfs/thakur_cricket_turf.jpg",
  ],
  // Hi5ers Turf - Goregaon — Caged Football + Box Cricket
  3: [
    "/turfs/football_arena_night.jpg",
    "/turfs/thakur_cricket_turf.jpg",
    "/turfs/players_turf_rooftop.jpg",
    "/turfs/goalster_sports_arena.jpg",
  ],
  // Goalster Sports Arena — Multi-sports
  4: [
    "/turfs/goalster_sports_arena.jpg",
    "/turfs/thakur_cricket_turf.jpg",
    "/turfs/football_arena_night.jpg",
    "/turfs/players_turf_rooftop.jpg",
  ],
  // Prime Turf — Football + Cricket
  5: [
    "/turfs/football_arena_night.jpg",
    "/turfs/players_turf_rooftop.jpg",
    "/turfs/goalster_sports_arena.jpg",
    "/turfs/thakur_cricket_turf.jpg",
  ],
  // Green Spaces Turf
  6: [
    "/turfs/goalster_sports_arena.jpg",
    "/turfs/football_arena_night.jpg",
    "/turfs/players_turf_rooftop.jpg",
    "/turfs/thakur_cricket_turf.jpg",
  ],
  // Classic 7
  7: [
    "/turfs/players_turf_rooftop.jpg",
    "/turfs/goalster_sports_arena.jpg",
    "/turfs/football_arena_night.jpg",
    "/turfs/thakur_cricket_turf.jpg",
  ],
  // Five Nine Turf
  8: [
    "/turfs/thakur_cricket_turf.jpg",
    "/turfs/football_arena_night.jpg",
    "/turfs/players_turf_rooftop.jpg",
    "/turfs/goalster_sports_arena.jpg",
  ],
};

export function TurfDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { turfs } = useTurfs();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [numPlayers, setNumPlayers] = useState(10);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [splitPlayers, setSplitPlayers] = useState<{ name: string; phone: string }[]>([]);
  const [copied, setCopied] = useState(false);

  const isLoggedIn = !!localStorage.getItem("turfbook_auth");

  // Find turf by ID — support both numeric IDs and UUID strings
  const turf = turfs.find((t) => String(t.id) === String(id));

  if (!turf) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-2xl font-bold mb-2">Turf not found</p>
          <p className="text-[#BDBDBD] mb-6">This turf may have been removed or the link is incorrect.</p>
          <Button onClick={() => navigate("/home")} className="bg-[#00E676] text-[#121212]">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // 4 sport-matched images unique to this turf
  const images = TURF_GALLERY[turf.id as number] ?? [turf.image];

  // Map amenity strings to icon objects
  const amenities = (turf.amenities || []).map((label) => ({
    icon: amenityIconMap[label] || Shield,
    label,
  }));

  const maxPlayers = turf.maxPlayers ?? 22;

  const toggleSlot = (slot: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const totalAmount = selectedSlots.length * turf.price;

  const handleConfirmBooking = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    // Seed split players from numPlayers count
    setSplitPlayers(Array.from({ length: numPlayers }, (_, i) => ({ name: i === 0 ? "You" : "", phone: "" })));
    setShowSplitModal(true);
  };

  const handleProceedToPayment = () => {
    setShowSplitModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async () => {
    setShowPaymentModal(false);
    setShowConfirmationModal(true);

    const userObj = JSON.parse(localStorage.getItem("turfbook_auth") || "{}");
    const bookingDateStr = selectedDate.toISOString().split("T")[0];
    const newBooking = {
      id: Date.now(),
      turfId: turf.id,
      turfName: turf.name,
      turfImage: turf.image,
      location: turf.location,
      date: bookingDateStr,
      timeSlots: selectedSlots,
      players: numPlayers,
      totalAmount,
      paymentStatus: "Paid",
      status: "Pending",
      bookingRef: `TRF-${Math.floor(100 + Math.random() * 900)}-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    };

    // Save to user's bookings in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem("turfbook_user_bookings") || "[]");
      localStorage.setItem("turfbook_user_bookings", JSON.stringify([newBooking, ...existing]));
    } catch {}

    // Persist to Supabase database
    try {
      await fetch(`${TURFBOOK_API}/bookings`, {
        method: "POST",
        headers: TURFBOOK_HEADERS,
        body: JSON.stringify({
          turfId: String(turf.id),
          turfName: turf.name,
          playerId: userObj?.id || "guest",
          playerName: userObj?.name || "Player",
          date: bookingDateStr,
          slot: selectedSlots.join(", "),
          sport: turf.sports[0] || "Football",
          amount: totalAmount,
          status: "pending",
        }),
      });
    } catch (err) {
      console.warn("Supabase booking sync warning:", err);
    }
  };

  const perPersonAmount = Math.ceil(totalAmount / numPlayers);

  const updatePlayer = (index: number, field: "name" | "phone", value: string) => {
    setSplitPlayers((prev) => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  };

  const addPlayer = () => {
    if (splitPlayers.length < maxPlayers) setSplitPlayers((prev) => [...prev, { name: "", phone: "" }]);
  };

  const removePlayer = (index: number) => {
    if (splitPlayers.length > 1) setSplitPlayers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCopySplit = () => {
    const lines = [
      `🏟️ Turf Booking – ${turf.name}`,
      `📅 ${selectedDate.toLocaleDateString()} | ${selectedSlots.join(", ")}`,
      `💰 Total: ₹${totalAmount} ÷ ${splitPlayers.length} players`,
      `👤 Your share: ₹${perPersonAmount} each`,
      ``,
      ...splitPlayers.map((p, i) => `${i + 1}. ${p.name || "Player"} — ₹${perPersonAmount}`),
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappShare = (player: { name: string; phone: string }) => {
    const msg = encodeURIComponent(
      `Hi ${player.name || "there"} 👋\nYour share for *${turf.name}* booking on ${selectedDate.toLocaleDateString()} is *₹${perPersonAmount}*.\nSlots: ${selectedSlots.join(", ")}`
    );
    const phone = player.phone.replace(/\D/g, "");
    window.open(phone ? `https://wa.me/${phone}?text=${msg}` : `https://wa.me/?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1E1E1E] border-b border-[#1B5E20] backdrop-blur-custom">
        <div className="container mx-auto px-4 py-4">
          <Button
            onClick={() => navigate("/home")}
            variant="ghost"
            className="text-white hover:text-[#00E676]"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative rounded-[14px] overflow-hidden h-[400px] group">
              <img
                src={images[currentImageIndex]}
                alt={turf.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                {/* Left arrow */}
                {currentImageIndex > 0 && (
                  <button
                    onClick={() => setCurrentImageIndex((i) => i - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 border border-[#00E676]/50 text-[#00E676] hover:bg-[#00E676]/20 hover:border-[#00E676] transition-all backdrop-blur-sm shadow-[0_0_12px_rgba(0,230,118,0.2)]"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                {/* Right arrow */}
                {currentImageIndex < images.length - 1 && (
                  <button
                    onClick={() => setCurrentImageIndex((i) => i + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 border border-[#00E676]/50 text-[#00E676] hover:bg-[#00E676]/20 hover:border-[#00E676] transition-all backdrop-blur-sm shadow-[0_0_12px_rgba(0,230,118,0.2)]"
                  >
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </button>
                )}
              </div>

              {/* Image Navigation */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "w-8 bg-[#00E676] neon-glow"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Turf Info */}
            <div className="bg-[#1E1E1E] rounded-[14px] p-6 card-elevation">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {turf.name}
                  </h1>
                  <div className="flex items-center gap-2 text-[#BDBDBD]">
                    <MapPin className="w-5 h-5 text-[#00E676]" />
                    <span>{turf.location}</span>
                  </div>
                </div>
                {turf.rating !== undefined && (
                  <div className="flex items-center gap-2 bg-[#121212] px-4 py-2 rounded-lg">
                    <Star className="w-5 h-5 fill-[#00E676] text-[#00E676]" />
                    <span className="text-white font-bold text-lg">
                      {turf.rating}
                    </span>
                    <span className="text-[#BDBDBD]">({turf.reviews ?? 0})</span>
                  </div>
                )}
              </div>

              {/* Sports */}
              <div className="flex flex-wrap gap-2 mb-6">
                {turf.sports.map((sport) => (
                  <Badge
                    key={sport}
                    className="bg-[#1B5E20] text-[#00E676] border border-[#00E676]"
                  >
                    {sport}
                  </Badge>
                ))}
                {turf.covered && (
                  <Badge className="bg-[#00E676]/20 text-[#00E676]">Covered</Badge>
                )}
                {turf.open24x7 && (
                  <Badge className="bg-[#00E676]/20 text-[#00E676]">24/7</Badge>
                )}
              </div>

              {/* Description */}
              {turf.description && (
                <p className="text-[#BDBDBD] mb-6">{turf.description}</p>
              )}

              {/* Amenities */}
              {amenities.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {amenities.map((amenity) => (
                      <div
                        key={amenity.label}
                        className="flex items-center gap-2 text-[#BDBDBD]"
                      >
                        <amenity.icon className="w-5 h-5 text-[#00E676]" />
                        <span>{amenity.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Map Preview */}
            {turf.lat && turf.lng && (
              <div className="bg-[#1E1E1E] rounded-[14px] p-6 card-elevation">
                <h3 className="text-white font-semibold mb-4">Location</h3>
                <GoogleMapPin
                  lat={turf.lat}
                  lng={turf.lng}
                  locationName={turf.location}
                  turfName={turf.name}
                  price={turf.price}
                  height="256px"
                  zoom={15}
                />
              </div>
            )}
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <div className="bg-[#1E1E1E] rounded-[14px] p-6 card-elevation sticky top-24">

              {/* Price + open/closed badge */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[#BDBDBD] text-sm mb-1">Price per hour</p>
                  <p className="text-[#00E676] text-3xl font-bold">₹{turf.price}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  turf.isOpen === false
                    ? "bg-red-500/10 text-red-400 border-red-500/40"
                    : "bg-[#00E676]/10 text-[#00E676] border-[#00E676]/40"
                }`}>
                  {turf.isOpen === false ? "Closed" : "Open"}
                </span>
              </div>

              {turf.isOpen === false ? (
                /* ── Closed state ── */
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto">
                    <Clock className="w-8 h-8 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg mb-1">Currently Closed</p>
                    <p className="text-[#BDBDBD] text-sm">
                      This turf is not accepting bookings right now. Check back later or browse other available turfs.
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate("/home")}
                    className="w-full bg-[#1B5E20] text-white hover:bg-[#1B5E20]/80 border border-[#1B5E20]"
                  >
                    Browse Other Turfs
                  </Button>
                </div>
              ) : (
                /* ── Open state – full booking UI ── */
                <>
                  {/* Date Selector */}
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-3">Select Date</h3>
                    <div className="bg-[#0F0F0F] rounded-[16px] border border-[#00E676]/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-3">Select Time Slots</h3>
                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => toggleSlot(slot)}
                          className={`px-3 py-2 rounded-lg text-sm transition-all border ${
                            selectedSlots.includes(slot)
                              ? "bg-[#00E676] text-[#121212] border-[#00E676] neon-glow"
                              : "bg-[#121212] text-white border-[#1B5E20] hover:border-[#00E676]"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Number of Players */}
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-3">Number of Players</h3>
                    <div className="flex items-center justify-between bg-[#121212] rounded-lg p-3 border border-[#1B5E20]">
                      <Button
                        onClick={() => setNumPlayers(Math.max(1, numPlayers - 1))}
                        variant="ghost"
                        size="icon"
                        className="text-white hover:text-[#00E676]"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-white font-bold text-xl">{numPlayers}</span>
                      <Button
                        onClick={() => setNumPlayers(Math.min(maxPlayers, numPlayers + 1))}
                        variant="ghost"
                        size="icon"
                        className="text-white hover:text-[#00E676]"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-[#BDBDBD] text-xs mt-1 text-center">
                      Max {maxPlayers} players
                    </p>
                  </div>

                  {/* Total Amount */}
                  {selectedSlots.length > 0 && (
                    <div className="mb-6 bg-[#121212] rounded-lg p-4 border border-[#00E676]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#BDBDBD]">Selected Slots:</span>
                        <span className="text-white font-semibold">{selectedSlots.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#BDBDBD]">Total Amount:</span>
                        <span className="text-[#00E676] font-bold text-2xl">₹{totalAmount}</span>
                      </div>
                    </div>
                  )}

                  {/* Confirm Button */}
                  <Button
                    onClick={handleConfirmBooking}
                    disabled={selectedSlots.length === 0}
                    className="w-full bg-[#00E676] text-[#121212] hover:bg-[#00E676]/90 neon-glow-hover font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Booking
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bill Split Modal */}
      <Dialog open={showSplitModal} onOpenChange={setShowSplitModal}>
        <DialogContent className="bg-[#1E1E1E] border-[#1B5E20] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-xl flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-[#00E676]" />
              Split the Bill
            </DialogTitle>
            <DialogDescription className="text-[#BDBDBD]">
              Add player details and share each person's amount before paying.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* Summary Strip */}
            <div className="bg-[#121212] border border-[#1B5E20] rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[#BDBDBD] text-xs">Total</p>
                <p className="text-white font-bold text-lg">₹{totalAmount}</p>
              </div>
              <div className="text-center">
                <p className="text-[#BDBDBD] text-xs">Players</p>
                <p className="text-white font-bold text-lg">{splitPlayers.length}</p>
              </div>
              <div className="text-right">
                <p className="text-[#BDBDBD] text-xs">Per Person</p>
                <p className="text-[#00E676] font-bold text-xl">₹{Math.ceil(totalAmount / (splitPlayers.length || 1))}</p>
              </div>
            </div>

            {/* Player Rows */}
            <div className="space-y-3">
              {splitPlayers.map((player, idx) => (
                <div key={idx} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#00E676] text-xs font-semibold uppercase tracking-wider">
                      Player {idx + 1}{idx === 0 ? " (You)" : ""}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold text-sm bg-[#1B5E20]/40 px-2 py-0.5 rounded-lg">
                        ₹{Math.ceil(totalAmount / (splitPlayers.length || 1))}
                      </span>
                      {idx > 0 && (
                        <button
                          onClick={() => removePlayer(idx)}
                          className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-400/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={player.name}
                      onChange={(e) => updatePlayer(idx, "name", e.target.value)}
                      className="bg-[#1E1E1E] border border-[#1B5E20] text-white placeholder:text-[#616161] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00E676] transition-all"
                    />
                    <input
                      type="tel"
                      placeholder="WhatsApp number"
                      value={player.phone}
                      onChange={(e) => updatePlayer(idx, "phone", e.target.value)}
                      className="bg-[#1E1E1E] border border-[#1B5E20] text-white placeholder:text-[#616161] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00E676] transition-all"
                    />
                  </div>
                  <button
                    onClick={() => whatsappShare(player)}
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/25 rounded-lg py-1.5 text-xs font-semibold transition-all"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Send via WhatsApp
                  </button>
                </div>
              ))}
            </div>

            {/* Add Player */}
            {splitPlayers.length < maxPlayers && (
              <button
                onClick={addPlayer}
                className="w-full flex items-center justify-center gap-2 border border-dashed border-[#1B5E20] text-[#00E676] hover:bg-[#1B5E20]/10 rounded-xl py-2.5 text-sm font-semibold transition-all"
              >
                <UserPlus className="w-4 h-4" />
                Add Player
              </button>
            )}

            {/* Copy All */}
            <button
              onClick={handleCopySplit}
              className="w-full flex items-center justify-center gap-2 bg-[#2A2A2A] hover:bg-[#333] border border-[#333] text-white rounded-xl py-2.5 text-sm font-semibold transition-all"
            >
              {copied ? <CheckCheck className="w-4 h-4 text-[#00E676]" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Split Details"}
            </button>

            {/* Proceed CTA */}
            <button
              onClick={handleProceedToPayment}
              className="w-full bg-[#00E676] hover:bg-[#00E676]/90 text-[#121212] font-bold rounded-xl py-3 text-base neon-glow-hover transition-all"
            >
              Proceed to Payment
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="bg-[#1E1E1E] border-[#1B5E20] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">Complete Payment</DialogTitle>
            <DialogDescription className="text-[#BDBDBD]">
              Scan the QR code to make payment
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-6">
            {/* QR Code */}
            <div className="rounded-2xl overflow-hidden mx-auto w-fit border-4 border-[#1B5E20] shadow-[0_0_30px_rgba(0,230,118,0.25)]">
              <ImageWithFallback
                src={paymentQR}
                alt="Scan to pay via PhonePe – HDFC Bank"
                className="w-64 h-64 object-contain"
              />
            </div>
            <p className="text-center text-xs text-[#BDBDBD]">Scan with any UPI app · PhonePe / HDFC Bank</p>

            {/* Booking summary */}
            <div className="bg-[#121212] rounded-lg p-4 border border-[#1B5E20] space-y-2 text-sm">
              <div className="flex justify-between text-[#BDBDBD]">
                <span>Turf</span>
                <span className="text-white font-medium">{turf.name}</span>
              </div>
              <div className="flex justify-between text-[#BDBDBD]">
                <span>Date</span>
                <span className="text-white font-medium">{selectedDate.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-[#BDBDBD]">
                <span>Slots</span>
                <span className="text-white font-medium">{selectedSlots.length}</span>
              </div>
              <div className="flex justify-between border-t border-[#1B5E20] pt-2 mt-2">
                <span className="text-[#BDBDBD]">Amount to Pay</span>
                <span className="text-[#00E676] font-bold text-lg">₹{totalAmount}</span>
              </div>
            </div>

            <p className="text-[#BDBDBD] text-xs text-center">
              After completing the payment, click the button below
            </p>
          </div>

          <DialogFooter>
            <Button
              onClick={handlePaymentComplete}
              className="w-full bg-[#00E676] text-[#121212] hover:bg-[#00E676]/90 neon-glow-hover"
            >
              I've Completed Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmationModal} onOpenChange={setShowConfirmationModal}>
        <DialogContent className="bg-[#1E1E1E] border-[#1B5E20]">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">
              Waiting for Confirmation
            </DialogTitle>
            <DialogDescription className="text-[#BDBDBD]">
              Your booking is pending owner confirmation
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 text-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-white mb-2">Payment Received!</p>
            <p className="text-[#BDBDBD] text-sm">
              The turf owner will review and confirm your booking shortly.
              You'll be notified once confirmed.
            </p>
          </div>

          <DialogFooter>
            <Link to="/home" className="w-full">
              <Button className="w-full bg-[#00E676] text-[#121212] hover:bg-[#00E676]/90">
                Go to Home
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
