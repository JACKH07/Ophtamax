# Ophtamax Frontend v2

Application React.js complète pour la gestion de cabinet d'ophtalmologie.

## Démarrage rapide

```bash
cd ophtamax-frontend
npm install
npm run dev
```

Ouvrir [http://localhost:5173](http://localhost:5173)

## Connexion (mode démo)

| Identifiant | Mot de passe | Rôle |
|-------------|--------------|------|
| **opht** | **opht** | Ophtalmologiste (recommandé) |
| admin | admin | Administrateur |
| secretaire | secretaire | Secrétaire |
| nkahydara | test | Assistante (compte v1) |
| compta | compta | Comptable |

## Modules livrés

| Module | Route | Fonctionnalités |
|--------|-------|-----------------|
| Connexion | `/login` | Auth + rôles |
| Tableau de bord | `/dashboard` | KPIs, file d'attente, créneaux |
| Patients | `/patients` | Liste, création, fiche, édition |
| Agenda | `/agenda` | Planning jour + file d'attente |
| Consultations | `/consultations` | Liste, saisie OD/OG, diagnostic |
| Ordonnances | `/ordonnances` | Liste + impression PDF navigateur |
| Facturation | `/facturation` | Factures, caisse, impayés |
| Statistiques | `/statistiques` | Graphiques, top diagnostics |
| Paramètres | `/parametres` | Société, référentiels |
| Utilisateurs | `/utilisateurs` | Gestion comptes et rôles |

## Configuration

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_USE_MOCK=true   # false quand Laravel API est prêt
```

## Documentation

- [Cadrage](docs/CADRAGE.md)
- [Design System Stitch](docs/DESIGN_SYSTEM.md)
- [Contrat API](docs/API_CONTRACT.md)
- [Rôles & permissions](docs/ROLES_PERMISSIONS.md)
