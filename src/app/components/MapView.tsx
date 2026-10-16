import { useState, useEffect, useRef, useCallback } from "react";
import { Navigation, Star, MapPin, ZoomIn, ZoomOut, Maximize2, Layers } from "lucide-react";
import { Button } from "./ui/button";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Turf {
  id: number;
  name: string;
  location: string;
  distance?: number;
  image: string;
  price: number;
  rating?: number;
  isOpen?: boolean;
  lat?: number;
  lng?: number;
  sports: string[];
}

interface MapViewProps {
  turfs: Turf[];
}

export function MapView({ turfs }: MapViewProps) {
  const [hoveredTurf, setHoveredTurf] = useState<number | null>(null);
  const [selectedTurf, setSelectedTurf] = useState<number | null>(null);
  const [mapType, setMapType] = useState<"street" | "satellite">("street");
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());

  const initMap = useCallback(() => {
    if (!mapDivRef.current || turfs.length === 0) return;

    const validTurf = turfs.find((t) => t.lat && t.lng);
    const centerLat = validTurf?.lat ?? 19.1368;
    const centerLng = validTurf?.lng ?? 72.8299;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      markersRef.current.clear();
    }

    const map = L.map(mapDivRef.current, {
      center: [centerLat, centerLng],
      zoom: 13,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    const streetLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    const satelliteLayerUrl =
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

    const initialLayer = L.tileLayer(
      mapType === "satellite" ? satelliteLayerUrl : streetLayerUrl,
      {
        attribution:
          mapType === "satellite"
            ? '&copy; <a href="https://www.esri.com/" target="_blank">Esri World Imagery</a>'
            : '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }
    ).addTo(map);

    tileLayerRef.current = initialLayer;
    mapInstanceRef.current = map;

    // Add markers for all turfs
    turfs.forEach((turf) => {
      if (!turf.lat || !turf.lng) return;

      const isOpen = turf.isOpen ?? true;
      const color = isOpen ? "#00E676" : "#FF6B6B";

      const customDivIcon = L.divIcon({
        className: "turf-map-marker",
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;filter:drop-shadow(0 3px 8px ${
            isOpen ? "rgba(0,230,118,0.6)" : "rgba(255,107,107,0.6)"
          });">
            <div style="
              background:${color};color:#121212;font-weight:700;font-size:11px;
              padding:3px 8px;border-radius:6px;white-space:nowrap;
              border:2px solid #121212;margin-bottom:2px;
            ">₹${turf.price}/hr</div>
            <svg width="24" height="30" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 0C4.925 0 0 4.925 0 11C0 19.25 11 28 11 28C11 28 22 19.25 22 11C22 4.925 17.075 0 11 0Z" fill="${color}"/>
              <circle cx="11" cy="11" r="4.5" fill="#121212"/>
              <circle cx="11" cy="11" r="2" fill="${color}"/>
            </svg>
          </div>
        `,
        iconSize: [60, 52],
        iconAnchor: [30, 50],
        popupAnchor: [0, -48],
      });

      const marker = L.marker([turf.lat, turf.lng], { icon: customDivIcon }).addTo(map);

      const popupHtml = `
        <div style="background:#1E1E1E;border-radius:12px;padding:12px;min-width:210px;font-family:system-ui;border:1px solid #1B5E20;color:#fff;">
          <h4 style="color:#fff;font-weight:700;font-size:14px;margin:0 0 4px">${turf.name}</h4>
          <p style="color:#BDBDBD;font-size:11px;margin:0 0 8px;line-height:1.3">${turf.location}</p>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px;">
            <span style="color:#00E676;font-weight:700;font-size:14px">₹${turf.price}/hr</span>
            <a href="/turf/${turf.id}" style="background:#00E676;color:#121212;border-radius:6px;padding:5px 12px;font-size:11px;font-weight:700;text-decoration:none;">View Arena</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: "turf-popup-custom",
        closeButton: true,
      });

      marker.on("click", () => {
        setSelectedTurf(turf.id);
      });

      markersRef.current.set(turf.id, marker);
    });

    const validCoords = turfs
      .filter((t) => t.lat && t.lng)
      .map((t) => [t.lat!, t.lng!] as [number, number]);

    if (validCoords.length > 0) {
      const bounds = L.latLngBounds(validCoords);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [turfs, mapType]);

  useEffect(() => {
    initMap();
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initMap]);

  const toggleLayer = () => {
    const nextType = mapType === "street" ? "satellite" : "street";
    setMapType(nextType);
  };

  const panToTurf = (turf: Turf) => {
    if (!turf.lat || !turf.lng || !mapInstanceRef.current) return;
    setSelectedTurf(turf.id);
    mapInstanceRef.current.flyTo([turf.lat, turf.lng], 15, { duration: 1.2 });
    const marker = markersRef.current.get(turf.id);
    if (marker) {
      marker.openPopup();
    }
  };

  const handleFitAll = () => {
    if (!mapInstanceRef.current || turfs.length === 0) return;
    const validCoords = turfs
      .filter((t) => t.lat && t.lng)
      .map((t) => [t.lat!, t.lng!] as [number, number]);
    if (validCoords.length > 0) {
      const bounds = L.latLngBounds(validCoords);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  return (
    <div className="bg-[#1E1E1E] rounded-[14px] overflow-hidden card-elevation h-[calc(100vh-300px)] border border-[#1B5E20]/40">
      <div className="flex h-full">
        {/* Left panel — turf list */}
        <div className="w-80 bg-[#121212] border-r border-[#1B5E20]/50 overflow-y-auto flex-shrink-0">
          <div className="p-4 border-b border-[#1B5E20]/50 sticky top-0 bg-[#121212] z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#00E676]" />
                {turfs.length} Turfs Found
              </h3>
              <span className="text-[11px] bg-[#00E676]/10 text-[#00E676] px-2 py-0.5 rounded-full font-medium">
                Live Map
              </span>
            </div>
            <p className="text-[#BDBDBD] text-xs mt-1">Click a venue to focus on the map</p>
          </div>
          <div className="p-3 space-y-3">
            {turfs.map((turf) => (
              <div
                key={turf.id}
                onMouseEnter={() => setHoveredTurf(turf.id)}
                onMouseLeave={() => setHoveredTurf(null)}
                onClick={() => panToTurf(turf)}
                className={`bg-[#1E1E1E] rounded-xl p-3 cursor-pointer transition-all border ${
                  hoveredTurf === turf.id || selectedTurf === turf.id
                    ? "border-[#00E676] shadow-[0_0_12px_rgba(0,230,118,0.25)] translate-x-0.5"
                    : "border-[#1B5E20]/40 hover:border-[#1B5E20]"
                }`}
              >
                <div className="flex gap-3">
                  <img
                    src={turf.image}
                    alt={turf.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h4 className="text-white font-semibold text-xs leading-tight truncate">
                        {turf.name}
                      </h4>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap flex-shrink-0 ${
                          turf.isOpen ?? true
                            ? "bg-[#00E676]/20 text-[#00E676]"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {turf.isOpen ?? true ? "Open" : "Closed"}
                      </span>
                    </div>
                    <p className="text-[#BDBDBD] text-[11px] mb-1.5 truncate">{turf.location}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] text-[#BDBDBD]">
                        {turf.distance !== undefined && (
                          <span className="flex items-center gap-0.5">
                            <Navigation className="h-3 w-3 text-[#00E676]" />
                            {turf.distance} km
                          </span>
                        )}
                        {turf.rating !== undefined && (
                          <span className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 text-[#00E676] fill-[#00E676]" />
                            {turf.rating}
                          </span>
                        )}
                      </div>
                      <span className="text-[#00E676] font-bold text-xs">₹{turf.price}/hr</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — OpenStreetMap & Satellite Map */}
        <div className="flex-1 relative">
          <div ref={mapDivRef} className="absolute inset-0 w-full h-full" />

          {/* Map Controls */}
          <div className="absolute right-4 top-4 flex flex-col gap-2 z-[400]">
            <Button
              size="icon"
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="bg-[#1E1E1E]/90 hover:bg-[#2a2a2a] text-white border border-[#1B5E20] w-9 h-9 shadow-lg backdrop-blur"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="bg-[#1E1E1E]/90 hover:bg-[#2a2a2a] text-white border border-[#1B5E20] w-9 h-9 shadow-lg backdrop-blur"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              onClick={toggleLayer}
              className={`border border-[#1B5E20] w-9 h-9 shadow-lg backdrop-blur ${
                mapType === "satellite"
                  ? "bg-[#00E676] text-[#121212]"
                  : "bg-[#1E1E1E]/90 text-white hover:bg-[#2a2a2a]"
              }`}
              title={mapType === "street" ? "Switch to Satellite View" : "Switch to Street View"}
            >
              <Layers className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              onClick={handleFitAll}
              className="bg-[#1E1E1E]/90 hover:bg-[#2a2a2a] text-[#00E676] border border-[#1B5E20] w-9 h-9 shadow-lg backdrop-blur"
              title="Fit All Turfs"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Layer and Fit all buttons bottom */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 z-[400]">
            <Button
              onClick={toggleLayer}
              variant="outline"
              className="bg-[#1E1E1E]/90 border-[#1B5E20] text-xs text-white hover:text-[#00E676] h-auto py-1.5 px-3 backdrop-blur"
            >
              {mapType === "street" ? "🛰️ Satellite View" : "🗺️ Street Map"}
            </Button>
            <Button
              onClick={handleFitAll}
              className="bg-[#00E676] text-[#121212] hover:bg-[#00E676]/90 font-bold text-xs px-3.5 py-1.5 h-auto shadow-[0_4px_14px_rgba(0,230,118,0.35)]"
            >
              Fit All Venues
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
