import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from '@/api/client'
import { USE_MOCK } from '@/api/endpoints'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { loginSchema, type LoginFormData } from '@/features/auth/schemas/loginSchema'
import { login } from '@/features/auth/services/authService'
import { PATHS } from '@/routes/paths'

export function LoginPage() {
  const navigate = useNavigate()
  const { setAuth, isAuthenticated } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { remember: false },
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate(PATHS.dashboard, { replace: true })
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (data: LoginFormData) => {
    setError(null)
    setIsSubmitting(true)
    try {
      const response = await login({
        login: data.login,
        password: data.password,
      })
      setAuth(response.token, response.user, response.permissions)
      navigate(PATHS.dashboard, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-surface-bright to-surface-container-high bg-eye-pattern font-sans text-on-surface">
      <main className="w-full max-w-md px-4 py-8">
        <div className="relative flex w-full flex-col items-center overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest/90 p-8 shadow-[0_4px_24px_rgba(0,98,106,0.06)] backdrop-blur-md">
          <div className="mb-8 flex w-full flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-container shadow-sm">
              <MaterialIcon name="visibility" filled className="text-[32px] text-on-primary-container" />
            </div>
            <h1 className="mb-1 text-headline-md font-semibold text-primary">Ophtamax</h1>
            <p className="text-body-sm text-on-surface-variant">Management Platform</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            <div className="flex w-full flex-col gap-1">
              <label htmlFor="login" className="mb-1 text-label-md font-semibold tracking-wide text-on-surface-variant">
                Identifiant
              </label>
              <div className="relative w-full">
                <MaterialIcon
                  name="person"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                />
                <input
                  id="login"
                  type="text"
                  placeholder="Entrez votre identifiant"
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-3 pl-10 pr-4 text-body-md shadow-sm transition-all placeholder:text-outline-variant focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  {...register('login')}
                />
              </div>
              {errors.login && (
                <p className="text-label-sm text-error">{errors.login.message}</p>
              )}
            </div>

            <div className="flex w-full flex-col gap-1">
              <label htmlFor="password" className="mb-1 text-label-md font-semibold tracking-wide text-on-surface-variant">
                Mot de passe
              </label>
              <div className="relative w-full">
                <MaterialIcon
                  name="lock"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-3 pl-10 pr-10 text-body-md shadow-sm transition-all placeholder:text-outline-variant focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-outline transition-colors hover:text-primary focus:outline-none"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  <MaterialIcon name={showPassword ? 'visibility' : 'visibility_off'} />
                </button>
              </div>
              {errors.password && (
                <p className="text-label-sm text-error">{errors.password.message}</p>
              )}
            </div>

            <div className="flex w-full items-center justify-between pt-1">
              <label className="flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary"
                  {...register('remember')}
                />
                <span className="ml-2 block cursor-pointer text-body-sm text-on-surface-variant">
                  Se souvenir de moi
                </span>
              </label>
              <button
                type="button"
                className="text-label-md font-semibold tracking-wide text-primary transition-colors hover:text-primary-fixed-dim"
              >
                Mot de passe oublié ?
              </button>
            </div>

            {error && (
              <div className="rounded-lg bg-error-container px-4 py-3 text-body-sm text-on-error-container">
                {error}
              </div>
            )}

            {USE_MOCK && !error && (
              <div className="rounded-lg bg-surface-container-low px-4 py-3 text-body-sm text-on-surface-variant">
                <p className="font-semibold text-on-surface">Mode démo</p>
                <p className="mt-1">admin / admin · opht / opht · secretaire / secretaire</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 flex w-full items-center justify-center rounded-lg border border-transparent bg-primary px-4 py-3 text-label-md font-semibold tracking-wide text-on-primary shadow-sm transition-all hover:bg-on-primary-fixed-variant focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-[0.98] disabled:opacity-60"
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-primary-container/20 blur-2xl" />
          <div className="pointer-events-none absolute -left-12 -top-12 h-32 w-32 rounded-full bg-secondary-container/30 blur-2xl" />
        </div>

        <div className="mt-8 w-full text-center">
          <p className="text-body-sm text-on-surface-variant/70">
            © 2024 Centre d&apos;Ophtalmologie Saint-Louis. Tous droits réservés.
          </p>
        </div>
      </main>
    </div>
  )
}
