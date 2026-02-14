import { TrendingUp, Calendar, DollarSign, Users } from "lucide-react";
import { motion } from "motion/react";

export function OwnerDashboardHome() {
  const stats = [
    {
      label: "Total Revenue",
      value: "₹45,280",
      change: "+12.5%",
      icon: DollarSign,
      color: "#00E676",
    },
    {
      label: "Bookings Today",
      value: "23",
      change: "+8.2%",
      icon: Calendar,
      color: "#00E676",
    },
    {
      label: "Active Turfs",
      value: "4",
      change: "0%",
      icon: TrendingUp,
      color: "#00E676",
    },
    {
      label: "Total Users",
      value: "1,247",
      change: "+18.9%",
      icon: Users,
      color: "#00E676",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-[#BDBDBD] text-lg">Welcome back! Here's your turf overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-[#1E1E1E] rounded-2xl p-6 border border-[#1B5E20] hover:border-[#00E676] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,230,118,0.2)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#1B5E20] flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#00E676]" />
                </div>
                <span className="text-[#00E676] text-sm font-semibold">{stat.change}</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-[#BDBDBD] text-sm">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-[#1B5E20]">
        <h3 className="text-2xl font-bold text-white mb-6">Recent Bookings</h3>
        <div className="space-y-4">
          {[
            { name: "Rahul Sharma", turf: "Regional Arena", time: "6:00 PM - 7:00 PM", status: "Confirmed" },
            { name: "Priya Patel", turf: "Elite Stadium", time: "7:00 PM - 8:00 PM", status: "Confirmed" },
            { name: "Amit Kumar", turf: "Regional Arena", time: "8:00 PM - 9:00 PM", status: "Pending" },
          ].map((booking, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-[#121212] rounded-xl hover:bg-[#1A1A1A] transition-all duration-300"
            >
              <div>
                <p className="text-white font-semibold">{booking.name}</p>
                <p className="text-[#BDBDBD] text-sm">{booking.turf} • {booking.time}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  booking.status === "Confirmed"
                    ? "bg-[#1B5E20] text-[#00E676]"
                    : "bg-[#2A2A2A] text-[#BDBDBD]"
                }`}
              >
                {booking.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}