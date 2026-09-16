"use client";

import { useMemo, useState, useTransition } from "react";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isBefore,
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { createBookingRequest } from "@/app/annonces/[id]/actions";
import { useToast } from "@/components/toast/toast-provider";

type UnavailableRange = { start: string; end: string }; // end exclusif

export function BookingCalendar({
  propertyId,
  pricePerNight,
  unavailable,
}: {
  propertyId: string;
  pricePerNight: number;
  unavailable: UnavailableRange[];
}) {
  const router = useRouter();
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [guestNote, setGuestNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const today = startOfDay(new Date());

  const unavailableIntervals = useMemo(
    () =>
      unavailable.map((u) => ({
        start: parseISO(u.start),
        lastNight: addDays(parseISO(u.end), -1),
      })),
    [unavailable]
  );

  function isDateUnavailable(day: Date) {
    return unavailableIntervals.some((u) =>
      isWithinInterval(day, { start: u.start, end: u.lastNight })
    );
  }

  const days = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  });
  const firstWeekday = (startOfMonth(month).getDay() + 6) % 7;

  function handleDayClick(day: Date) {
    if (isBefore(day, today) || isDateUnavailable(day)) return;

    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(day);
      setRangeEnd(null);
      return;
    }
    if (isBefore(day, rangeStart) || isSameDay(day, rangeStart)) {
      setRangeStart(day);
      return;
    }
    const spanned = eachDayOfInterval({ start: rangeStart, end: day });
    if (spanned.some((d) => isDateUnavailable(d))) {
      toast({ type: "error", message: "La sélection traverse des dates indisponibles." });
      return;
    }
    setRangeEnd(day);
  }

  const nights =
    rangeStart && rangeEnd
      ? Math.round((rangeEnd.getTime() - rangeStart.getTime()) / 86400000)
      : 0;
  const total = nights * pricePerNight;

  function handleSubmit() {
    if (!rangeStart || !rangeEnd) return;
    const startDate = format(rangeStart, "yyyy-MM-dd");
    const endDate = format(rangeEnd, "yyyy-MM-dd");

    startTransition(async () => {
      try {
        await createBookingRequest(propertyId, startDate, endDate, guestNote);
        setRangeStart(null);
        setRangeEnd(null);
        setGuestNote("");
        toast({
          type: "success",
          message:
            "Demande envoyée ! Le propriétaire doit la confirmer. Suis son statut depuis « Mes réservations ».",
        });
        router.refresh();
      } catch (e) {
        toast({
          type: "error",
          message: e instanceof Error ? e.message : "Erreur inconnue.",
        });
      }
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMonth((m) => subMonths(m, 1))}
          className="flex h-8 w-8 items-center justify-center rounded border border-border text-foreground-muted hover:text-foreground"
          aria-label="Mois précédent"
        >
          <ChevronLeft size={16} />
        </button>
        <p className="font-display text-sm font-semibold capitalize text-foreground">
          {format(month, "MMMM yyyy", { locale: fr })}
        </p>
        <button
          type="button"
          onClick={() => setMonth((m) => addMonths(m, 1))}
          className="flex h-8 w-8 items-center justify-center rounded border border-border text-foreground-muted hover:text-foreground"
          aria-label="Mois suivant"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-foreground-muted">
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <div key={i} className="py-1">
            {d}
          </div>
        ))}
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const past = isBefore(day, today);
          const unavailableDay = isDateUnavailable(day);
          const selected =
            rangeStart &&
            (rangeEnd
              ? isWithinInterval(day, { start: rangeStart, end: rangeEnd })
              : isSameDay(day, rangeStart));

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={past || unavailableDay}
              onClick={() => handleDayClick(day)}
              className={`aspect-square rounded text-sm transition-colors ${
                past
                  ? "text-foreground-muted/40"
                  : unavailableDay
                    ? "bg-danger/10 text-danger/70 line-through"
                    : selected
                      ? "bg-indigo text-indigo-foreground"
                      : "text-foreground hover:bg-surface-muted"
              }`}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      {rangeStart && !rangeEnd && (
        <p className="mt-3 text-sm text-foreground-muted">
          Choisis maintenant la date de départ.
        </p>
      )}

      {rangeStart && rangeEnd && (
        <div className="mt-4 rounded border border-border p-3">
          <p className="text-sm text-foreground">
            Du <strong>{format(rangeStart, "d MMM yyyy", { locale: fr })}</strong>{" "}
            au <strong>{format(rangeEnd, "d MMM yyyy", { locale: fr })}</strong>{" "}
            · {nights} {nights > 1 ? "nuits" : "nuit"}
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-foreground">
            {total.toLocaleString("fr-FR")} FCFA
          </p>
          <Textarea
            className="mt-2"
            rows={3}
            placeholder="Un message pour le propriétaire (optionnel)"
            value={guestNote}
            onChange={(e) => setGuestNote(e.target.value)}
          />
          <div className="mt-3 flex gap-2">
            <Button type="button" onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Envoi..." : "Envoyer la demande"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setRangeStart(null);
                setRangeEnd(null);
              }}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}