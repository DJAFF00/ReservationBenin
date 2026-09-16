# Kajola — Plateforme de réservation de location meublée (Bénin)

Étape 2 du projet : squelette Next.js (App Router, TypeScript, Tailwind)
connecté à Supabase, avec mode clair/sombre.

## Démarrage

1. Installer les dépendances :
   ```bash
   npm install
   ```

2. Configurer Supabase :
   - Copie `.env.example` en `.env.local`
   - Remplis `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     (Supabase Dashboard → Project Settings → API)
   - Si ce n'est pas déjà fait, exécute `supabase/schema.sql` dans
     l'éditeur SQL de ton projet Supabase.

3. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```
   Le site est accessible sur http://localhost:3000

## Structure du projet

```
app/                  Pages (App Router)
  layout.tsx           Layout racine : polices, ThemeProvider
  page.tsx              Page d'accueil : recherche + grille d'annonces
  globals.css           Design tokens (couleurs clair/sombre)
components/
  site-header.tsx        En-tête + navigation
  property-card.tsx      Carte d'annonce
  theme-toggle.tsx        Bascule mode clair/sombre
  theme-provider.tsx      Provider next-themes
lib/
  supabase/client.ts       Client Supabase (navigateur)
  supabase/server.ts        Client Supabase (Server Components)
  supabase/middleware.ts      Rafraîchissement de session + routes protégées
middleware.ts                Middleware racine Next.js
supabase/schema.sql          Schéma de base de données (tables, RLS)
```

## Identité visuelle

- Couleurs : indigo `#1C2B4A`, ocre latérite `#C1793A`, vert palmier `#2F5D4F`,
  fond ivoire (clair) / charbon (sombre)
- Typo : Bricolage Grotesque (titres), IBM Plex Sans (texte et données)
- Les variables sont dans `app/globals.css` (`:root` et `.dark`)

## Prochaines étapes

- [ ] Authentification (connexion / inscription, rôles locataire / propriétaire)
- [ ] CRUD des annonces (formulaire, upload photos vers Supabase Storage)
- [ ] Calendrier de disponibilité par bien
- [ ] Recherche avec filtres (ville, prix, capacité, dates)
- [ ] Flux de réservation (demande → confirmation propriétaire)
- [ ] Tableau de bord propriétaire et admin
- [ ] Notifications par email
