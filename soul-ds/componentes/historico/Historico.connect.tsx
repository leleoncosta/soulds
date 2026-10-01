import { figma } from '@figma/code-connect'
import { Historico } from './Historico'

/* ───────────────────────────────────────────────────────────────────────────
   Code Connect — Mapeia o componente Figma para o código React

   Este arquivo vincula automaticamente o componente Historico do Figma
   com o componente Historico.tsx do React.
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * VARIANT: top
 */
figma.connect(
  Historico,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=366:212',
  {
    props: {
      label: figma.string('Label'),
      mostrarIcon1: figma.boolean('Mostrar icon 1'),
      mostrarIcon2: figma.boolean('Mostrar icon 2'),
      variant: 'top' as const,
    },
    example: (props) => <Historico {...props} />,
  }
)

/**
 * VARIANT: base
 */
figma.connect(
  Historico,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=366:211',
  {
    props: {
      labelBase: figma.string('Label base'),
      textoBase: figma.string('Texto base'),
      mostrarIconBase: figma.boolean('Mostrar icon base'),
      variant: 'base' as const,
    },
    example: (props) => <Historico {...props} />,
  }
)
