import { figma } from '@figma/code-connect'
import { Chips } from './Chips'

/* ───────────────────────────────────────────────────────────────────────────
   Code Connect — Mapeia o componente Figma para o código React

   Este arquivo vincula automaticamente o componente Chips do Figma
   com o componente Chips.tsx do React, permitindo que designers vejam
   código automaticamente quando selecionam o componente no Figma.
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * DEFAULT VARIANT
 */
figma.connect(
  Chips,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=329:504',
  {
    props: {
      texto: figma.string('Texto chips'),
      iconLeft: figma.boolean('icon left'),
      iconRight: figma.boolean('icon right'),
      variant: 'default' as const,
    },
    example: (props) => <Chips {...props} />,
  }
)

/**
 * SUCCESS VARIANT
 */
figma.connect(
  Chips,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=332:511',
  {
    props: {
      texto: figma.string('Texto chips'),
      iconLeft: figma.boolean('icon left'),
      iconRight: figma.boolean('icon right'),
      variant: 'success' as const,
    },
    example: (props) => <Chips {...props} />,
  }
)

/**
 * WARNING VARIANT
 */
figma.connect(
  Chips,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=332:515',
  {
    props: {
      texto: figma.string('Texto chips'),
      iconLeft: figma.boolean('icon left'),
      iconRight: figma.boolean('icon right'),
      variant: 'warning' as const,
    },
    example: (props) => <Chips {...props} />,
  }
)

/**
 * INFO VARIANT
 */
figma.connect(
  Chips,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=332:519',
  {
    props: {
      texto: figma.string('Texto chips'),
      iconLeft: figma.boolean('icon left'),
      iconRight: figma.boolean('icon right'),
      variant: 'info' as const,
    },
    example: (props) => <Chips {...props} />,
  }
)

/**
 * DANGER VARIANT
 */
figma.connect(
  Chips,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=332:523',
  {
    props: {
      texto: figma.string('Texto chips'),
      iconLeft: figma.boolean('icon left'),
      iconRight: figma.boolean('icon right'),
      variant: 'danger' as const,
    },
    example: (props) => <Chips {...props} />,
  }
)
