import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { fetchRealTurfsFromOSM, calculateDistance } from "../services/osmTurfs";
import { TURFBOOK_API, TURFBOOK_HEADERS } from "./AuthContext";

export interface Turf {
  id: number | string;
  name: string;
  location: string;
  image: string;
  price: number;
  sports: string[];
  covered: boolean;
  amenities: string[];
  description?: string;
  maxPlayers?: number;
  qrCode?: string;
  // For Player Dashboard
  distance?: number;
  rating?: number;
  reviews?: number;
  open24x7?: boolean;
  hasOffer?: boolean;
  isOpen?: boolean;
  lat?: number;
  lng?: number;
  // For Owner Dashboard
  totalBookings?: number;
  status?: string;
  ownerId?: string;
}

interface TurfContextType {
  turfs: Turf[];
  activeCity: string;
  isLoadingLiveTurfs: boolean;
  isDatabaseConnected: boolean;
  setActiveCity: (city: string) => void;
  addTurf: (turf: Omit<Turf, "id">) => Promise<void>;
  updateTurf: (id: number | string, turf: Partial<Turf>) => Promise<void>;
  deleteTurf: (id: number | string) => Promise<void>;
  fetchLiveTurfsByCity: (city: string) => Promise<void>;
  fetchTurfsNearUser: () => Promise<void>;
  refreshFromDatabase: () => Promise<void>;
}

const TurfContext = createContext<TurfContextType | undefined>(undefined);

// Real-world fallback turfs if database connection is pending
const initialTurfs: Turf[] = [
  {
    id: "1ab16f3d-aca1-4d81-9a3d-b356c9a23eb9",
    name: "Thakur Shyamnarayan Turf",
    location: "Thakur Village, Kandivali East, Mumbai",
    distance: 1.2,
    image: "/turfs/thakur_cricket_turf.jpg",
    price: 1400,
    sports: ["Box Cricket", "Football"],
    rating: 4.1,
    reviews: 391,
    covered: true,
    open24x7: false,
    hasOffer: true,
    amenities: ["Parking", "Washroom", "Floodlights", "Cafeteria"],
    isOpen: true,
    lat: 19.2085,
    lng: 72.8725,
    totalBookings: 84,
    status: "Active",
    description: "Famous covered box cricket arena in Evershine Millennium Paradise, Thakur Village, Kandivali East. High-tension boundary netting, cushioned turf pitch, and tournament scoreboards.",
  },
  {
    id: "be2caf35-36cc-4356-81ae-a91503e57ca7",
    name: "Players Turf At Goregaon",
    location: "SV Road, Goregaon West, Mumbai",
    distance: 2.4,
    image: "/turfs/players_turf_rooftop.jpg",
    price: 1600,
    sports: ["Football", "Cricket"],
    rating: 4.1,
    reviews: 370,
    covered: false,
    open24x7: true,
    hasOffer: true,
    amenities: ["Terrace View", "Parking", "Washroom", "Floodlights", "Cafe"],
    isOpen: true,
    lat: 19.162,
    lng: 72.845,
    totalBookings: 112,
    status: "Active",
    description: "Iconic open-air rooftop turf at Small Scale Industrial Premises, SV Road Goregaon. Features panoramic Mumbai skyline views, professional 5-a-side football perimeter, and cafe.",
  },
  {
    id: "9fdb711f-7dcc-4147-84ce-4433c13511b5",
    name: "Hi5ers Turf - Goregaon",
    location: "Vishveshwar Nagar Rd, Goregaon East, Mumbai",
    distance: 2.8,
    image: "/turfs/football_arena_night.jpg",
    price: 1500,
    sports: ["Football", "Box Cricket"],
    rating: 4.1,
    reviews: 229,
    covered: true,
    open24x7: true,
    hasOffer: false,
    amenities: ["Parking", "Washroom", "Floodlights", "Sound System"],
    isOpen: true,
    lat: 19.1685,
    lng: 72.859,
    totalBookings: 63,
    status: "Active",
    description: "Premier 24x7 floodlit caged sports turf in Grambir Industrial Estate, Goregaon East. FIFA-certified synthetic grass with rebound netting.",
  },
  {
    id: "b3d370b6-1521-4086-8aae-806eddace754",
    name: "Goalster Sports Arena",
    location: "Evershine Dream Park, Kandivali East, Mumbai",
    distance: 1.4,
    image: "/turfs/goalster_sports_arena.jpg",
    price: 1300,
    sports: ["Cricket", "Football", "Badminton"],
    rating: 4.6,
    reviews: 215,
    covered: false,
    open24x7: true,
    hasOffer: true,
    amenities: ["Dugout Seating", "Cafeteria", "Parking", "Floodlights"],
    isOpen: true,
    lat: 19.2078,
    lng: 72.8718,
    totalBookings: 96,
    status: "Active",
    description: "Spacious community sports hub in Kandivali East with dedicated box cricket lanes, futsal pitch, cafeteria, and viewing dugouts.",
  },
  {
    id: "a88ee595-ce71-4e3a-8dfd-9f2343c99f85",
    name: "Astro Turf Bandra",
    location: "St Peter's Road, Khar West, Mumbai",
    distance: 2.1,
    image: "/turfs/players_turf_rooftop.jpg",
    price: 1600,
    sports: ["Football", "Cricket"],
    rating: 4.9,
    reviews: 218,
    covered: false,
    open24x7: true,
    hasOffer: true,
    amenities: ["Parking", "Washroom", "Floodlights", "Cafeteria"],
    isOpen: true,
    lat: 19.0544,
    lng: 72.8304,
    totalBookings: 68,
    status: "Active",
    description: "Famous open-air turf near Bandra/Khar with top-tier artificial grass, perfect for 5-a-side football and box cricket tournaments.",
  },
  {
    id: "127f0be2-124b-4b6e-90e1-36b9d7f247dd",
    name: "Sportobuddy Sports Arena",
    location: "Andheri West, Mumbai",
    distance: 1.4,
    image: "/turfs/football_arena_night.jpg",
    price: 1500,
    sports: ["Cricket", "Football"],
    rating: 4.8,
    reviews: 124,
    covered: true,
    open24x7: false,
    hasOffer: true,
    amenities: ["Parking", "Washroom", "Cafeteria", "Floodlights"],
    isOpen: true,
    lat: 19.1368,
    lng: 72.8299,
    totalBookings: 45,
    status: "Active",
    description: "Premier multi-sport turf in Andheri West featuring FIFA-grade astro turf, high-intensity LED floodlights, and premium changing rooms.",
  },
];

