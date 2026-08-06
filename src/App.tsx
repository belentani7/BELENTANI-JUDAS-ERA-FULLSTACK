import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './shell/AppShell'

const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })))
const EditorialPage = lazy(() => import('./pages/EditorialPage').then((module) => ({ default: module.EditorialPage })))
const JudasPage = lazy(() => import('./pages/JudasPage').then((module) => ({ default: module.JudasPage })))
const ArchivePage = lazy(() => import('./pages/ArchivePage').then((module) => ({ default: module.ArchivePage })))
const LabPage = lazy(() => import('./pages/LabPage').then((module) => ({ default: module.LabPage })))
const PortalPage = lazy(() => import('./pages/PortalPage').then((module) => ({ default: module.PortalPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))

export function App() {
  return (
    <AppShell>
      <Suspense fallback={<div className="route-loading" role="status">Cargando señal</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/judas" element={<JudasPage />} />
          <Route path="/judas/:chapterId" element={<JudasPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/art-lab" element={<LabPage />} />
          <Route path="/portal" element={<PortalPage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/:routeId" element={<EditorialPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AppShell>
  )
}
