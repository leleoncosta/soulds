import { figma } from '@figma/code-connect'
import { Check } from './Check'

/* ───────────────────────────────────────────────────────────────────────────
   Code Connect — Mapeia o componente Figma para o código React

   Este arquivo vincula automaticamente o componente Check do Figma
   com o componente Check.tsx do React — 6 combinações (selected × size).
   ─────────────────────────────────────────────────────────────────────────── */

figma.connect(
  Check,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=325:271',
  {
    props: {},
    example: () => <Check size="sm" />,
  }
)

figma.connect(
  Check,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=325:333',
  {
    props: {},
    example: () => <Check size="sm" defaultChecked />,
  }
)

figma.connect(
  Check,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=327:342',
  {
    props: {},
    example: () => <Check size="md" />,
  }
)

figma.connect(
  Check,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=325:270',
  {
    props: {},
    example: () => <Check size="md" defaultChecked />,
  }
)

figma.connect(
  Check,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=327:348',
  {
    props: {},
    example: () => <Check size="lg" />,
  }
)

figma.connect(
  Check,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=325:330',
  {
    props: {},
    example: () => <Check size="lg" defaultChecked />,
  }
)
