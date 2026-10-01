import { figma } from '@figma/code-connect'
import { Radio } from './Radio'

/* ───────────────────────────────────────────────────────────────────────────
   Code Connect — Mapeia o componente Figma para o código React

   Este arquivo vincula automaticamente o componente Radio do Figma
   com o componente Radio.tsx do React — 6 combinações (selected × size).
   ─────────────────────────────────────────────────────────────────────────── */

figma.connect(
  Radio,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=325:291',
  {
    props: {},
    example: () => <Radio size="sm" defaultChecked />,
  }
)

figma.connect(
  Radio,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=325:296',
  {
    props: {},
    example: () => <Radio size="sm" />,
  }
)

figma.connect(
  Radio,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=327:353',
  {
    props: {},
    example: () => <Radio size="md" defaultChecked />,
  }
)

figma.connect(
  Radio,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=327:359',
  {
    props: {},
    example: () => <Radio size="md" />,
  }
)

figma.connect(
  Radio,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=327:356',
  {
    props: {},
    example: () => <Radio size="lg" defaultChecked />,
  }
)

figma.connect(
  Radio,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=327:361',
  {
    props: {},
    example: () => <Radio size="lg" />,
  }
)
