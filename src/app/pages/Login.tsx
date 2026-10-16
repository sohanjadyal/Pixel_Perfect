import { useState } from "react";
import { Logo } from "../components/Logo";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const inputCls =
  "bg-[#121212] border-[#1B5E20] text-white placeholder:text-[#BDBDBD] focus:border-[#00E676] focus:ring-[#00E676]";

export function Login() {
  const navigate = useNavigate();
  const { playerLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await playerLogin(email, password);
    setLoading(false);

    if (result.success) {
      navigate("/home");
    } else {
      const msg = (result.message ?? "").toLowerCase();
      if (msg.includes("not found") || msg.includes("no player") || msg.includes("not registered")) {
        setError("No account found with this email. Please sign up first.");
      } else {
        // "Invalid credentials" means email+password combo is wrong — don't imply account doesn't exist
        setError("Incorrect email or password. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-5 left-5 flex items-center gap-2 text-[#BDBDBD] hover:text-[#00E676] transition-colors text-sm font-medium group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3"><Logo height={56} /></div>
          <p className="text-[#BDBDBD]">Welcome back! Please login to continue.</p>
        </div>

        <div className="bg-[#1E1E1E] rounded-[14px] p-8 card-elevation">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputCls}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputCls}
              />
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-[#00E676] hover:underline">
                Forgot Password?
              </Link>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
                {error.includes("sign up") && (
                  <Link to="/signup" className="text-[#00E676] text-sm font-semibold hover:underline mt-1 block">
                    Create an account →
                  </Link>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00E676] text-[#121212] hover:bg-[#00E676]/90 neon-glow-hover font-semibold"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#BDBDBD]">
              {"Don't have an account? "}
              <Link to="/signup" className="text-[#00E676] hover:underline font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
