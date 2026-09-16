import { saveProperty } from "@/app/tableau-de-bord/annonces/actions";
import { Input, Label, Textarea, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TYPES_BIEN, AMENITES } from "@/lib/constants";

type PropertyData = {
  id: string;
  title: string;
  description: string;
  property_type: string;
  address: string;
  city: string;
  neighborhood: string | null;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  price_per_night: number;
  price_per_week: number | null;
  price_per_month: number | null;
} | null;

export function PropertyForm({ property }: { property: PropertyData }) {
  const amenitiesSelected = new Set(property?.amenities ?? []);

  return (
    <form action={saveProperty} className="space-y-8">
      {property && (
        <input type="hidden" name="property_id" value={property.id} />
      )}

      {/* Informations générales */}
      <section className="space-y-4">
        <h2 className="font-display text-base font-semibold text-foreground">
          Informations générales
        </h2>

        <div>
          <Label htmlFor="title">Titre de l&apos;annonce</Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={property?.title}
            placeholder="Ex : Appartement 2 chambres, vue lagune"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={property?.description}
            placeholder="Décrivez le logement, son quartier, ses accès..."
          />
        </div>

        <div>
          <Label htmlFor="property_type">Type de bien</Label>
          <Select
            id="property_type"
            name="property_type"
            required
            defaultValue={property?.property_type ?? ""}
          >
            <option value="" disabled>
              Choisir un type
            </option>
            {TYPES_BIEN.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </div>
      </section>

      {/* Localisation */}
      <section className="space-y-4">
        <h2 className="font-display text-base font-semibold text-foreground">
          Localisation
        </h2>

        <div>
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            name="address"
            required
            defaultValue={property?.address}
            placeholder="Rue, repère..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              name="city"
              required
              defaultValue={property?.city}
              placeholder="Ex : Cotonou"
            />
          </div>
          <div>
            <Label htmlFor="neighborhood">Quartier</Label>
            <Input
              id="neighborhood"
              name="neighborhood"
              defaultValue={property?.neighborhood ?? ""}
              placeholder="Ex : Fidjrossè"
            />
          </div>
        </div>
      </section>

      {/* Capacité */}
      <section className="space-y-4">
        <h2 className="font-display text-base font-semibold text-foreground">
          Capacité
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="capacity">Voyageurs</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              min={1}
              required
              defaultValue={property?.capacity ?? 1}
            />
          </div>
          <div>
            <Label htmlFor="bedrooms">Chambres</Label>
            <Input
              id="bedrooms"
              name="bedrooms"
              type="number"
              min={0}
              required
              defaultValue={property?.bedrooms ?? 1}
            />
          </div>
          <div>
            <Label htmlFor="bathrooms">Salles de bain</Label>
            <Input
              id="bathrooms"
              name="bathrooms"
              type="number"
              min={0}
              required
              defaultValue={property?.bathrooms ?? 1}
            />
          </div>
        </div>
      </section>

      {/* Équipements */}
      <section className="space-y-4">
        <h2 className="font-display text-base font-semibold text-foreground">
          Équipements
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {AMENITES.map((a) => (
            <label
              key={a.value}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <input
                type="checkbox"
                name="amenities"
                value={a.value}
                defaultChecked={amenitiesSelected.has(a.value)}
                className="h-4 w-4 rounded border-border accent-indigo"
              />
              {a.label}
            </label>
          ))}
        </div>
      </section>

      {/* Tarifs */}
      <section className="space-y-4">
        <h2 className="font-display text-base font-semibold text-foreground">
          Tarifs (FCFA)
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="price_per_night">Par nuit *</Label>
            <Input
              id="price_per_night"
              name="price_per_night"
              type="number"
              min={0}
              required
              defaultValue={property?.price_per_night}
            />
          </div>
          <div>
            <Label htmlFor="price_per_week">Par semaine</Label>
            <Input
              id="price_per_week"
              name="price_per_week"
              type="number"
              min={0}
              defaultValue={property?.price_per_week ?? ""}
            />
          </div>
          <div>
            <Label htmlFor="price_per_month">Par mois</Label>
            <Input
              id="price_per_month"
              name="price_per_month"
              type="number"
              min={0}
              defaultValue={property?.price_per_month ?? ""}
            />
          </div>
        </div>
      </section>

      <Button type="submit">
        {property ? "Enregistrer les modifications" : "Créer l'annonce"}
      </Button>
    </form>
  );
}
