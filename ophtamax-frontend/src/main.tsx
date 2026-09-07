import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app/App'
import '@/styles/global.css'

function markFontsReady() {
  document.documentElement.classList.add('fonts-ready')
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
