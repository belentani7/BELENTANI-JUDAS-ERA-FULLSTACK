export type CopyStatus = 'verified' | 'cautious' | 'pending'

export type RouteSectionType =
  | 'hero'
  | 'manifesto'
  | 'index'
  | 'grid'
  | 'timeline'
  | 'chapters'
  | 'media'
  | 'table'
  | 'radial'
  | 'contact'

export interface RouteSectionItem {
  id: string
  label: string
  title: string
  body: string
  meta?: string
  status?: CopyStatus
}

export interface RouteSection {
  id: string
  type: RouteSectionType
  eyebrow: string
  title: string
  body: string
  items?: RouteSectionItem[]
  cta?: { label: string; href: string }
}

export interface RouteDefinition {
  [key: string]: unknown
  id: string
  path: string
  label: string
  navLabel: string
  title: string
  summary: string
  themeId: string
  status: CopyStatus
  sections: RouteSection[]
  relatedRoutes: string[]
}

export interface JudasChapter {
  id: string
  number: number
  title: string
  summary: string
  status: CopyStatus
  sections: RouteSection[]
}

export const judasChapters: JudasChapter[] = [
  {
    id: 'judas-01-hombre-integrado',
    number: 1,
    title: 'Hombre Integrado',
    summary: 'Un umbral visual para entrar en el archivo JUDAS sin convertir una intuicion en biografia cerrada.',
    status: 'cautious',
    sections: [
      { id: 'call-signal', type: 'media', eyebrow: '01 / umbral', title: 'Antes del nombre, la señal', body: 'La experiencia comienza con materia, imagen y una frase. El medio de la obra permanece sellado.', items: [{ id: 'call-visual', label: 'Campo', title: 'Señal de entrada', body: 'Un artefacto visual abre el recorrido sin revelar ni precargar el medio protegido.', status: 'verified' }] },
      { id: 'call-note', type: 'manifesto', eyebrow: 'nota', title: 'Un comienzo abierto', body: 'JUDAS se trata aqui como una obra en desarrollo y como un dispositivo de lectura. El visitante recibe contexto suficiente para continuar, no una afirmacion total.' },
    ],
  },
  {
    id: 'judas-02-deuda-impagable',
    number: 2,
    title: 'Deuda Impagable',
    summary: 'Un capitulo de contraste entre voz, personaje y documento disponible.',
    status: 'cautious',
    sections: [
      { id: 'mirror-voices', type: 'grid', eyebrow: '02 / contraste', title: 'Voces que no deben mezclarse', body: 'Separar experiencia personal, material de trabajo y lectura editorial permite que cada pieza conserve su grado de certeza.', items: [{ id: 'mirror-canon', label: 'Canon', title: 'Material fechado', body: 'Presentar solo lo que cuente con nombre de archivo, fecha o procedencia clara.', status: 'verified' }, { id: 'mirror-reading', label: 'Lectura', title: 'Hipotesis de montaje', body: 'Las asociaciones visuales pueden mostrarse como propuesta editorial, con lenguaje de posibilidad.', status: 'cautious' }] },
      { id: 'mirror-frame', type: 'index', eyebrow: 'ficha', title: 'Marco de consulta', body: 'Una ficha lateral puede indicar procedencia, estado, formato y siguiente accion sin interrumpir el flujo de la obra.', cta: { label: 'Abrir archivo', href: '/archive' } },
    ],
  },
  {
    id: 'judas-03-robo-y-canto',
    number: 3,
    title: 'Robo y Canto',
    summary: 'Un espacio para el conflicto y la interrupcion, con controles que respetan el ritmo de lectura.',
    status: 'cautious',
    sections: [
      { id: 'fall-sequence', type: 'timeline', eyebrow: '03 / secuencia', title: 'Cortar tambien es editar', body: 'La secuencia puede mostrar cambios de intensidad sin afirmar que cada fragmento representa un hecho biografico.', items: [{ id: 'fall-01', label: 'Pulso', title: 'Acumulacion', body: 'Aumentar densidad tipografica y proximidad entre piezas.', meta: 'propuesta de ritmo', status: 'cautious' }, { id: 'fall-02', label: 'Corte', title: 'Silencio', body: 'Dejar un intervalo amplio antes de introducir el siguiente documento.', meta: 'propuesta de ritmo', status: 'cautious' }] },
      { id: 'fall-access', type: 'manifesto', eyebrow: 'cuidado', title: 'El visitante conserva el control', body: 'El movimiento intenso debe tener alternativa reducida y la lectura debe permanecer posible sin efectos.' },
    ],
  },
  {
    id: 'judas-04-victoria-amarga',
    number: 4,
    title: 'Victoria Amarga',
    summary: 'Una mesa de evidencias para ordenar documentos, versiones y preguntas sin confundirlos.',
    status: 'cautious',
    sections: [
      { id: 'archive-ledger', type: 'table', eyebrow: '04 / registro', title: 'Lo que puede comprobarse', body: 'El archivo debe privilegiar metadatos claros sobre una narracion espectacular.', items: [{ id: 'archive-file', label: 'Documento', title: 'Entrada con procedencia', body: 'Nombre, formato, fecha disponible, fuente y estado de revision.', status: 'verified' }, { id: 'archive-gap', label: 'Pregunta', title: 'Hueco documentado', body: 'Una ausencia se registra como ausencia; no se completa con una suposicion.', status: 'cautious' }] },
      { id: 'archive-route', type: 'index', eyebrow: 'navegacion', title: 'De la pieza al contexto', body: 'Cada pieza puede enlazar a su ficha, a una version anterior y al area de derechos cuando corresponda.', cta: { label: 'Ir al archivo', href: '/archive' } },
    ],
  },
  {
    id: 'judas-05-mentira-compartida',
    number: 5,
    title: 'Mentira Compartida',
    summary: 'Un cierre provisional que devuelve al visitante al presente del estudio y a las proximas decisiones.',
    status: 'cautious',
    sections: [
      { id: 'return-loop', type: 'radial' as RouteSectionType, eyebrow: '05 / retorno', title: 'La obra vuelve al taller', body: 'El final no necesita resolver JUDAS. Puede ofrecer rutas hacia archivo, estudio, derechos y contacto con un estado editorial legible.', items: [{ id: 'return-archive', label: 'Continuar', title: 'Abrir archivo', body: 'Volver a los documentos y piezas visuales relacionadas.', meta: '/archive' }, { id: 'return-studio', label: 'Continuar', title: 'Ver proceso', body: 'Consultar herramientas, versiones y notas de trabajo.', meta: '/studio' }] },
      { id: 'return-note', type: 'manifesto', eyebrow: 'estado', title: 'Cierre abierto', body: 'La fecha de cierre, la edicion definitiva y la disponibilidad publica deben confirmarse antes de presentarse como hechos.' },
    ],
  },
]

