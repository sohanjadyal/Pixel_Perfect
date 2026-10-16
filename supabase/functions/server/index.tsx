import { Hono } from "npm:hono";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();
const PREFIX = "/make-server-ba6c6bfc";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
  "Access-Control-Max-Age": "600",
};

// Handle every OPTIONS preflight immediately
app.options("*", (c) => new Response(null, { status: 204, headers: CORS }));

// Inject CORS headers into every response
app.use("*", async (c, next) => {
  await next();
  Object.entries(CORS).forEach(([k, v]) => c.res.headers.set(k, v));
});

app.use("*", logger(console.log));

// ──────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────
function uuid() {
  return crypto.randomUUID();
}

function now() {
  return new Date().toISOString();
}

async function listByPrefix(prefix: string) {
  return await kv.getByPrefix(prefix);
}

// ──────────────────────────────────────────────────
// Health
// ──────────────────────────────────────────────────
app.get(`${PREFIX}/health`, (c) => c.json({ status: "ok" }));

// ──────────────────────────────────────────────────
// SEED – idempotent: only runs if no admin exists
// ──────────────────────────────────────────────────
app.post(`${PREFIX}/seed`, async (c) => {
  try {
    const existing = await kv.get("admin:main");
    if (existing) return c.json({ seeded: false, message: "Already seeded" });

    // Create admin
    await kv.set("admin:main", {
      id: "main",
      email: "admin@turfbook.com",
      password: "admin123",
      name: "Super Admin",
      role: "admin",
      createdAt: now(),
    });

    // Seed sample players
    const players = [
      { id: uuid(), name: "Rahul Sharma", email: "rahul@example.com", phone: "+91 9876543210", password: "pass123", status: "active", totalBookings: 12, createdAt: now() },
      { id: uuid(), name: "Priya Nair", email: "priya@example.com", phone: "+91 9123456789", password: "pass123", status: "active", totalBookings: 7, createdAt: now() },
      { id: uuid(), name: "Arjun Mehta", email: "arjun@example.com", phone: "+91 9988776655", password: "pass123", status: "active", totalBookings: 3, createdAt: now() },
    ];
    for (const p of players) await kv.set(`player:${p.id}`, p);

    // Seed sample owners
    const owners = [
      { id: uuid(), name: "Vikram Patel", email: "vikram@example.com", phone: "+91 9845123456", password: "pass123", businessName: "VP Sports", status: "active", totalTurfs: 2, revenue: 85000, createdAt: now() },
      { id: uuid(), name: "Sneha Reddy", email: "sneha@example.com", phone: "+91 9731234567", password: "pass123", businessName: "Sneha Sports Arena", status: "active", totalTurfs: 1, revenue: 42000, createdAt: now() },
    ];
    for (const o of owners) await kv.set(`owner:${o.id}`, o);

    // Seed sample turfs
    const turfList = [
      {
        id: uuid(),
        name: "Green Valley Sports Arena",
        location: "Koramangala, Bangalore",
        price: 1500,
        sports: ["Cricket", "Football"],
        covered: true,
        amenities: ["Parking", "Washroom", "Cafeteria"],
        image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800",
        lat: 12.9352, lng: 77.6245,
        rating: 4.8, reviews: 124,
        open24x7: false, isOpen: true, hasOffer: true,
        status: "Active", totalBookings: 45,
        ownerId: owners[0].id,
        createdAt: now(),
      },
      {
        id: uuid(),
        name: "Champions Cricket Ground",
        location: "Indiranagar, Bangalore",
        price: 2000,
        sports: ["Cricket"],
        covered: false,
        amenities: ["Parking", "Washroom"],
        image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800",
        lat: 12.9716, lng: 77.6412,
        rating: 4.6, reviews: 89,
        open24x7: true, isOpen: true, hasOffer: false,
        status: "Active", totalBookings: 32,
        ownerId: owners[0].id,
        createdAt: now(),
      },
      {
        id: uuid(),
        name: "Elite Football Turf",
        location: "HSR Layout, Bangalore",
        price: 1200,
        sports: ["Football", "Pickleball"],
        covered: true,
        amenities: ["Parking", "Washroom", "Cafeteria", "Changing Room"],
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
        lat: 12.9121, lng: 77.6446,
        rating: 4.9, reviews: 203,
        open24x7: true, isOpen: true, hasOffer: true,
        status: "Active", totalBookings: 58,
        ownerId: owners[1].id,
        createdAt: now(),
      },
    ];
    for (const t of turfList) await kv.set(`turf:${t.id}`, t);

    // Seed sample bookings
    const turfIds = turfList.map((t) => t.id);
    const playerIds = players.map((p) => p.id);
    const bookings = [
      { id: uuid(), turfId: turfIds[0], turfName: "Green Valley Sports Arena", playerId: playerIds[0], playerName: "Rahul Sharma", date: "2026-10-10", slot: "06:00 - 07:00", sport: "Cricket", amount: 1500, status: "confirmed", createdAt: now() },
      { id: uuid(), turfId: turfIds[1], turfName: "Champions Cricket Ground", playerId: playerIds[1], playerName: "Priya Nair", date: "2026-10-11", slot: "08:00 - 09:00", sport: "Cricket", amount: 2000, status: "confirmed", createdAt: now() },
      { id: uuid(), turfId: turfIds[2], turfName: "Elite Football Turf", playerId: playerIds[2], playerName: "Arjun Mehta", date: "2026-10-12", slot: "17:00 - 18:00", sport: "Football", amount: 1200, status: "pending", createdAt: now() },
      { id: uuid(), turfId: turfIds[0], turfName: "Green Valley Sports Arena", playerId: playerIds[1], playerName: "Priya Nair", date: "2026-10-13", slot: "19:00 - 20:00", sport: "Football", amount: 1500, status: "cancelled", createdAt: now() },
    ];
    for (const b of bookings) await kv.set(`booking:${b.id}`, b);

    return c.json({ seeded: true, message: "Database seeded successfully" });
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

// ──────────────────────────────────────────────────
// ADMIN AUTH
// ──────────────────────────────────────────────────
app.post(`${PREFIX}/admin/login`, async (c) => {
  try {
    const { email, password } = await c.req.json();
    const admin = await kv.get("admin:main");
    if (!admin) {
      // Auto-create default admin if missing
      const defaultAdmin = { id: "main", email: "admin@turfbook.com", password: "admin123", name: "Super Admin", role: "admin", createdAt: now() };
      await kv.set("admin:main", defaultAdmin);
      if (email === defaultAdmin.email && password === defaultAdmin.password) {
        const { password: _, ...safe } = defaultAdmin;
        return c.json({ success: true, admin: safe });
      }
      return c.json({ success: false, message: "Invalid credentials" }, 401);
    }
    if (admin.email !== email || admin.password !== password) {
      return c.json({ success: false, message: "Invalid credentials" }, 401);
    }
    const { password: _, ...safe } = admin;
    return c.json({ success: true, admin: safe });
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

// ──────────────────────────────────────────────────
// ADMIN STATS
// ──────────────────────────────────────────────────
app.get(`${PREFIX}/admin/stats`, async (c) => {
  try {
    const [players, owners, turfs, bookings] = await Promise.all([
      listByPrefix("player:"),
      listByPrefix("owner:"),
      listByPrefix("turf:"),
      listByPrefix("booking:"),
    ]);
    const totalRevenue = bookings.filter((b: any) => b.status === "confirmed").reduce((sum: number, b: any) => sum + (b.amount || 0), 0);
    const confirmedBookings = bookings.filter((b: any) => b.status === "confirmed").length;
    return c.json({
      totalPlayers: players.length,
      totalOwners: owners.length,
      totalTurfs: turfs.length,
      totalBookings: bookings.length,
      confirmedBookings,
      totalRevenue,
      pendingBookings: bookings.filter((b: any) => b.status === "pending").length,
      activeTurfs: turfs.filter((t: any) => t.status === "Active").length,
    });
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

// ──────────────────────────────────────────────────
// ADMIN – PLAYERS
// ──────────────────────────────────────────────────
app.get(`${PREFIX}/admin/players`, async (c) => {
  try {
    const players = await listByPrefix("player:");
    return c.json(players.map(({ password, ...p }: any) => p));
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

app.delete(`${PREFIX}/admin/players/:id`, async (c) => {
  try {
    await kv.del(`player:${c.req.param("id")}`);
    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

app.patch(`${PREFIX}/admin/players/:id/status`, async (c) => {
  try {
    const player = await kv.get(`player:${c.req.param("id")}`);
    if (!player) return c.json({ error: "Not found" }, 404);
    const { status } = await c.req.json();
    const updated = { ...player, status };
    await kv.set(`player:${c.req.param("id")}`, updated);
    const { password: _, ...safe } = updated;
    return c.json(safe);
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

// ──────────────────────────────────────────────────
// ADMIN – OWNERS
// ──────────────────────────────────────────────────
app.get(`${PREFIX}/admin/owners`, async (c) => {
  try {
    const owners = await listByPrefix("owner:");
    return c.json(owners.map(({ password, ...o }: any) => o));
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

app.delete(`${PREFIX}/admin/owners/:id`, async (c) => {
  try {
    await kv.del(`owner:${c.req.param("id")}`);
    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

app.patch(`${PREFIX}/admin/owners/:id/status`, async (c) => {
  try {
    const owner = await kv.get(`owner:${c.req.param("id")}`);
    if (!owner) return c.json({ error: "Not found" }, 404);
    const { status } = await c.req.json();
    const updated = { ...owner, status };
    await kv.set(`owner:${c.req.param("id")}`, updated);
    const { password: _, ...safe } = updated;
    return c.json(safe);
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

// ──────────────────────────────────────────────────
// ADMIN – TURFS
// ──────────────────────────────────────────────────
app.get(`${PREFIX}/admin/turfs`, async (c) => {
  try {
    const turfs = await listByPrefix("turf:");
    return c.json(turfs);
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

app.delete(`${PREFIX}/admin/turfs/:id`, async (c) => {
  try {
    await kv.del(`turf:${c.req.param("id")}`);
    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

app.patch(`${PREFIX}/admin/turfs/:id/status`, async (c) => {
  try {
    const turf = await kv.get(`turf:${c.req.param("id")}`);
    if (!turf) return c.json({ error: "Not found" }, 404);
    const { status } = await c.req.json();
    const updated = { ...turf, status };
    await kv.set(`turf:${c.req.param("id")}`, updated);
    return c.json(updated);
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

// ──────────────────────────────────────────────────
// ADMIN – BOOKINGS
// ──────────────────────────────────────────────────
app.get(`${PREFIX}/admin/bookings`, async (c) => {
  try {
    const bookings = await listByPrefix("booking:");
    return c.json(bookings);
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

app.delete(`${PREFIX}/admin/bookings/:id`, async (c) => {
  try {
    await kv.del(`booking:${c.req.param("id")}`);
    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

app.patch(`${PREFIX}/admin/bookings/:id/status`, async (c) => {
  try {
    const booking = await kv.get(`booking:${c.req.param("id")}`);
    if (!booking) return c.json({ error: "Not found" }, 404);
    const { status } = await c.req.json();
    const updated = { ...booking, status };
    await kv.set(`booking:${c.req.param("id")}`, updated);
    return c.json(updated);
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

// ──────────────────────────────────────────────────
// PLAYER AUTH
// ──────────────────────────────────────────────────
app.post(`${PREFIX}/players/signup`, async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, phone, password } = body;
    // Check for existing email
    const all = await listByPrefix("player:");
    const exists = all.find((p: any) => p.email === email);
    if (exists) return c.json({ success: false, message: "Email already registered" }, 409);
    const id = uuid();
    const player = { id, name, email, phone, password, status: "active", totalBookings: 0, createdAt: now() };
    await kv.set(`player:${id}`, player);
    const { password: _, ...safe } = player;
    return c.json({ success: true, player: safe });
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

app.post(`${PREFIX}/players/login`, async (c) => {
  try {
    const { email, password } = await c.req.json();
    const all = await listByPrefix("player:");
    const player = all.find((p: any) => p.email === email && p.password === password);
    if (!player) return c.json({ success: false, message: "Invalid credentials" }, 401);
    if (player.status === "suspended") return c.json({ success: false, message: "Account suspended" }, 403);
    const { password: _, ...safe } = player;
    return c.json({ success: true, player: safe });
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

// ──────────────────────────────────────────────────
// OWNER AUTH
// ──────────────────────────────────────────────────
app.post(`${PREFIX}/owners/signup`, async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, phone, password, businessName } = body;
    const all = await listByPrefix("owner:");
    const exists = all.find((o: any) => o.email === email);
    if (exists) return c.json({ success: false, message: "Email already registered" }, 409);
    const id = uuid();
    const owner = { id, name, email, phone, password, businessName: businessName || name, status: "active", totalTurfs: 0, revenue: 0, createdAt: now() };
    await kv.set(`owner:${id}`, owner);
    const { password: _, ...safe } = owner;
    return c.json({ success: true, owner: safe });
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

app.post(`${PREFIX}/owners/login`, async (c) => {
  try {
    const { email, password } = await c.req.json();
    const all = await listByPrefix("owner:");
    const owner = all.find((o: any) => o.email === email && o.password === password);
    if (!owner) return c.json({ success: false, message: "Invalid credentials" }, 401);
    if (owner.status === "suspended") return c.json({ success: false, message: "Account suspended" }, 403);
    const { password: _, ...safe } = owner;
    return c.json({ success: true, owner: safe });
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

// ──────────────────────────────────────────────────
// TURFS (public + owner operations)
// ──────────────────────────────────────────────────
app.get(`${PREFIX}/turfs`, async (c) => {
  try {
    const turfs = await listByPrefix("turf:");
    return c.json(turfs);
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

app.get(`${PREFIX}/turfs/:id`, async (c) => {
  try {
    const turf = await kv.get(`turf:${c.req.param("id")}`);
    if (!turf) return c.json({ error: "Not found" }, 404);
    return c.json(turf);
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

app.post(`${PREFIX}/turfs`, async (c) => {
  try {
    const body = await c.req.json();
    const id = uuid();
    const turf = {
      id,
      ...body,
      status: body.status || "Active",
      totalBookings: 0,
      rating: body.rating || 0,
      reviews: body.reviews || 0,
      isOpen: true,
      createdAt: now(),
    };
    await kv.set(`turf:${id}`, turf);
    // Update owner's turf count
    if (turf.ownerId) {
      const owner = await kv.get(`owner:${turf.ownerId}`);
      if (owner) await kv.set(`owner:${turf.ownerId}`, { ...owner, totalTurfs: (owner.totalTurfs || 0) + 1 });
    }
    return c.json(turf, 201);
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

app.put(`${PREFIX}/turfs/:id`, async (c) => {
  try {
    const existing = await kv.get(`turf:${c.req.param("id")}`);
    if (!existing) return c.json({ error: "Not found" }, 404);
    const body = await c.req.json();
    const updated = { ...existing, ...body, updatedAt: now() };
    await kv.set(`turf:${c.req.param("id")}`, updated);
    return c.json(updated);
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

app.delete(`${PREFIX}/turfs/:id`, async (c) => {
  try {
    const turf = await kv.get(`turf:${c.req.param("id")}`);
    if (!turf) return c.json({ error: "Not found" }, 404);
    await kv.del(`turf:${c.req.param("id")}`);
    if (turf.ownerId) {
      const owner = await kv.get(`owner:${turf.ownerId}`);
      if (owner) await kv.set(`owner:${turf.ownerId}`, { ...owner, totalTurfs: Math.max(0, (owner.totalTurfs || 1) - 1) });
    }
    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

// ──────────────────────────────────────────────────
// BOOKINGS
// ──────────────────────────────────────────────────
app.get(`${PREFIX}/bookings`, async (c) => {
  try {
    const { playerId, ownerId, turfId } = c.req.query();
    let bookings = await listByPrefix("booking:");
    if (playerId) bookings = bookings.filter((b: any) => b.playerId === playerId);
    if (turfId) bookings = bookings.filter((b: any) => b.turfId === turfId);
    return c.json(bookings);
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

app.post(`${PREFIX}/bookings`, async (c) => {
  try {
    const body = await c.req.json();
    const id = uuid();
    const booking = { id, ...body, status: "confirmed", createdAt: now() };
    await kv.set(`booking:${id}`, booking);
    // Increment turf booking count
    if (booking.turfId) {
      const turf = await kv.get(`turf:${booking.turfId}`);
      if (turf) await kv.set(`turf:${booking.turfId}`, { ...turf, totalBookings: (turf.totalBookings || 0) + 1 });
    }
    // Increment player booking count
    if (booking.playerId) {
      const player = await kv.get(`player:${booking.playerId}`);
      if (player) await kv.set(`player:${booking.playerId}`, { ...player, totalBookings: (player.totalBookings || 0) + 1 });
    }
    return c.json(booking, 201);
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

app.patch(`${PREFIX}/bookings/:id/status`, async (c) => {
  try {
    const booking = await kv.get(`booking:${c.req.param("id")}`);
    if (!booking) return c.json({ error: "Not found" }, 404);
    const { status } = await c.req.json();
    const updated = { ...booking, status };
    await kv.set(`booking:${c.req.param("id")}`, updated);
    return c.json(updated);
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

Deno.serve(app.fetch);
