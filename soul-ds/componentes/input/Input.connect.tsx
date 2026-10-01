import { figma } from '@figma/code-connect'
import { Input } from './Input'

/* ───────────────────────────────────────────────────────────────────────────
   Code Connect — Mapeia o componente Figma para o código React

   O Figma modela variant=text/placeholder como dois símbolos estáticos.
   Na implementação real isso é nativo do HTML: `variant=text` → use `value`
   (ou `defaultValue`); `variant=placeholder` → use a prop `placeholder`.
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * TEXT · DEFAULT
 */
figma.connect(
  Input,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=225:7153',
  {
    props: {
      label: figma.string('Label'),
      obrigatorio: figma.boolean('obrigatório'),
      icone: figma.boolean('icone'),
      hint: figma.boolean('hint'),
      textoAuxiliar: figma.string('Texto auxiliar'),
      value: figma.string('Texto Input'),
    },
    example: (props) => <Input {...props} onChange={() => {}} />,
  }
)

/**
 * PLACEHOLDER · DEFAULT
 */
figma.connect(
  Input,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=243:7237',
  {
    props: {
      label: figma.string('Label'),
      obrigatorio: figma.boolean('obrigatório'),
      icone: figma.boolean('icone'),
      hint: figma.boolean('hint'),
      textoAuxiliar: figma.string('Texto auxiliar'),
      placeholder: figma.string('Texto Placeholder'),
    },
    example: (props) => <Input {...props} />,
  }
)

/**
 * TEXT · ERROR
 */
figma.connect(
  Input,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=243:7382',
  {
    props: {
      label: figma.string('Label'),
      obrigatorio: figma.boolean('obrigatório'),
      icone: figma.boolean('icone'),
      textoAuxiliar: figma.string('Texto auxiliar'),
      value: figma.string('Texto Input'),
    },
    example: (props) => <Input {...props} error hint onChange={() => {}} />,
  }
)

/**
 * TEXT · DISABLED
 */
figma.connect(
  Input,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=243:7400',
  {
    props: {
      label: figma.string('Label'),
      obrigatorio: figma.boolean('obrigatório'),
      icone: figma.boolean('icone'),
      hint: figma.boolean('hint'),
      textoAuxiliar: figma.string('Texto auxiliar'),
      value: figma.string('Texto Input'),
    },
    example: (props) => <Input {...props} disabled onChange={() => {}} />,
  }
)
