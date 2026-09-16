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
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addAvailabilityBlock, removeAvailabilityBlock } from "@/app/tableau-de-bord/annonces/[id]/disponibilites/actions";
import { useToast } from "@/components/toast/toast-provider";

type Block = {
  id: string;
  start_date: string; // YYYY-MM-DD, inclus
  end_date: string; // YYYY-MM-DD, exclu
  reason: string | null;
};

export function CalendarBlocker({
  propertyId,
  initialBlocks,
}: {
  propertyId: string;
  initialBlocks: Block[];
}) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const today = startOfDay(new Date());

  const blockedIntervals = useMemo(
    () =>
      blocks.map((b) => ({
        id: b.id,
        start: parseISO(b.start_date),
        // end_date est exclusif : la dernière nuit bloquée est end_date - 1
        lastNight: addDays(parseISO(b.end_date), -1),
      })),
    [blocks]
  );

  function isDateBlocked(day: Date) {
    return blockedIntervals.some((b) =>
      isWithinInterval(day, { start: b.start, end: b.lastNight })
    );
  }

  const days = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  });
  const firstWeekday = (startOfMonth(month).getDay() + 6) % 7; // lundi = 0

  function handleDayClick(day: Date) {
    if (isBefore(day, today) || isDateBlocked(day)) return;

    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(day);
      setRangeEnd(null);
      return;
    }
    if (isBefore(day, rangeStart)) {
      setRangeStart(day);
      return;
    }
    // Refuse une sélection qui traverserait une période déjà bloquée
    const spanned = eachDayOfInterval({ start: rangeStart, end: day });
    if (spanned.some((d) => isDateBlocked(d))) {
      toast({
        type: "error",
        message: "La sélection ne peut pas chevaucher une période déjà bloquée.",
      });
      return;
    }
    setRangeEnd(day);
  }

  function confirmBlock() {
    if (!rangeStart) return;
    const lastNight = rangeEnd ?? rangeStart;
    const startDate = format(rangeStart, "yyyy-MM-dd");
    const endDate = format(addDays(lastNight, 1), "yyyy-MM-dd"); // exclusif

    startTransition(async () => {
      try {
        await addAvailabilityBlock(propertyId, startDate, endDate, reason);
        setBlocks((prev) => [
          ...prev,
          { id: crypto.randomUUID(), start_date: startDate, end_date: endDate, reason },
        ]);
        setRangeStart(null);
        setRangeEnd(null);
        setReason("");
        toast({ type: "success", message: "Période bloquée." });
      } catch (e) {
        toast({
          type: "error",
          message: e instanceof Error ? e.message : "Erreur inconnue.",
        });
      }
    });
  }

  function handleDelete(blockId: string) {
    startTransition(async () => {
      try {
        await removeAvailabilityBlock(blockId, propertyId);
        setBlocks((prev) => prev.filter((b) => b.id !== blockId));
        toast({ type: "success", message: "Blocage supprimé." });
      } catch (e) {
        toast({
          type: "error",
          message: e instanceof Error ? e.message : "Erreur lors de la suppression.",
        });
      }
    });
  }

  return (
    <div>
      {/* En-tête mois */}
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

      {/* Grille */}
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
          const blocked = isDateBlocked(day);
          const selected =
            rangeStart &&
            (rangeEnd
              ? isWithinInterval(day, { start: rangeStart, end: rangeEnd })
              : isSameDay(day, rangeStart));

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={past || blocked}
              onClick={() => handleDayClick(day)}
              className={`aspect-square rounded text-sm transition-colors ${
                past
                  ? "text-foreground-muted/40"
                  : blocked
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

      {/* Confirmation de la sélection */}
      {rangeStart && (
        <div className="mt-4 rounded border border-border p-3">
          <p className="text-sm text-foreground">
            Bloquer du{" "}
            <strong>{format(rangeStart, "d MMM yyyy", { locale: fr })}</strong>{" "}
            au{" "}
            <strong>
              {format(rangeEnd ?? rangeStart, "d MMM yyyy", { locale: fr })}
            </strong>
          </p>
          <Input
            className="mt-2"
            placeholder="Motif (optionnel) : travaux, usage personnel..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="mt-3 flex gap-2">
            <Button
              type="button"
              onClick={confirmBlock}
              disabled={isPending}
              className="text-sm"
            >
              Confirmer le blocage
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setRangeStart(null);
                setRangeEnd(null);
                setReason("");
              }}
              className="text-sm"
            >
              Annuler
            </Button>
          </div>
        </div>
      )}

      {/* Liste des blocages */}
      <div className="mt-8">
        <h3 className="text-sm font-medium text-foreground">
          Périodes bloquées
        </h3>
        {blocks.length === 0 ? (
          <p className="mt-2 text-sm text-foreground-muted">
            Aucune période bloquée pour l&apos;instant.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-border">
            {blocks
              .slice()
              .sort((a, b) => a.start_date.localeCompare(b.start_date))
              .map((b) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between py-2.5"
                >
                  <div>
                    <p className="text-sm text-foreground">
                      {format(parseISO(b.start_date), "d MMM yyyy", {
                        locale: fr,
                      })}{" "}
                      →{" "}
                      {format(addDays(parseISO(b.end_date), -1), "d MMM yyyy", {
                        locale: fr,
                      })}
                    </p>
                    {b.reason && (
                      <p className="text-xs text-foreground-muted">
                        {b.reason}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(b.id)}
                    disabled={isPending}
                    className="text-foreground-muted hover:text-danger"
                    aria-label="Supprimer ce blocage"
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}