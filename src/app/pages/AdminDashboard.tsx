import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  LayoutDashboard, Users, Building2, MapPin, Calendar,
  LogOut, Menu, X, Search, Trash2, Ban, CheckCircle,
  TrendingUp, DollarSign, Activity, ChevronLeft, ChevronRight,
  Shield, RefreshCw, AlertCircle, Eye, MoreVertical,
} from "lucide-react";
import { Logo } from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { TURFBOOK_API, TURFBOOK_HEADERS } from "../context/AuthContext";

// ──────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────
interface Stats {
  totalPlayers: number;
  totalOwners: number;
  totalTurfs: number;
  totalBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  activeTurfs: number;
}
interface Player { id: string; name: string; email: string; phone?: string; status: string; totalBookings: number; createdAt: string; }
interface Owner { id: string; name: string; email: string; phone?: string; businessName?: string; status: string; totalTurfs: number; revenue: number; createdAt: string; }
interface TurfItem { id: string; name: string; location: string; price: number; sports: string[]; status: string; totalBookings: number; rating: number; ownerId?: string; createdAt: string; }
interface Booking { id: string; turfName: string; playerName: string; date: string; slot: string; sport: string; amount: number; status: string; createdAt: string; }

type Section = "overview" | "players" | "owners" | "turfs" | "bookings";

// ──────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────
const statusColor = (s: string) => {
  if (s === "active" || s === "Active" || s === "confirmed") return "text-[#00E676] bg-[#00E676]/10 border-[#00E676]/30";
  if (s === "pending") return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
  if (s === "suspended" || s === "Inactive" || s === "cancelled") return "text-red-400 bg-red-400/10 border-red-400/30";
  return "text-[#BDBDBD] bg-white/5 border-white/10";
};