export function TurfProvider({ children }: { children: ReactNode }) {
  const [turfs, setTurfs] = useState<Turf[]>(initialTurfs);
  const [activeCity, setActiveCity] = useState<string>("Mumbai");
  const [isLoadingLiveTurfs, setIsLoadingLiveTurfs] = useState<boolean>(false);
  const [isDatabaseConnected, setIsDatabaseConnected] = useState<boolean>(false);

  // Load from Supabase on mount
  const refreshFromDatabase = useCallback(async () => {
    try {
      const res = await fetch(`${TURFBOOK_API}/turfs`, { headers: TURFBOOK_HEADERS });
      if (res.ok) {
        const dbTurfs = await res.json();
        if (Array.isArray(dbTurfs) && dbTurfs.length > 0) {
          // Calculate realistic distance from Mumbai center if missing
          const mapped = dbTurfs.map((t: Turf) => ({
            ...t,
            distance: t.distance ?? (t.lat && t.lng ? calculateDistance(19.2085, 72.8725, t.lat, t.lng) : 1.5),
          }));
          setTurfs(mapped);
          setIsDatabaseConnected(true);
          return;
        }
      }
    } catch (err) {
      console.warn("Supabase fetch failed, falling back to local cache:", err);
    }
  }, []);

  useEffect(() => {
    refreshFromDatabase();
  }, [refreshFromDatabase]);

  const addTurf = async (newTurf: Omit<Turf, "id">) => {
    const turfWithDefaults = {
      ...newTurf,
      distance: 0,
      rating: 4.8,
      reviews: 1,
      open24x7: false,
      hasOffer: false,
      isOpen: true,
      lat: newTurf.lat || 19.1197,
      lng: newTurf.lng || 72.8464,
      totalBookings: 0,
      status: "Active",
    };

    // Optimistic UI update
    const tempId = "temp-" + Date.now();
    setTurfs((prev) => [{ ...turfWithDefaults, id: tempId }, ...prev]);

    // Persist to Supabase Database
    try {
      const res = await fetch(`${TURFBOOK_API}/turfs`, {
        method: "POST",
        headers: TURFBOOK_HEADERS,
        body: JSON.stringify(turfWithDefaults),
      });
      if (res.ok) {
        const saved = await res.json();
        setTurfs((prev) =>
          prev.map((t) => (t.id === tempId ? { ...t, id: saved.id } : t))
        );
      }
    } catch (err) {
      console.warn("Could not save turf to Supabase, saved locally:", err);
    }
  };

  const updateTurf = async (id: number | string, updatedTurf: Partial<Turf>) => {
    setTurfs((prev) =>
      prev.map((turf) => (String(turf.id) === String(id) ? { ...turf, ...updatedTurf } : turf))
    );

    // Sync status change to Supabase
    if (updatedTurf.status) {
      try {
        await fetch(`${TURFBOOK_API}/admin/turfs/${id}/status`, {
          method: "PATCH",
          headers: TURFBOOK_HEADERS,
          body: JSON.stringify({ status: updatedTurf.status }),
        });
      } catch (err) {
        console.warn("Supabase patch failed:", err);
      }
    }
  };

  const deleteTurf = async (id: number | string) => {
    setTurfs((prev) => prev.filter((turf) => String(turf.id) !== String(id)));

    try {
      await fetch(`${TURFBOOK_API}/admin/turfs/${id}`, {
        method: "DELETE",
        headers: TURFBOOK_HEADERS,
      });
    } catch (err) {
      console.warn("Supabase delete failed:", err);
    }
  };

  const fetchLiveTurfsByCity = useCallback(async (city: string) => {
    setIsLoadingLiveTurfs(true);
    setActiveCity(city);
    try {
      const liveVenues = await fetchRealTurfsFromOSM(city);
      if (liveVenues.length > 0) {
        setTurfs((prev) => {
          const nonOSMTurfs = prev.filter((t) => typeof t.id === "string");
          return [...liveVenues, ...nonOSMTurfs];
        });
      }
    } catch (err) {
      console.warn("Failed to fetch live turfs:", err);
    } finally {
      setIsLoadingLiveTurfs(false);
    }
  }, []);

  const fetchTurfsNearUser = useCallback(async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoadingLiveTurfs(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const geoData = await geoRes.json();
          const detectedCity =
            geoData.address?.city ||
            geoData.address?.town ||
            geoData.address?.suburb ||
            geoData.address?.state_district ||
            "Local Area";

          setActiveCity(detectedCity);

          const liveVenues = await fetchRealTurfsFromOSM(detectedCity, {
            lat: latitude,
            lng: longitude,
          });

          if (liveVenues.length > 0) {
            setTurfs(liveVenues);
          } else {
            setTurfs((prev) =>
              prev.map((t) => ({
                ...t,
                distance: t.lat && t.lng ? calculateDistance(latitude, longitude, t.lat, t.lng) : t.distance,
              }))
            );
          }
        } catch (err) {
          console.warn("Location fetch error:", err);
        } finally {
          setIsLoadingLiveTurfs(false);
        }
      },
      (err) => {
        console.warn("Geolocation denied or unavailable:", err);
        setIsLoadingLiveTurfs(false);
      },
      { timeout: 8000 }
    );
  }, []);

  return (
    <TurfContext.Provider
      value={{
        turfs,
        activeCity,
        isLoadingLiveTurfs,
        isDatabaseConnected,
        setActiveCity,
        addTurf,
        updateTurf,
        deleteTurf,
        fetchLiveTurfsByCity,
        fetchTurfsNearUser,
        refreshFromDatabase,
      }}
    >
      {children}
    </TurfContext.Provider>
  );
}

export function useTurfs() {
  const context = useContext(TurfContext);
  if (context === undefined) {
    throw new Error("useTurfs must be used within a TurfProvider");
  }
  return context;
}
