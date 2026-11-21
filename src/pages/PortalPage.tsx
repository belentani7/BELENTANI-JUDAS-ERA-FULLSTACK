import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';

const PortalExperience = lazy(() => import('../components/PortalExperience').then((module) => ({ default: module.PortalExperience })));

export function PortalPage() {
  return (
    <div className="page page--portal" data-route-root>
      <header className="portal-head">
        <p className="page__eyebrow">PORTAL / GOLDEN KEY</p>
        <h1>La llave no abre una respuesta.</h1>
        <p>Abre una condicion de paso: atender, elegir, continuar.</p>
      </header>

      <section className="portal-stage" aria-labelledby="portal-title">
        <div className="portal-stage__copy">
          <p className="page__kicker">UMBRAL 01</p>
          <h2 id="portal-title">Golden Key</h2>
          <p>
            La clave funciona como figura de navegacion dentro de este mundo. No certifica acceso,
            pertenencia ni informacion exterior al recorrido.
          </p>
          <ol className="portal-steps">
            <li>Nombrar la entrada.</li>
            <li>Escuchar el dato sin fijarlo.</li>
            <li>Elegir una voz de salida.</li>
          </ol>
        </div>
        <div className="portal-stage__experience">
          <Suspense fallback={<p>Preparando portal</p>}><PortalExperience /></Suspense>
        </div>
      </section>

      <nav aria-label="Continuar el recorrido" className="portal-nav">
        <Link to="/judas">Cinco capitulos de JUDAS</Link>
        <Link to="/art-lab">Abrir Lab local</Link>
        <Link to="/archive">Consultar Archivo</Link>
      </nav>
    </div>
  );
}

export default PortalPage;
