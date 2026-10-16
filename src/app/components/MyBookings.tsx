import { useState } from "react";
import { Calendar, Clock, MapPin, Phone, X, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { NotificationContainer, NotificationProps } from "./NotificationToast";

const mockBookings = [
  {
    id: 1,
    turfName: "Sportobuddy Sports Arena",
    turfImage: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800",
    location: "Andheri West, Mumbai",
    date: "2026-02-15",
    timeSlots: ["10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM"],
    players: 12,
    totalAmount: 3000,
    paymentStatus: "Paid",
    status: "Confirmed",
    bookingRef: "TRF-001-240215",
  },
  {
    id: 2,
    turfName: "Lucky Sports Hub",
    turfImage: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800",
    location: "Chandivali, Andheri East, Mumbai",
    date: "2026-02-16",
    timeSlots: ["6:00 PM - 7:00 PM"],
    players: 22,
    totalAmount: 2000,
    paymentStatus: "Paid",
    status: "Pending",
    bookingRef: "TRF-002-240216",
  },
  {
    id: 3,
    turfName: "Prime Turf",
    turfImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    location: "Marol, Andheri East, Mumbai",
    date: "2026-02-10",
    timeSlots: ["4:00 PM - 5:00 PM"],
    players: 10,
    totalAmount: 1200,
    paymentStatus: "Paid",
    status: "Played",
    bookingRef: "TRF-003-240210",
  },
  {
    id: 4,
    turfName: "Score",
    turfImage: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800",
    location: "Marwah House, Marol, Andheri East, Mumbai",
    date: "2026-02-12",
    timeSlots: ["3:00 PM - 4:00 PM"],
    players: 16,
    totalAmount: 1800,
    paymentStatus: "Refunded",
    status: "Rejected",
    rejectionReason: "Turf maintenance scheduled for that day",
    bookingRef: "TRF-004-240212",
  },
];

export function MyBookings() {
  const [allBookings, setAllBookings] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("turfbook_user_bookings") || "[]");
      return [...stored, ...mockBookings];
    } catch {
      return mockBookings;
    }
  });
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = (
    type: "success" | "error" | "warning" | "info",
    title: string,
    message: string
  ) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, type, title, message, onClose: removeNotification }]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const filteredBookings = allBookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status.toLowerCase() === filter.toLowerCase();
  });

  const handleCancelBooking = (bookingId: number | string) => {
    setAllBookings((prev) =>
      prev.map((b) => (String(b.id) === String(bookingId) ? { ...b, status: "Cancelled" } : b))
    );
    try {
      const stored = JSON.parse(localStorage.getItem("turfbook_user_bookings") || "[]");
      const updated = stored.map((b: any) =>
        String(b.id) === String(bookingId) ? { ...b, status: "Cancelled" } : b
      );
      localStorage.setItem("turfbook_user_bookings", JSON.stringify(updated));
    } catch {}
    addNotification("success", "Booking Cancelled", "Your booking has been cancelled successfully.");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-[#00E676]/20 text-[#00E676] border-[#00E676]";
      case "pending":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500";
      case "played":
        return "bg-blue-500/20 text-blue-500 border-blue-500";
      case "rejected":
        return "bg-red-500/20 text-red-500 border-red-500";
      case "cancelled":
        return "bg-red-500/20 text-red-500 border-red-500";
      default:
        return "bg-[#BDBDBD]/20 text-[#BDBDBD] border-[#BDBDBD]";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-[#00E676]/20 text-[#00E676]";
      case "pending":
        return "bg-yellow-500/20 text-yellow-500";
      case "refunded":
        return "bg-blue-500/20 text-blue-500";
      default:
        return "bg-[#BDBDBD]/20 text-[#BDBDBD]";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Notification Container */}
        <NotificationContainer notifications={notifications} onClose={removeNotification} />

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
            <p className="text-[#BDBDBD]">Track and manage all your turf bookings</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["all", "confirmed", "pending", "played", "rejected", "cancelled"].map((status) => (
            <Button
              key={status}
              onClick={() => setFilter(status)}
              variant="outline"
              className={`capitalize whitespace-nowrap ${ filter === status ? "bg-[#00E676] text-[#121212] border-[#00E676]" : "border-[#1B5E20] text-white hover:border-[#00E676]" } text-[#000000]`}
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Bookings Grid */}
        {filteredBookings.length === 0 ? (
          <div className="bg-[#121212] rounded-[14px] p-12 text-center card-elevation">
            <p className="text-[#BDBDBD] text-lg">No bookings found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-[#1E1E1E] rounded-[14px] overflow-hidden card-elevation hover:border-[#00E676] border-2 border-transparent transition-all"
              >
                {/* Image Header */}
                <div className="relative h-32">
                  <img
                    src={booking.turfImage}
                    alt={booking.turfName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-white font-bold text-lg">
                      {booking.turfName}
                    </h3>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-[#BDBDBD] text-sm">
                    <MapPin className="w-4 h-4 text-[#00E676]" />
                    <span>{booking.location}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-[#00E676]" />
                      <span className="text-white">
                        {new Date(booking.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#BDBDBD]">Players:</span>
                      <span className="text-white font-semibold">
                        {booking.players}
                      </span>
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <p className="text-[#BDBDBD] text-xs mb-2">Time Slots:</p>
                    <div className="flex flex-wrap gap-2">
                      {booking.timeSlots.map((slot, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 bg-[#121212] px-3 py-1 rounded-full border border-[#1B5E20]"
                        >
                          <Clock className="w-3 h-3 text-[#00E676]" />
                          <span className="text-white text-xs">{slot}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {booking.status === "Rejected" && booking.rejectionReason && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-500 text-xs font-semibold mb-1">Rejection Reason</p>
                          <p className="text-[#BDBDBD] text-xs">{booking.rejectionReason}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pending Owner Approval Notice */}
                  {booking.status === "Pending" && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-yellow-500 text-xs font-semibold mb-1">Awaiting Confirmation</p>
                          <p className="text-[#BDBDBD] text-xs">Your booking is pending owner approval. You'll be notified once confirmed.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-[#1B5E20]">
                    <div>
                      <p className="text-[#BDBDBD] text-xs">Booking Ref</p>
                      <p className="text-white text-sm font-mono">
                        {booking.bookingRef}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                        {booking.paymentStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-[#BDBDBD] text-sm">Total Amount</p>
                      <p className="text-[#00E676] text-2xl font-bold">
                        ₹{booking.totalAmount}
                      </p>
                    </div>

                    {(booking.status === "Pending" || booking.status === "Confirmed") && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#1E1E1E] border-[#1B5E20]">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">
                              Cancel Booking?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-[#BDBDBD]">
                              Are you sure you want to cancel this booking? This action
                              cannot be undone. Refund will be processed as per policy.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-[#121212] text-white border-[#1B5E20]">
                              Keep Booking
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleCancelBooking(booking.id)}
                              className="bg-red-500 text-white hover:bg-red-600"
                            >
                              Cancel Booking
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}