import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app/App'
import '@/styles/global.css'

const PRELOADER_FADE_MS = 400
const PRELOADER_DURATION_MS = 5_000

function markFontsReady() {
  document.documentElement.classList.add('fonts-ready')
}

function hidePreloader() {
  const el = document.getElementById('app-preloader')
  if (!el || el.dataset.done === '1') return
  el.dataset.done = '1'
  el.classList.add('is-hiding')
  el.setAttribute('aria-busy', 'false')
  window.setTimeout(() => el.remove(), PRELOADER_FADE_MS)
}

if (document.fonts?.ready) {
  document.fonts.ready.then(markFontsReady).catch(markFontsReady)
} else {
  markFontsReady()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

window.setTimeout(hidePreloader, PRELOADER_DURATION_MS)
