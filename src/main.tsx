import '@fontsource-variable/instrument-sans/index.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/bodoni-moda/600.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { MotionProvider } from './shell/MotionProvider'
import { WorldProvider } from './shell/WorldProvider'
import './styles/global.css'
import './styles/pages.css'
import './styles/worlds.css'
import './styles/judas-era.css'
import './styles/home-experience.css'
import './styles/studio-world.css'

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
