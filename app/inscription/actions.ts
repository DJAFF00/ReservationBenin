"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
  const fullName = (formData.get("full_name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!fullName || !email || !password || !role) {
    redirect(
      `/inscription?toast=error&toast_msg=${encodeURIComponent("Merci de remplir tous les champs, y compris le type de compte.")}`
    );
  }

  if (password.length < 8) {
    redirect(
      `/inscription?toast=error&toast_msg=${encodeURIComponent("Le mot de passe doit contenir au moins 8 caractères.")}`
    );
  }

  if (role !== "locataire" && role !== "proprietaire") {
    redirect(
      `/inscription?toast=error&toast_msg=${encodeURIComponent("Type de compte invalide.")}`
    );
  }

  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role },
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    redirect(`/inscription?toast=error&toast_msg=${encodeURIComponent(error.message)}`);
  }

  redirect(
    `/inscription/verification?email=${encodeURIComponent(email)}&toast=success&toast_msg=${encodeURIComponent("Compte créé avec succès !")}`
  );
}