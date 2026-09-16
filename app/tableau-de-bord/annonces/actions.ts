"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { MAX_PHOTOS_PAR_ANNONCE } from "@/lib/constants";

async function requireOwner() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  return { supabase, user };
}

export async function saveProperty(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const propertyId = formData.get("property_id") as string | null;

  const payload = {
    title: (formData.get("title") as string)?.trim(),
    description: ((formData.get("description") as string) ?? "").trim(),
    property_type: formData.get("property_type") as string,
    address: (formData.get("address") as string)?.trim(),
    city: (formData.get("city") as string)?.trim(),
    neighborhood: ((formData.get("neighborhood") as string) || "").trim() || null,
    capacity: Number(formData.get("capacity") || 1),
    bedrooms: Number(formData.get("bedrooms") || 1),
    bathrooms: Number(formData.get("bathrooms") || 1),
    amenities: formData.getAll("amenities") as string[],
    price_per_night: Number(formData.get("price_per_night") || 0),
    price_per_week: formData.get("price_per_week")
      ? Number(formData.get("price_per_week"))
      : null,
    price_per_month: formData.get("price_per_month")
      ? Number(formData.get("price_per_month"))
      : null,
  };

  const returnPath = propertyId
    ? `/tableau-de-bord/annonces/${propertyId}`
    : "/tableau-de-bord/annonces/nouvelle";

  if (
    !payload.title ||
    !payload.property_type ||
    !payload.address ||
    !payload.city ||
    !payload.price_per_night
  ) {
    redirect(
      `${returnPath}?toast=error&toast_msg=${encodeURIComponent(
        "Merci de remplir les champs obligatoires : titre, type, adresse, ville, prix par nuit."
      )}`
    );
  }

  if (propertyId) {
    const { error } = await supabase
      .from("properties")
      .update(payload)
      .eq("id", propertyId)
      .eq("owner_id", user.id);

    if (error) {
      redirect(
        `${returnPath}?toast=error&toast_msg=${encodeURIComponent("Erreur lors de l'enregistrement.")}`
      );
    }
    revalidatePath(returnPath);
    redirect(
      `${returnPath}?toast=success&toast_msg=${encodeURIComponent("Modifications enregistrées.")}`
    );
  } else {
    const { data, error } = await supabase
      .from("properties")
      .insert({ ...payload, owner_id: user.id })
      .select("id")
      .single();

    if (error || !data) {
      redirect(
        `${returnPath}?toast=error&toast_msg=${encodeURIComponent("Erreur lors de la création.")}`
      );
    }
    revalidatePath("/tableau-de-bord/annonces");
    redirect(
      `/tableau-de-bord/annonces/${data!.id}?toast=success&toast_msg=${encodeURIComponent(
        "Annonce créée. Ajoute des photos puis publie-la."
      )}`
    );
  }
}

export async function deleteProperty(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const propertyId = formData.get("property_id") as string;

  await supabase
    .from("properties")
    .delete()
    .eq("id", propertyId)
    .eq("owner_id", user.id);

  revalidatePath("/tableau-de-bord/annonces");
  redirect(
    `/tableau-de-bord/annonces?toast=success&toast_msg=${encodeURIComponent("Annonce supprimée.")}`
  );
}

export async function togglePublish(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const propertyId = formData.get("property_id") as string;
  const nextStatus = formData.get("next_status") as string;

  await supabase
    .from("properties")
    .update({ status: nextStatus })
    .eq("id", propertyId)
    .eq("owner_id", user.id);

  revalidatePath(`/tableau-de-bord/annonces/${propertyId}`);
  revalidatePath("/tableau-de-bord/annonces");

  redirect(
    `/tableau-de-bord/annonces/${propertyId}?toast=success&toast_msg=${encodeURIComponent(
      nextStatus === "publie" ? "Annonce publiée." : "Annonce dépubliée."
    )}`
  );
}

export async function addPropertyImage(propertyId: string, url: string) {
  const { supabase, user } = await requireOwner();

  const { data: property } = await supabase
    .from("properties")
    .select("id")
    .eq("id", propertyId)
    .eq("owner_id", user.id)
    .single();

  if (!property) throw new Error("Bien introuvable.");

  const { count } = await supabase
    .from("property_images")
    .select("id", { count: "exact", head: true })
    .eq("property_id", propertyId);

  if ((count ?? 0) >= MAX_PHOTOS_PAR_ANNONCE) {
    throw new Error(`Maximum ${MAX_PHOTOS_PAR_ANNONCE} photos par annonce.`);
  }

  const { error } = await supabase
    .from("property_images")
    .insert({ property_id: propertyId, url, position: count ?? 0 });

  if (error) throw new Error("Erreur lors de l'enregistrement de la photo.");

  revalidatePath(`/tableau-de-bord/annonces/${propertyId}`);
}

export async function removePropertyImage(
  imageId: string,
  propertyId: string,
  url: string
) {
  const { supabase, user } = await requireOwner();

  const { data: property } = await supabase
    .from("properties")
    .select("id")
    .eq("id", propertyId)
    .eq("owner_id", user.id)
    .single();

  if (!property) throw new Error("Bien introuvable.");

  const path = url.split("/property-images/")[1];
  if (path) {
    await supabase.storage.from("property-images").remove([path]);
  }
  await supabase.from("property_images").delete().eq("id", imageId);

  revalidatePath(`/tableau-de-bord/annonces/${propertyId}`);
}