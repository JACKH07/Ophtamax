# Ophtamax Frontend v2

Application React.js pour la gestion de cabinet d'ophtalmologie. Consomme l'API REST Laravel (Sanctum).

## Prérequis

- Node.js 20+
- npm 10+

## Installation

```bash
cd ophtamax-frontend
cp .env.example .env
npm install
npm run dev
```

Application disponible sur [http://localhost:5173](http://localhost:5173).

## Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `VITE_API_URL` | URL base API Laravel | `http://localhost:8000/api/v1` |
| `VITE_USE_MOCK` | Mode démo sans backend | `true` |

## Mode démo (sans Laravel)

Avec `VITE_USE_MOCK=true`, utilisez ces comptes :

| Identifiant | Mot de passe | Rôle |
|-------------|--------------|------|
| `admin` | `admin` | Administrateur |
| `opht` | `opht` | Ophtalmologiste |
| `secretaire` | `secretaire` | Secrétaire |
| `assistant` | `assistant` | Assistant |
| `compta` | `compta` | Comptable |

## Scripts

```bash
npm run dev      # Serveur de développement
npm run build    # Build production
npm run preview  # Prévisualiser le build
```

## Structure

```
src/
├── api/           # Client Axios, types, mocks
├── app/           # Router, providers
├── components/    # Layout, guards
├── features/      # Modules métier (auth, dashboard, ...)
├── routes/        # Paths, permissions
├── stores/        # Zustand (auth)
└── styles/        # Tailwind global
```

## Documentation

- [Cadrage (Lot 0)](docs/CADRAGE.md)
- [Rôles & permissions](docs/ROLES_PERMISSIONS.md)
- [Contrat API](docs/API_CONTRACT.md)

## Lots de développement

- ✅ Lot 0 — Cadrage
- ✅ Lot 1 — Auth + Dashboard
- ⏳ Lot 2 — Patients
- ⏳ Lot 3 — Consultations
- ⏳ Lot 4 — Agenda
- ⏳ Lot 5 — Facturation & Statistiques
- ⏳ Lot 6 — Paramètres & Utilisateurs
- ⏳ Lot 7 — Finition
