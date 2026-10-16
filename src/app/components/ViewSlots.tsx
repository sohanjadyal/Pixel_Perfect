import { useState } from "react";
import { Clock, CheckCircle2, XCircle, Lock, Unlock, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useTurfs } from "../context/TurfContext";

const TIME_SLOTS = [
  "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
  "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM",
];

// Mock booked slots: turfId -> date string -> set of slot indices
const MOCK_BOOKED: Record<number, Record<string, number[]>> = {
  1: { "2026-10-12": [0, 1, 6, 7, 8], "2026-10-13": [3, 4, 12, 13] },
  2: { "2026-10-12": [6, 7], "2026-10-14": [10, 11, 12] },
  3: { "2026-10-12": [0, 1, 2, 14, 15], "2026-10-13": [6, 7, 8] },
};

function getWeekDates(offset: number) {
  const today = new Date();
  today.setDate(today.getDate() + offset * 7);
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function fmt(d: Date) {
  return d.toISOString().split("T")[0];
}

export function ViewSlots() {
  const { turfs } = useTurfs();
  const [selectedTurfId, setSelectedTurfId] = useState(turfs[0]?.id ?? 1);
  const [weekOffset, setWeekOffset] = useState(0);
  // blockedSlots: date -> slot indices manually blocked by owner
  const [blocked, setBlocked] = useState<Record<string, number[]>>({});
  const [view, setView] = useState<"week" | "day">("week");
  const [selectedDay, setSelectedDay] = useState(fmt(new Date()));

  const weekDates = getWeekDates(weekOffset);
  const selectedTurf = turfs.find((t) => t.id === selectedTurfId);

  const isBooked = (date: string, slotIdx: number) =>
    (MOCK_BOOKED[selectedTurfId]?.[date] ?? []).includes(slotIdx);

  const isBlocked = (date: string, slotIdx: number) =>
    (blocked[date] ?? []).includes(slotIdx);

  const toggleBlock = (date: string, slotIdx: number) => {
    if (isBooked(date, slotIdx)) return; // can't toggle a booked slot
    setBlocked((prev) => {
      const current = prev[date] ?? [];
      return {
        ...prev,
        [date]: current.includes(slotIdx)
          ? current.filter((i) => i !== slotIdx)
          : [...current, slotIdx],
      };
    });
  };

  const daySlotCounts = weekDates.map((d) => {
    const key = fmt(d);
    const booked = (MOCK_BOOKED[selectedTurfId]?.[key] ?? []).length;
    const blockedCount = (blocked[key] ?? []).length;
    return { booked, blocked: blockedCount, available: TIME_SLOTS.length - booked - blockedCount };
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">View Slots</h2>
        <p className="text-[#757575] mt-1">See availability and block/unblock time slots</p>
      </div>

      {/* Turf selector */}
      <div className="flex flex-wrap gap-2">
        {turfs.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTurfId(t.id)}
            className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
              selectedTurfId === t.id
                ? "bg-[#00E676] border-[#00E676] text-[#121212]"
                : "bg-[#1E1E1E] border-[#1B5E20] text-[#BDBDBD] hover:border-[#00E676]/50 hover:text-white"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Legend + view toggle */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4 text-xs text-[#757575]">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#00E676]/30 border border-[#00E676]/50" />Available</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-yellow-400/20 border border-yellow-400/40" />Booked</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#2a2a2a] border border-[#424242]" />Blocked</span>
        </div>
        <div className="flex gap-1 bg-[#1E1E1E] border border-[#1B5E20] rounded-xl p-1">
          {(["week", "day"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                view === v ? "bg-[#00E676] text-[#121212]" : "text-[#757575] hover:text-white"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Week navigator */}
      <div className="flex items-center justify-between bg-[#1E1E1E] border border-[#1B5E20] rounded-2xl px-4 py-3">
        <button onClick={() => setWeekOffset((w) => w - 1)} className="p-1.5 text-[#757575] hover:text-[#00E676] rounded-lg hover:bg-[#00E676]/10 transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1 text-white font-semibold text-sm">
          <Clock className="w-4 h-4 text-[#00E676] mr-1" />
          {weekDates[0].toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          {" – "}
          {weekDates[6].toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </div>
        <button onClick={() => setWeekOffset((w) => w + 1)} className="p-1.5 text-[#757575] hover:text-[#00E676] rounded-lg hover:bg-[#00E676]/10 transition-all">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Week overview */}
      {view === "week" && (
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((d, di) => {
            const key = fmt(d);
            const sc = daySlotCounts[di];
            const isToday = key === fmt(new Date());
            return (
              <motion.button
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: di * 0.04 }}
                onClick={() => { setSelectedDay(key); setView("day"); }}
                className={`bg-[#1E1E1E] border rounded-xl p-3 text-center hover:border-[#00E676]/60 transition-all group ${
                  isToday ? "border-[#00E676]/50 shadow-[0_0_12px_rgba(0,230,118,0.15)]" : "border-[#1B5E20]"
                }`}
              >
                <p className={`text-xs font-medium mb-1 ${isToday ? "text-[#00E676]" : "text-[#757575]"}`}>
                  {d.toLocaleDateString("en-IN", { weekday: "short" })}
                </p>
                <p className={`font-bold text-lg leading-none mb-2 ${isToday ? "text-[#00E676]" : "text-white"}`}>
                  {d.getDate()}
                </p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#00E676]">{sc.booked}B</span>
                    <span className="text-yellow-400">{sc.available}A</span>
                  </div>
                  <div className="h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all"
                      style={{ width: `${(sc.booked / TIME_SLOTS.length) * 100}%` }}
                    />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Day slot grid */}
      {view === "day" && (
        <div className="bg-[#1E1E1E] border border-[#1B5E20] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1B5E20] bg-[#1a1a1a]">
            <div>
              <p className="text-white font-semibold">
                {new Date(selectedDay).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
              </p>
              <p className="text-[#757575] text-xs mt-0.5">{selectedTurf?.name}</p>
            </div>
            <button onClick={() => setView("week")} className="text-[#00E676] text-sm font-medium hover:underline">
              ← Week view
            </button>
          </div>

          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {TIME_SLOTS.map((slot, idx) => {
              const booked = isBooked(selectedDay, idx);
              const blockedSlot = isBlocked(selectedDay, idx);
              return (
                <motion.button
                  key={slot}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  onClick={() => toggleBlock(selectedDay, idx)}
                  disabled={booked}
                  title={booked ? "Booked — cannot change" : blockedSlot ? "Click to unblock" : "Click to block"}
                  className={`relative flex flex-col items-center justify-center py-3 px-2 rounded-xl border text-xs font-medium transition-all ${
                    booked
                      ? "bg-yellow-400/10 border-yellow-400/30 text-yellow-400 cursor-not-allowed"
                      : blockedSlot
                      ? "bg-[#2a2a2a] border-[#424242] text-[#424242] hover:border-red-400/50"
                      : "bg-[#00E676]/5 border-[#00E676]/20 text-[#00E676] hover:bg-[#00E676]/15 hover:border-[#00E676]/50"
                  }`}
                >
                  {booked && <CheckCircle2 className="w-3.5 h-3.5 mb-1" />}
                  {blockedSlot && !booked && <Lock className="w-3.5 h-3.5 mb-1 text-[#424242]" />}
                  {!booked && !blockedSlot && <Unlock className="w-3.5 h-3.5 mb-1" />}
                  {slot}
                  {booked && <span className="text-[9px] mt-0.5 opacity-70">Booked</span>}
                  {blockedSlot && !booked && <span className="text-[9px] mt-0.5 opacity-70">Blocked</span>}
                  {!booked && !blockedSlot && <span className="text-[9px] mt-0.5 opacity-70">Available</span>}
                </motion.button>
              );
            })}
          </div>

          <div className="px-5 py-3 border-t border-[#1B5E20] bg-[#1a1a1a] flex items-center gap-2 text-xs text-[#757575]">
            <Lock className="w-3.5 h-3.5" />
            Click any available slot to block it from player booking. Click a blocked slot to unblock.
          </div>
        </div>
      )}
    </div>
  );
}
