import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface GoogleMapPinProps {
  lat: number;
  lng: number;
  locationName: string;
  turfName: string;
  price: number;
  height?: string;
  zoom?: number;
}

export function GoogleMapPin({
  lat,
  lng,
  locationName,
  turfName,
  price,
  height = "256px",
  zoom = 15,
}: GoogleMapPinProps) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapDivRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapDivRef.current, {
      center: [lat, lng],
      zoom,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    // Clean OpenStreetMap tiles - 100% Free, No Watermark, No API Key
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    const customPin = L.divIcon({
      className: "turf-detail-marker",
      html: `
        <div style="
          display:flex;flex-direction:column;align-items:center;cursor:pointer;
          filter:drop-shadow(0 4px 12px rgba(0,230,118,0.6));
        ">
          <div style="
            background:#00E676;color:#121212;font-weight:700;font-size:11px;
            padding:4px 9px;border-radius:8px;white-space:nowrap;
            box-shadow:0 0 0 2px #121212,0 0 0 3px #00E676;
            margin-bottom:3px;
          ">${turfName} · ₹${price}/hr</div>
          <svg width="26" height="32" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#00E676"/>
            <circle cx="14" cy="14" r="6" fill="#121212"/>
            <circle cx="14" cy="14" r="3" fill="#00E676"/>
          </svg>
        </div>
      `,
      iconSize: [120, 50],
      iconAnchor: [60, 48],
      popupAnchor: [0, -48],
    });

    const marker = L.marker([lat, lng], { icon: customPin }).addTo(map);
    marker.bindPopup(
      `<div style="font-family:system-ui;font-size:12px;font-weight:600;color:#121212;">${locationName}</div>`
    );

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, zoom, turfName, locationName, price]);

  return (
    <div
      style={{
        height,
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
        border: "1px solid rgba(27, 94, 32, 0.4)",
      }}
    >
      <div ref={mapDivRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
