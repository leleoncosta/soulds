import { figma } from '@figma/code-connect'
import { Avatar } from './Avatar'

/* ───────────────────────────────────────────────────────────────────────────
   Code Connect — Mapeia o componente Figma para o código React

   Este arquivo vincula automaticamente o componente Avatar do Figma
   com o componente Avatar.tsx do React, permitindo que designers vejam
   código automaticamente quando selecionam o componente no Figma.
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * IMAGE VARIANT
 */
figma.connect(
  Avatar,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=118:154',
  {
    props: {
      nome: figma.string('Nome'),
      info: figma.string('Info'),
      textos: figma.boolean('Textos'),
      variant: 'image' as const,
    },
    example: (props) => <Avatar {...props} src="https://exemplo.com/foto-do-usuario.jpg" alt={props.nome} />,
  }
)

/**
 * ICON VARIANT
 */
figma.connect(
  Avatar,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=118:156',
  {
    props: {
      nome: figma.string('Nome'),
      info: figma.string('Info'),
      textos: figma.boolean('Textos'),
      variant: 'icon' as const,
    },
    example: (props) => <Avatar {...props} />,
  }
)
