import { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Plus,
  Phone,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const mockMyRequests = [
  {
    id: 1,
    sport: "Cricket",
    date: "2026-02-20",
    timeSlots: ["10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM"],
    totalPlayers: 22,
    requiredPlayers: 10,
    joinedPlayers: 12,
    contributionPerPlayer: 150,
    players: [
      { name: "Rahul Kumar", phone: "+91 9876543210" },
      { name: "Amit Sharma", phone: "+91 9876543211" },
      { name: "Vikas Patel", phone: "+91 9876543212" },
    ],
  },
  {
    id: 2,
    sport: "Football",
    date: "2026-02-18",
    timeSlots: ["6:00 PM - 7:00 PM"],
    totalPlayers: 10,
    requiredPlayers: 4,
    joinedPlayers: 6,
    contributionPerPlayer: 200,
    players: [
      { name: "Sanjay Reddy", phone: "+91 9876543213" },
      { name: "Kiran Singh", phone: "+91 9876543214" },
    ],
  },
];

const mockAvailableMatches = [
  {
    id: 3,
    creatorName: "Arjun Mehta",
    creatorPhone: "+91 9876543215",
    sport: "Badminton",
    date: "2026-02-17",
    timeSlots: ["4:00 PM - 5:00 PM"],
    totalPlayers: 4,
    requiredPlayers: 2,
    joinedPlayers: 2,
    contributionPerPlayer: 100,
    hasJoined: false,
  },
  {
    id: 4,
    creatorName: "Priya Gupta",
    creatorPhone: "+91 9876543216",
    sport: "Cricket",
    date: "2026-02-19",
    timeSlots: ["7:00 AM - 8:00 AM"],
    totalPlayers: 22,
    requiredPlayers: 11,
    joinedPlayers: 11,
    contributionPerPlayer: 180,
    hasJoined: false,
  },
];

const mockJoinedMatches = [
  {
    id: 5,
    creatorName: "Rohan Desai",
    creatorPhone: "+91 9876543217",
    sport: "Football",
    date: "2026-02-21",
    timeSlots: ["5:00 PM - 6:00 PM"],
    totalPlayers: 10,
    requiredPlayers: 5,
    joinedPlayers: 5,
    contributionPerPlayer: 150,
    hasJoined: true,
    allPlayers: [
      {
        name: "Rohan Desai (Creator)",
        phone: "+91 9876543217",
      },
      { name: "Me", phone: "+91 9876543210" },
      { name: "Ajay Kumar", phone: "+91 9876543218" },
      { name: "Deepak Rao", phone: "+91 9876543219" },
      { name: "Manoj Tiwari", phone: "+91 9876543220" },
    ],
  },
];

export function MatchSection() {
  const [showCreateDialog, setShowCreateDialog] =
    useState(false);
  const [newMatch, setNewMatch] = useState({
    sport: "",
    date: "",
    timeSlots: [""],
    totalPlayers: "",
    requiredPlayers: "",
    contributionPerPlayer: "",
  });

  const handleCreateMatch = () => {
    console.log("Creating match:", newMatch);
    setShowCreateDialog(false);
    // Handle match creation
  };

  const handleJoinMatch = (matchId: number) => {
    console.log("Joining match:", matchId);
    // Handle joining match
  };

  const handleLeaveMatch = (matchId: number) => {
    console.log("Leaving match:", matchId);
    // Handle leaving match
  };

  const handleCancelMatch = (matchId: number) => {
    console.log("Cancelling match:", matchId);
    // Handle cancelling match
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Matches
            </h1>
            <p className="text-[#BDBDBD]">
              Find players or create your own match
            </p>
          </div>

          <Dialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
          >
            <DialogTrigger asChild>
              <Button className="bg-[#00E676] text-[#121212] hover:bg-[#00E676]/90 neon-glow-hover">
                <Plus className="w-4 h-4 mr-2" />
                Create Match Request
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1E1E1E] border-[#1B5E20] max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white text-2xl">
                  Create Match Request
                </DialogTitle>
                <DialogDescription className="text-[#BDBDBD]">
                  Fill in the details to create a new match
                  request
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label className="text-white">Sport</Label>
                  <Select
                    value={newMatch.sport}
                    onValueChange={(value) =>
                      setNewMatch({ ...newMatch, sport: value })
                    }
                  >
                    <SelectTrigger className="bg-[#121212] border-[#1B5E20] text-white">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E1E1E] border-[#1B5E20]">
                      <SelectItem value="cricket">
                        Cricket
                      </SelectItem>
                      <SelectItem value="football">
                        Football
                      </SelectItem>
                      <SelectItem value="badminton">
                        Badminton
                      </SelectItem>
                      <SelectItem value="pickleball">
                        Pickleball
                      </SelectItem>
                      <SelectItem value="basketball">
                        Basketball
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Date</Label>
                    <Input
                      type="date"
                      value={newMatch.date}
                      onChange={(e) =>
                        setNewMatch({
                          ...newMatch,
                          date: e.target.value,
                        })
                      }
                      className="bg-[#121212] border-[#1B5E20] text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">
                      Time Slot
                    </Label>
                    <Input
                      type="time"
                      value={newMatch.timeSlots[0]}
                      onChange={(e) =>
                        setNewMatch({
                          ...newMatch,
                          timeSlots: [e.target.value],
                        })
                      }
                      className="bg-[#121212] border-[#1B5E20] text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">
                      Total Players
                    </Label>
                    <Input
                      type="number"
                      placeholder="e.g., 22"
                      value={newMatch.totalPlayers}
                      onChange={(e) =>
                        setNewMatch({
                          ...newMatch,
                          totalPlayers: e.target.value,
                        })
                      }
                      className="bg-[#121212] border-[#1B5E20] text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">
                      Players Required
                    </Label>
                    <Input
                      type="number"
                      placeholder="e.g., 11"
                      value={newMatch.requiredPlayers}
                      onChange={(e) =>
                        setNewMatch({
                          ...newMatch,
                          requiredPlayers: e.target.value,
                        })
                      }
                      className="bg-[#121212] border-[#1B5E20] text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">
                    Contribution per Player (₹)
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g., 150"
                    value={newMatch.contributionPerPlayer}
                    onChange={(e) =>
                      setNewMatch({
                        ...newMatch,
                        contributionPerPlayer: e.target.value,
                      })
                    }
                    className="bg-[#121212] border-[#1B5E20] text-white"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={() => setShowCreateDialog(false)}
                  variant="outline"
                  className="border-[#1B5E20] text-white text-[#000000]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateMatch}
                  className="bg-[#00E676] text-[#121212] hover:bg-[#00E676]/90"
                >
                  Create Match
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="bg-[#FFFFFF] border border-[#1B5E20] mb-6">
            <TabsTrigger
              value="available"
              className="data-[state=active]:bg-[#00E676] data-[state=active]:text-[#121212]"
            >
              Available Matches
            </TabsTrigger>
            <TabsTrigger
              value="my-requests"
              className="data-[state=active]:bg-[#00E676] data-[state=active]:text-[#121212]"
            >
              My Requests
            </TabsTrigger>
            <TabsTrigger
              value="joined"
              className="data-[state=active]:bg-[#00E676] data-[state=active]:text-[#121212]"
            >
              Joined Matches
            </TabsTrigger>
          </TabsList>

          {/* Available Matches */}
          <TabsContent value="available" className="space-y-4">
            {mockAvailableMatches.map((match) => (
              <div
                key={match.id}
                className="bg-[#1E1E1E] rounded-[14px] p-6 card-elevation hover:border-[#00E676] border-2 border-[#1B5E20] transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-bold text-xl">
                            {match.sport}
                          </h3>
                          <Badge className="bg-[#1B5E20] text-[#00E676] border border-[#00E676]">
                            {match.requiredPlayers -
                              match.joinedPlayers}{" "}
                            Needed
                          </Badge>
                        </div>
                        <p className="text-[#BDBDBD]">
                          By {match.creatorName}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#00E676]" />
                        <span className="text-white text-sm">
                          {new Date(
                            match.date,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#00E676]" />
                        <span className="text-white text-sm">
                          {match.timeSlots[0]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#00E676]" />
                        <span className="text-white text-sm">
                          {match.joinedPlayers}/
                          {match.totalPlayers}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#00E676] font-bold">
                          ₹{match.contributionPerPlayer}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleJoinMatch(match.id)}
                    className="bg-[#00E676] text-[#121212] hover:bg-[#00E676]/90 neon-glow-hover"
                  >
                    Join Match
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* My Requests */}
          <TabsContent
            value="my-requests"
            className="space-y-4"
          >
            {mockMyRequests.map((match) => (
              <div
                key={match.id}
                className="bg-[#1E1E1E] rounded-[14px] p-6 card-elevation border-2 border-[#00E676]/30"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-bold text-xl">
                          {match.sport}
                        </h3>
                        <Badge className="bg-[#00E676]/20 text-[#00E676]">
                          My Request
                        </Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() =>
                        handleCancelMatch(match.id)
                      }
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel Match
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#00E676]" />
                      <span className="text-white text-sm">
                        {new Date(
                          match.date,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#00E676]" />
                      <span className="text-white text-sm">
                        {match.timeSlots.join(", ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#00E676]" />
                      <span className="text-white text-sm">
                        {match.joinedPlayers}/
                        {match.totalPlayers}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#00E676] font-bold">
                        ₹{match.contributionPerPlayer}
                      </span>
                    </div>
                  </div>

                  {/* Joined Players List */}
                  <div>
                    <h4 className="text-white font-semibold mb-3">
                      Joined Players ({match.joinedPlayers})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {match.players.map((player, index) => (
                        <div
                          key={index}
                          className="bg-[#121212] rounded-lg p-3 border border-[#1B5E20]"
                        >
                          <p className="text-white font-medium">
                            {player.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="w-3 h-3 text-[#00E676]" />
                            <p className="text-[#BDBDBD] text-sm">
                              {player.phone}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Joined Matches */}
          <TabsContent value="joined" className="space-y-4">
            {mockJoinedMatches.map((match) => (
              <div
                key={match.id}
                className="bg-[#1E1E1E] rounded-[14px] p-6 card-elevation border-2 border-[#1B5E20]"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-bold text-xl">
                          {match.sport}
                        </h3>
                        <Badge className="bg-[#1B5E20] text-[#00E676]">
                          Joined
                        </Badge>
                      </div>
                      <p className="text-[#BDBDBD]">
                        Created by {match.creatorName}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleLeaveMatch(match.id)}
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Leave Match
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#00E676]" />
                      <span className="text-white text-sm">
                        {new Date(
                          match.date,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#00E676]" />
                      <span className="text-white text-sm">
                        {match.timeSlots.join(", ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#00E676]" />
                      <span className="text-white text-sm">
                        {match.joinedPlayers}/
                        {match.totalPlayers}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#00E676] font-bold">
                        ₹{match.contributionPerPlayer}
                      </span>
                    </div>
                  </div>

                  {/* All Players List */}
                  <div>
                    <h4 className="text-white font-semibold mb-3">
                      All Players ({match.allPlayers.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {match.allPlayers.map((player, index) => (
                        <div
                          key={index}
                          className="bg-[#121212] rounded-lg p-3 border border-[#1B5E20]"
                        >
                          <p className="text-white font-medium">
                            {player.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="w-3 h-3 text-[#00E676]" />
                            <p className="text-[#BDBDBD] text-sm">
                              {player.phone}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}