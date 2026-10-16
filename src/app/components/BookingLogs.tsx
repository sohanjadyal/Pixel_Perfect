import { motion } from "motion/react";
import { Calendar, Clock, User, Phone, IndianRupee, Check, X, AlertCircle, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface Booking {
  id: number;
  playerName: string;
  email: string;
  phone: string;
  turfName: string;
  date: string;
  time: string;
  amount: number;
  paymentStatus: string;
  status: string;
  rejectionReason?: string;
}

const mockBookings: Booking[] = [
  {
    id: 1,
    playerName: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    phone: "+91 98765 43210",
    turfName: "Sportobuddy Sports Arena",
    date: "Feb 16, 2026",
    time: "6:00 PM - 7:00 PM",
    amount: 1000,
    paymentStatus: "paid",
    status: "confirmed",
  },
  {
    id: 2,
    playerName: "Priya Patel",
    email: "priya.patel@gmail.com",
    phone: "+91 98765 43211",
    turfName: "Prime Turf",
    date: "Feb 17, 2026",
    time: "7:00 PM - 8:00 PM",
    amount: 1500,
    paymentStatus: "paid",
    status: "confirmed",
  },
  {
    id: 3,
    playerName: "Amit Kumar",
    email: "amit.kumar@gmail.com",
    phone: "+91 98765 43212",
    turfName: "Sportobuddy Sports Arena",
    date: "Feb 18, 2026",
    time: "8:00 PM - 9:00 PM",
    amount: 1000,
    paymentStatus: "paid",
    status: "pending",
  },
  {
    id: 4,
    playerName: "Sneha Reddy",
    email: "sneha.reddy@gmail.com",
    phone: "+91 98765 43213",
    turfName: "Score",
    date: "Feb 19, 2026",
    time: "5:00 PM - 6:00 PM",
    amount: 1200,
    paymentStatus: "paid",
    status: "pending",
  },
  {
    id: 5,
    playerName: "Vikram Singh",
    email: "vikram.singh@gmail.com",
    phone: "+91 98765 43214",
    turfName: "Classic 7 Sports Turf",
    date: "Feb 20, 2026",
    time: "6:00 PM - 7:00 PM",
    amount: 1100,
    paymentStatus: "paid",
    status: "rejected",
    rejectionReason: "Turf maintenance scheduled",
  },
];

function sendConfirmationEmail(booking: Booking) {
  const subject = encodeURIComponent(`✅ Booking Confirmed – ${booking.turfName}`);
  const body = encodeURIComponent(
    `Dear ${booking.playerName},\n\n` +
    `Your booking has been CONFIRMED!\n\n` +
    `📍 Turf: ${booking.turfName}\n` +
    `📅 Date: ${booking.date}\n` +
    `🕐 Time: ${booking.time}\n` +
    `💰 Amount Paid: ₹${booking.amount}\n\n` +
    `Please arrive 10 minutes early. Bring your booking confirmation.\n\n` +
    `See you on the field! 🏟️\n\n` +
    `— TurfBook Team`
  );
  window.open(`mailto:${booking.email}?subject=${subject}&body=${body}`, "_blank");
}

function sendRejectionEmail(booking: Booking, reason: string) {
  const subject = encodeURIComponent(`❌ Booking Update – ${booking.turfName}`);
  const body = encodeURIComponent(
    `Dear ${booking.playerName},\n\n` +
    `Unfortunately, your booking has been REJECTED.\n\n` +
    `📍 Turf: ${booking.turfName}\n` +
    `📅 Date: ${booking.date}\n` +
    `🕐 Time: ${booking.time}\n` +
    `💰 Amount: ₹${booking.amount}\n\n` +
    `Reason: ${reason}\n\n` +
    `If you paid, your refund will be processed within 3–5 business days.\n` +
    `We apologize for the inconvenience. Please try booking another slot.\n\n` +
    `— TurfBook Team`
  );
  window.open(`mailto:${booking.email}?subject=${subject}&body=${body}`, "_blank");
}

export function BookingLogs() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const handleApprove = (bookingId: number) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setBookings((prev) =>
      prev.map((b) => b.id === bookingId ? { ...b, status: "confirmed" } : b)
    );

    sendConfirmationEmail(booking);
    toast.success(`Booking approved! Confirmation email opened for ${booking.playerName}.`, {
      description: booking.email,
      icon: "✅",
    });
  };

  const handleRejectClick = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setShowRejectDialog(true);
  };

  const handleRejectConfirm = () => {
    if (!selectedBookingId || !rejectionReason.trim()) return;

    const booking = bookings.find((b) => b.id === selectedBookingId);
    if (!booking) return;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBookingId ? { ...b, status: "rejected", rejectionReason } : b
      )
    );

    sendRejectionEmail(booking, rejectionReason);
    toast.error(`Booking rejected. Rejection email opened for ${booking.playerName}.`, {
      description: `Reason: ${rejectionReason}`,
      icon: "❌",
    });

    setShowRejectDialog(false);
    setRejectionReason("");
    setSelectedBookingId(null);
  };

  const filteredBookings = bookings.filter((b) =>
    statusFilter === "All Status" ? true : b.status === statusFilter.toLowerCase()
  );

  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.amount, 0);

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { bg: string; text: string; Icon: typeof Check }> = {
      confirmed: { bg: "bg-[#1B5E20]", text: "text-[#00E676]", Icon: Check },
      pending: { bg: "bg-yellow-500/20", text: "text-yellow-500", Icon: AlertCircle },
      rejected: { bg: "bg-[#3A1A1A]", text: "text-[#FF6B6B]", Icon: X },
    };
    const { bg, text, Icon } = configs[status] ?? configs.pending;
    return (
      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${bg} ${text}`}>
        <Icon className="w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">Booking Logs</h2>
          <p className="text-[#BDBDBD] text-sm sm:text-base">Approve or reject bookings — players are notified by email</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1E1E1E] text-white px-3 sm:px-4 py-2 rounded-xl border border-[#1B5E20] focus:border-[#00E676] focus:outline-none focus:ring-2 focus:ring-[#00E676]/20 transition-all duration-300 text-sm"
          >
            <option>All Status</option>
            <option>Confirmed</option>
            <option>Pending</option>
            <option>Rejected</option>
          </select>
          <button className="px-4 sm:px-6 py-2 bg-[#00E676] text-[#121212] rounded-xl font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,230,118,0.6)] text-sm">
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-[#1E1E1E] rounded-xl p-3 sm:p-4 border border-[#1B5E20]">
          <p className="text-[#BDBDBD] text-xs sm:text-sm mb-1">Total Bookings</p>
          <p className="text-white text-xl sm:text-2xl font-bold">{bookings.length}</p>
        </div>
        <div className="bg-[#1E1E1E] rounded-xl p-3 sm:p-4 border border-[#1B5E20]">
          <p className="text-[#BDBDBD] text-xs sm:text-sm mb-1">Revenue Generated</p>
          <p className="text-[#00E676] text-xl sm:text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-[#1E1E1E] rounded-xl p-3 sm:p-4 border border-[#1B5E20]">
          <p className="text-[#BDBDBD] text-xs sm:text-sm mb-1">Pending Approvals</p>
          <p className="text-yellow-400 text-xl sm:text-2xl font-bold">{pendingCount}</p>
        </div>
      </div>

      {/* Email notice */}
      <div className="flex items-center gap-2 bg-[#1B5E20]/20 border border-[#1B5E20] rounded-xl px-4 py-3 text-sm text-[#BDBDBD]">
        <Mail className="w-4 h-4 text-[#00E676] flex-shrink-0" />
        Approving or rejecting a booking opens a pre-filled email to the player in your default mail app.
      </div>

      {/* Table */}
      <div className="bg-[#1E1E1E] rounded-xl sm:rounded-2xl border border-[#1B5E20] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1B5E20]">
                <th className="text-left p-3 sm:p-4 text-[#BDBDBD] font-semibold text-xs sm:text-sm">Player</th>
                <th className="text-left p-3 sm:p-4 text-[#BDBDBD] font-semibold text-xs sm:text-sm hidden lg:table-cell">Turf</th>
                <th className="text-left p-3 sm:p-4 text-[#BDBDBD] font-semibold text-xs sm:text-sm">Date & Time</th>
                <th className="text-left p-3 sm:p-4 text-[#BDBDBD] font-semibold text-xs sm:text-sm">Amount</th>
                <th className="text-left p-3 sm:p-4 text-[#BDBDBD] font-semibold text-xs sm:text-sm">Status</th>
                <th className="text-left p-3 sm:p-4 text-[#BDBDBD] font-semibold text-xs sm:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, index) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-[#1B5E20]/50 hover:bg-[#1A1A1A] transition-colors duration-300"
                >
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1B5E20] flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#00E676]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-semibold text-xs sm:text-sm truncate">{booking.playerName}</p>
                        <p className="text-[#BDBDBD] text-xs flex items-center gap-1">
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{booking.email}</span>
                        </p>
                        <p className="text-[#BDBDBD] text-xs flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{booking.phone}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 hidden lg:table-cell">
                    <p className="text-white text-xs sm:text-sm">{booking.turfName}</p>
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="flex flex-col gap-0.5 sm:gap-1">
                      <p className="text-white flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#00E676] flex-shrink-0" />
                        <span className="truncate">{booking.date}</span>
                      </p>
                      <p className="text-[#BDBDBD] text-xs flex items-center gap-1 sm:gap-1.5">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{booking.time}</span>
                      </p>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4">
                    <p className="text-[#00E676] font-bold flex items-center gap-1 text-xs sm:text-sm">
                      <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      {booking.amount}
                    </p>
                  </td>
                  <td className="p-3 sm:p-4">
                    {getStatusBadge(booking.status)}
                    {booking.status === "rejected" && booking.rejectionReason && (
                      <p className="text-[#FF6B6B] text-xs mt-1 max-w-[140px] truncate" title={booking.rejectionReason}>
                        {booking.rejectionReason}
                      </p>
                    )}
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="flex flex-wrap gap-2">
                      {booking.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(booking.id)}
                            className="bg-[#00E676] text-[#121212] font-semibold text-xs px-3"
                          >
                            <Check className="w-3 h-3 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleRejectClick(booking.id)}
                            className="bg-[#FF6B6B] text-white font-semibold text-xs px-3 hover:bg-red-500"
                          >
                            <X className="w-3 h-3 mr-1" /> Reject
                          </Button>
                        </>
                      )}
                      {booking.status !== "pending" && (
                        <button
                          onClick={() => {
                            const b = booking;
                            sendConfirmationEmail(b);
                          }}
                          className="flex items-center gap-1 text-xs text-[#BDBDBD] hover:text-[#00E676] transition-colors"
                          title="Resend email"
                        >
                          <Mail className="w-3 h-3" /> Resend
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#BDBDBD]">
                    No bookings found for selected status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-[#1E1E1E] border-[#1B5E20] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Reject Booking</DialogTitle>
            <DialogDescription className="text-[#BDBDBD]">
              Provide a reason — it will be included in the rejection email sent to the player.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejectionReason" className="text-white">Rejection Reason</Label>
              <Input
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Turf maintenance scheduled"
                className="bg-[#121212] border-[#1B5E20] text-white focus:border-[#00E676]"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              onClick={() => setShowRejectDialog(false)}
              variant="outline"
              className="border-[#1B5E20] text-white bg-transparent hover:bg-[#1B5E20]/20 hover:border-[#00E676] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectConfirm}
              disabled={!rejectionReason.trim()}
              className="bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
            >
              Reject & Notify Player
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
