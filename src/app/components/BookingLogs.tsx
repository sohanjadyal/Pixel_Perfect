import { motion } from "motion/react";
import { Calendar, Clock, User, Phone, DollarSign, Check, X, AlertCircle } from "lucide-react";

const mockBookings = [
  {
    id: 1,
    playerName: "Rahul Sharma",
    phone: "+91 98765 43210",
    turfName: "Regional Sports Arena",
    date: "Feb 16, 2026",
    time: "6:00 PM - 7:00 PM",
    amount: 1000,
    status: "confirmed",
  },
  {
    id: 2,
    playerName: "Priya Patel",
    phone: "+91 98765 43211",
    turfName: "Elite Cricket Stadium",
    date: "Feb 17, 2026",
    time: "7:00 PM - 8:00 PM",
    amount: 1500,
    status: "confirmed",
  },
  {
    id: 3,
    playerName: "Amit Kumar",
    phone: "+91 98765 43212",
    turfName: "Regional Sports Arena",
    date: "Feb 18, 2026",
    time: "8:00 PM - 9:00 PM",
    amount: 1000,
    status: "pending",
  },
  {
    id: 4,
    playerName: "Sneha Reddy",
    phone: "+91 98765 43213",
    turfName: "Metro Sports Complex",
    date: "Feb 19, 2026",
    time: "5:00 PM - 6:00 PM",
    amount: 1200,
    status: "confirmed",
  },
  {
    id: 5,
    playerName: "Vikram Singh",
    phone: "+91 98765 43214",
    turfName: "Champions Ground",
    date: "Feb 20, 2026",
    time: "6:00 PM - 7:00 PM",
    amount: 1100,
    status: "cancelled",
  },
];

export function BookingLogs() {
  const getStatusBadge = (status: string) => {
    const configs = {
      confirmed: {
        bg: "bg-[#1B5E20]",
        text: "text-[#00E676]",
        icon: Check,
      },
      pending: {
        bg: "bg-[#2A2A2A]",
        text: "text-[#BDBDBD]",
        icon: AlertCircle,
      },
      cancelled: {
        bg: "bg-[#3A1A1A]",
        text: "text-[#FF6B6B]",
        icon: X,
      },
    };

    const config = configs[status as keyof typeof configs];
    const Icon = config.icon;

    return (
      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
        <Icon className="w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-white mb-2">Booking Logs</h2>
          <p className="text-[#BDBDBD] text-lg">View all your turf bookings</p>
        </div>
        
        <div className="flex gap-3">
          <select className="bg-[#1E1E1E] text-white px-4 py-2 rounded-xl border border-[#1B5E20] focus:border-[#00E676] focus:outline-none focus:ring-2 focus:ring-[#00E676]/20 transition-all duration-300">
            <option>All Status</option>
            <option>Confirmed</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </select>
          
          <button className="px-6 py-2 bg-[#00E676] text-[#121212] rounded-xl font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,230,118,0.6)]">
            Export
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1E1E1E] rounded-xl p-4 border border-[#1B5E20]">
          <p className="text-[#BDBDBD] text-sm mb-1">Total Bookings</p>
          <p className="text-white text-2xl font-bold">5</p>
        </div>
        <div className="bg-[#1E1E1E] rounded-xl p-4 border border-[#1B5E20]">
          <p className="text-[#BDBDBD] text-sm mb-1">Revenue Generated</p>
          <p className="text-[#00E676] text-2xl font-bold">₹5,800</p>
        </div>
        <div className="bg-[#1E1E1E] rounded-xl p-4 border border-[#1B5E20]">
          <p className="text-[#BDBDBD] text-sm mb-1">Pending Payments</p>
          <p className="text-[#BDBDBD] text-2xl font-bold">₹1,000</p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-[#1E1E1E] rounded-2xl border border-[#1B5E20] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1B5E20]">
                <th className="text-left p-4 text-[#BDBDBD] font-semibold">Player</th>
                <th className="text-left p-4 text-[#BDBDBD] font-semibold">Turf</th>
                <th className="text-left p-4 text-[#BDBDBD] font-semibold">Date & Time</th>
                <th className="text-left p-4 text-[#BDBDBD] font-semibold">Amount</th>
                <th className="text-left p-4 text-[#BDBDBD] font-semibold">Status</th>
                <th className="text-left p-4 text-[#BDBDBD] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockBookings.map((booking, index) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-[#1B5E20] hover:bg-[#1A1A1A] transition-colors duration-300"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1B5E20] flex items-center justify-center">
                        <User className="w-5 h-5 text-[#00E676]" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{booking.playerName}</p>
                        <p className="text-[#BDBDBD] text-sm flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {booking.phone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-white">{booking.turfName}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-white flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#00E676]" />
                        {booking.date}
                      </p>
                      <p className="text-[#BDBDBD] text-sm flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {booking.time}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-[#00E676] font-bold flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {booking.amount}
                    </p>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="p-4">
                    <button className="text-[#00E676] hover:text-[#00E676]/80 transition-colors duration-300 font-semibold">
                      View Details
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}