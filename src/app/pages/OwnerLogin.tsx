import { useState } from "react";
import { Logo } from "../components/Logo";
import { useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import {
  Building2, Mail, Lock, Eye, EyeOff, ArrowLeft,
  BarChart3, CalendarCheck, Wallet, ShieldCheck, Loader2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../context/AuthContext";

const features = [
  { icon: BarChart3, label: "Live Booking Analytics", desc: "Track revenue and occupancy in real time" },
  { icon: CalendarCheck, label: "Slot Management", desc: "Control availability with one tap" },
  { icon: Wallet, label: "Instant Payouts", desc: "Payments settled directly to your account" },
  { icon: ShieldCheck, label: "Verified Platform", desc: "Trusted by 500+ turf owners in Mumbai" },
];

export function OwnerLogin() {
  const navigate = useNavigate();
  const { ownerLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [globalError, setGlobalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: "", password: "" });
    setGlobalError("");

    const newErrors = { email: "", password: "" };
    let hasErrors = false;

    if (!formData.email) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      hasErrors = true;
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
      hasErrors = true;
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 characters";
      hasErrors = true;
    }

    if (hasErrors) { setErrors(newErrors); return; }

    setIsLoading(true);
    const result = await ownerLogin(formData.email, formData.password);
    setIsLoading(false);

    if (result.success) {
      navigate("/owner/dashboard");
    } else {
      const msg = (result.message ?? "").toLowerCase();
      if (msg.includes("not found") || msg.includes("no owner") || msg.includes("not registered")) {
        setGlobalError("No account found. Please register as an owner first.");
      } else {
        setGlobalError("Incorrect email or password. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col lg:flex-row">

      {/* ── Left panel – branding & features ───────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden">
        {/* Background glow layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1a0d] via-[#121212] to-[#0d0d0d]" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#00E676]/8 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#1B5E20]/20 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#00E676 1px, transparent 1px), linear-gradient(90deg, #00E676 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10">
          <Link to="/home">
            <Logo height={44} />
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4"
            >
              Grow your turf<br />
              <span className="text-[#00E676]">business smarter.</span>
            </motion.h2>
            <p className="text-[#BDBDBD] text-lg leading-relaxed">
              The all-in-one dashboard to manage bookings, slots, and payments — built for turf owners across Mumbai.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {features.map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 * i + 0.3 }}
                className="flex items-start gap-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl px-5 py-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#00E676]/15 border border-[#00E676]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-[#00E676]" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{label}</p>
                  <p className="text-[#757575] text-sm mt-0.5">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-[#424242] text-sm">© 2026 TurfBook · All rights reserved</p>
        </div>
      </div>

      {/* ── Right panel – login form ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-[#121212] border-b border-[#1B5E20] px-4 py-4 flex items-center justify-between">
          <Link to="/home"><Logo height={36} /></Link>
          <Button variant="ghost" onClick={() => navigate("/home")} className="text-[#BDBDBD] hover:text-white text-sm gap-1 px-2">
            <ArrowLeft className="w-4 h-4" /> Home
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-[#121212] lg:bg-[#0f0f0f]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="w-full max-w-md"
          >
            {/* Back link desktop */}
            <div className="hidden lg:flex mb-8">
              <button
                onClick={() => navigate("/home")}
                className="flex items-center gap-1.5 text-[#BDBDBD] hover:text-[#00E676] text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </button>
            </div>

            {/* Header */}
            <div className="mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00E676] to-[#1B5E20] flex items-center justify-center mb-5 shadow-[0_0_24px_rgba(0,230,118,0.35)]">
                <Building2 className="w-7 h-7 text-[#121212]" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-1.5">Owner Login</h1>
              <p className="text-[#757575] text-base">Sign in to manage your turfs and bookings</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#BDBDBD] block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#424242]" />
                  <Input
                    type="email"
                    placeholder="owner@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-[#424242] focus:border-[#00E676] focus:ring-[#00E676]/20 h-12 rounded-xl transition-all"
                  />
                </div>
                {errors.email && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs">
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#BDBDBD] block">Password</label>
                  <button type="button" className="text-xs text-[#00E676] hover:text-[#00E676]/80 transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#424242]" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-11 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-[#424242] focus:border-[#00E676] focus:ring-[#00E676]/20 h-12 rounded-xl transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#424242] hover:text-[#00E676] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs">
                    {errors.password}
                  </motion.p>
                )}
              </div>

              {/* Global error */}
              {globalError && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                  <p className="text-red-400 text-sm">{globalError}</p>
                  {globalError.includes("register") && (
                    <Link to="/owner/signup" className="text-[#00E676] text-sm font-semibold hover:underline mt-1 block">
                      Register as Turf Owner →
                    </Link>
                  )}
                </motion.div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#00E676] text-[#121212] hover:bg-[#00E676]/90 font-semibold text-base rounded-xl shadow-[0_0_20px_rgba(0,230,118,0.25)] hover:shadow-[0_0_32px_rgba(0,230,118,0.45)] transition-all mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  "Login to Dashboard"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#1e1e1e]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-[#121212] lg:bg-[#0f0f0f] text-[#424242]">New to TurfBook?</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => navigate("/owner/signup")}
              className="w-full h-11 border-[#2a2a2a] text-white hover:border-[#00E676] hover:text-[#00E676] rounded-xl transition-all bg-transparent"
            >
              Register as Turf Owner
            </Button>

            {/* Player link */}
            <p className="text-center text-[#424242] text-sm mt-6">
              Looking to book a turf?{" "}
              <Link to="/login" className="text-[#00E676] hover:underline font-medium">
                Player Login
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
