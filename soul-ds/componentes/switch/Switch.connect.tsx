import { figma } from '@figma/code-connect'
import { Switch } from './Switch'

/* ───────────────────────────────────────────────────────────────────────────
   Code Connect — Mapeia o componente Figma para o código React

   Este arquivo vincula automaticamente o componente Switch do Figma
   com o componente Switch.tsx do React — 4 combinações (selected × state).
   ─────────────────────────────────────────────────────────────────────────── */

figma.connect(
  Switch,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=469:1666',
  {
    props: { icon: figma.boolean('Icon') },
    example: (props) => <Switch {...props} />,
  }
)

figma.connect(
  Switch,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=355:276',
  {
    props: { icon: figma.boolean('Icon') },
    example: (props) => <Switch {...props} defaultChecked />,
  }
)

figma.connect(
  Switch,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=469:1735',
  {
    props: { icon: figma.boolean('Icon') },
    example: (props) => <Switch {...props} disabled />,
  }
)

figma.connect(
  Switch,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=469:1742',
  {
    props: { icon: figma.boolean('Icon') },
    example: (props) => <Switch {...props} disabled defaultChecked />,
  }
)
