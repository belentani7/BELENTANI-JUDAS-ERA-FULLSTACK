import type { JudasEraCopy, JudasEraLocale, JudasEraManifest } from './judasEra.types'

export const fallbackManifest: JudasEraManifest = {
  title: 'JUDAS', status: 'SEALED', releaseMediaAvailable: false,
  locales: ['es', 'en', 'pt', 'ca'],
  chapters: ['threshold', 'artifact', 'debt', 'transmutation', 'return'],
  updatedAt: '2026-08-07T00:00:00.000Z',
}

export const judasEraCopy: Readonly<Record<JudasEraLocale, JudasEraCopy>> = {
  es: {
    eyebrow: 'BELENTANI / ERA JUDAS / ARTEFACTO 07',
    intro: 'Una ficción digital sobre acceso, deuda y transformación. La identidad civil permanece detrás de la cerca de datos.',
    enter: 'DESCIENDE AL UMBRAL', sealed: 'OBRA SELLADA / SIN REPRODUCCIÓN', offline: 'MODO LOCAL', live: 'NÚCLEO CONECTADO',
    chapters: [
      { id: 'threshold', signal: 'UMBRAL', title: 'La señal reconoce primero la ausencia.', body: 'No hay una ficha que consumir. Hay un campo que atravesar: arena magnética, cristal oscuro y una pregunta suspendida.', image: '/media/judas/judas-signal-ship.webp', alt: 'Nave futurista atravesando un campo rojo bajo el título JUDAS.' },
      { id: 'artifact', signal: 'ARTEFACTO', title: 'La llave no abre una puerta. Cambia a quien la sostiene.', body: 'El objeto central respira entre fragmentos. Cada giro reorganiza el archivo sin convertir el símbolo en biografía literal.', image: '/media/diamond_scene.png', alt: 'Tres formas de cristal flotan sobre una superficie azul oscura.' },
      { id: 'debt', signal: 'DEUDA', title: 'Lo que fue entregado no puede devolverse intacto.', body: 'La deuda no se cuenta como diagnóstico ni acusación. Se presenta como tensión escénica: recibir una frecuencia y no poder sostenerla.', image: '/media/judas/judas-desert-armour.webp', alt: 'Figura de espaldas con armadura roja y dorada en un desierto futurista.' },
      { id: 'transmutation', signal: 'TRANSMUTACIÓN', title: 'La herida deja de ser prueba y se vuelve materia.', body: 'Metal, humo y memoria cambian con el desplazamiento. La experiencia avanza sin carruseles, tarjetas ni diapositivas.', image: '/media/judas/judas-cathedral-threshold.webp', alt: 'Figura ante un umbral de cristal dentro de una catedral iluminada.' },
      { id: 'return', signal: 'RETORNO', title: 'Belentani no explica el sistema. Lo mantiene vivo.', body: 'El recorrido termina donde comienza el ecosistema: artista, archivo, laboratorio y portal comparten un mismo núcleo.', image: '/media/judas/judas-signal-ship.webp', alt: 'Nave ascendente en un cielo negro y rojo.' },
    ],
  },
  en: {
    eyebrow: 'BELENTANI / JUDAS ERA / ARTIFACT 07',
    intro: 'A digital fiction about access, debt and transformation. Civil identity remains behind the data fence.',
    enter: 'DESCEND INTO THE THRESHOLD', sealed: 'SEALED WORK / NO PLAYBACK', offline: 'LOCAL MODE', live: 'CORE CONNECTED',
    chapters: [
      { id: 'threshold', signal: 'THRESHOLD', title: 'The signal recognizes absence first.', body: 'There is no profile to consume. There is a field to cross: magnetic sand, dark glass and a suspended question.', image: '/media/judas/judas-signal-ship.webp', alt: 'A futuristic ship crossing a red field beneath the title JUDAS.' },
      { id: 'artifact', signal: 'ARTIFACT', title: 'The key opens no door. It changes whoever holds it.', body: 'The central object breathes among fragments. Each turn reorganizes the archive without turning symbol into literal biography.', image: '/media/diamond_scene.png', alt: 'Three glass forms floating above a dark blue surface.' },
      { id: 'debt', signal: 'DEBT', title: 'What was given cannot return intact.', body: 'Debt is not framed as diagnosis or accusation. It appears as stage tension: receiving a frequency and failing to hold it.', image: '/media/judas/judas-desert-armour.webp', alt: 'A figure in red and gold armor seen from behind in a futuristic desert.' },
      { id: 'transmutation', signal: 'TRANSMUTATION', title: 'The wound stops being evidence and becomes matter.', body: 'Metal, smoke and memory shift with movement. The experience advances without carousels, cards or slides.', image: '/media/judas/judas-cathedral-threshold.webp', alt: 'A figure facing a glass threshold inside an illuminated cathedral.' },
      { id: 'return', signal: 'RETURN', title: 'Belentani does not explain the system. Belentani keeps it alive.', body: 'The journey ends where the ecosystem begins: artist, archive, laboratory and portal share one core.', image: '/media/judas/judas-signal-ship.webp', alt: 'A ship ascending through a black and red sky.' },
    ],
  },
  pt: {
    eyebrow: 'BELENTANI / ERA JUDAS / ARTEFATO 07',
    intro: 'Uma ficção digital sobre acesso, dívida e transformação. A identidade civil permanece atrás da cerca de dados.',
    enter: 'DESÇA AO LIMIAR', sealed: 'OBRA SELADA / SEM REPRODUÇÃO', offline: 'MODO LOCAL', live: 'NÚCLEO CONECTADO',
    chapters: [
      { id: 'threshold', signal: 'LIMIAR', title: 'O sinal reconhece primeiro a ausência.', body: 'Não há um perfil para consumir. Há um campo para atravessar: areia magnética, cristal escuro e uma pergunta suspensa.', image: '/media/judas/judas-signal-ship.webp', alt: 'Nave futurista atravessando um campo vermelho sob o título JUDAS.' },
      { id: 'artifact', signal: 'ARTEFATO', title: 'A chave não abre uma porta. Muda quem a segura.', body: 'O objeto central respira entre fragmentos. Cada giro reorganiza o arquivo sem transformar símbolo em biografia literal.', image: '/media/diamond_scene.png', alt: 'Três formas de cristal flutuam sobre uma superfície azul escura.' },
      { id: 'debt', signal: 'DÍVIDA', title: 'O que foi entregue não pode voltar intacto.', body: 'A dívida não aparece como diagnóstico ou acusação. É tensão cênica: receber uma frequência e não conseguir sustentá-la.', image: '/media/judas/judas-desert-armour.webp', alt: 'Figura de costas com armadura vermelha e dourada em um deserto futurista.' },
      { id: 'transmutation', signal: 'TRANSMUTAÇÃO', title: 'A ferida deixa de ser prova e vira matéria.', body: 'Metal, fumaça e memória mudam com o deslocamento. A experiência avança sem carrosséis, cartões ou slides.', image: '/media/judas/judas-cathedral-threshold.webp', alt: 'Figura diante de um limiar de cristal dentro de uma catedral iluminada.' },
      { id: 'return', signal: 'RETORNO', title: 'Belentani não explica o sistema. Mantém o sistema vivo.', body: 'O percurso termina onde começa o ecossistema: artista, arquivo, laboratório e portal compartilham um núcleo.', image: '/media/judas/judas-signal-ship.webp', alt: 'Nave subindo em um céu preto e vermelho.' },
    ],
  },
  ca: {
    eyebrow: 'BELENTANI / ERA JUDAS / ARTEFACTE 07',
    intro: 'Una ficció digital sobre accés, deute i transformació. La identitat civil roman darrere de la tanca de dades.',
    enter: 'DESCENDEIX AL LLINDAR', sealed: 'OBRA SEGELLADA / SENSE REPRODUCCIÓ', offline: 'MODE LOCAL', live: 'NUCLI CONNECTAT',
    chapters: [
      { id: 'threshold', signal: 'LLINDAR', title: 'El senyal reconeix primer l’absència.', body: 'No hi ha una fitxa per consumir. Hi ha un camp per travessar: sorra magnètica, vidre fosc i una pregunta suspesa.', image: '/media/judas/judas-signal-ship.webp', alt: 'Nau futurista travessant un camp vermell sota el títol JUDAS.' },
      { id: 'artifact', signal: 'ARTEFACTE', title: 'La clau no obre una porta. Canvia qui la sosté.', body: 'L’objecte central respira entre fragments. Cada gir reorganitza l’arxiu sense convertir el símbol en biografia literal.', image: '/media/diamond_scene.png', alt: 'Tres formes de vidre floten sobre una superfície blava fosca.' },
      { id: 'debt', signal: 'DEUTE', title: 'Allò que es va lliurar no pot tornar intacte.', body: 'El deute no s’explica com a diagnòstic ni acusació. És tensió escènica: rebre una freqüència i no poder sostenir-la.', image: '/media/judas/judas-desert-armour.webp', alt: 'Figura d’esquena amb armadura vermella i daurada en un desert futurista.' },
      { id: 'transmutation', signal: 'TRANSMUTACIÓ', title: 'La ferida deixa de ser prova i esdevé matèria.', body: 'Metall, fum i memòria canvien amb el desplaçament. L’experiència avança sense carrusels, targetes ni diapositives.', image: '/media/judas/judas-cathedral-threshold.webp', alt: 'Figura davant un llindar de vidre dins una catedral il·luminada.' },
      { id: 'return', signal: 'RETORN', title: 'Belentani no explica el sistema. El manté viu.', body: 'El recorregut acaba on comença l’ecosistema: artista, arxiu, laboratori i portal comparteixen un sol nucli.', image: '/media/judas/judas-signal-ship.webp', alt: 'Nau ascendint en un cel negre i vermell.' },
    ],
  },
}
