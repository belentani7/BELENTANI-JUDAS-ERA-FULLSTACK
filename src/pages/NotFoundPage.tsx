import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="page page--not-found" data-route-root>
      <header>
        <p className="page__eyebrow">BELENTANI / SENAL NO ENCONTRADA</p>
        <h1>Esta puerta no forma parte del recorrido actual.</h1>
        <p>
          Puede que la ruta haya cambiado, que la pieza permanezca en revision editorial o que la
          clave no corresponda a este mundo.
        </p>
      </header>
      <nav aria-label="Rutas disponibles">
        <ul className="route-list">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/artist">Artista</Link></li>
          <li><Link to="/judas">JUDAS</Link></li>
          <li><Link to="/archive">Archivo</Link></li>
          <li><Link to="/art-lab">Lab</Link></li>
          <li><Link to="/portal">Portal</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default NotFoundPage;
