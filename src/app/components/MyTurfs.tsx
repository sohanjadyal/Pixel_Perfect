import { MapPin, Edit2, Star, TrendingUp, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { useTurfs, Turf } from "../context/TurfContext";

interface MyTurfsProps {
  onEdit?: (turf: Turf) => void;
}

export function MyTurfs({ onEdit }: MyTurfsProps) {
  const { turfs, updateTurf } = useTurfs();

  const handleToggle = (id: number, current: string | undefined) => {
    updateTurf(id, { status: current === "Active" ? "Inactive" : "Active", isOpen: current !== "Active" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">My Turfs</h2>
          <p className="text-[#757575] mt-1">{turfs.length} turfs registered</p>
        </div>
        <div className="flex items-center gap-2 bg-[#1B5E20]/20 border border-[#1B5E20] rounded-xl px-4 py-2">
          <TrendingUp className="w-4 h-4 text-[#00E676]" />
          <span className="text-[#00E676] text-sm font-medium">
            {turfs.filter((t) => t.status === "Active").length} Active
          </span>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {turfs.map((turf, i) => {
          const isActive = turf.status !== "Inactive";
          return (
            <motion.div
              key={turf.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className={`bg-[#1E1E1E] rounded-2xl overflow-hidden border transition-all duration-300 group ${
                isActive ? "border-[#1B5E20] hover:border-[#00E676]/60 hover:shadow-[0_0_24px_rgba(0,230,118,0.1)]" : "border-[#2a2a2a] opacity-70"
              }`}
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={turf.image}
                  alt={turf.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Status pill */}
                <div className="absolute top-3 left-3">
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                    isActive ? "bg-[#00E676]/20 border border-[#00E676]/50 text-[#00E676]" : "bg-[#2a2a2a]/80 border border-white/10 text-[#757575]"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#00E676] animate-pulse" : "bg-[#757575]"}`} />
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Covered badge */}
                <div className="absolute top-3 right-3">
                  <span className="bg-black/50 backdrop-blur-sm border border-white/10 text-white text-xs px-2 py-1 rounded-lg">
                    {turf.covered ? "Covered" : "Open Air"}
                  </span>
                </div>

                {/* Rating */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-[#00E676] text-[#00E676]" />
                  <span className="text-white font-bold text-sm">{turf.rating ?? "—"}</span>
                  <span className="text-[#757575] text-xs">({turf.reviews ?? 0})</span>
                </div>

                {/* Price */}
                <div className="absolute bottom-3 right-3 bg-[#00E676] text-[#121212] font-bold text-sm px-3 py-1 rounded-lg">
                  ₹{turf.price}/hr
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-white font-bold text-base leading-tight line-clamp-1">{turf.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-[#757575] text-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#00E676] flex-shrink-0" />
                    <span className="truncate">{turf.location}</span>
                  </div>
                </div>

                {/* Sports tags */}
                <div className="flex flex-wrap gap-1.5">
                  {turf.sports.map((s) => (
                    <span key={s} className="px-2.5 py-0.5 bg-[#00E676]/10 border border-[#00E676]/20 text-[#00E676] text-xs rounded-full font-medium">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-[#1B5E20]/50">
                  <div className="text-center">
                    <p className="text-white font-bold text-sm">{turf.totalBookings ?? 0}</p>
                    <p className="text-[#757575] text-[10px] mt-0.5">Bookings</p>
                  </div>
                  <div className="text-center border-x border-[#1B5E20]/50">
                    <p className="text-white font-bold text-sm">{turf.amenities?.length ?? 0}</p>
                    <p className="text-[#757575] text-[10px] mt-0.5">Amenities</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-sm">{turf.maxPlayers ?? 22}</p>
                    <p className="text-[#757575] text-[10px] mt-0.5">Max Players</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleToggle(turf.id, turf.status)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all flex-1 justify-center ${
                      isActive
                        ? "border-[#00E676]/30 text-[#00E676] hover:bg-[#00E676]/10"
                        : "border-red-500/30 text-red-400 hover:bg-red-500/10"
                    }`}
                  >
                    {isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    {isActive ? "Visible" : "Hidden"}
                  </button>
                  <button
                    onClick={() => onEdit?.(turf)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#1B5E20] text-[#BDBDBD] hover:border-[#00E676] hover:text-white text-xs font-semibold transition-all flex-1 justify-center"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
