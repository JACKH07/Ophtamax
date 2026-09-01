# Design System — Stitch Ophtamax

Source de vérité visuelle : exports HTML Stitch

- Connexion : `connexion_ophtamax/code.html`
- Tableau de bord : `tableau_de_bord_ophtamax_link_fix/code.html`

## Tokens implémentés

Fichier : `src/styles/global.css` (`@theme`)

- **Couleurs** : palette Material 3 (primary `#00626a`, secondary, surfaces, outline…)
- **Typographie** : Inter + tailles `display-lg`, `headline-md/sm`, `body-md/sm`, `label-md/sm`
- **Espacements** : `sidebar-width` (260px), `margin-page` (32px), `gutter` (24px)
- **Icônes** : Google Material Symbols Outlined (`MaterialIcon` component)
- **Fond login** : dégradé + motif œil (`bg-eye-pattern`)

## Composants alignés

| Composant React | Référence HTML |
|-----------------|----------------|
| `LoginPage` | Carte glassmorphism, champs avec icônes, footer copyright |
| `Sidebar` | Nav fixe 260px, item actif `secondary-container` + bordure primary |
| `Header` | Barre sticky, recherche à droite |
| `StatCard` | KPI avec icône circulaire, label uppercase |
| `WaitingQueueTable` | Table file d'attente, badges statut, menu `more_vert` |
| `UpcomingSlots` | Timeline verticale avec points colorés |
| `TopDiagnostics` | Barres horizontales avec opacités dégradées |
