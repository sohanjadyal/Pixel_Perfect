import { useState } from "react";
import { MapPin, Edit, Calendar, Star, Shield, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const mockTurfs = [
  {
    id: 1,
    name: "Green Valley Sports Arena",
    location: "Koramangala, Bangalore",
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800",
    price: 1500,
    sports: ["Cricket", "Football"],
    covered: true,
    totalBookings: 45,
    rating: 4.8,
    status: "Active",
  },
  {
    id: 2,
    name: "Champions Cricket Ground",
    location: "Indiranagar, Bangalore",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800",
    price: 2000,
    sports: ["Cricket"],
    covered: false,
    totalBookings: 32,
    rating: 4.6,
    status: "Active",
  },
  {
    id: 3,
    name: "Elite Football Turf",
    location: "HSR Layout, Bangalore",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    price: 1200,
    sports: ["Football", "Pickleball"],
    covered: true,
    totalBookings: 58,
    rating: 4.9,
    status: "Active",
  },
];

export function MyTurfs() {
  const [turfs, setTurfs] = useState(mockTurfs);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">My Turfs</h2>
        <p className="text-[#BDBDBD]">Manage all your registered turfs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {turfs.map((turf) => (
          <div
            key={turf.id}
            className="bg-[#1E1E1E] rounded-[14px] overflow-hidden card-elevation hover:border-[#00E676] border-2 border-transparent transition-all group"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={turf.image}
                alt={turf.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <Badge className="bg-[#00E676] text-[#121212] neon-glow">
                  {turf.status}
                </Badge>
              </div>

              {/* Rating */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                <Star className="w-4 h-4 fill-[#00E676] text-[#00E676]" />
                <span className="text-white font-semibold">{turf.rating}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#00E676] transition-colors">
                  {turf.name}
                </h3>
                <div className="flex items-center gap-2 text-[#BDBDBD] text-sm">
                  <MapPin className="w-4 h-4 text-[#00E676]" />
                  <span>{turf.location}</span>
                </div>
              </div>

              {/* Sports Tags */}
              <div className="flex flex-wrap gap-2">
                {turf.sports.map((sport) => (
                  <span
                    key={sport}
                    className="px-2 py-1 bg-[#121212] text-[#BDBDBD] text-xs rounded-full border border-[#1B5E20]"
                  >
                    {sport}
                  </span>
                ))}
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    turf.covered
                      ? "bg-[#00E676]/20 text-[#00E676]"
                      : "bg-[#BDBDBD]/20 text-[#BDBDBD]"
                  }`}
                >
                  {turf.covered ? "Covered" : "Open"}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1B5E20]">
                <div>
                  <p className="text-[#BDBDBD] text-xs">Total Bookings</p>
                  <p className="text-white font-bold">{turf.totalBookings}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#BDBDBD] text-xs">Price/Hour</p>
                  <p className="text-[#00E676] font-bold text-lg">₹{turf.price}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 border-[#1B5E20] text-black hover:border-[#00E676] hover:text-[#121212]"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button className="flex-1 bg-[#00E676] text-[#121212] hover:bg-[#00E676]/90">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Slots
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
