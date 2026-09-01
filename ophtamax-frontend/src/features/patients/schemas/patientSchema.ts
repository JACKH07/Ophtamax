import { z } from 'zod'

export const patientSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  sexe: z.enum(['M', 'F']),
  date_nais: z.string().min(1, 'La date de naissance est requise'),
  profession: z.string().min(1, 'La profession est requise'),
  contact: z.string().min(1, 'Le contact est requis'),
  assurance: z.string(),
  antecedents: z.string(),
})

export type PatientFormValues = z.infer<typeof patientSchema>
