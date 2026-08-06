import '@fontsource-variable/instrument-sans'
import '@fontsource/ibm-plex-mono'
import '@fontsource/bodoni-moda'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { MotionProvider } from './shell/MotionProvider'
import { WorldProvider } from './shell/WorldProvider'
import './styles/global.css'
import './styles/pages.css'
import './styles/worlds.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <WorldProvider>
        <MotionProvider>
          <App />
        </MotionProvider>
      </WorldProvider>
    </BrowserRouter>
  </StrictMode>,
)
