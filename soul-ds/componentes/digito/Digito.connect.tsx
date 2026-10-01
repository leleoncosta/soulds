import { figma } from '@figma/code-connect'
import { Digito } from './Digito'

/* ───────────────────────────────────────────────────────────────────────────
   Code Connect — Mapeia o componente Figma para o código React

   Este arquivo vincula automaticamente o componente Digito do Figma
   com o componente Digito.tsx do React. Sub-componente interno do
   calendario — 12 combinações (variant × state × weight).
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * DIGIT · BOLD
 */
figma.connect(
  Digito,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=288:8432',
  {
    props: { digito: figma.string('digito') },
    example: (props) => (
      <Digito variant="digit" weight="bold" state="default">
        {props.digito}
      </Digito>
    ),
  }
)

figma.connect(
  Digito,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=288:8434',
  {
    props: { digito: figma.string('digito') },
    example: (props) => (
      <Digito variant="digit" weight="bold" state="active">
        {props.digito}
      </Digito>
    ),
  }
)

figma.connect(
  Digito,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=288:8436',
  {
    props: { digito: figma.string('digito') },
    example: (props) => (
      <Digito variant="digit" weight="bold" state="hover">
        {props.digito}
      </Digito>
    ),
  }
)

figma.connect(
  Digito,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=288:8438',
  {
    props: { digito: figma.string('digito') },
    example: (props) => (
      <Digito variant="digit" weight="bold" state="disabled">
        {props.digito}
      </Digito>
    ),
  }
)

/**
 * DIGIT · NORMAL (dias de preenchimento dos extremos)
 */
figma.connect(
  Digito,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=288:8469',
  {
    props: { digito: figma.string('digito') },
    example: (props) => (
      <Digito variant="digit" weight="normal" state="default">
        {props.digito}
      </Digito>
    ),
  }
)

figma.connect(
  Digito,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=288:8471',
  {
    props: { digito: figma.string('digito') },
    example: (props) => (
      <Digito variant="digit" weight="normal" state="active">
        {props.digito}
      </Digito>
    ),
  }
)

figma.connect(
  Digito,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=288:8473',
  {
    props: { digito: figma.string('digito') },
    example: (props) => (
      <Digito variant="digit" weight="normal" state="hover">
        {props.digito}
      </Digito>
    ),
  }
)

figma.connect(
  Digito,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=288:8475',
  {
    props: { digito: figma.string('digito') },
    example: (props) => (
      <Digito variant="digit" weight="normal" state="disabled">
        {props.digito}
      </Digito>
    ),
  }
)

/**
 * TEXT (abreviação de mês/ano)
 */
figma.connect(
  Digito,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=288:8686',
  {
    props: { texto: figma.string('texto') },
    example: (props) => (
      <Digito variant="text" state="default">
        {props.texto}
      </Digito>
    ),
  }
)

figma.connect(
  Digito,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=288:8688',
  {
    props: { texto: figma.string('texto') },
    example: (props) => (
      <Digito variant="text" state="active">
        {props.texto}
      </Digito>
    ),
  }
)

figma.connect(
  Digito,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=288:8690',
  {
    props: { texto: figma.string('texto') },
    example: (props) => (
      <Digito variant="text" state="hover">
        {props.texto}
      </Digito>
    ),
  }
)

figma.connect(
  Digito,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=288:8692',
  {
    props: { texto: figma.string('texto') },
    example: (props) => (
      <Digito variant="text" state="disabled">
        {props.texto}
      </Digito>
    ),
  }
)
