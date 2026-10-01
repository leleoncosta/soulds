import { figma } from '@figma/code-connect'
import { Breadcrumb } from './Breadcrumb'

/* ───────────────────────────────────────────────────────────────────────────
   Code Connect — Mapeia o componente Figma para o código React

   Este arquivo vincula automaticamente o componente Breadcrumb do Figma
   com o componente Breadcrumb.tsx do React, permitindo que designers vejam
   código automaticamente quando selecionam o componente no Figma.
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * DEFAULT STATE
 */
figma.connect(
  Breadcrumb,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=225:6537',
  {
    props: {
      nomePagina: figma.string('Nome página'),
      state: 'default' as const,
    },
    example: (props) => <Breadcrumb {...props} href="#" />,
  }
)

/**
 * ACTIVE STATE
 */
figma.connect(
  Breadcrumb,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=225:6539',
  {
    props: {
      nomePagina: figma.string('Nome página'),
      state: 'active' as const,
    },
    example: (props) => <Breadcrumb {...props} />,
  }
)
