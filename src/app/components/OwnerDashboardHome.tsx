import { motion } from "motion/react";
import { TrendingUp, Calendar, IndianRupee, Users, ArrowUpRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const stats = [
  { label: "Total Revenue", value: "₹45,280", change: "+12.5%", sub: "vs last month", icon: IndianRupee, up: true },
  { label: "Bookings Today", value: "23", change: "+8.2%", sub: "vs yesterday", icon: Calendar, up: true },
  { label: "Active Turfs", value: "4", change: "Steady", sub: "all running", icon: TrendingUp, up: true },
  { label: "Total Players", value: "1,247", change: "+18.9%", sub: "new this week", icon: Users, up: true },
];

const recentBookings = [
  { name: "Rahul Sharma", turf: "Sportobuddy Sports Arena", time: "6:00 PM – 7:00 PM", date: "Today", status: "confirmed", amount: 1500 },
  { name: "Priya Patel", turf: "Prime Turf", time: "7:00 PM – 8:00 PM", date: "Today", status: "confirmed", amount: 1200 },
  { name: "Amit Kumar", turf: "Sportobuddy Sports Arena", time: "8:00 PM – 9:00 PM", date: "Tomorrow", status: "pending", amount: 1500 },
  { name: "Sneha Reddy", turf: "Score", time: "5:00 PM – 6:00 PM", date: "Feb 19", status: "pending", amount: 1800 },
  { name: "Vikram Singh", turf: "Classic 7 Sports Turf", time: "6:00 PM – 7:00 PM", date: "Feb 20", status: "rejected", amount: 1300 },
];

const quickStats = [
  { label: "Slots Booked", value: "68", total: "120", pct: 57 },
  { label: "Payment Rate", value: "94%", total: "", pct: 94 },
  { label: "Avg. Rating", value: "4.7", total: "/ 5", pct: 94 },
];

export function OwnerDashboardHome() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-[#757575] mt-1">Welcome back! Here's your turf overview for today.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-[#1E1E1E] border border-[#1B5E20] rounded-xl px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
          <span className="text-[#00E676] text-sm font-medium">Live</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-[#1E1E1E] rounded-2xl p-4 sm:p-5 border border-[#1B5E20] hover:border-[#00E676]/60 hover:shadow-[0_0_24px_rgba(0,230,118,0.12)] transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#00E676]/10 border border-[#00E676]/20 flex items-center justify-center group-hover:bg-[#00E676]/20 transition-all">
                  <Icon className="w-4 h-4 text-[#00E676]" />
                </div>
                <span className="flex items-center gap-0.5 text-[#00E676] text-xs font-semibold">
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-white leading-none mb-1">{stat.value}</p>
              <p className="text-[#757575] text-xs">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick stats */}
        <div className="bg-[#1E1E1E] border border-[#1B5E20] rounded-2xl p-5 space-y-4">
          <h3 className="text-white font-semibold">Performance</h3>
          {quickStats.map((qs) => (
            <div key={qs.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[#BDBDBD] text-sm">{qs.label}</span>
                <span className="text-white font-bold text-sm">{qs.value}{qs.total}</span>
              </div>
              <div className="h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${qs.pct}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full bg-[#00E676] rounded-full"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Today's schedule preview */}
        <div className="lg:col-span-2 bg-[#1E1E1E] border border-[#1B5E20] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Today's Schedule</h3>
            <span className="text-[#00E676] text-xs font-medium">5 slots booked</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {["6AM","7AM","8AM","9AM","10AM","11AM","12PM","1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM","10PM","11PM"].map((t, i) => {
              const booked = [2,3,5,6,12,13,14].includes(i);
              return (
                <div
                  key={t}
                  className={`rounded-lg px-2 py-2 text-center text-xs font-medium transition-all ${
                    booked
                      ? "bg-[#00E676]/20 border border-[#00E676]/50 text-[#00E676]"
                      : "bg-[#2a2a2a] border border-transparent text-[#424242]"
                  }`}
                >
                  {t}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-[#757575]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#00E676]/40 border border-[#00E676]/60" />Booked</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#2a2a2a]" />Available</span>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-[#1E1E1E] border border-[#1B5E20] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1B5E20]">
          <h3 className="text-white font-semibold">Recent Bookings</h3>
          <span className="text-[#757575] text-xs">{recentBookings.length} total</span>
        </div>
        <div className="divide-y divide-[#1B5E20]/50">
          {recentBookings.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-[#1a1a1a] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#1B5E20]/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#00E676] text-xs font-bold">{b.name[0]}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{b.name}</p>
                  <p className="text-[#757575] text-xs truncate">{b.turf} · {b.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                <span className="text-[#BDBDBD] text-xs hidden sm:block">{b.date}</span>
                <span className="text-[#00E676] font-semibold text-sm">₹{b.amount}</span>
                {b.status === "confirmed" && <CheckCircle2 className="w-4 h-4 text-[#00E676]" />}
                {b.status === "pending" && <Clock className="w-4 h-4 text-yellow-400" />}
                {b.status === "rejected" && <AlertCircle className="w-4 h-4 text-red-400" />}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
