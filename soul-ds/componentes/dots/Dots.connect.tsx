import { figma } from '@figma/code-connect'
import { Dots } from './Dots'

/* ───────────────────────────────────────────────────────────────────────────
   Code Connect — Mapeia o componente Figma para o código React

   Este arquivo vincula automaticamente o componente Dots do Figma
   com o componente Dots.tsx do React.
   ─────────────────────────────────────────────────────────────────────────── */

figma.connect(
  Dots,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=337:716',
  {
    props: {},
    example: () => <Dots state="default" aria-label="Página" />,
  }
)

figma.connect(
  Dots,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=337:718',
  {
    props: {},
    example: () => <Dots state="active" aria-label="Página atual" aria-current="true" />,
  }
)
