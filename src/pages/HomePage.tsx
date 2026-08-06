import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { routeDefinitions, type RouteDefinition } from '../data/routes';
import { themes } from '../data/themes';
import { useWorld } from '../shell/WorldProvider';

const SignalScene = lazy(() => import('../components/SignalScene').then((module) => ({ default: module.SignalScene })));

type RoutePreview = { path: string; title: string; description: string };

const fallbackWorlds: readonly RoutePreview[] = [
  { path: '/artist', title: 'Artista', description: 'Lecturas, fragmentos y trazos de un archivo en proceso.' },
  { path: '/judas', title: 'JUDAS', description: 'Cinco capitulos para atravesar la traicion como lenguaje.' },
  { path: '/archive', title: 'Archivo', description: 'Materiales con procedencia y estado editorial visibles.' },
  { path: '/art-lab', title: 'Lab', description: 'Senales locales: entrada, proceso y salida reproducibles.' },
  { path: '/portal', title: 'Portal', description: 'Acceso a una experiencia guiada por la Golden Key.' },
];

function getString(record: Record<string, unknown>, keys: readonly string[], fallback: string): string {
  for (const key of keys) if (typeof record[key] === 'string') return record[key];
  return fallback;
}

function getWorlds(routes: readonly RouteDefinition[]): readonly RoutePreview[] {
  const previews = (routes as readonly Record<string, unknown>[])
    .map((route) => ({
      path: getString(route, ['path', 'href', 'to'], ''),
      title: getString(route, ['title', 'label', 'name'], ''),
      description: getString(route, ['description', 'summary', 'excerpt'], 'Entrada al mundo editorial.'),
    }))
    .filter((route) => route.path && route.path !== '/' && route.title)
    .slice(0, 5);
  return previews.length ? previews : fallbackWorlds;
}

export function HomePage() {
  const { world } = useWorld();
  const worlds = getWorlds(routeDefinitions);
  const worldNumber = themes.findIndex((theme) => theme.id === world.id) + 1;
  return (
    <div className="page page--home" data-route-root>
      <header className="page__masthead" aria-label="BELENTANI">
        <p className="page__eyebrow">BELENTANI / 20 WORLDS</p>
        <p className="page__index">MUNDO {String(worldNumber).padStart(2, '0')}</p>
      </header>

      <section className="home-intro" aria-labelledby="home-title">
        <div className="home-intro__copy">
          <p className="page__kicker">Sistema creativo en curso</p>
          <h1 id="home-title">BELENTANI</h1>
          <p className="home-intro__statement">
            traicion = entrada<br />
            dolor = datos<br />
            voz = salida
          </p>
          <p>
            Un espacio editorial y sensorial. Cada entrada propone una lectura; no sustituye
            el contexto ni presenta ficcion, memoria o biografia como hechos verificados.
          </p>
          <nav aria-label="Rutas principales">
            <ul className="route-list">
              {worlds.map(({ path, title, description }, index) => (
                <li key={title}>
                  <Link to={path}>
                    <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <span>{title}</span>
                    <small>{description}</small>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="home-intro__signal" aria-label="Senal visual de bienvenida">
          <Suspense fallback={<p className="scene-loading">Preparando escena</p>}>
            <SignalScene label="Senal BELENTANI" />
          </Suspense>
        </div>
      </section>

      <section className="home-protocol" aria-labelledby="protocol-title">
        <p className="page__kicker">Protocolo</p>
        <h2 id="protocol-title">No hay linea recta.</h2>
        <p>
          La entrada puede ser una escucha, una imagen, una palabra o una clave. La salida queda
          abierta para quien decide continuar.
        </p>
        <Link className="text-link" to="/portal">Abrir Portal</Link>
      </section>
    </div>
  );
}

export default HomePage;
