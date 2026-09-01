import { z } from 'zod'

export const loginSchema = z.object({
  login: z.string().min(1, 'L\'identifiant est requis'),
  password: z.string().min(1, 'Le mot de passe est requis'),
  remember: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
