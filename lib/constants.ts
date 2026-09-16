export const VILLES = [
  "Cotonou",
  "Porto-Novo",
  "Ouidah",
  "Abomey",
  "Parakou",
] as const;

export const TYPES_BIEN = [
  { value: "appartement", label: "Appartement" },
  { value: "studio", label: "Studio" },
  { value: "villa", label: "Villa" },
  { value: "chambre", label: "Chambre" },
  { value: "maison", label: "Maison" },
] as const;

export const AMENITES = [
  { value: "electricite", label: "Électricité" },
  { value: "eau_courante", label: "Eau courante" },
  { value: "climatisation", label: "Climatisation" },
  { value: "wifi", label: "Wifi" },
  { value: "generateur", label: "Générateur" },
  { value: "parking", label: "Parking privé" },
  { value: "cuisine_equipee", label: "Cuisine équipée" },
  { value: "television", label: "Télévision" },
  { value: "lave_linge", label: "Lave-linge" },
  { value: "gardiennage", label: "Gardiennage / sécurité" },
  { value: "piscine", label: "Piscine" },
  { value: "balcon", label: "Balcon / terrasse" },
] as const;

export const MAX_PHOTOS_PAR_ANNONCE = 5;

export function labelType(value: string) {
  return TYPES_BIEN.find((t) => t.value === value)?.label ?? value;
}