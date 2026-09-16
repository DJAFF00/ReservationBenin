"use client";

import { useRef, useState, useTransition } from "react";
import { Trash2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { addPropertyImage, removePropertyImage } from "@/app/tableau-de-bord/annonces/actions";
import { MAX_PHOTOS_PAR_ANNONCE } from "@/lib/constants";
import { useToast } from "@/components/toast/toast-provider";

type PropertyImage = { id: string; url: string };

export function ImageUploader({
  propertyId,
  initialImages,
}: {
  propertyId: string;
  initialImages: PropertyImage[];
}) {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const remainingSlots = MAX_PHOTOS_PAR_ANNONCE - images.length;

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const toUpload = Array.from(files).slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      toast({
        type: "error",
        message: `Tu peux encore ajouter ${remainingSlots} photo(s) maximum.`,
      });
    }

    setUploading(true);
    const supabase = createClient();
    let addedCount = 0;

    for (const file of toUpload) {
      if (!file.type.startsWith("image/")) {
        toast({ type: "error", message: "Seules les images sont acceptées." });
        continue;
      }
      if (file.size > 8 * 1024 * 1024) {
        toast({ type: "error", message: "Chaque photo doit faire moins de 8 Mo." });
        continue;
      }

      const ext = file.name.split(".").pop();
      const path = `${propertyId}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(path, file);

      if (uploadError) {
        toast({ type: "error", message: "Échec de l'envoi d'une photo. Réessaie." });
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("property-images").getPublicUrl(path);

      try {
        await addPropertyImage(propertyId, publicUrl);
        setImages((prev) => [...prev, { id: publicUrl, url: publicUrl }]);
        addedCount++;
      } catch (e) {
        toast({
          type: "error",
          message: e instanceof Error ? e.message : "Erreur inconnue.",
        });
      }
    }

    if (addedCount > 0) {
      toast({
        type: "success",
        message: addedCount > 1 ? `${addedCount} photos ajoutées.` : "Photo ajoutée.",
      });
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDelete(image: PropertyImage) {
    startTransition(async () => {
      try {
        await removePropertyImage(image.id, propertyId, image.url);
        setImages((prev) => prev.filter((i) => i.id !== image.id));
        toast({ type: "success", message: "Photo supprimée." });
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
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative aspect-square overflow-hidden rounded-photo bg-surface-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt=""
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleDelete(image)}
              disabled={isPending}
              className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded bg-background/90 text-danger opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Supprimer la photo"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        {remainingSlots > 0 && (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-photo border border-dashed border-border text-foreground-muted hover:border-foreground-muted">
            <Upload size={16} />
            <span className="text-center text-xs px-2">
              {uploading ? "Envoi..." : "Ajouter"}
            </span>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        )}
      </div>

      <p className="mt-2 text-xs text-foreground-muted">
        {images.length}/{MAX_PHOTOS_PAR_ANNONCE} photos
      </p>
    </div>
  );
}