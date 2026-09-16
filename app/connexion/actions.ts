"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect(
      `/connexion?toast=error&toast_msg=${encodeURIComponent("Merci de remplir tous les champs.")}`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(
      `/connexion?toast=error&toast_msg=${encodeURIComponent("Email ou mot de passe incorrect.")}`
    );
  }

  redirect(
    `/tableau-de-bord?toast=success&toast_msg=${encodeURIComponent("Connexion réussie. Bienvenue !")}`
  );
}