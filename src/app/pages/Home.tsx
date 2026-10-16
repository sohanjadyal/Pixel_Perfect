import { useState } from "react";
import { Logo } from "../components/Logo";
import { Link } from "react-router";
import {
  Search,
  Bell,
  User,
  MapPin,
  Filter,
  Map,
  LocateFixed,
  Loader2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { FeaturedCarousel } from "../components/FeaturedCarousel";
import { FilterSidebar } from "../components/FilterSidebar";
import { TurfCard } from "../components/TurfCard";
import { MapView } from "../components/MapView";
import { MyBookings } from "../components/MyBookings";
import { MatchSection } from "../components/MatchSection";
import { useTurfs } from "../context/TurfContext";

export function Home() {
  const {
    turfs,
    activeCity,
    isLoadingLiveTurfs,
    fetchLiveTurfsByCity,
    fetchTurfsNearUser,
  } = useTurfs();
  const [activeTab, setActiveTab] = useState("home");
  const [showFilter, setShowFilter] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map">(
    "grid",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const [activeFilters, setActiveFilters] = useState({
    sortBy: "distance",
    offers: false,
    covered: false,
    uncovered: false,
    open24x7: false,
    availableOnly: false,
    sports: [] as string[],
    amenities: [] as string[],
  });

  const isLoggedIn = !!localStorage.getItem("turfbook_auth");

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "Booking Confirmed",
      message: "Your booking at Green Valley Sports Arena is confirmed for Feb 15, 2026",
      time: "2 hours ago",
      isRead: false,
      type: "success",
    },
    {
      id: 2,
      title: "Match Request",
      message: "John Doe wants to join your cricket match at Champions Ground",
      time: "5 hours ago",
      isRead: false,
      type: "info",
    },
    {
      id: 3,
      title: "Payment Received",
      message: "Payment of ₹1500 received successfully",
      time: "1 day ago",
      isRead: true,
      type: "success",
    },
    {
      id: 4,
      title: "Booking Reminder",
      message: "Your booking at Elite Football Turf is tomorrow at 6:00 PM",
      time: "1 day ago",
      isRead: true,
      type: "info",
    },
  ];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Filter + sort turfs based on search query and active filters
  const filteredTurfs = turfs
    .filter((turf) => {
      if (turf.status !== "Active") return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          turf.name.toLowerCase().includes(query) ||
          turf.location.toLowerCase().includes(query) ||
          turf.sports.some((sport) => sport.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      if (activeFilters.offers && !turf.hasOffer) return false;
      if (activeFilters.covered && !turf.covered) return false;
      if (activeFilters.uncovered && turf.covered) return false;
      if (activeFilters.open24x7 && !turf.open24x7) return false;
      if (activeFilters.availableOnly && turf.isOpen === false) return false;

      if (activeFilters.sports.length > 0) {
        const hasAnySport = activeFilters.sports.some((s) =>
          turf.sports.includes(s)
        );
        if (!hasAnySport) return false;
      }

      if (activeFilters.amenities.length > 0) {
        const hasAllAmenities = activeFilters.amenities.every((a) =>
          turf.amenities.includes(a)
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (activeFilters.sortBy === "price-high") return (b.price ?? 0) - (a.price ?? 0);
      if (activeFilters.sortBy === "price-low") return (a.price ?? 0) - (b.price ?? 0);
      if (activeFilters.sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      // default: distance
      return (a.distance ?? 0) - (b.distance ?? 0);
    });

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#1E1E1E] border-b border-[#1B5E20] backdrop-blur-custom">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            {/* Logo */}
            <Link
              to="/home"
              className="flex items-center gap-2"
              onClick={() => setActiveTab("home")}
            >
              <Logo height={52} />
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#BDBDBD]" />
              <Input
                placeholder="Search turfs, locations, sports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#121212] border-[#1B5E20] text-white placeholder:text-[#BDBDBD] focus:border-[#00E676]"
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              <Link to="/owner" className="hidden sm:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-[#00E676] text-xs md:text-sm px-2 md:px-4"
                >
                  Owner Login
                </Button>
              </Link>

              <Button
                onClick={() => setShowNotifications(!showNotifications)}
                variant="ghost"
                size="icon"
                className="text-white hover:text-[#00E676] relative h-8 w-8 md:h-10 md:w-10"
              >
                <Bell className="h-4 w-4 md:h-5 md:w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#00E676] rounded-full pulse-glow"></span>
                )}
              </Button>

              <Button
                onClick={() => setActiveTab("bookings")}
                variant="ghost"
                size="sm"
                className={`hidden lg:flex text-white hover:text-[#00E676] ${
                  activeTab === "bookings"
                    ? "text-[#00E676]"
                    : ""
                }`}
              >
                My Bookings
              </Button>

              <Button
                onClick={() => setActiveTab("matches")}
                variant="ghost"
                size="sm"
                className={`hidden lg:flex text-white hover:text-[#00E676] ${
                  activeTab === "matches"
                    ? "text-[#00E676]"
                    : ""
                }`}
              >
                Matches
              </Button>

              {isLoggedIn ? (
                <Link to="/profile">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-[#00E676] h-8 w-8 md:h-10 md:w-10"
                  >
                    <User className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button className="bg-[#00E676] text-[#121212] hover:bg-[#00E676]/90 neon-glow-hover text-xs md:text-sm px-3 md:px-4 h-8 md:h-10">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#BDBDBD]" />
              <Input
                placeholder="Search turfs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#121212] border-[#1B5E20] text-white placeholder:text-[#BDBDBD]"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
          />
          
          {/* Notifications Panel */}
          <div className="fixed top-20 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] bg-[#1E1E1E] border border-[#1B5E20] rounded-[14px] shadow-2xl card-elevation animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#1B5E20]">
              <h3 className="text-white font-semibold text-lg">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-[#00E676] text-[#121212] text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-[500px] overflow-y-auto">
              {!isLoggedIn ? (
                <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#1B5E20]/20 border border-[#1B5E20] flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-[#00E676]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                  </div>
                  <p className="text-white font-semibold text-sm mb-1">Login to see notifications</p>
                  <p className="text-[#757575] text-xs mb-4">Sign in to receive booking confirmations and updates</p>
                  <Link to="/login" onClick={() => setShowNotifications(false)}>
                    <Button size="sm" className="bg-[#00E676] text-[#121212] font-bold hover:bg-[#00E676]/90">
                      Login / Sign Up
                    </Button>
                  </Link>
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-[#1B5E20]">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-[#121212] cursor-pointer transition-colors ${
                        !notification.isRead ? "bg-[#1B5E20]/10" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-[#00E676] rounded-full pulse-glow" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-semibold text-sm mb-1">{notification.title}</h4>
                          <p className="text-[#BDBDBD] text-xs mb-2 line-clamp-2">{notification.message}</p>
                          <span className="text-[#00E676] text-xs">{notification.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-[#BDBDBD] mx-auto mb-3 opacity-50" />
                  <p className="text-[#BDBDBD] text-sm">No notifications yet</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {isLoggedIn && notifications.length > 0 && (
              <div className="p-3 border-t border-[#1B5E20]">
                <Button
                  variant="ghost"
                  className="w-full text-[#00E676] hover:text-[#00E676] hover:bg-[#00E676]/10"
                  onClick={() => setShowNotifications(false)}
                >
                  Mark all as read
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Main Content */}
      {activeTab === "home" && (
        <main className="container mx-auto px-4 py-4 md:py-6">
          {/* Featured Carousel */}
          <FeaturedCarousel
            turfs={turfs.filter((t) => t.hasOffer && t.status === "Active")}
          />

          {/* Real-Life City Selector & GPS Locator */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3.5 bg-[#1E1E1E]/90 border border-[#1B5E20]/40 rounded-[14px] backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-[#00E676] font-semibold pr-2 border-r border-[#1B5E20]/50">
                <MapPin className="w-4 h-4 text-[#00E676]" />
                <span>Region:</span>
              </div>
              {["Mumbai", "Bengaluru", "Delhi NCR", "Pune"].map((city) => (
                <button
                  key={city}
                  onClick={() => fetchLiveTurfsByCity(city)}
                  disabled={isLoadingLiveTurfs}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all ${
                    activeCity.toLowerCase().includes(city.toLowerCase().split(" ")[0])
                      ? "bg-[#00E676] text-[#121212] font-bold shadow-[0_0_12px_rgba(0,230,118,0.45)] scale-105"
                      : "bg-[#121212] text-[#BDBDBD] hover:text-white hover:bg-[#252525] border border-[#1B5E20]/40"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            <button
              onClick={fetchTurfsNearUser}
              disabled={isLoadingLiveTurfs}
              className="flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-full font-semibold bg-[#121212] text-[#00E676] border border-[#00E676]/50 hover:bg-[#00E676]/15 hover:border-[#00E676] transition-all shadow-sm"
              title="Use device GPS to find live turfs closest to you"
            >
              {isLoadingLiveTurfs ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Searching Live Venues...</span>
                </>
              ) : (
                <>
                  <LocateFixed className="w-3.5 h-3.5" />
                  <span>Find Turfs Near Me</span>
                </>
              )}
            </button>
          </div>

          {/* Filter & Map Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                Available Turfs
                <span className="text-xs bg-[#00E676]/15 text-[#00E676] px-2.5 py-0.5 rounded-full font-semibold border border-[#00E676]/30">
                  {filteredTurfs.length} Venues
                </span>
              </h2>
              <p className="text-xs text-[#BDBDBD] mt-0.5">
                Showing real sports venues in <span className="text-[#00E676] font-medium">{activeCity}</span>
              </p>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={() => setShowFilter(!showFilter)}
                variant="outline"
                size="sm"
                className={`border-[#1B5E20] text-white hover:border-[#00E676] ${showFilter ? "bg-[#00E676]/20 border-[#00E676]" : ""} text-[#000000] flex-1 sm:flex-none`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <div className="flex bg-[#1E1E1E] rounded-[14px] border border-[#1B5E20] overflow-hidden">
                <Button
                  onClick={() => setViewMode("grid")}
                  variant="ghost"
                  size="sm"
                  className={`rounded-none ${viewMode === "grid" ? "bg-[#00E676] text-[#121212]" : "text-white"} text-xs md:text-sm px-3 md:px-4`}
                >
                  Grid
                </Button>
                <Button
                  onClick={() => setViewMode("map")}
                  variant="ghost"
                  size="sm"
                  className={`rounded-none ${
                    viewMode === "map"
                      ? "bg-[#00E676] text-[#121212]"
                      : "text-white"
                  } text-xs md:text-sm px-3 md:px-4`}
                >
                  <Map className="h-4 w-4 mr-1 md:mr-2" />
                  Map
                </Button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Filter Sidebar */}
            {showFilter && (
              <div className="w-full lg:w-80 flex-shrink-0">
                <FilterSidebar filters={activeFilters} onApply={setActiveFilters} />
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {filteredTurfs.map((turf) => (
                    <TurfCard key={turf.id} turf={turf} />
                  ))}
                </div>
              ) : (
                <MapView turfs={filteredTurfs} />
              )}
            </div>
          </div>
        </main>
      )}

      {activeTab === "bookings" && (
        isLoggedIn ? <MyBookings /> : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-20 h-20 rounded-full bg-[#1B5E20]/20 border border-[#1B5E20] flex items-center justify-center mb-5">
              <svg className="w-10 h-10 text-[#00E676]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
            </div>
            <h2 className="text-white font-bold text-2xl mb-2">Login to view your bookings</h2>
            <p className="text-[#757575] mb-6 max-w-sm">Sign in to see all your upcoming and past turf bookings in one place.</p>
            <Link to="/login">
              <Button className="bg-[#00E676] text-[#121212] font-bold px-8 py-3 rounded-xl hover:bg-[#00E676]/90 shadow-[0_0_24px_rgba(0,230,118,0.3)] transition-all">
                Login / Sign Up
              </Button>
            </Link>
          </div>
        )
      )}
      {activeTab === "matches" && <MatchSection />}

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1E1E1E] border-t border-[#1B5E20] lg:hidden backdrop-blur-xl">
        <div className="flex items-center justify-around px-2 py-3">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === "home"
                ? "text-[#00E676]"
                : "text-[#BDBDBD]"
            }`}
          >
            <MapPin className="h-5 w-5" />
            <span className="text-xs font-medium">Turfs</span>
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === "bookings"
                ? "text-[#00E676]"
                : "text-[#BDBDBD]"
            }`}
          >
            <Bell className="h-5 w-5" />
            <span className="text-xs font-medium">Bookings</span>
          </button>

          <button
            onClick={() => setActiveTab("matches")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === "matches"
                ? "text-[#00E676]"
                : "text-[#BDBDBD]"
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs font-medium">Matches</span>
          </button>

          <Link to="/owner">
            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300 text-[#BDBDBD]">
              <User className="h-5 w-5" />
              <span className="text-xs font-medium">Owner</span>
            </button>
          </Link>
        </div>
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="h-20 lg:hidden"></div>
    </div>
  );
}