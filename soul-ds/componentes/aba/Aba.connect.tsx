import { figma } from '@figma/code-connect'
import { Aba } from './Aba'

/* ───────────────────────────────────────────────────────────────────────────
   Code Connect — Mapeia o componente Figma para o código React

   Este arquivo vincula automaticamente o componente Aba do Figma
   com o componente Aba.tsx do React, permitindo que designers vejam
   código automaticamente quando selecionam o componente no Figma.
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * DEFAULT STATE
 */
figma.connect(
  Aba,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=219:1145',
  {
    props: {
      label: figma.string('Label'),
      state: 'default' as const,
    },
    example: (props) => <Aba {...props} />,
  }
)

/**
 * ACTIVE STATE
 */
figma.connect(
  Aba,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=219:1147',
  {
    props: {
      label: figma.string('Label'),
      state: 'active' as const,
    },
    example: (props) => <Aba {...props} />,
  }
)
