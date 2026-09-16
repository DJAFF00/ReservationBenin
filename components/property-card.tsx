import Link from "next/link";
import { ImageOff, MapPin } from "lucide-react";

type PropertyCardProps = {
  id: string;
  title: string;
  city: string;
  neighborhood?: string | null;
  pricePerNight: number;
  imageUrl?: string;
  bedrooms: number;
};

export function PropertyCard({
  id,
  title,
  city,
  neighborhood,
  pricePerNight,
  imageUrl,
  bedrooms,
}: PropertyCardProps) {
  return (
    <Link
      href={`/annonces/${id}`}
      className="group block cursor-pointer transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-photo bg-surface-muted shadow-sm transition-shadow duration-300 group-hover:shadow-xl">
        {imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-foreground-muted/50">
            <ImageOff size={22} />
          </div>
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-display text-[17px] font-medium leading-snug text-foreground transition-colors group-hover:text-ochre">
          {title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-foreground-muted">
          <MapPin size={13} />
          {neighborhood ? `${neighborhood}, ` : ""}
          {city}
        </p>
        <p className="mt-2 text-sm text-foreground-muted">
          {bedrooms} {bedrooms > 1 ? "chambres" : "chambre"}
        </p>
        <p className="mt-2 font-display text-[15px] font-semibold text-foreground">
          {pricePerNight.toLocaleString("fr-FR")} FCFA{" "}
          <span className="font-sans text-sm font-normal text-foreground-muted">
            / nuit
          </span>
        </p>
      </div>
    </Link>
  );
}