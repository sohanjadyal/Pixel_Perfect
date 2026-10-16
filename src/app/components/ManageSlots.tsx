import { useState } from "react";
import { Calendar, Clock, MapPin, User, Phone, SlidersHorizontal, Search, CheckCircle2, AlertCircle, XCircle, PlayCircle } from "lucide-react";
import { motion } from "motion/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const mockBookings = [
  { id: 1, turfImage: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800", turfName: "Sportobuddy Sports Arena", location: "Andheri West, Mumbai", date: "2026-02-15", timeSlot: "10:00 AM – 11:00 AM", playerName: "Rahul Kumar", playerPhone: "+91 9876543210", paymentStatus: "Paid", status: "Booked" },
  { id: 2, turfImage: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800", turfName: "Lucky Sports Hub", location: "Chandivali, Andheri East, Mumbai", date: "2026-02-16", timeSlot: "6:00 PM – 7:00 PM", playerName: "Amit Sharma", playerPhone: "+91 9876543211", paymentStatus: "Pending", status: "Pending" },
  { id: 3, turfImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800", turfName: "Prime Turf", location: "Marol, Andheri East, Mumbai", date: "2026-02-10", timeSlot: "4:00 PM – 5:00 PM", playerName: "Vikas Patel", playerPhone: "+91 9876543212", paymentStatus: "Paid", status: "Played" },
  { id: 4, turfImage: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800", turfName: "Sportobuddy Sports Arena", location: "Andheri West, Mumbai", date: "2026-02-12", timeSlot: "3:00 PM – 4:00 PM", playerName: "Sanjay Reddy", playerPhone: "+91 9876543213", paymentStatus: "Refunded", status: "Cancelled" },
  { id: 5, turfImage: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800", turfName: "Score", location: "Marwah House, Marol, Andheri East, Mumbai", date: "2026-02-18", timeSlot: "7:00 AM – 8:00 AM", playerName: "Kiran Singh", playerPhone: "+91 9876543214", paymentStatus: "Paid", status: "Booked" },
  { id: 6, turfImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800", turfName: "Prime Turf", location: "Marol, Andheri East, Mumbai", date: "2026-02-20", timeSlot: "5:00 PM – 6:00 PM", playerName: "Manoj Tiwari", playerPhone: "+91 9876543215", paymentStatus: "Paid", status: "Booked" },
];

const STATUS_CONFIG = {
  Booked:    { icon: CheckCircle2, color: "text-[#00E676]", bg: "bg-[#00E676]/10 border-[#00E676]/30" },
  Pending:   { icon: AlertCircle,  color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
  Played:    { icon: PlayCircle,   color: "text-blue-400",  bg: "bg-blue-400/10 border-blue-400/30" },
  Cancelled: { icon: XCircle,      color: "text-red-400",   bg: "bg-red-400/10 border-red-400/30" },
} as const;

const PAYMENT_CONFIG = {
  Paid:     "bg-[#00E676]/10 border-[#00E676]/30 text-[#00E676]",
  Pending:  "bg-yellow-400/10 border-yellow-400/30 text-yellow-400",
  Refunded: "bg-blue-400/10 border-blue-400/30 text-blue-400",
} as const;

export function ManageSlots() {
  const [turfFilter, setTurfFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const uniqueTurfs = Array.from(new Set(mockBookings.map((b) => b.turfName)));

  const filtered = mockBookings.filter((b) => {
    if (turfFilter !== "all" && b.turfName !== turfFilter) return false;
    if (paymentFilter !== "all" && b.paymentStatus.toLowerCase() !== paymentFilter) return false;
    if (statusFilter !== "all" && b.status.toLowerCase() !== statusFilter) return false;
    if (search && !b.playerName.toLowerCase().includes(search.toLowerCase()) && !b.turfName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    total: mockBookings.length,
    booked: mockBookings.filter((b) => b.status === "Booked").length,
    pending: mockBookings.filter((b) => b.status === "Pending").length,
    played: mockBookings.filter((b) => b.status === "Played").length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Manage Slots</h2>
          <p className="text-[#757575] mt-1">Track all bookings across your turfs</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
            showFilters ? "bg-[#00E676]/10 border-[#00E676]/50 text-[#00E676]" : "border-[#1B5E20] text-[#BDBDBD] hover:border-[#00E676]/50"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Summary pills */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", value: counts.total, color: "text-white" },
          { label: "Booked", value: counts.booked, color: "text-[#00E676]" },
          { label: "Pending", value: counts.pending, color: "text-yellow-400" },
          { label: "Played", value: counts.played, color: "text-blue-400" },
        ].map((s) => (
          <div key={s.label} className="bg-[#1E1E1E] border border-[#1B5E20] rounded-xl p-3 text-center">
            <p className={`font-bold text-xl ${s.color}`}>{s.value}</p>
            <p className="text-[#757575] text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#424242]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by player or turf name..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#1E1E1E] border border-[#1B5E20] rounded-xl text-white placeholder:text-[#424242] text-sm focus:outline-none focus:border-[#00E676] transition-all"
          />
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#1E1E1E] border border-[#1B5E20] rounded-xl p-4"
          >
            <Select value={turfFilter} onValueChange={setTurfFilter}>
              <SelectTrigger className="bg-[#121212] border-[#2a2a2a] text-white h-10 rounded-lg">
                <SelectValue placeholder="All Turfs" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E1E1E] border-[#1B5E20]">
                <SelectItem value="all">All Turfs</SelectItem>
                {uniqueTurfs.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-[#121212] border-[#2a2a2a] text-white h-10 rounded-lg">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E1E1E] border-[#1B5E20]">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="played">Played</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="bg-[#121212] border-[#2a2a2a] text-white h-10 rounded-lg">
                <SelectValue placeholder="All Payments" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E1E1E] border-[#1B5E20]">
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        )}
      </div>

      {/* Bookings list */}
      {filtered.length === 0 ? (
        <div className="bg-[#1E1E1E] border border-[#1B5E20] rounded-2xl p-12 text-center">
          <p className="text-[#757575]">No bookings match your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b, i) => {
            const sc = STATUS_CONFIG[b.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.Pending;
            const StatusIcon = sc.icon;
            const pc = PAYMENT_CONFIG[b.paymentStatus as keyof typeof PAYMENT_CONFIG] ?? PAYMENT_CONFIG.Pending;
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-[#1E1E1E] border border-[#1B5E20] hover:border-[#00E676]/40 rounded-2xl overflow-hidden flex flex-col sm:flex-row transition-all group"
              >
                {/* Image strip */}
                <div className="relative w-full sm:w-32 h-24 sm:h-auto flex-shrink-0">
                  <img src={b.turfImage} alt={b.turfName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40 hidden sm:block" />
                </div>

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Turf + player */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-white font-semibold text-sm line-clamp-1">{b.turfName}</p>
                    <div className="flex items-center gap-1.5 text-[#757575] text-xs">
                      <MapPin className="w-3 h-3 text-[#00E676] flex-shrink-0" />
                      <span className="truncate">{b.location}</span>
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <span className="flex items-center gap-1 text-[#BDBDBD] text-xs">
                        <User className="w-3 h-3" />{b.playerName}
                      </span>
                      <span className="flex items-center gap-1 text-[#BDBDBD] text-xs">
                        <Phone className="w-3 h-3" />{b.playerPhone}
                      </span>
                    </div>
                  </div>

                  {/* Date/time */}
                  <div className="text-xs space-y-1 flex-shrink-0">
                    <div className="flex items-center gap-1.5 text-white">
                      <Calendar className="w-3.5 h-3.5 text-[#00E676]" />
                      {new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                    <div className="flex items-center gap-1.5 text-[#BDBDBD]">
                      <Clock className="w-3.5 h-3.5 text-[#00E676]" />
                      {b.timeSlot}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-row sm:flex-col items-center gap-2 flex-shrink-0">
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold ${sc.bg} ${sc.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />{b.status}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${pc}`}>
                      {b.paymentStatus}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
