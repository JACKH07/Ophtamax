# Rôles et permissions — Ophtamax v2

## Codes rôles

| Code | Libellé | Description |
|------|---------|-------------|
| `ADMIN` | Administrateur | Accès total |
| `SEC` | Secrétaire / accueil | Patients, agenda, accueil, facturation basique |
| `OPHT` | Ophtalmologiste | Consultations, ordonnances, prescriptions |
| `ASS` | Assistant / orthoptiste | Consultations (saisie examens), agenda |
| `COMPTA` | Comptable / direction | Facturation, statistiques, exports |

## Matrice routes

| Route | ADMIN | SEC | OPHT | ASS | COMPTA |
|-------|:-----:|:---:|:----:|:---:|:------:|
| `/dashboard` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/patients` | ✓ | ✓ | ✓ | ✓ | ✓ (lecture) |
| `/patients/nouveau` | ✓ | ✓ | — | — | — |
| `/patients/:id/modifier` | ✓ | ✓ | — | — | — |
| `/agenda` | ✓ | ✓ | ✓ | ✓ | — |
| `/consultations` | ✓ | ✓* | ✓ | ✓ | — |
| `/facturation` | ✓ | ✓* | — | — | ✓ |
| `/statistiques` | ✓ | — | ✓ | — | ✓ |
| `/parametres/*` | ✓ | — | — | — | — |
| `/utilisateurs/*` | ✓ | — | — | — | — |

\* lecture seule pour SEC sur consultations ; SEC peut créer factures basiques.

## Matrice permissions (actions)

Implémentée dans `src/routes/rolePermissions.ts`.

| Permission | Rôles |
|------------|-------|
| `patients.create` | ADMIN, SEC |
| `patients.edit` | ADMIN, SEC |
| `patients.delete` | ADMIN |
| `consultations.write` | ADMIN, OPHT, ASS |
| `ordonnance.print` | ADMIN, OPHT |
| `facturation.write` | ADMIN, COMPTA |
| `caisse.access` | ADMIN, COMPTA, SEC |
| `settings.manage` | ADMIN |
| `users.manage` | ADMIN |

## Réponse API attendue (auth/me)

```json
{
  "data": {
    "user": {
      "id": "...",
      "nom": "Koffi",
      "prenoms": "Jean",
      "login_user": "jkoffi",
      "email": "...",
      "id_role": "OPHT",
      "fonction": "Ophtalmologiste"
    },
    "permissions": ["consultations.write", "ordonnance.print", ...]
  }
}
```

## Mode démo (VITE_USE_MOCK=true)

Comptes de test :

| Identifiant | Mot de passe | Rôle |
|-------------|--------------|------|
| `admin` | `admin` | ADMIN |
| `secretaire` | `secretaire` | SEC |
| `opht` | `opht` | OPHT (Dr Koffi) |
| `assistant` | `assistant` | ASS |
| `compta` | `compta` | COMPTA |
