const API_KEY = "AIzaSyBM_09N9qw5WaXhBvWdvYuCejq6X7LiRmc";

// Module-level state — one loader per JS module instance
let loaded = false;
let loading = false;
const queue: (() => void)[] = [];

export function loadGoogleMaps(cb: () => void) {
  if (loaded) { cb(); return; }
  queue.push(cb);
  if (loading) return;
  loading = true;

  (window as any).initGoogleMap = () => {
    loaded = true;
    queue.splice(0).forEach((fn) => fn());
  };

  const existing = document.querySelector(
    `script[src*="maps.googleapis.com"]`
  );
  if (existing) {
    // Script already in DOM (e.g. hot-reload) — just wait for it
    if ((window as any).google?.maps) {
      (window as any).initGoogleMap();
    }
    return;
  }

  const s = document.createElement("script");
  s.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initGoogleMap&libraries=marker&loading=async`;
  s.async = true;
  s.defer = true;
  document.head.appendChild(s);
}

export function isMapsLoaded() {
  return loaded;
}
