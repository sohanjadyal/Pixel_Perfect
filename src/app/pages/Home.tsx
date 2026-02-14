import { useState } from "react";
import { Link } from "react-router";
import {
  Search,
  Bell,
  User,
  MapPin,
  Filter,
  Map,
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

const mockTurfs = [
  {
    id: 1,
    name: "Green Valley Sports Arena",
    location: "Koramangala, Bangalore",
    distance: 2.3,
    image:
      "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800",
    price: 1500,
    sports: ["Cricket", "Football"],
    rating: 4.8,
    reviews: 124,
    covered: true,
    open24x7: false,
    hasOffer: true,
    amenities: ["Parking", "Washroom", "Cafeteria"],
    isOpen: true,
    lat: 12.9352,
    lng: 77.6245,
  },
  {
    id: 2,
    name: "Champions Cricket Ground",
    location: "Indiranagar, Bangalore",
    distance: 3.5,
    image:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800",
    price: 2000,
    sports: ["Cricket"],
    rating: 4.6,
    reviews: 89,
    covered: false,
    open24x7: true,
    hasOffer: false,
    amenities: ["Parking", "Washroom"],
    isOpen: true,
    lat: 12.9716,
    lng: 77.6412,
  },
  {
    id: 3,
    name: "Elite Football Turf",
    location: "HSR Layout, Bangalore",
    distance: 1.8,
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    price: 1200,
    sports: ["Football", "Pickleball"],
    rating: 4.9,
    reviews: 203,
    covered: true,
    open24x7: true,
    hasOffer: true,
    amenities: [
      "Parking",
      "Washroom",
      "Cafeteria",
      "Changing Room",
    ],
    isOpen: true,
    lat: 12.9121,
    lng: 77.6446,
  },
  {
    id: 4,
    name: "Victory Multi-Sport Complex",
    location: "Whitefield, Bangalore",
    distance: 5.2,
    image:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800",
    price: 1800,
    sports: ["Cricket", "Football", "Badminton"],
    rating: 4.7,
    reviews: 156,
    covered: false,
    open24x7: false,
    hasOffer: false,
    amenities: ["Parking", "Washroom", "Cafeteria"],
    isOpen: true,
    lat: 12.9698,
    lng: 77.7499,
  },
  {
    id: 5,
    name: "Sunrise Sports Hub",
    location: "Marathahalli, Bangalore",
    distance: 4.1,
    image:
      "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800",
    price: 1600,
    sports: ["Football", "Cricket"],
    rating: 4.5,
    reviews: 92,
    covered: true,
    open24x7: false,
    hasOffer: true,
    amenities: ["Parking", "Washroom"],
    isOpen: false,
    lat: 12.9591,
    lng: 77.6974,
  },
  {
    id: 6,
    name: "Thunder Pickleball Arena",
    location: "Jayanagar, Bangalore",
    distance: 3.0,
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800",
    price: 1000,
    sports: ["Pickleball", "Badminton"],
    rating: 4.8,
    reviews: 78,
    covered: true,
    open24x7: true,
    hasOffer: false,
    amenities: ["Parking", "Washroom", "Changing Room"],
    isOpen: true,
    lat: 12.925,
    lng: 77.5838,
  },
];

export function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [showFilter, setShowFilter] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map">(
    "grid",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const isLoggedIn = !!localStorage.getItem("turfbook_user");

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

  // Filter turfs based on search query
  const filteredTurfs = mockTurfs.filter((turf) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      turf.name.toLowerCase().includes(query) ||
      turf.location.toLowerCase().includes(query) ||
      turf.sports.some((sport) =>
        sport.toLowerCase().includes(query),
      )
    );
  });

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#1E1E1E] border-b border-[#1B5E20] backdrop-blur-custom">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link
              to="/home"
              className="flex items-center gap-2"
              onClick={() => setActiveTab("home")}
            >
              <div className="text-2xl font-bold">
                <span className="text-[#00E676]">Turf</span>
                <span className="text-white">Book</span>
              </div>
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
            <div className="flex items-center gap-2">
              <Link to="/owner">
                <Button
                  variant="ghost"
                  className="text-white hover:text-[#00E676]"
                >
                  Owner Login
                </Button>
              </Link>

              <Button
                onClick={() => setShowNotifications(!showNotifications)}
                variant="ghost"
                size="icon"
                className="text-white hover:text-[#00E676] relative"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#00E676] rounded-full pulse-glow"></span>
                )}
              </Button>

              <Button
                onClick={() => setActiveTab("bookings")}
                variant="ghost"
                className={`text-white hover:text-[#00E676] ${
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
                className={`text-white hover:text-[#00E676] ${
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
                    className="text-white hover:text-[#00E676]"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button className="bg-[#00E676] text-[#121212] hover:bg-[#00E676]/90 neon-glow-hover">
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
              {notifications.length > 0 ? (
                <div className="divide-y divide-[#1B5E20]">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-[#121212] cursor-pointer transition-colors ${
                        !notification.isRead ? "bg-[#1B5E20]/10" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Status Indicator */}
                        <div className="flex-shrink-0 mt-1">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-[#00E676] rounded-full pulse-glow" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-semibold text-sm mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-[#BDBDBD] text-xs mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <span className="text-[#00E676] text-xs">
                            {notification.time}
                          </span>
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
            {notifications.length > 0 && (
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
        <main className="container mx-auto px-4 py-6">
          {/* Featured Carousel */}
          <FeaturedCarousel
            turfs={mockTurfs.filter((t) => t.hasOffer)}
          />

          {/* Filter & Map Toggle */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Available Turfs
            </h2>

            <div className="flex gap-2">
              <Button
                onClick={() => setShowFilter(!showFilter)}
                variant="outline"
                className={`border-[#1B5E20] text-white hover:border-[#00E676] ${showFilter ? "bg-[#00E676]/20 border-[#00E676]" : ""} text-[#000000]`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <div className="flex bg-[#1E1E1E] rounded-[14px] border border-[#1B5E20] overflow-hidden">
                <Button
                  onClick={() => setViewMode("grid")}
                  variant="ghost"
                  size="sm"
                  className={`rounded-none ${viewMode === "grid" ? "bg-[#00E676] text-[#121212]" : "text-white"} text-[14px] p-[10px]`}
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
                  }`}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Map
                </Button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex gap-6">
            {/* Filter Sidebar */}
            {showFilter && viewMode === "grid" && (
              <div className="w-80 flex-shrink-0">
                <FilterSidebar />
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {activeTab === "bookings" && <MyBookings />}
      {activeTab === "matches" && <MatchSection />}
    </div>
  );
}