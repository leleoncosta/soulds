import { figma } from '@figma/code-connect'
import { Calendario } from './Calendario'

/* ───────────────────────────────────────────────────────────────────────────
   Code Connect — Mapeia o componente Figma para o código React

   Este arquivo vincula automaticamente o componente Calendario do Figma
   com o componente Calendario.tsx do React, permitindo que designers vejam
   código automaticamente quando selecionam o componente no Figma.
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * VIEW: day
 */
figma.connect(
  Calendario,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=288:8699',
  {
    props: { view: 'day' as const },
    example: (props) => <Calendario {...props} />,
  }
)

/**
 * VIEW: month
 */
figma.connect(
  Calendario,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=288:8701',
  {
    props: { view: 'month' as const },
    example: (props) => <Calendario {...props} />,
  }
)

/**
 * VIEW: year
 */
figma.connect(
  Calendario,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=288:8814',
  {
    props: { view: 'year' as const },
    example: (props) => <Calendario {...props} />,
  }
)
