import { useState } from "react";
import { Logo } from "../components/Logo";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";

type Step = "form" | "done";

const inputCls =
  "bg-[#121212] border-[#1B5E20] text-white placeholder:text-[#BDBDBD] focus:border-[#00E676] focus:ring-[#00E676]";

export function Signup() {
  const navigate = useNavigate();
  const { playerSignup } = useAuth();

  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await playerSignup({
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
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
    setTimeout(() => navigate("/home"), 1800);
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4 relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-5 left-5 flex items-center gap-2 text-[#BDBDBD] hover:text-[#00E676] transition-colors text-sm font-medium group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back
      </button>

      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3"><Logo height={56} /></div>
          <p className="text-[#BDBDBD]">Create your account to get started.</p>
        </div>

        <div className="bg-[#1E1E1E] rounded-[14px] p-8 card-elevation">
          <AnimatePresence mode="wait">

            {step === "form" && (
              <motion.form
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white">First Name</Label>
                    <Input id="firstName" name="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} required className={inputCls} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white">Last Name</Label>
                    <Input id="lastName" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} required className={inputCls} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+91 9876543210" value={formData.phone} onChange={handleChange} required className={inputCls} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} required className={inputCls} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input id="password" name="password" type="password" placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} required minLength={6} className={inputCls} />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <Button type="submit" disabled={loading} className="w-full bg-[#00E676] text-[#121212] hover:bg-[#00E676]/90 neon-glow-hover font-semibold">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                </Button>

                <p className="text-center text-[#BDBDBD] text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#00E676] hover:underline font-semibold">Login</Link>
                </p>
              </motion.form>
            )}

            {step === "done" && (
              <motion.div
                key="done"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center py-8 gap-4"
              >
                <div className="w-20 h-20 rounded-full bg-[#00E676] flex items-center justify-center shadow-[0_0_40px_rgba(0,230,118,0.5)]">
                  <CheckCircle2 className="w-10 h-10 text-[#121212]" strokeWidth={3} />
                </div>
                <h2 className="text-white font-bold text-2xl">Account Created!</h2>
                <p className="text-[#BDBDBD] text-sm">Redirecting you to home…</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
