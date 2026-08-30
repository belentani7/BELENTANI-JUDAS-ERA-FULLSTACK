import type { StudioDomain, StudioTool } from './studio.types'

interface ToolRecipe {
  name: string
  action: string
}

interface DomainDefinition {
  id: StudioDomain
  label: string
  accent: string
  purpose: string
  recipes: ToolRecipe[]
}

const domains: DomainDefinition[] = [
  {
    id: 'image',
    label: 'Imagen',
    accent: '#ff5b72',
    purpose: 'compone una dirección visual reproducible',
    recipes: [
      { name: 'Reliquia cromática', action: 'Extraer una paleta material' },
      { name: 'Luz negativa', action: 'Diseñar exposición y contraste' },
      { name: 'Índice de textura', action: 'Traducir palabras a superficies' },
      { name: 'Encuadre imposible', action: 'Construir una composición asimétrica' },
      { name: 'Materia de archivo', action: 'Fusionar grano, metal y memoria' },
      { name: 'Prisma nocturno', action: 'Separar una escena en espectros' },
      { name: 'Piel sintética', action: 'Definir una superficie orgánica' },
      { name: 'Solarizador OMEGA', action: 'Invertir la jerarquía luminosa' },
      { name: 'Cartógrafo de sombras', action: 'Trazar profundidad por penumbra' },
      { name: 'Transmutador de formato', action: 'Convertir imagen entre PNG, JPEG y WebP' },
    ],
  },
  {
    id: 'motion',
    label: 'Movimiento',
    accent: '#ff9f43',
    purpose: 'orquesta tiempo, cámara y respuesta corporal',
    recipes: [
      { name: 'Órbita dirigida', action: 'Coreografiar una trayectoria espacial' },
      { name: 'Telar de parallax', action: 'Separar profundidad en capas' },
      { name: 'Pulso de entrada', action: 'Diseñar una aparición con intención' },
      { name: 'Corte gravitacional', action: 'Cambiar ritmo sin perder continuidad' },
      { name: 'Cámara respirante', action: 'Convertir pausa en desplazamiento' },
      { name: 'Lerp de materia', action: 'Suavizar una transición física' },
      { name: 'Ruptura de máscara', action: 'Revelar contenido por geometría' },
      { name: 'Espiral cinética', action: 'Ordenar elementos en rotación' },
      { name: 'Eco temporal', action: 'Construir retardos significativos' },
      { name: 'Director de crescendo', action: 'Escalar una escena hacia un pico' },
    ],
  },
  {
    id: 'sound',
    label: 'Sonido',
    accent: '#f7d154',
    purpose: 'genera patrones sonoros sin cargar medios privados',
    recipes: [
      { name: 'Sintetizador de pulso', action: 'Crear una secuencia tonal local' },
      { name: 'Tejedor de drones', action: 'Construir una base armónica' },
      { name: 'Mapa de frecuencias', action: 'Traducir texto a un espectro' },
      { name: 'Metrónomo ritual', action: 'Fijar un tempo narrativo' },
      { name: 'Arquitecto de silencio', action: 'Distribuir vacío y ataque' },
      { name: 'Secuenciador orbital', action: 'Ordenar notas como cuerpos' },
      { name: 'Resonador de vidrio', action: 'Diseñar un timbre cristalino' },
      { name: 'Motor subterráneo', action: 'Producir un patrón de baja frecuencia' },
      { name: 'Coro espectral', action: 'Apilar intervalos sintéticos' },
      { name: 'Conversor de gesto', action: 'Transformar intensidad en envolvente' },
    ],
  },
  {
    id: 'video',
    label: 'Vídeo',
    accent: '#e7ecff',
    purpose: 'convierte una idea en montaje y secuencia de planos',
    recipes: [
      { name: 'Storyboard de doce pulsos', action: 'Dividir una visión en planos' },
      { name: 'Montador de umbrales', action: 'Diseñar entradas y salidas de escena' },
      { name: 'Cámara de reliquias', action: 'Asignar lente y movimiento' },
      { name: 'Ritmo de tráiler', action: 'Condensar una narrativa audiovisual' },
      { name: 'Continuidad imposible', action: 'Conectar espacios incompatibles' },
      { name: 'Director de loop', action: 'Cerrar un ciclo sin corte visible' },
      { name: 'Secuencia vertical', action: 'Adaptar composición a formato móvil' },
      { name: 'Secuencia panorámica', action: 'Expandir composición horizontal' },
      { name: 'Editor de respiración', action: 'Alternar densidad y descanso' },
      { name: 'Matriz de keyframes', action: 'Producir hitos temporales repetibles' },
    ],
  },
  {
    id: 'prompt',
    label: 'Prompt',
    accent: '#d98cff',
    purpose: 'estructura instrucciones creativas con límites verificables',
    recipes: [
      { name: 'Prisma de prompt', action: 'Separar intención, materia y cámara' },
      { name: 'Forja de restricciones', action: 'Convertir límites en dirección' },
      { name: 'Compresor de visión', action: 'Reducir ruido sin perder identidad' },
      { name: 'Expansor de escena', action: 'Añadir profundidad a una semilla' },
      { name: 'Traductor multimodal', action: 'Adaptar una idea entre medios' },
      { name: 'Guardia de canon', action: 'Alinear una salida con el sistema' },
      { name: 'Director de variaciones', action: 'Crear mutaciones controladas' },
      { name: 'Inyector de materia', action: 'Añadir tactilidad a una instrucción' },
      { name: 'Secuenciador de agentes', action: 'Dividir una misión en acciones' },
      { name: 'Prompt OMEGA', action: 'Sintetizar una orden de mundo completo' },
    ],
  },
  {
    id: 'text',
    label: 'Lenguaje',
    accent: '#ff7fc8',
    purpose: 'transforma texto en estructuras narrativas originales',
    recipes: [
      { name: 'Condensador de manifiesto', action: 'Comprimir una declaración' },
      { name: 'Transmutador de tono', action: 'Cambiar registro conservando sentido' },
      { name: 'Ritual de titulares', action: 'Generar títulos con tensión' },
      { name: 'Editor de vacío', action: 'Distribuir texto y silencio' },
      { name: 'Nudo narrativo', action: 'Conectar motivos recurrentes' },
      { name: 'Multiplicador de voces', action: 'Proponer perspectivas diferenciadas' },
      { name: 'Cifrador poético', action: 'Convertir conceptos en símbolos' },
      { name: 'Arquitecto de capítulos', action: 'Ordenar una progresión dramática' },
      { name: 'Detector de clichés', action: 'Señalar formulaciones genéricas' },
      { name: 'Espejo semántico', action: 'Releer una idea desde su reverso' },
    ],
  },
  {
    id: 'code',
    label: 'Código',
    accent: '#60f5c8',
    purpose: 'produce semillas técnicas pequeñas y trazables',
    recipes: [
      { name: 'Semilla de shader', action: 'Definir una materia procedural' },
      { name: 'Forja de CustomEase', action: 'Construir una curva de movimiento' },
      { name: 'Generador de sigilos SVG', action: 'Trazar un símbolo vectorial' },
      { name: 'Módulo de color CSS', action: 'Crear tokens cromáticos' },
      { name: 'Compositor de máscaras', action: 'Producir una revelación geométrica' },
      { name: 'Auditor de cleanup', action: 'Enumerar recursos que liberar' },
      { name: 'Presupuesto de escena', action: 'Calcular un límite gráfico' },
      { name: 'Matriz responsive', action: 'Definir estados de composición' },
      { name: 'Contrato de interacción', action: 'Especificar entrada y salida' },
      { name: 'Generador de seed', action: 'Crear aleatoriedad reproducible' },
    ],
  },
  {
    id: 'world',
    label: 'Mundos',
    accent: '#5de1ff',
    purpose: 'diseña espacios conectados con reglas internas',
    recipes: [
      { name: 'Arquitecto de biomas', action: 'Definir un entorno coherente' },
      { name: 'Cartógrafo de portales', action: 'Conectar destinos y condiciones' },
      { name: 'Motor de clima', action: 'Asignar atmósfera dinámica' },
      { name: 'Gravedad narrativa', action: 'Jerarquizar objetos y motivos' },
      { name: 'Constructor de ruinas', action: 'Diseñar historia material' },
      { name: 'Sembrador de entidades', action: 'Poblar un espacio con presencias' },
      { name: 'Diseñador de reliquias', action: 'Crear objetos con función' },
      { name: 'Atlas de conexiones', action: 'Relacionar mundos por significado' },
      { name: 'Compilador de leyes', action: 'Fijar límites físicos y narrativos' },
      { name: 'Simulador OMEGA', action: 'Sintetizar un mundo navegable' },
    ],
  },
  {
    id: 'archive',
    label: 'Archivo',
    accent: '#a9b1c6',
    purpose: 'organiza procedencia, derechos y versiones sin publicar originales',
    recipes: [
      { name: 'Libro de procedencia', action: 'Crear una ficha verificable' },
      { name: 'Detector de variantes', action: 'Comparar identidad de archivos' },
      { name: 'Puerta de derechos', action: 'Evaluar estado de publicación' },
      { name: 'Cronista de versiones', action: 'Ordenar cambios por fecha' },
      { name: 'Índice de huellas', action: 'Generar identificadores anónimos' },
      { name: 'Mapa de linaje', action: 'Conectar origen y derivados' },
      { name: 'Clasificador de estado', action: 'Separar canon, propuesta y pendiente' },
      { name: 'Inventario de medios', action: 'Estructurar metadatos de activos' },
      { name: 'Guardián privado', action: 'Detectar límites de exposición' },
      { name: 'Cápsula de restauración', action: 'Describir una recuperación reversible' },
    ],
  },
  {
    id: 'ritual',
    label: 'Ritual',
    accent: '#ff465c',
    purpose: 'compone juego, misterio y progresión sin manipulación',
    recipes: [
      { name: 'Compositor de easter eggs', action: 'Ocultar una conexión justa' },
      { name: 'Ceremonia de entrada', action: 'Diseñar un umbral interactivo' },
      { name: 'Círculo de decisiones', action: 'Crear rutas con consecuencias' },
      { name: 'Guardián del sello', action: 'Proteger una obra no publicada' },
      { name: 'Oráculo determinista', action: 'Responder sin fingir conciencia' },
      { name: 'Juego de fragmentos', action: 'Construir una búsqueda accesible' },
      { name: 'Clave de retorno', action: 'Crear una secuencia memorable' },
      { name: 'Rito de transformación', action: 'Diseñar cambio de estado' },
      { name: 'Memoria del visitante', action: 'Persistir progreso local mínimo' },
      { name: 'Cámara cero', action: 'Cerrar el circuito del ecosistema' },
    ],
  },
]

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export const studioTools: StudioTool[] = domains.flatMap((domain, domainIndex) =>
  domain.recipes.map((recipe, recipeIndex) => {
    const index = domainIndex * 10 + recipeIndex + 1
    return {
      id: `${domain.id}-${slugify(recipe.name)}`,
      index,
      name: recipe.name,
      action: recipe.action,
      description: `${recipe.action}; ${domain.purpose}.`,
      domain: domain.id,
      domainLabel: domain.label,
      engine: domain.id,
      accent: domain.accent,
      local: true,
      truthMode: 'LOCAL_DETERMINISTIC',
      network: 'never',
    }
  }),
)

export const studioDomains = domains.map(({ id, label, accent }) => ({ id, label, accent }))

export function getStudioTool(toolId: string) {
  return studioTools.find((tool) => tool.id === toolId) ?? studioTools[0]
}
