import { useState } from "react";
import { Logo } from "../components/Logo";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Building2, Mail, Lock, ArrowLeft, Eye, EyeOff, User, Phone, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAuth } from "../context/AuthContext";

type Step = "form" | "done";

export function OwnerSignup() {
  const navigate = useNavigate();
  const { ownerSignup } = useAuth();

  const [step, setStep] = useState<Step>("form");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
  });

  const fieldErr = (msg: string) => { setError(msg); return false; };

  const validate = () => {
    if (!formData.name) return fieldErr("Name is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return fieldErr("Invalid email format");
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) return fieldErr("Enter a valid 10-digit phone number");
    if (formData.password.length < 6) return fieldErr("Password must be at least 6 characters");
    if (formData.password !== formData.confirmPassword) return fieldErr("Passwords do not match");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);

    const result = await ownerSignup({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      businessName: formData.name,
    });

    setLoading(false);
    if (!result.success) {
      const msg = result.message ?? "";
      if (msg.toLowerCase().includes("already registered")) {
        setError("This email is already registered. Please log in instead.");
      } else {
        setError(msg || "Registration failed. Please try again.");
      }
      return;
    }
    setStep("done");
    setTimeout(() => navigate("/owner/dashboard"), 1800);
  };

  const inputCls = "pl-10 bg-[#121212] border-[#1B5E20] text-white placeholder:text-[#757575] focus:border-[#00E676] h-12 transition-all duration-300";

  return (
    <div className="min-h-screen bg-[#121212] relative overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Sports Facility"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#121212] via-[#121212]/95 to-[#1B5E20]/20" />
      </div>

      <div className="absolute top-20 right-1/4 w-96 h-96 bg-[#00E676]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-[#1B5E20]/20 rounded-full blur-[120px]" />

      <header className="relative z-10 border-b border-[#1B5E20] bg-[#1E1E1E]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/home"><Logo height={36} /></Link>
          <Button variant="ghost" onClick={() => navigate("/owner/login")}
            className="text-white hover:text-[#00E676] transition-all duration-300">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Login
          </Button>
        </div>
      </header>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] p-4 py-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
          <div className="bg-[#1E1E1E] rounded-[24px] p-8 border border-[#1B5E20] shadow-[0_8px_32px_rgba(0,230,118,0.1)]">

            <AnimatePresence mode="wait">

              {step === "form" && (
                <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-gradient-to-br from-[#00E676] to-[#1B5E20] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,230,118,0.3)]">
                    <Building2 className="w-8 h-8 text-[#121212]" />
                  </motion.div>

                  <h1 className="text-3xl font-bold text-center mb-2">
                    <span className="text-white">Register as </span>
                    <span className="text-[#00E676]">Owner</span>
                  </h1>
                  <p className="text-[#BDBDBD] text-center mb-8">Start managing your turf business today</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white block">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#BDBDBD]" />
                        <Input placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputCls} required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white block">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#BDBDBD]" />
                        <Input type="email" placeholder="owner@turfbook.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputCls} required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white block">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#BDBDBD]" />
                        <Input type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputCls} required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white block">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#BDBDBD]" />
                        <Input type={showPassword ? "text" : "password"} placeholder="Create a password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className={`${inputCls} pr-10`} required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BDBDBD] hover:text-[#00E676]">
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white block">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#BDBDBD]" />
                        <Input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className={`${inputCls} pr-10`} required />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BDBDBD] hover:text-[#00E676]">
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <Button type="submit" disabled={loading} className="w-full h-12 bg-[#00E676] text-[#121212] hover:bg-[#00E676]/90 font-semibold text-lg mt-2">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                    </Button>
                  </form>

                  <div className="text-center mt-6">
                    <button onClick={() => navigate("/owner/login")} className="text-[#00E676] hover:text-[#00E676]/80 font-medium transition-colors">
                      Already registered? Login →
                    </button>
                  </div>
                </motion.div>
              )}

              {step === "done" && (
                <motion.div key="done" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center py-8 gap-4">
                  <div className="w-20 h-20 rounded-full bg-[#00E676] flex items-center justify-center shadow-[0_0_40px_rgba(0,230,118,0.5)]">
                    <CheckCircle2 className="w-10 h-10 text-[#121212]" strokeWidth={3} />
                  </div>
                  <h2 className="text-white font-bold text-2xl">Account Created!</h2>
                  <p className="text-[#BDBDBD] text-sm">Taking you to your dashboard…</p>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-center text-[#757575] text-sm mt-6">
            Join TurfBook and grow your sports facility business
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
