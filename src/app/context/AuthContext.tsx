import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Server API (best-effort sync — auth works locally even if this is unreachable)
const API = "https://duelrajbsoyppaexoraj.supabase.co/functions/v1/make-server-ba6c6bfc";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1ZWxyYWpic295cHBhZXhvcmFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNTI1OTEsImV4cCI6MjA4NjYyODU5MX0.RhLACfDfbQxkBNzaHWz1GqPsSUg3hM74jT9MNuasXhk";
const HEADERS = { "Content-Type": "application/json", "Authorization": `Bearer ${ANON_KEY}` };

const ADMIN_EMAIL = "admin@turfbook.com";
const ADMIN_PASSWORD = "admin123";

// ── Local user registry (primary auth store) ──────────────────────────────────
// Shape: Record<email, StoredUser>
interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "player" | "owner";
  passwordHash: string;
  status: string;
  totalBookings?: number;
  totalTurfs?: number;
  revenue?: number;
  businessName?: string;
  createdAt: string;
}

function registryGet(): Record<string, StoredUser> {
  try {
    return JSON.parse(localStorage.getItem("turfbook_registry") ?? "{}");
  } catch {
    return {};
  }
}

function registrySet(reg: Record<string, StoredUser>) {
  localStorage.setItem("turfbook_registry", JSON.stringify(reg));
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AdminUser { id: string; email: string; name: string; role: "admin" }
export interface PlayerUser { id: string; email: string; name: string; phone?: string; role: "player"; status: string; totalBookings: number }
export interface OwnerUser { id: string; email: string; name: string; phone?: string; businessName?: string; role: "owner"; status: string; totalTurfs: number; revenue: number }
export type AuthUser = AdminUser | PlayerUser | OwnerUser;

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  playerLogin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  ownerLogin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  playerSignup: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  ownerSignup: (data: { name: string; email: string; phone: string; password: string; businessName: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  seedDatabase: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("turfbook_auth");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem("turfbook_auth"); }
    }
    setLoading(false);
    // Best-effort server seed
    fetch(`${API}/seed`, { method: "POST", headers: HEADERS }).catch(() => {});
  }, []);

  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (u) localStorage.setItem("turfbook_auth", JSON.stringify(u));
    else localStorage.removeItem("turfbook_auth");
  };

  // ── Admin ──────────────────────────────────────────────────────────────────

  const adminLogin = async (email: string, password: string) => {
    // Try server first, fall back to hardcoded default
    try {
      const res = await fetch(`${API}/admin/login`, { method: "POST", headers: HEADERS, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (data.success) {
        persist({ ...data.admin, role: "admin" });
        return { success: true };
      }
    } catch {}
    // Fallback: hardcoded admin
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      persist({ id: "main", email: ADMIN_EMAIL, name: "Super Admin", role: "admin" });
      return { success: true };
    }
    return { success: false, message: "Invalid credentials" };
  };

  // ── Players ────────────────────────────────────────────────────────────────

  const playerSignup = async (data: { name: string; email: string; phone: string; password: string }) => {
    const emailKey = data.email.toLowerCase().trim();
    const reg = registryGet();

    if (reg[emailKey]) {
      return { success: false, message: "Email already registered" };
    }

    const passwordHash = await sha256(data.password);
    const id = crypto.randomUUID();
    const newUser: StoredUser = {
      id, name: data.name, email: emailKey, phone: data.phone,
      role: "player", passwordHash, status: "active", totalBookings: 0,
      createdAt: new Date().toISOString(),
    };

    reg[emailKey] = newUser;
    registrySet(reg);

    const sessionUser: PlayerUser = { id, name: data.name, email: emailKey, phone: data.phone, role: "player", status: "active", totalBookings: 0 };
    persist(sessionUser);

    // Best-effort server sync
    fetch(`${API}/players/signup`, {
      method: "POST", headers: HEADERS,
      body: JSON.stringify({ name: data.name, email: emailKey, phone: data.phone, password: data.password }),
    }).catch(() => {});

    return { success: true };
  };

  const playerLogin = async (email: string, password: string) => {
    const emailKey = email.toLowerCase().trim();
    const reg = registryGet();
    const stored = reg[emailKey];

    if (stored && stored.role === "player") {
      const hash = await sha256(password);
      if (stored.passwordHash === hash) {
        const sessionUser: PlayerUser = { id: stored.id, name: stored.name, email: stored.email, phone: stored.phone, role: "player", status: stored.status, totalBookings: stored.totalBookings ?? 0 };
        persist(sessionUser);
        return { success: true };
      }
      return { success: false, message: "Invalid credentials" };
    }

    // Fall back to server (for seeded demo accounts)
    try {
      const res = await fetch(`${API}/players/login`, { method: "POST", headers: HEADERS, body: JSON.stringify({ email: emailKey, password }) });
      const data = await res.json();
      if (data.success) {
        persist({ ...data.player, role: "player" });
        // Cache locally for next time
        const hash = await sha256(password);
        const newReg = registryGet();
        newReg[emailKey] = { ...data.player, role: "player", passwordHash: hash, phone: data.player.phone ?? "" };
        registrySet(newReg);
        return { success: true };
      }
      return { success: false, message: data.message || "not found" };
    } catch {}

    return { success: false, message: "not found" };
  };

  // ── Owners ─────────────────────────────────────────────────────────────────

  const ownerSignup = async (data: { name: string; email: string; phone: string; password: string; businessName: string }) => {
    const emailKey = data.email.toLowerCase().trim();
    const reg = registryGet();

    if (reg[emailKey]) {
      return { success: false, message: "Email already registered" };
    }

    const passwordHash = await sha256(data.password);
    const id = crypto.randomUUID();
    const newUser: StoredUser = {
      id, name: data.name, email: emailKey, phone: data.phone,
      role: "owner", passwordHash, status: "active",
      businessName: data.businessName || data.name,
      totalTurfs: 0, revenue: 0,
      createdAt: new Date().toISOString(),
    };

    reg[emailKey] = newUser;
    registrySet(reg);

    const sessionUser: OwnerUser = { id, name: data.name, email: emailKey, phone: data.phone, role: "owner", status: "active", businessName: data.businessName || data.name, totalTurfs: 0, revenue: 0 };
    persist(sessionUser);

    // Best-effort server sync
    fetch(`${API}/owners/signup`, {
      method: "POST", headers: HEADERS,
      body: JSON.stringify({ name: data.name, email: emailKey, phone: data.phone, password: data.password, businessName: data.businessName }),
    }).catch(() => {});

    return { success: true };
  };

  const ownerLogin = async (email: string, password: string) => {
    const emailKey = email.toLowerCase().trim();
    const reg = registryGet();
    const stored = reg[emailKey];

    if (stored && stored.role === "owner") {
      const hash = await sha256(password);
      if (stored.passwordHash === hash) {
        const sessionUser: OwnerUser = { id: stored.id, name: stored.name, email: stored.email, phone: stored.phone, role: "owner", status: stored.status, businessName: stored.businessName, totalTurfs: stored.totalTurfs ?? 0, revenue: stored.revenue ?? 0 };
        persist(sessionUser);
        return { success: true };
      }
      return { success: false, message: "Invalid credentials" };
    }

    // Fall back to server
    try {
      const res = await fetch(`${API}/owners/login`, { method: "POST", headers: HEADERS, body: JSON.stringify({ email: emailKey, password }) });
      const data = await res.json();
      if (data.success) {
        persist({ ...data.owner, role: "owner" });
        const hash = await sha256(password);
        const newReg = registryGet();
        newReg[emailKey] = { ...data.owner, role: "owner", passwordHash: hash, phone: data.owner.phone ?? "" };
        registrySet(newReg);
        return { success: true };
      }
      return { success: false, message: data.message || "not found" };
    } catch {}

    return { success: false, message: "not found" };
  };

  const logout = () => persist(null);

  const seedDatabase = async () => {
    await fetch(`${API}/seed`, { method: "POST", headers: HEADERS });
  };

  return (
    <AuthContext.Provider value={{ user, loading, adminLogin, playerLogin, ownerLogin, playerSignup, ownerSignup, logout, seedDatabase }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { API as TURFBOOK_API, HEADERS as TURFBOOK_HEADERS };
