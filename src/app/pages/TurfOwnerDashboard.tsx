import { useState } from "react";
import { LayoutDashboard, PlusCircle, Calendar, Receipt, CreditCard, Building2, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate, Link } from "react-router";
import { AddTurfForm } from "../components/AddTurfForm";
import { ManageSlots } from "../components/ManageSlots";
import { MyTurfs } from "../components/MyTurfs";
import { OwnerPayments } from "../components/OwnerPayments";
import { OwnerDashboardHome } from "../components/OwnerDashboardHome";
import { BookingLogs } from "../components/BookingLogs";

export function TurfOwnerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("turfbook_user");
    navigate("/home");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "my-turf", label: "My Turf", icon: Building2 },
    { id: "add-turf", label: "Add Turf", icon: PlusCircle },
    { id: "manage-slots", label: "Manage Slots", icon: Calendar },
    { id: "bookings", label: "Bookings", icon: Receipt },
    { id: "payments", label: "Payments", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#121212] flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-[#1E1E1E] border-r border-[#1B5E20] flex flex-col"
      >
        {/* Logo */}
        <Link to="/home" className="p-6 border-b border-[#1B5E20] block hover:bg-[#2A2A2A]/30 transition-all duration-300">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">
              <span className="text-[#00E676]">Turf</span>
              <span className="text-white">Book</span>
            </h1>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative ${
                  isActive
                    ? "bg-[#1B5E20] text-[#00E676] shadow-[0_0_20px_rgba(0,230,118,0.2)]"
                    : "text-[#BDBDBD] hover:bg-[#2A2A2A] hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-semibold">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-[#00E676] rounded-r-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#1B5E20]">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#BDBDBD] hover:bg-[#2A2A2A] hover:text-white transition-all duration-300"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === "dashboard" && <OwnerDashboardHome />}
            {activeTab === "add-turf" && <AddTurfForm />}
            {activeTab === "manage-slots" && <ManageSlots />}
            {activeTab === "bookings" && <BookingLogs />}
            {activeTab === "payments" && <OwnerPayments />}
            {activeTab === "my-turf" && <MyTurfs />}
          </motion.div>
        </div>
      </main>
    </div>
  );
}