# Contrat API REST — Ophtamax v2

Préfixe : `/api/v1`  
Auth : `Authorization: Bearer {token}` (Laravel Sanctum)

Format réponse standard :

```json
{
  "data": {},
  "meta": { "current_page": 1, "total": 100, "per_page": 15 },
  "message": "ok"
}
```

Statut : **🆕 à créer** (aucune API REST dans la v1 actuelle)

---

## Auth

| Méthode | URL | Body | Response |
|---------|-----|------|----------|
| POST | `/auth/login` | `{ login, password }` | `{ token, user, permissions[] }` |
| POST | `/auth/logout` | — | `{ message }` |
| GET | `/auth/me` | — | `{ user, permissions[] }` |
| PUT | `/auth/password` | `{ current, new, confirm }` | `{ message }` |

---

## Dashboard

| Méthode | URL | Response |
|---------|-----|----------|
| GET | `/dashboard/summary` | KPIs journée |
| GET | `/dashboard/consultations-chart?period=month` | séries graphique |
| GET | `/dashboard/revenue-chart?from=&to=` | séries CA |
| GET | `/dashboard/waiting-queue?date=` | file d'attente |
| GET | `/dashboard/upcoming-slots?date=` | prochains créneaux |
| GET | `/dashboard/top-diagnostics?period=month` | top diagnostics |

---

## Patients

Table `patient` : `id, nom, prenom, sexe, date_nais, profession, contact, assurance, antecedents`

| Méthode | URL |
|---------|-----|
| GET | `/patients?page=&search=&assurance=` |
| GET | `/patients/:id` |
| POST | `/patients` |
| PUT | `/patients/:id` |
| DELETE | `/patients/:id` |
| GET | `/patients/:id/consultations` |

---

## Agenda (tables à créer)

| Méthode | URL |
|---------|-----|
| GET | `/agenda/rendez-vous?from=&to=&medecin_id=` |
| POST | `/agenda/rendez-vous` |
| PUT | `/agenda/rendez-vous/:id` |
| DELETE | `/agenda/rendez-vous/:id` |
| GET | `/agenda/file-attente?date=` |
| POST | `/agenda/file-attente` |
| PATCH | `/agenda/file-attente/:id/statut` |

---

## Consultations

Table `consultation` : `id, id_patient, nom_prenoms_pat, datecons, diagnostic, examen, ordonnance, prescription`

| Méthode | URL |
|---------|-----|
| GET | `/consultations?page=&patient_id=&from=&to=` |
| GET | `/consultations/:id` |
| POST | `/consultations` |
| PUT | `/consultations/:id` |
| DELETE | `/consultations/:id` |
| GET | `/consultations/:id/ordonnance/pdf` |
| GET | `/consultations/:id/prescription/pdf` |

---

## Facturation (modèle à définir)

| Méthode | URL |
|---------|-----|
| GET | `/factures` |
| POST | `/factures` |
| GET | `/factures/:id` |
| POST | `/factures/:id/paiements` |
| GET | `/factures/:id/pdf` |
| GET | `/caisse/jour?date=` |

---

## Statistiques

| Méthode | URL |
|---------|-----|
| GET | `/statistiques/consultations?from=&to=` |
| GET | `/statistiques/facturation?from=&to=` |
| GET | `/statistiques/export?type=&format=` |

---

## Référentiels / Paramètres

| Méthode | URL | Table v1 |
|---------|-----|----------|
| CRUD | `/referentiels/genres` | `genre` |
| CRUD | `/referentiels/professions` | `profession` |
| CRUD | `/referentiels/examens` | `examen` |
| CRUD | `/referentiels/assurances` | `assurance` |
| CRUD | `/referentiels/roles` | `roles` |
| GET/PUT | `/parametres/societe` | `societe` |

---

## Utilisateurs

Table `user` : `id, codegenre, nom, prenoms, datenais, login_user, pswrd, email, id_role, fonction`

| Méthode | URL |
|---------|-----|
| GET | `/users` |
| POST | `/users` |
| PUT | `/users/:id` |
| DELETE | `/users/:id` |