function Badge({ status }: { status: string }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColor(status)}`}>
      {status}
    </span>
  );
}

// ──────────────────────────────────────────────────
// Stat Card
// ──────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="bg-[#1E1E1E] rounded-2xl p-5 border border-[#2A2A2A] hover:border-[#1B5E20]/50 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <TrendingUp className="w-4 h-4 text-[#00E676] opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-[#BDBDBD]">{label}</div>
      {sub && <div className="text-xs text-[#555] mt-1">{sub}</div>}
    </div>
  );
}

// ──────────────────────────────────────────────────
// Confirm Modal
// ──────────────────────────────────────────────────
function ConfirmModal({ open, title, message, onConfirm, onCancel }: {
  open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div className="relative bg-[#1E1E1E] rounded-2xl p-6 border border-[#2A2A2A] w-full max-w-sm">
        <div className="flex items-center gap-3 mb-3">
          <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
          <h3 className="font-semibold text-white text-lg">{title}</h3>
        </div>
        <p className="text-[#BDBDBD] text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-[#2A2A2A] text-[#BDBDBD] hover:bg-[#2A2A2A] transition-all text-sm">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-all text-sm font-medium">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────
// Detail Modal
// ──────────────────────────────────────────────────
function DetailModal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-[#1E1E1E] rounded-2xl border border-[#2A2A2A] w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#1E1E1E] border-b border-[#2A2A2A] px-6 py-4 flex items-center justify-between">
          <h3 className="font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-[#BDBDBD] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────
// Main Dashboard
// ──────────────────────────────────────────────────
export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [section, setSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [stats, setStats] = useState<Stats | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [turfs, setTurfs] = useState<TurfItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [search, setSearch] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const [confirm, setConfirm] = useState<{ open: boolean; title: string; message: string; action: () => void }>({ open: false, title: "", message: "", action: () => {} });
  const [detail, setDetail] = useState<{ open: boolean; title: string; data: any }>({ open: false, title: "", data: null });
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: "success" | "error" }>({ show: false, msg: "", type: "success" });

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") navigate("/home");
    else if (!user) navigate("/admin");
  }, [user]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  };

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${TURFBOOK_API}/admin/stats`, { headers: TURFBOOK_HEADERS });
      const data = await res.json();
      setStats(data);
    } catch {}
  }, []);

  const fetchPlayers = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch(`${TURFBOOK_API}/admin/players`, { headers: TURFBOOK_HEADERS });
      setPlayers(await res.json());
    } catch {} finally { setLoadingData(false); }
  }, []);

  const fetchOwners = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch(`${TURFBOOK_API}/admin/owners`, { headers: TURFBOOK_HEADERS });
      setOwners(await res.json());
    } catch {} finally { setLoadingData(false); }
  }, []);

  const fetchTurfs = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch(`${TURFBOOK_API}/admin/turfs`, { headers: TURFBOOK_HEADERS });
      setTurfs(await res.json());
    } catch {} finally { setLoadingData(false); }
  }, []);

  const fetchBookings = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch(`${TURFBOOK_API}/admin/bookings`, { headers: TURFBOOK_HEADERS });
      setBookings(await res.json());
    } catch {} finally { setLoadingData(false); }
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    setSearch("");
    if (section === "players") fetchPlayers();
    else if (section === "owners") fetchOwners();
    else if (section === "turfs") fetchTurfs();
    else if (section === "bookings") fetchBookings();
    else fetchStats();
  }, [section]);

  // ── Delete helpers ──
  const deleteItem = async (endpoint: string, onSuccess: () => void) => {
    try {
      await fetch(`${TURFBOOK_API}${endpoint}`, { method: "DELETE", headers: TURFBOOK_HEADERS });
      onSuccess();
      showToast("Deleted successfully");
      fetchStats();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const patchStatus = async (endpoint: string, status: string, onSuccess: () => void) => {
    try {
      await fetch(`${TURFBOOK_API}${endpoint}`, {
        method: "PATCH",
        headers: TURFBOOK_HEADERS,
        body: JSON.stringify({ status }),
      });
      onSuccess();
      showToast(`Status updated to ${status}`);
    } catch {
      showToast("Update failed", "error");
    }
  };

  const askConfirm = (title: string, message: string, action: () => void) => {
    setConfirm({ open: true, title, message, action });
  };

  // ── Nav items ──
  const navItems = [
    { id: "overview" as Section, label: "Dashboard", icon: LayoutDashboard },
    { id: "players" as Section, label: "Players", icon: Users },
    { id: "owners" as Section, label: "Owners", icon: Building2 },
    { id: "turfs" as Section, label: "Turfs", icon: MapPin },
    { id: "bookings" as Section, label: "Bookings", icon: Calendar },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  // ── Filtered lists ──
  const filteredPlayers = players.filter((p) =>
    [p.name, p.email, p.phone || ""].join(" ").toLowerCase().includes(search.toLowerCase())
  );
  const filteredOwners = owners.filter((o) =>
    [o.name, o.email, o.businessName || ""].join(" ").toLowerCase().includes(search.toLowerCase())
  );
  const filteredTurfs = turfs.filter((t) =>
    [t.name, t.location, ...(t.sports || [])].join(" ").toLowerCase().includes(search.toLowerCase())
  );
  const filteredBookings = bookings.filter((b) =>
    [b.turfName, b.playerName, b.sport, b.status].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#121212] flex text-white">

      {/* ── Toast ── */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all ${
          toast.type === "success"
            ? "bg-[#1B5E20] border-[#00E676]/30 text-[#00E676]"
            : "bg-red-900/40 border-red-500/30 text-red-400"
        }`}
          style={{ boxShadow: toast.type === "success" ? "0 0 20px rgba(0,230,118,0.2)" : "none" }}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* ── Confirm Modal ── */}
      <ConfirmModal
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        onConfirm={() => { confirm.action(); setConfirm((c) => ({ ...c, open: false })); }}
        onCancel={() => setConfirm((c) => ({ ...c, open: false }))}
      />

      {/* ── Detail Modal ── */}
      <DetailModal open={detail.open} onClose={() => setDetail((d) => ({ ...d, open: false }))} title={detail.title}>
        {detail.data && (
          <div className="space-y-3">
            {Object.entries(detail.data).map(([k, v]) => (
              k !== "password" && (
                <div key={k} className="flex gap-3">
                  <span className="text-[#BDBDBD] text-sm capitalize min-w-[120px]">{k.replace(/([A-Z])/g, " $1")}:</span>
                  <span className="text-white text-sm break-all">{Array.isArray(v) ? (v as string[]).join(", ") : String(v)}</span>
                </div>
              )
            ))}
          </div>
        )}
      </DetailModal>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-auto
        flex flex-col bg-[#1A1A1A] border-r border-[#1B5E20]/40
        transition-all duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${sidebarCollapsed ? "w-20" : "w-64"}
      `}>
        {/* Logo */}
        <div className={`flex items-center gap-3 px-5 py-5 border-b border-[#1B5E20]/30 ${sidebarCollapsed ? "justify-center px-3" : ""}`}>
          {sidebarCollapsed ? (
            <div className="w-8 h-8 rounded-lg bg-[#1B5E20] flex items-center justify-center flex-shrink-0"
              style={{ boxShadow: "0 0 12px rgba(0,230,118,0.3)" }}>
              <Shield className="w-4 h-4 text-[#00E676]" />
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Logo height={32} />
              <div className="text-[10px] text-[#555]">Admin Panel</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setSection(id); setSidebarOpen(false); }}
              className={`
                w-full flex items-center gap-3 px-5 py-3 text-sm transition-all
                ${sidebarCollapsed ? "justify-center px-3" : ""}
                ${section === id
                  ? "bg-[#1B5E20]/30 text-[#00E676] border-r-2 border-[#00E676]"
                  : "text-[#BDBDBD] hover:bg-[#2A2A2A] hover:text-white"}
              `}
              title={sidebarCollapsed ? label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!sidebarCollapsed && <span>{label}</span>}
            </button>
          ))}
        </nav>

        {/* User + logout */}
        <div className={`p-4 border-t border-[#1B5E20]/30 ${sidebarCollapsed ? "flex justify-center" : ""}`}>
          {!sidebarCollapsed && user && (
            <div className="mb-3 px-2">
              <div className="text-xs text-[#BDBDBD]">Logged in as</div>
              <div className="text-sm font-medium text-white truncate">{user.name}</div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 text-red-400 hover:text-red-300 transition-all text-sm ${sidebarCollapsed ? "" : "w-full px-2"}`}
            title={sidebarCollapsed ? "Logout" : undefined}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!sidebarCollapsed && "Logout"}
          </button>
        </div>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#1B5E20] border border-[#00E676]/30 items-center justify-center text-[#00E676] hover:scale-110 transition-all"
        >
          {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#1A1A1A]/95 backdrop-blur border-b border-[#1B5E20]/30 px-4 lg:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-[#00E676] hover:bg-[#2A2A2A] rounded-lg transition-all"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-lg font-semibold text-white capitalize">
                {section === "overview" ? "Dashboard Overview" : section}
              </h1>
              <p className="text-xs text-[#555]">TurfBook Platform Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (section === "players") fetchPlayers();
                else if (section === "owners") fetchOwners();
                else if (section === "turfs") fetchTurfs();
                else if (section === "bookings") fetchBookings();
                else fetchStats();
              }}
              className="p-2 text-[#BDBDBD] hover:text-[#00E676] hover:bg-[#2A2A2A] rounded-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-[#1E1E1E] px-3 py-2 rounded-xl border border-[#2A2A2A] text-xs text-[#00E676]">
              <Activity className="w-3 h-3" />
              Live
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">

          {/* ══ OVERVIEW ══ */}
          {section === "overview" && (
            <div className="space-y-6">
              {/* Stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Total Players" value={stats?.totalPlayers ?? "—"} sub="Registered users" color="bg-blue-500/20 text-blue-400" />
                <StatCard icon={Building2} label="Total Owners" value={stats?.totalOwners ?? "—"} sub="Turf owners" color="bg-purple-500/20 text-purple-400" />
                <StatCard icon={MapPin} label="Total Turfs" value={stats?.totalTurfs ?? "—"} sub={`${stats?.activeTurfs ?? 0} active`} color="bg-[#1B5E20]/40 text-[#00E676]" />
                <StatCard icon={Calendar} label="Bookings" value={stats?.totalBookings ?? "—"} sub={`${stats?.confirmedBookings ?? 0} confirmed`} color="bg-yellow-500/20 text-yellow-400" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon={DollarSign} label="Total Revenue" value={`₹${(stats?.totalRevenue ?? 0).toLocaleString()}`} sub="Confirmed bookings" color="bg-[#1B5E20]/40 text-[#00E676]" />
                <StatCard icon={Calendar} label="Pending Bookings" value={stats?.pendingBookings ?? "—"} sub="Awaiting confirmation" color="bg-yellow-500/20 text-yellow-400" />
                <StatCard icon={Activity} label="Active Turfs" value={stats?.activeTurfs ?? "—"} sub="Currently open" color="bg-blue-500/20 text-blue-400" />
              </div>

              {/* Quick actions */}
              <div className="bg-[#1E1E1E] rounded-2xl p-5 border border-[#2A2A2A]">
                <h2 className="text-sm font-semibold text-[#BDBDBD] mb-4">Quick Navigation</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {navItems.filter((n) => n.id !== "overview").map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => setSection(id)}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#121212] border border-[#2A2A2A] hover:border-[#1B5E20] hover:text-[#00E676] text-[#BDBDBD] transition-all text-sm">
                      <Icon className="w-5 h-5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ SEARCH BAR (shared) ══ */}
          {section !== "overview" && (
            <div className="mb-4 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
              <input
                type="text"
                placeholder={`Search ${section}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555] focus:outline-none focus:border-[#1B5E20] text-sm"
              />
            </div>
          )}

          {/* ══ PLAYERS ══ */}
          {section === "players" && (
            <div className="bg-[#1E1E1E] rounded-2xl border border-[#2A2A2A] overflow-hidden">
              <div className="p-4 border-b border-[#2A2A2A] flex items-center justify-between">
                <h2 className="font-semibold text-white">Players ({filteredPlayers.length})</h2>
                {loadingData && <RefreshCw className="w-4 h-4 text-[#00E676] animate-spin" />}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2A2A2A] text-[#BDBDBD]">
                      <th className="text-left px-4 py-3 font-medium">Player</th>
                      <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Contact</th>
                      <th className="text-left px-4 py-3 font-medium">Status</th>
                      <th className="text-right px-4 py-3 font-medium hidden md:table-cell">Bookings</th>
                      <th className="text-right px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlayers.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-12 text-[#555]">No players found</td></tr>
                    ) : filteredPlayers.map((p) => (
                      <tr key={p.id} className="border-b border-[#2A2A2A]/50 hover:bg-[#2A2A2A]/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-white">{p.name}</div>
                          <div className="text-[#BDBDBD] text-xs">{p.email}</div>
                        </td>
                        <td className="px-4 py-3 text-[#BDBDBD] hidden sm:table-cell">{p.phone || "—"}</td>
                        <td className="px-4 py-3"><Badge status={p.status} /></td>
                        <td className="px-4 py-3 text-right text-[#BDBDBD] hidden md:table-cell">{p.totalBookings}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setDetail({ open: true, title: p.name, data: p })}
                              className="p-1.5 text-[#BDBDBD] hover:text-[#00E676] hover:bg-[#1B5E20]/20 rounded-lg transition-all">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => {
                              const newStatus = p.status === "active" ? "suspended" : "active";
                              askConfirm(
                                `${newStatus === "suspended" ? "Suspend" : "Activate"} Player`,
                                `Are you sure you want to ${newStatus === "suspended" ? "suspend" : "activate"} ${p.name}?`,
                                () => patchStatus(`/admin/players/${p.id}/status`, newStatus, fetchPlayers)
                              );
                            }}
                              className="p-1.5 text-[#BDBDBD] hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-all">
                              <Ban className="w-4 h-4" />
                            </button>
                            <button onClick={() =>
                              askConfirm("Delete Player", `Permanently delete ${p.name}? This cannot be undone.`,
                                () => deleteItem(`/admin/players/${p.id}`, fetchPlayers)
                              )}
                              className="p-1.5 text-[#BDBDBD] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ OWNERS ══ */}
          {section === "owners" && (
            <div className="bg-[#1E1E1E] rounded-2xl border border-[#2A2A2A] overflow-hidden">
              <div className="p-4 border-b border-[#2A2A2A] flex items-center justify-between">
                <h2 className="font-semibold text-white">Owners ({filteredOwners.length})</h2>
                {loadingData && <RefreshCw className="w-4 h-4 text-[#00E676] animate-spin" />}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2A2A2A] text-[#BDBDBD]">
                      <th className="text-left px-4 py-3 font-medium">Owner</th>
                      <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Business</th>
                      <th className="text-left px-4 py-3 font-medium">Status</th>
                      <th className="text-right px-4 py-3 font-medium hidden md:table-cell">Turfs</th>
                      <th className="text-right px-4 py-3 font-medium hidden md:table-cell">Revenue</th>
                      <th className="text-right px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOwners.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-12 text-[#555]">No owners found</td></tr>
                    ) : filteredOwners.map((o) => (
                      <tr key={o.id} className="border-b border-[#2A2A2A]/50 hover:bg-[#2A2A2A]/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-white">{o.name}</div>
                          <div className="text-[#BDBDBD] text-xs">{o.email}</div>
                        </td>
                        <td className="px-4 py-3 text-[#BDBDBD] hidden sm:table-cell">{o.businessName || "—"}</td>
                        <td className="px-4 py-3"><Badge status={o.status} /></td>
                        <td className="px-4 py-3 text-right text-[#BDBDBD] hidden md:table-cell">{o.totalTurfs}</td>
                        <td className="px-4 py-3 text-right text-[#00E676] font-medium hidden md:table-cell">₹{(o.revenue || 0).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setDetail({ open: true, title: o.name, data: o })}
                              className="p-1.5 text-[#BDBDBD] hover:text-[#00E676] hover:bg-[#1B5E20]/20 rounded-lg transition-all">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => {
                              const newStatus = o.status === "active" ? "suspended" : "active";
                              askConfirm(
                                `${newStatus === "suspended" ? "Suspend" : "Activate"} Owner`,
                                `Are you sure you want to ${newStatus === "suspended" ? "suspend" : "activate"} ${o.name}?`,
                                () => patchStatus(`/admin/owners/${o.id}/status`, newStatus, fetchOwners)
                              );
                            }}
                              className="p-1.5 text-[#BDBDBD] hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-all">
                              <Ban className="w-4 h-4" />
                            </button>
                            <button onClick={() =>
                              askConfirm("Delete Owner", `Permanently delete ${o.name}? This cannot be undone.`,
                                () => deleteItem(`/admin/owners/${o.id}`, fetchOwners)
                              )}
                              className="p-1.5 text-[#BDBDBD] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ TURFS ══ */}
          {section === "turfs" && (
            <div className="bg-[#1E1E1E] rounded-2xl border border-[#2A2A2A] overflow-hidden">
              <div className="p-4 border-b border-[#2A2A2A] flex items-center justify-between">
                <h2 className="font-semibold text-white">Turfs ({filteredTurfs.length})</h2>
                {loadingData && <RefreshCw className="w-4 h-4 text-[#00E676] animate-spin" />}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2A2A2A] text-[#BDBDBD]">
                      <th className="text-left px-4 py-3 font-medium">Turf</th>
                      <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Location</th>
                      <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Sports</th>
                      <th className="text-right px-4 py-3 font-medium hidden md:table-cell">Price/hr</th>
                      <th className="text-left px-4 py-3 font-medium">Status</th>
                      <th className="text-right px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTurfs.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-12 text-[#555]">No turfs found</td></tr>
                    ) : filteredTurfs.map((t) => (
                      <tr key={t.id} className="border-b border-[#2A2A2A]/50 hover:bg-[#2A2A2A]/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-white">{t.name}</div>
                          <div className="text-[#BDBDBD] text-xs">{t.totalBookings} bookings · ★ {t.rating || "—"}</div>
                        </td>
                        <td className="px-4 py-3 text-[#BDBDBD] hidden sm:table-cell">{t.location}</td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {(t.sports || []).slice(0, 2).map((s) => (
                              <span key={s} className="px-1.5 py-0.5 rounded bg-[#1B5E20]/20 text-[#00E676] text-xs">{s}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-[#00E676] font-medium hidden md:table-cell">₹{t.price}</td>
                        <td className="px-4 py-3"><Badge status={t.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setDetail({ open: true, title: t.name, data: t })}
                              className="p-1.5 text-[#BDBDBD] hover:text-[#00E676] hover:bg-[#1B5E20]/20 rounded-lg transition-all">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => {
                              const newStatus = t.status === "Active" ? "Inactive" : "Active";
                              askConfirm(
                                `${newStatus === "Inactive" ? "Deactivate" : "Activate"} Turf`,
                                `Change ${t.name} status to ${newStatus}?`,
                                () => patchStatus(`/admin/turfs/${t.id}/status`, newStatus, fetchTurfs)
                              );
                            }}
                              className="p-1.5 text-[#BDBDBD] hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-all">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            <button onClick={() =>
                              askConfirm("Delete Turf", `Permanently delete "${t.name}"? This cannot be undone.`,
                                () => deleteItem(`/admin/turfs/${t.id}`, fetchTurfs)
                              )}
                              className="p-1.5 text-[#BDBDBD] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ BOOKINGS ══ */}
          {section === "bookings" && (
            <div className="bg-[#1E1E1E] rounded-2xl border border-[#2A2A2A] overflow-hidden">
              <div className="p-4 border-b border-[#2A2A2A] flex items-center justify-between">
                <h2 className="font-semibold text-white">Bookings ({filteredBookings.length})</h2>
                {loadingData && <RefreshCw className="w-4 h-4 text-[#00E676] animate-spin" />}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2A2A2A] text-[#BDBDBD]">
                      <th className="text-left px-4 py-3 font-medium">Turf</th>
                      <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Player</th>
                      <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Date & Slot</th>
                      <th className="text-left px-4 py-3 font-medium">Status</th>
                      <th className="text-right px-4 py-3 font-medium hidden md:table-cell">Amount</th>
                      <th className="text-right px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-12 text-[#555]">No bookings found</td></tr>
                    ) : filteredBookings.map((b) => (
                      <tr key={b.id} className="border-b border-[#2A2A2A]/50 hover:bg-[#2A2A2A]/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-white text-xs leading-snug">{b.turfName}</div>
                          <div className="text-[#BDBDBD] text-xs">{b.sport}</div>
                        </td>
                        <td className="px-4 py-3 text-[#BDBDBD] hidden sm:table-cell">{b.playerName}</td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="text-white text-xs">{b.date}</div>
                          <div className="text-[#BDBDBD] text-xs">{b.slot}</div>
                        </td>
                        <td className="px-4 py-3"><Badge status={b.status} /></td>
                        <td className="px-4 py-3 text-right text-[#00E676] font-medium hidden md:table-cell">₹{b.amount}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setDetail({ open: true, title: `Booking – ${b.turfName}`, data: b })}
                              className="p-1.5 text-[#BDBDBD] hover:text-[#00E676] hover:bg-[#1B5E20]/20 rounded-lg transition-all">
                              <Eye className="w-4 h-4" />
                            </button>
                            {b.status === "pending" && (
                              <button onClick={() =>
                                askConfirm("Confirm Booking", `Confirm booking for ${b.playerName}?`,
                                  () => patchStatus(`/admin/bookings/${b.id}/status`, "confirmed", fetchBookings)
                                )}
                                className="p-1.5 text-[#BDBDBD] hover:text-[#00E676] hover:bg-[#1B5E20]/20 rounded-lg transition-all">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button onClick={() =>
                              askConfirm("Delete Booking", `Permanently delete this booking? This cannot be undone.`,
                                () => deleteItem(`/admin/bookings/${b.id}`, fetchBookings)
                              )}
                              className="p-1.5 text-[#BDBDBD] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
