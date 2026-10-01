import { figma } from '@figma/code-connect'
import { Tooltip } from './Tooltip'

/* ───────────────────────────────────────────────────────────────────────────
   Code Connect — Mapeia o componente Figma para o código React

   Este arquivo vincula automaticamente o componente Tooltip do Figma
   com o componente Tooltip.tsx do React — 12 combinações de posição de seta.
   O Figma modela apenas o balão; o elemento disparador (children) é
   responsabilidade do consumidor.
   ─────────────────────────────────────────────────────────────────────────── */

figma.connect(
  Tooltip,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=817:3176',
  {
    props: { texto: figma.string('Texto') },
    example: (props) => (
      <Tooltip texto={props.texto} arrowPosition="bottom-left">
        <button>Ação</button>
      </Tooltip>
    ),
  }
)

figma.connect(
  Tooltip,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=817:3178',
  {
    props: { texto: figma.string('Texto') },
    example: (props) => (
      <Tooltip texto={props.texto} arrowPosition="bottom">
        <button>Ação</button>
      </Tooltip>
    ),
  }
)

figma.connect(
  Tooltip,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=817:3175',
  {
    props: { texto: figma.string('Texto') },
    example: (props) => (
      <Tooltip texto={props.texto} arrowPosition="bottom-right">
        <button>Ação</button>
      </Tooltip>
    ),
  }
)

figma.connect(
  Tooltip,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=817:3177',
  {
    props: { texto: figma.string('Texto') },
    example: (props) => (
      <Tooltip texto={props.texto} arrowPosition="top-left">
        <button>Ação</button>
      </Tooltip>
    ),
  }
)

figma.connect(
  Tooltip,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=817:3173',
  {
    props: { texto: figma.string('Texto') },
    example: (props) => (
      <Tooltip texto={props.texto} arrowPosition="top">
        <button>Ação</button>
      </Tooltip>
    ),
  }
)

figma.connect(
  Tooltip,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=817:3170',
  {
    props: { texto: figma.string('Texto') },
    example: (props) => (
      <Tooltip texto={props.texto} arrowPosition="right-top">
        <button>Ação</button>
      </Tooltip>
    ),
  }
)

figma.connect(
  Tooltip,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=817:3174',
  {
    props: { texto: figma.string('Texto') },
    example: (props) => (
      <Tooltip texto={props.texto} arrowPosition="top-right">
        <button>Ação</button>
      </Tooltip>
    ),
  }
)

figma.connect(
  Tooltip,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=817:3171',
  {
    props: { texto: figma.string('Texto') },
    example: (props) => (
      <Tooltip texto={props.texto} arrowPosition="right">
        <button>Ação</button>
      </Tooltip>
    ),
  }
)

figma.connect(
  Tooltip,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=817:3169',
  {
    props: { texto: figma.string('Texto') },
    example: (props) => (
      <Tooltip texto={props.texto} arrowPosition="right-bottom">
        <button>Ação</button>
      </Tooltip>
    ),
  }
)

figma.connect(
  Tooltip,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=817:3168',
  {
    props: { texto: figma.string('Texto') },
    example: (props) => (
      <Tooltip texto={props.texto} arrowPosition="left-top">
        <button>Ação</button>
      </Tooltip>
    ),
  }
)

figma.connect(
  Tooltip,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=817:3167',
  {
    props: { texto: figma.string('Texto') },
    example: (props) => (
      <Tooltip texto={props.texto} arrowPosition="left">
        <button>Ação</button>
      </Tooltip>
    ),
  }
)

figma.connect(
  Tooltip,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=817:3172',
  {
    props: { texto: figma.string('Texto') },
    example: (props) => (
      <Tooltip texto={props.texto} arrowPosition="left-bottom">
        <button>Ação</button>
      </Tooltip>
    ),
  }
)
