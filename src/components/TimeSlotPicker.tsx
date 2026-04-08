import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { uz } from "date-fns/locale";

interface TimeSlot {
  id: string;
  slot_date: string;
  slot_time: string;
  is_available: boolean;
}

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
  isLoading?: boolean;
}

const TimeSlotPicker = ({
  slots,
  selectedSlotId,
  onSelectSlot,
  isLoading,
}: TimeSlotPickerProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Group slots by date
  const slotsByDate: Record<string, TimeSlot[]> = {};
  slots.forEach((slot) => {
    if (!slotsByDate[slot.slot_date]) {
      slotsByDate[slot.slot_date] = [];
    }
    slotsByDate[slot.slot_date].push(slot);
  });

  const dates = Object.keys(slotsByDate).sort();

  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return format(date, "d MMMM, EEEE", { locale: uz });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    return timeStr.slice(0, 5); // HH:MM format
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Yuklanmoqda...
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">
          Bo'sh vaqtlar mavjud emas
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Date Selection */}
      <div>
        <p className="text-sm font-medium mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Kunni tanlang
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dates.map((date) => (
            <Button
              key={date}
              variant={selectedDate === date ? "coral" : "outline"}
              size="sm"
              className="whitespace-nowrap"
              onClick={() => setSelectedDate(date)}
            >
              {formatDate(date)}
            </Button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Vaqtni tanlang
          </p>
          <div className="grid grid-cols-3 gap-2">
            {slotsByDate[selectedDate]?.map((slot) => (
              <Card
                key={slot.id}
                className={`p-3 text-center cursor-pointer transition-all ${
                  selectedSlotId === slot.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:border-primary/50"
                }`}
                onClick={() => onSelectSlot(slot.id)}
              >
                <div className="flex items-center justify-center gap-1">
                  {selectedSlotId === slot.id && (
                    <Check className="w-4 h-4" />
                  )}
                  <span className="font-medium">
                    {formatTime(slot.slot_time)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {selectedSlotId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-primary/10 rounded-lg p-3 text-sm"
        >
          <p className="font-medium text-primary">Tanlangan vaqt:</p>
          <p className="text-foreground">
            {formatDate(selectedDate!)} - {formatTime(slots.find(s => s.id === selectedSlotId)?.slot_time || "")}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default TimeSlotPicker;