export const routeDefinitions: RouteDefinition[] = [
  {
    id: 'home', path: '/', label: 'Inicio', navLabel: 'Origen', title: 'Veinte mundos para una misma practica', summary: 'Una entrada editorial a BELENTANI, su archivo, sus obras y sus laboratorios.', themeId: 'paper-archive', status: 'cautious', relatedRoutes: ['/artist', '/judas', '/archive'],
    sections: [
      { id: 'home-hero', type: 'hero', eyebrow: 'BELENTANI / indice vivo', title: 'Una practica que cruza obra, archivo y sistema', body: 'Este sitio organiza materiales artisticos, experimentos y herramientas en rutas separadas. La copia distingue lo documentado de lo que sigue en proceso.', cta: { label: 'Explorar el indice', href: '/artist' } },
      { id: 'home-worlds', type: 'grid', eyebrow: 'mapa', title: 'Veinte mundos, cuatro familias', body: 'Cada mundo propone una atmosfera visual y una forma de lectura. La interfaz puede cambiar de familia sin perder la orientacion global.', items: [{ id: 'home-work', label: 'Obra', title: 'JUDAS', body: 'Experiencia narrativa y archivo de una obra en desarrollo.', meta: '/judas', status: 'cautious' }, { id: 'home-practice', label: 'Practica', title: 'Estudio y laboratorios', body: 'Metodos, prototipos y herramientas en revision.', meta: '/studio', status: 'cautious' }, { id: 'home-access', label: 'Acceso', title: 'Portal y derechos', body: 'Informacion para consulta, colaboracion y permisos.', meta: '/portal', status: 'cautious' }] },
      { id: 'home-note', type: 'manifesto', eyebrow: 'criterio', title: 'Leer antes de afirmar', body: 'Las fichas de cada ruta pueden mostrar fuente, fecha y nivel de certeza. El sistema esta preparado para recibir nuevas verificaciones sin reescribir el mapa.' },
    ],
  },
  {
    id: 'artist', path: '/artist', label: 'Artist', navLabel: 'Artist', title: 'Una practica en construccion', summary: 'Perfil editorial prudente para situar la voz, los medios y las preguntas del proyecto.', themeId: 'museum-label', status: 'cautious', relatedRoutes: ['/', '/books', '/studio'],
    sections: [
      { id: 'artist-hero', type: 'hero', eyebrow: 'perfil', title: 'Belentani como nombre de trabajo', body: 'La pagina presenta una practica que conecta musica, imagen, escritura y herramientas digitales. Los datos biograficos deben mantenerse ligados a una fuente concreta.', cta: { label: 'Ver documentos', href: '/archive' } },
      { id: 'artist-media', type: 'grid', eyebrow: 'medios', title: 'Lo que la practica toca', body: 'Un sistema de tarjetas permite separar disciplinas sin encerrarlas en una sola etiqueta.', items: [{ id: 'artist-sound', label: '01', title: 'Sonido', body: 'Canciones, demos y experimentos de escucha.', status: 'cautious' }, { id: 'artist-image', label: '02', title: 'Imagen', body: 'Direcciones visuales, escenas y piezas en movimiento.', status: 'cautious' }, { id: 'artist-text', label: '03', title: 'Texto', body: 'Notas, manuscritos y lecturas aun por editar.', status: 'pending' }] },
      { id: 'artist-statement', type: 'manifesto', eyebrow: 'posicion', title: 'Una voz con bordes visibles', body: 'El perfil evita resumir una identidad completa. Ofrece entradas para que el visitante contraste la obra con sus materiales de origen.' },
    ],
  },
  {
    id: 'judas', path: '/judas', label: 'JUDAS', navLabel: 'JUDAS', title: 'JUDAS: cinco umbrales', summary: 'Una experiencia por capitulos para entrar en una obra, sus materiales y sus preguntas.', themeId: 'black-mirror', status: 'cautious', relatedRoutes: ['/', '/music', '/archive', '/film'],
    sections: [
      { id: 'judas-hero', type: 'hero', eyebrow: 'obra / lectura', title: 'No es una ficha cerrada', body: 'JUDAS se presenta como una experiencia de cinco capitulos. Las relaciones entre los fragmentos son una propuesta de montaje hasta que cada fuente quede comprobada.', cta: { label: 'Comenzar', href: '/judas#judas-01-the-call' } },
      { id: 'judas-chapter-index', type: 'chapters', eyebrow: 'indice', title: 'Cinco capitulos para leer a otro ritmo', body: 'El recorrido puede ser lineal o consultarse como un archivo. Cada capitulo conserva su estado editorial.', items: judasChapters.map((chapter) => ({ id: chapter.id, label: String(chapter.number).padStart(2, '0'), title: chapter.title, body: chapter.summary, meta: chapter.status })) },
      { id: 'judas-related', type: 'media', eyebrow: 'derivas', title: 'La experiencia tiene salidas', body: 'Imagen, pelicula y archivo pueden aportar contexto sin forzar una interpretacion unica.', cta: { label: 'Abrir el archivo', href: '/archive' } },
    ],
  },
  {
    id: 'archive', path: '/archive', label: 'Archive', navLabel: 'Archive', title: 'Archivo con estado visible', summary: 'Un indice de piezas, documentos y versiones para navegar con trazabilidad.', themeId: 'studio-notes', status: 'cautious', relatedRoutes: ['/judas', '/books', '/rights'],
    sections: [
      { id: 'archive-hero', type: 'hero', eyebrow: 'archivo', title: 'Cada fragmento necesita una ficha', body: 'El archivo prioriza procedencia, formato y fecha disponible. Cuando un dato no esta confirmado, se conserva como pregunta.', cta: { label: 'Consultar derechos', href: '/rights' } },
      { id: 'archive-index', type: 'index', eyebrow: 'catalogo', title: 'Un indice que se puede filtrar', body: 'El renderer puede combinar tipo, proyecto, estado y origen sin perder el nombre original de cada material.', items: [{ id: 'archive-audio', label: 'audio', title: 'Demos y mezclas', body: 'Pistas con metadatos que requieren revision individual.', status: 'pending' }, { id: 'archive-docs', label: 'texto', title: 'Notas y manuscritos', body: 'Documentos de trabajo con versiones diferenciadas.', status: 'cautious' }, { id: 'archive-images', label: 'imagen', title: 'Piezas visuales', body: 'Imagenes cuya licencia y procedencia deben constar.', status: 'pending' }] },
      { id: 'archive-method', type: 'table', eyebrow: 'metodo', title: 'Registro antes que acumulacion', body: 'El valor del archivo esta en hacer legible el contexto, no en presentar todo como definitivo.' },
    ],
  },
  {
    id: 'atlas', path: '/atlas', label: 'HTML Atlas', navLabel: 'Atlas', title: '691 HTML, un sistema de procedencia', summary: 'Mapa sanitizado del corpus recuperado y de sus familias reutilizables.', themeId: 'cobalt-grid', status: 'verified', relatedRoutes: ['/archive', '/judas/versions', '/rights'],
    sections: [
      { id: 'atlas-hero', type: 'hero', eyebrow: 'corpus / mapa', title: 'Todo queda representado sin ejecutar el legado', body: 'El Atlas publica huellas anónimas, tamaño, estructura y estado editorial. Rutas locales, nombres sensibles y código histórico permanecen fuera del runtime.', cta: { label: 'Abrir estudios JUDAS', href: '/judas/versions' } },
      { id: 'atlas-families', type: 'grid', eyebrow: 'integración', title: 'Versiones convertidas en arquitectura', body: 'Ocho familias reúnen navegación, umbral, rutas, terminal, espacio, identidad, pacto y Zion.', items: [{ id: 'atlas-core', label: 'núcleo', title: 'Señales BELENTANI', body: 'Fuentes relacionadas directamente con la arquitectura y el lenguaje del proyecto.', status: 'verified' }, { id: 'atlas-technical', label: 'técnica', title: 'Biblioteca interna', body: 'Documentación y herramientas conservadas como consulta, no como interfaz pública.', status: 'cautious' }, { id: 'atlas-external', label: 'revisión', title: 'Archivo relacionado', body: 'Material catalogado que requiere decisión editorial, derechos o contexto.', status: 'pending' }] },
      { id: 'atlas-boundary', type: 'manifesto', eyebrow: 'límite', title: 'Representar no equivale a publicar', body: 'El mapa hace visible la escala del corpus mientras conserva la separación entre archivo privado, material revisable y componentes integrados.' },
    ],
  },
  {
    id: 'music', path: '/music', label: 'Music', navLabel: 'Music', title: 'Musica en escucha lenta', summary: 'Un espacio para pistas, demos y notas de produccion con creditos verificables.', themeId: 'blue-hour', status: 'pending', relatedRoutes: ['/judas', '/studio', '/rights'],
    sections: [
      { id: 'music-hero', type: 'hero', eyebrow: 'sonido', title: 'Escuchar tambien es documentar', body: 'La interfaz debe mostrar duracion, formato, estado y credito antes de reproducir. La disponibilidad publica de cada pista queda pendiente de confirmacion.', cta: { label: 'Ver permisos', href: '/rights' } },
      { id: 'music-releases', type: 'grid', eyebrow: 'piezas', title: 'Pistas con contexto', body: 'Cada pieza publicada puede alojar reproductor, ficha tecnica y una nota de proceso.', items: [{ id: 'music-catalogue', label: 'catálogo', title: 'Obras publicadas', body: 'Material público con autoría, versión y disponibilidad confirmadas.', status: 'cautious' }, { id: 'music-demos', label: 'estudio', title: 'Demos', body: 'Bocetos sonoros para escuchar como proceso, no como lanzamiento confirmado.', status: 'pending' }] },
      { id: 'music-notes', type: 'manifesto', eyebrow: 'escucha', title: 'El silencio tambien informa', body: 'Cargas, restricciones y ausencias de metadata deben ocupar un lugar claro en la experiencia.' },
    ],
  },
  {
    id: 'film', path: '/film', label: 'Film', navLabel: 'Film', title: 'Imagen en movimiento', summary: 'Secuencias, pruebas y referencias de montaje para proyectos audiovisuales en proceso.', themeId: 'silver-screen', status: 'pending', relatedRoutes: ['/judas', '/music', '/art-lab'],
    sections: [
      { id: 'film-hero', type: 'hero', eyebrow: 'pelicula / prueba', title: 'Una pantalla para mirar el proceso', body: 'El espacio puede presentar trailers, pruebas y storyboards diferenciando una pieza terminada de un ensayo de montaje.', cta: { label: 'Abrir art lab', href: '/art-lab' } },
      { id: 'film-reels', type: 'media', eyebrow: 'secuencias', title: 'Reels con ficha corta', body: 'La imagen debe ir acompañada de titulo, duracion, formato, credito y estado de publicacion.', items: [{ id: 'film-reel-01', label: 'reel 01', title: 'Secuencia de entrada', body: 'Propuesta de apertura; la fecha y el material final requieren validacion.', status: 'pending' }, { id: 'film-reel-02', label: 'nota', title: 'Prueba de ritmo', body: 'Ensayo para relacionar sonido, texto y corte.', status: 'cautious' }] },
      { id: 'film-method', type: 'timeline', eyebrow: 'montaje', title: 'Del plano a la version', body: 'Una linea de tiempo puede hacer visible como una imagen cambia entre captura, prueba y publicacion.' },
    ],
  },
  {
    id: 'books', path: '/books', label: 'Books', navLabel: 'Books', title: 'Libros y manuscritos', summary: 'Lecturas, cuadernos y documentos editoriales con versionado cuidadoso.', themeId: 'paper-archive', status: 'pending', relatedRoutes: ['/artist', '/archive', '/contact'],
    sections: [
      { id: 'books-hero', type: 'hero', eyebrow: 'texto', title: 'El libro como lugar de retorno', body: 'Los textos pueden aparecer como fragmentos, ediciones y documentos de trabajo. La pagina debe indicar que version esta visible.', cta: { label: 'Pedir contexto', href: '/contact' } },
      { id: 'books-shelf', type: 'grid', eyebrow: 'estanteria', title: 'Una biblioteca que dice su estado', body: 'La organizacion editorial permite combinar portada, nota, formato y nivel de revision.', items: [{ id: 'book-manuscript', label: 'manuscrito', title: 'Texto en proceso', body: 'Material de trabajo con pasajes aun no editados.', status: 'pending' }, { id: 'book-archive', label: 'archivo', title: 'Documento de referencia', body: 'Pieza que puede consultarse junto a su procedencia.', status: 'cautious' }] },
      { id: 'books-reading', type: 'manifesto', eyebrow: 'lectura', title: 'Un fragmento no sustituye al libro', body: 'El sistema debe ofrecer contexto, paginacion y estado para que una cita no se convierta en una afirmacion fuera de lugar.' },
    ],
  },
  {
    id: 'studio', path: '/studio', label: 'Studio', navLabel: 'Studio', title: 'El estudio como instrumento', summary: 'Un espacio para procesos, herramientas y decisiones que todavia pueden cambiar.', themeId: 'studio-notes', status: 'cautious', relatedRoutes: ['/artist', '/music', '/art-lab', '/agents'],
    sections: [
      { id: 'studio-hero', type: 'hero', eyebrow: 'taller', title: 'Hacer visible como se hace', body: 'El estudio no funciona como un escaparate de resultados perfectos. Expone pruebas, metodos y limites con lenguaje concreto.', cta: { label: 'Ver laboratorios', href: '/art-lab' } },
      { id: 'studio-tools', type: 'grid', eyebrow: 'herramientas', title: 'Un banco de trabajo navegable', body: 'Cada herramienta puede mostrar su funcion, dependencia, estado y proxima comprobacion.', items: [{ id: 'studio-audio', label: 'audio', title: 'Mesa de sonido', body: 'Organizacion de pistas, versiones y escucha.', status: 'cautious' }, { id: 'studio-image', label: 'imagen', title: 'Mesa visual', body: 'Referencias, pruebas y direcciones de arte.', status: 'cautious' }, { id: 'studio-code', label: 'codigo', title: 'Mesa de interfaz', body: 'Componentes, rutas y estados para una experiencia generica.', status: 'verified' }] },
      { id: 'studio-log', type: 'timeline', eyebrow: 'bitacora', title: 'Decisiones con fecha', body: 'Las notas de cambio ayudan a diferenciar una idea, una prueba y una implementacion que ya paso validacion.' },
    ],
  },
  {
    id: 'noiacore', path: '/noiacore', label: 'NOIACORE', navLabel: 'NOIACORE', title: 'NOIACORE: cocina de sistemas', summary: 'Un laboratorio conceptual para cruzar materia, interfaz y herramientas de inteligencia.', themeId: 'acid-console', status: 'cautious', relatedRoutes: ['/studio', '/agents', '/prisma', '/art-lab'],
    sections: [
      { id: 'noiacore-hero', type: 'hero', eyebrow: 'laboratorio', title: 'Una cocina de posibilidades', body: 'NOIACORE se presenta como una linea de exploracion. Las aplicaciones concretas y sus resultados deben documentarse por separado.', cta: { label: 'Abrir agentes', href: '/agents' } },
      { id: 'noiacore-modules', type: 'grid', eyebrow: 'modulos', title: 'Materia, lenguaje y herramienta', body: 'El contenido puede agrupar experimentos por intencion sin afirmar que forman un producto terminado.', items: [{ id: 'noiacore-matter', label: '01', title: 'Materia', body: 'Texturas, ingredientes y sensaciones como vocabulario visual.', status: 'cautious' }, { id: 'noiacore-language', label: '02', title: 'Lenguaje', body: 'Prompts, notas y sistemas de nombrado en revision.', status: 'pending' }, { id: 'noiacore-tool', label: '03', title: 'Herramienta', body: 'Prototipos que requieren prueba antes de exponerse como servicio.', status: 'pending' }] },
      { id: 'noiacore-boundary', type: 'manifesto', eyebrow: 'limite', title: 'El experimento conserva sus bordes', body: 'La pagina debe indicar que es demostracion, propuesta o herramienta disponible. Esa diferencia protege la lectura y el uso.' },
    ],
  },
  {
    id: 'art-lab', path: '/art-lab', label: 'Art Lab', navLabel: 'Art Lab', title: 'Laboratorio de formas', summary: 'Prototipos visuales y experimentos de interaccion pensados para ser observados y medidos.', themeId: 'cobalt-grid', status: 'cautious', relatedRoutes: ['/studio', '/film', '/noiacore'],
    sections: [
      { id: 'art-lab-hero', type: 'hero', eyebrow: 'prueba', title: 'Aqui la forma puede cambiar', body: 'El Art Lab es un area para probar composicion, ritmo y respuesta de interfaz. Cada demo debe declarar si es exploracion o pieza publicada.', cta: { label: 'Ver el estudio', href: '/studio' } },
      { id: 'art-lab-prototypes', type: 'grid', eyebrow: 'prototipos', title: 'Un indice de experimentos', body: 'Los prototipos se vuelven legibles cuando muestran objetivo, tecnica y resultado observado.', items: [{ id: 'lab-scroll', label: 'interaccion', title: 'Ritmo de scroll', body: 'Ensayo de capas y entradas medido con alternativa reducida.', status: 'cautious' }, { id: 'lab-type', label: 'tipografia', title: 'Texto como superficie', body: 'Prueba de escala, contraste y lectura sostenida.', status: 'cautious' }, { id: 'lab-three', label: 'espacio', title: 'Campo tridimensional', body: 'Exploracion que debe validar rendimiento antes de ser central.', status: 'pending' }] },
      { id: 'art-lab-review', type: 'table', eyebrow: 'revision', title: 'Medir antes de escalar', body: 'Una ficha de evaluacion puede registrar legibilidad, rendimiento, accesibilidad y compatibilidad con movimiento reducido.' },
    ],
  },
  {
    id: 'agents', path: '/agents', label: 'Agents', navLabel: 'Agents', title: 'Agentes con limites claros', summary: 'Un directorio de flujos experimentales para asistencia, revision y organizacion.', themeId: 'lime-circuit', status: 'cautious', relatedRoutes: ['/noiacore', '/studio', '/portal'],
    sections: [
      { id: 'agents-hero', type: 'hero', eyebrow: 'sistemas', title: 'La herramienta debe explicar su alcance', body: 'Los agentes se describen por entrada, salida, modelo, permisos y estado de prueba. No se promete autonomia donde no esta verificada.', cta: { label: 'Consultar el portal', href: '/portal' } },
      { id: 'agents-directory', type: 'grid', eyebrow: 'directorio', title: 'Flujos para tareas concretas', body: 'Un renderer generico puede filtrar agentes por dominio y nivel de supervision.', items: [{ id: 'agent-index', label: 'archivo', title: 'Clasificador de material', body: 'Propone etiquetas; una persona debe revisar cada asignacion.', status: 'cautious' }, { id: 'agent-copy', label: 'texto', title: 'Asistente editorial', body: 'Sugiere estructura y preguntas, no hechos biograficos.', status: 'cautious' }, { id: 'agent-check', label: 'control', title: 'Comprobador de estado', body: 'Expone campos pendientes para reducir afirmaciones sin fuente.', status: 'pending' }] },
      { id: 'agents-guardrails', type: 'manifesto', eyebrow: 'supervision', title: 'La ultima palabra sigue siendo humana', body: 'Cada flujo debe registrar sus supuestos, su fuente y la accion de aprobacion antes de cambiar un documento o publicarlo.' },
    ],
  },
  {
    id: 'prisma', path: '/prisma', label: 'Prisma', navLabel: 'Prisma', title: 'Prisma: cambiar el angulo', summary: 'Una superficie para comparar lecturas visuales, narrativas y tecnicas del mismo material.', themeId: 'ceremonial-pink', status: 'cautious', relatedRoutes: ['/artist', '/art-lab', '/noiacore'],
    sections: [
      { id: 'prisma-hero', type: 'hero', eyebrow: 'lecturas', title: 'Una pieza, varios angulos', body: 'Prisma puede mostrar como una misma entrada cambia al pasar por musica, texto, imagen o sistema. Las conexiones se presentan como lecturas editables.', cta: { label: 'Ver referencias', href: '/art-lab' } },
      { id: 'prisma-facets', type: 'radial' as RouteSectionType, eyebrow: 'facetas', title: 'Cambiar de plano sin perder el origen', body: 'Cada faceta mantiene el enlace al documento de partida y explica que parte es observacion y que parte es propuesta.', items: [{ id: 'prisma-sound', label: 'sonido', title: 'Pulso', body: 'La entrada se ordena por ritmo, timbre o silencio.', status: 'cautious' }, { id: 'prisma-image', label: 'imagen', title: 'Superficie', body: 'La entrada se ordena por color, encuadre o materia.', status: 'cautious' }, { id: 'prisma-text', label: 'texto', title: 'Lectura', body: 'La entrada se ordena por voz, fragmento o pregunta.', status: 'cautious' }] },
      { id: 'prisma-origin', type: 'index', eyebrow: 'origen', title: 'El origen siempre vuelve a aparecer', body: 'Una navegacion de retorno evita que una interpretacion se independice de su fuente.', cta: { label: 'Abrir el archivo', href: '/archive' } },
    ],
  },
  {
    id: 'portal', path: '/portal', label: 'Portal', navLabel: 'Portal', title: 'Portal de acceso', summary: 'Un punto de entrada para colaboradores, lectores y personas que necesitan contexto.', themeId: 'amber-pulse', status: 'cautious', relatedRoutes: ['/rights', '/contact', '/archive'],
    sections: [
      { id: 'portal-hero', type: 'hero', eyebrow: 'acceso', title: 'Encuentra la puerta correcta', body: 'El portal separa consulta publica, colaboracion y solicitudes de permiso. La interfaz debe mostrar que puede hacerse en cada caso.', cta: { label: 'Ver derechos', href: '/rights' } },
      { id: 'portal-doors', type: 'grid', eyebrow: 'rutas', title: 'Tres formas de entrar', body: 'La arquitectura reduce pasos y evita que una solicitud de contacto se pierda entre materiales editoriales.', items: [{ id: 'portal-read', label: 'leer', title: 'Explorar la obra', body: 'Acceso al indice, capitulos y piezas disponibles.', meta: '/judas', status: 'cautious' }, { id: 'portal-work', label: 'colaborar', title: 'Hablar con el estudio', body: 'Contexto para una propuesta, encargo o consulta.', meta: '/contact', status: 'cautious' }, { id: 'portal-permission', label: 'usar', title: 'Solicitar permiso', body: 'Ruta para derechos, creditos y condiciones.', meta: '/rights', status: 'cautious' }] },
      { id: 'portal-status', type: 'table', eyebrow: 'estado', title: 'Acceso con expectativas honestas', body: 'Cuando una funcion aun no esta conectada, el portal lo indica y ofrece una via alternativa de contacto.' },
    ],
  },
  {
    id: 'rights', path: '/rights', label: 'Rights', navLabel: 'Rights', title: 'Derechos y procedencia', summary: 'Una pagina de consulta para creditos, permisos, licencias y materiales pendientes de verificar.', themeId: 'stone-oracle', status: 'cautious', relatedRoutes: ['/archive', '/music', '/portal', '/contact'],
    sections: [
      { id: 'rights-hero', type: 'hero', eyebrow: 'responsabilidad', title: 'La procedencia forma parte de la obra', body: 'Cada imagen, sonido, texto o codigo necesita una ficha de origen y un estado de permiso antes de publicarse.', cta: { label: 'Escribir al estudio', href: '/contact' } },
      { id: 'rights-ledger', type: 'table', eyebrow: 'registro', title: 'Campos para no perder el hilo', body: 'Un registro minimo puede incluir material, autor o fuente, licencia, credito requerido, uso previsto y revision pendiente.', items: [{ id: 'rights-clear', label: 'listo', title: 'Permiso confirmado', body: 'Conservar prueba del permiso junto a la ficha.', status: 'verified' }, { id: 'rights-review', label: 'revisar', title: 'Licencia por comprobar', body: 'No presentar como disponible hasta completar la consulta.', status: 'pending' }] },
      { id: 'rights-note', type: 'manifesto', eyebrow: 'criterio', title: 'La duda tambien se publica', body: 'Una marca de pendiente protege a creadores, colaboradores y visitantes mejor que una atribucion apresurada.' },
    ],
  },
  {
    id: 'contact', path: '/contact', label: 'Contact', navLabel: 'Contact', title: 'Contacto con contexto', summary: 'Un canal para preguntas, colaboraciones y correcciones sobre el archivo.', themeId: 'salt-garden', status: 'cautious', relatedRoutes: ['/portal', '/rights', '/artist'],
    sections: [
      { id: 'contact-hero', type: 'hero', eyebrow: 'contacto', title: 'Una pregunta concreta abre mejor la conversacion', body: 'El formulario puede pedir asunto, material relacionado, objetivo y medio de respuesta. Asi cada mensaje llega con el contexto necesario.', cta: { label: 'Preparar consulta', href: '#contact-form' } },
      { id: 'contact-reasons', type: 'grid', eyebrow: 'motivos', title: 'Elige una ruta de entrada', body: 'Un selector claro ayuda a distinguir una correccion de archivo, una propuesta de colaboracion y una solicitud de derechos.', items: [{ id: 'contact-correction', label: '01', title: 'Corregir un dato', body: 'Indicar la pagina, la fuente y la correccion propuesta.', status: 'cautious' }, { id: 'contact-collab', label: '02', title: 'Colaborar', body: 'Explicar alcance, calendario y material solicitado.', status: 'cautious' }, { id: 'contact-rights', label: '03', title: 'Consultar derechos', body: 'Describir uso, territorio, duracion y creditos previstos.', status: 'cautious' }] },
      { id: 'contact-form', type: 'contact', eyebrow: 'mensaje', title: 'Dejar una nota legible', body: 'El sistema debe confirmar recepcion sin prometer un plazo de respuesta no verificado.' },
    ],
  },
]
