# Lot 0 — Cadrage Ophtamax v2 Frontend

## Contexte

- **v1** : application PHP procédurale (Gentelella + PDO + sessions SHA1), dépôt `Ophtamax/production/`
- **v2 frontend** : React.js (ce dépôt `ophtamax-frontend/`), consomme une API REST Laravel 13
- **Schéma BDD cible** : `ophtamax_db.sql` (tables `patient`, `consultation`, `examen`, `user`, etc.)

## Décisions validées

| Sujet | Décision |
|-------|----------|
| Build | Vite + React 18 + TypeScript |
| Routing | react-router-dom v6 |
| État serveur | TanStack Query |
| État client | Zustand (auth, UI) |
| HTTP | Axios + intercepteurs Bearer |
| Formulaires | React Hook Form + Zod |
| UI | Tailwind CSS 4 + Lucide icons (aligné maquettes) |
| Auth | Laravel Sanctum (token API) |
| Emplacement | `ophtamax-frontend/` à la racine du monorepo |

## Conventions Git

- Branches : `main` (stable), `feat/<module>`, `fix/<issue>`
- Commits : Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`)
- PR : revue obligatoire, build + lint passent

## Structure feature-based

Voir `src/features/{auth,dashboard,...}` — chaque module contient `pages/`, `components/`, `hooks/`, `services/`, `schemas/`.

## Maquettes de référence

- Connexion : carte centrée, teal `#0d7377`, logo œil
- Dashboard : sidebar fixe, 4 KPI, file d'attente, créneaux, top diagnostics

## Prochain lots

| Lot | Contenu |
|-----|---------|
| 2 | Patients |
| 3 | Consultations & documents |
| 4 | Agenda |
| 5 | Facturation & Statistiques |
| 6 | Paramètres & Utilisateurs |
| 7 | Finition |
