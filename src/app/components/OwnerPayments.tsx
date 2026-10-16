import { useState } from "react";
import { Check, X, Clock, Calendar, User, Phone, IndianRupee, QrCode, TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import paymentQR from "@/imports/AccountQRCodeHDFC_Bank_-_8818_DARK_THEME.png";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "./ui/alert-dialog";

const initialPayments = [
  { id: 1, bookingRef: "TRF-001-240215", playerName: "Rahul Kumar", playerPhone: "+91 9876543210", turfName: "Sportobuddy Sports Arena", date: "2026-02-15", timeSlots: ["10:00 AM – 11:00 AM", "11:00 AM – 12:00 PM"], amount: 3000, paymentStatus: "Pending", screenshot: true },
  { id: 2, bookingRef: "TRF-002-240216", playerName: "Amit Sharma", playerPhone: "+91 9876543211", turfName: "Prime Turf", date: "2026-02-16", timeSlots: ["6:00 PM – 7:00 PM"], amount: 1200, paymentStatus: "Pending", screenshot: true },
  { id: 3, bookingRef: "TRF-003-240214", playerName: "Vikas Patel", playerPhone: "+91 9876543212", turfName: "Lucky Sports Hub", date: "2026-02-14", timeSlots: ["4:00 PM – 5:00 PM"], amount: 1400, paymentStatus: "Confirmed", screenshot: false },
  { id: 4, bookingRef: "TRF-004-240213", playerName: "Sanjay Reddy", playerPhone: "+91 9876543213", turfName: "Sportobuddy Sports Arena", date: "2026-02-13", timeSlots: ["3:00 PM – 4:00 PM"], amount: 1500, paymentStatus: "Rejected", screenshot: false },
];

const STATUS_STYLES: Record<string, string> = {
  Pending:   "bg-yellow-400/10 border-yellow-400/30 text-yellow-400",
  Confirmed: "bg-[#00E676]/10 border-[#00E676]/30 text-[#00E676]",
  Rejected:  "bg-red-400/10 border-red-400/30 text-red-400",
};

export function OwnerPayments() {
  const [payments, setPayments] = useState(initialPayments);
  const [filter, setFilter] = useState("all");

  const confirm = (id: number) => {
    setPayments((p) => p.map((x) => x.id === id ? { ...x, paymentStatus: "Confirmed" } : x));
    toast.success("Payment confirmed! Booking is now active.");
  };

  const reject = (id: number) => {
    setPayments((p) => p.map((x) => x.id === id ? { ...x, paymentStatus: "Rejected" } : x));
    toast.error("Payment rejected. Player will be notified.");
  };

  const filtered = filter === "all" ? payments : payments.filter((p) => p.paymentStatus.toLowerCase() === filter);

  const totalConfirmed = payments.filter((p) => p.paymentStatus === "Confirmed").reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter((p) => p.paymentStatus === "Pending").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">Payments</h2>
        <p className="text-[#757575] mt-1">Verify and manage payment receipts from players</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#1E1E1E] border border-[#1B5E20] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#00E676]" />
            <span className="text-[#757575] text-xs">Confirmed</span>
          </div>
          <p className="text-[#00E676] font-bold text-xl">₹{totalConfirmed.toLocaleString()}</p>
        </div>
        <div className="bg-[#1E1E1E] border border-[#1B5E20] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <span className="text-[#757575] text-xs">Pending</span>
          </div>
          <p className="text-yellow-400 font-bold text-xl">₹{totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-[#1E1E1E] border border-[#1B5E20] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <QrCode className="w-4 h-4 text-[#BDBDBD]" />
            <span className="text-[#757575] text-xs">Your QR</span>
          </div>
          <p className="text-white font-bold text-sm">HDFC · PhonePe</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {["all", "pending", "confirmed", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
              filter === f
                ? "bg-[#00E676] text-[#121212]"
                : "bg-[#1E1E1E] border border-[#1B5E20] text-[#757575] hover:text-white"
            }`}
          >
            {f === "all" ? `All (${payments.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${payments.filter((p) => p.paymentStatus.toLowerCase() === f).length})`}
          </button>
        ))}
      </div>

      {/* Payment cards */}
      <div className="space-y-4">
        {filtered.map((payment, i) => (
          <motion.div
            key={payment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            className="bg-[#1E1E1E] border border-[#1B5E20] rounded-2xl overflow-hidden"
          >
            {/* Card header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1B5E20]/50 bg-[#1a1a1a]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1B5E20]/40 flex items-center justify-center">
                  <span className="text-[#00E676] text-sm font-bold">{payment.playerName[0]}</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{payment.playerName}</p>
                  <p className="text-[#757575] text-xs">{payment.bookingRef}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#00E676] font-bold text-lg">₹{payment.amount.toLocaleString()}</span>
                <span className={`px-3 py-1 rounded-lg border text-xs font-semibold ${STATUS_STYLES[payment.paymentStatus]}`}>
                  {payment.paymentStatus}
                </span>
              </div>
            </div>

            {/* Card body */}
            <div className="p-5 flex flex-col lg:flex-row gap-5">
              {/* Left – booking details */}
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#121212] border border-[#1B5E20]/50 rounded-xl p-3 space-y-1">
                    <p className="text-[#757575] text-[11px] uppercase tracking-wider">Turf</p>
                    <p className="text-white text-sm font-medium leading-snug">{payment.turfName}</p>
                  </div>
                  <div className="bg-[#121212] border border-[#1B5E20]/50 rounded-xl p-3 space-y-1">
                    <p className="text-[#757575] text-[11px] uppercase tracking-wider">Date</p>
                    <p className="text-white text-sm font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#00E676]" />
                      {new Date(payment.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <div className="bg-[#121212] border border-[#1B5E20]/50 rounded-xl p-3 space-y-1">
                    <p className="text-[#757575] text-[11px] uppercase tracking-wider">Player</p>
                    <p className="text-white text-sm font-medium flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#00E676]" />
                      {payment.playerPhone}
                    </p>
                  </div>
                  <div className="bg-[#121212] border border-[#1B5E20]/50 rounded-xl p-3 space-y-1">
                    <p className="text-[#757575] text-[11px] uppercase tracking-wider">Slots</p>
                    <p className="text-white text-sm font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#00E676]" />
                      {payment.timeSlots.length} slot{payment.timeSlots.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Time slots */}
                <div className="flex flex-wrap gap-2">
                  {payment.timeSlots.map((slot, idx) => (
                    <span key={idx} className="flex items-center gap-1 bg-[#00E676]/5 border border-[#00E676]/20 text-[#00E676] text-xs px-3 py-1.5 rounded-lg">
                      <Clock className="w-3 h-3" />{slot}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right – QR + actions (only for pending) */}
              {payment.paymentStatus === "Pending" && (
                <div className="flex flex-row lg:flex-col gap-4 items-center lg:items-stretch lg:w-52 flex-shrink-0">
                  {/* QR display */}
                  <div className="bg-[#121212] border border-[#1B5E20] rounded-xl p-3 text-center flex-shrink-0">
                    <p className="text-[#757575] text-[10px] mb-2 uppercase tracking-wider">Your Collection QR</p>
                    <div className="rounded-lg overflow-hidden border border-[#1B5E20]/50 shadow-[0_0_16px_rgba(0,230,118,0.15)]">
                      <ImageWithFallback
                        src={paymentQR}
                        alt="PhonePe – HDFC Bank QR"
                        className="w-28 h-28 lg:w-full lg:h-32 object-contain"
                      />
                    </div>
                    <p className="text-[#424242] text-[10px] mt-1.5">PhonePe · HDFC Bank</p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex lg:flex-col gap-2 flex-1 lg:flex-none">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-[#00E676] text-[#121212] font-bold text-sm py-2.5 px-4 rounded-xl hover:bg-[#00E676]/90 shadow-[0_0_16px_rgba(0,230,118,0.25)] transition-all">
                          <Check className="w-4 h-4" /> Confirm
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[#1E1E1E] border-[#1B5E20]">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Confirm Payment?</AlertDialogTitle>
                          <AlertDialogDescription className="text-[#BDBDBD]">
                            Approves the booking for {payment.playerName} — ₹{payment.amount} marked as received.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-[#121212] text-white border-[#1B5E20]">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => confirm(payment.id)} className="bg-[#00E676] text-[#121212] hover:bg-[#00E676]/90">
                            Confirm Payment
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 border border-red-500/40 text-red-400 font-bold text-sm py-2.5 px-4 rounded-xl hover:bg-red-500/10 transition-all">
                          <X className="w-4 h-4" /> Reject
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[#1E1E1E] border-[#1B5E20]">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Reject Payment?</AlertDialogTitle>
                          <AlertDialogDescription className="text-[#BDBDBD]">
                            This will reject the booking for {payment.playerName} and notify the player.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-[#121212] text-white border-[#1B5E20]">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => reject(payment.id)} className="bg-red-500 text-white hover:bg-red-600">
                            Reject Payment
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}

              {/* Status message for non-pending */}
              {payment.paymentStatus !== "Pending" && (
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium self-center ${STATUS_STYLES[payment.paymentStatus]}`}>
                  {payment.paymentStatus === "Confirmed" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  Payment {payment.paymentStatus}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-[#1E1E1E] border border-[#1B5E20] rounded-2xl p-12 text-center">
            <p className="text-[#757575]">No payments in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
