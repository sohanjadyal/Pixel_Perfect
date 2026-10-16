import { useState } from "react";
import { Logo } from "../components/Logo";
import { useNavigate } from "react-router";
import { Shield, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const [email, setEmail] = useState("admin@turfbook.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await adminLogin(email, password);
    setLoading(false);
    if (result.success) {
      navigate("/admin/dashboard");
    } else {
      setError(result.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "linear-gradient(#00E676 1px, transparent 1px), linear-gradient(90deg, #00E676 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Neon glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#1B5E20] rounded-full blur-[120px] opacity-20" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#00E676] rounded-full blur-[100px] opacity-10" />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo height={56} />
          </div>
          <h1 className="text-3xl font-bold mb-1">
            <span className="text-[#00E676]">Admin</span>
            <span className="text-white"> Portal</span>
          </h1>
          <p className="text-[#BDBDBD] text-sm">TurfBook Platform Administration</p>
        </div>

        {/* Card */}
        <div className="bg-[#1E1E1E] rounded-2xl p-8 border border-[#1B5E20]/50"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(27,94,32,0.15)" }}>

          {/* Credential hint */}
          <div className="mb-6 p-3 rounded-xl bg-[#1B5E20]/20 border border-[#1B5E20]/40 flex items-start gap-3">
            <Lock className="w-4 h-4 text-[#00E676] mt-0.5 flex-shrink-0" />
            <div className="text-xs text-[#BDBDBD]">
              <p className="text-[#00E676] font-medium mb-0.5">Default credentials</p>
              <p>admin@turfbook.com / admin123</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#BDBDBD]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@turfbook.com"
                className="w-full px-4 py-3 bg-[#121212] border border-[#1B5E20]/60 rounded-xl text-white placeholder:text-[#555] focus:outline-none focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676]/30 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#BDBDBD]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#121212] border border-[#1B5E20]/60 rounded-xl text-white placeholder:text-[#555] focus:outline-none focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676]/30 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BDBDBD] hover:text-[#00E676] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl bg-red-900/20 border border-red-500/40 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-[#121212] bg-[#00E676] hover:bg-[#00E676]/90 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
              style={{ boxShadow: loading ? "none" : "0 0 20px rgba(0,230,118,0.4)" }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Access Admin Panel
                </>
              )}
            </button>
          </form>

          {/* Footer links */}
          <div className="mt-6 pt-6 border-t border-[#2A2A2A] text-center text-sm text-[#BDBDBD]">
            Not an admin?{" "}
            <a href="/home" className="text-[#00E676] hover:underline font-medium">
              Go to Player App
            </a>
            {" · "}
            <a href="/owner/login" className="text-[#00E676] hover:underline font-medium">
              Owner Login
            </a>
          </div>
        </div>

        {/* Branding */}
        <p className="text-center mt-6 text-[#555] text-xs">
          Admin · Restricted Access
        </p>
      </div>
    </div>
  );
}
