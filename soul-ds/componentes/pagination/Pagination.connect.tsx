import { figma } from '@figma/code-connect'
import { Pagination } from './Pagination'

/* ───────────────────────────────────────────────────────────────────────────
   Code Connect — Mapeia o componente Figma para o código React

   Este arquivo vincula automaticamente o componente Pagination do Figma
   com o componente Pagination.tsx do React. O slot "dots" do Figma é
   resolvido internamente pelo componente (um Dots por página).
   ─────────────────────────────────────────────────────────────────────────── */

figma.connect(
  Pagination,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=338:755',
  {
    props: {
      anterior: figma.string('Anterior'),
      proximo: figma.string('Próximo'),
      textoEsquerdo: figma.boolean('Texto esquerdo'),
      textoDireito: figma.boolean('Texto Direito'),
    },
    example: (props) => <Pagination {...props} page={2} totalPages={3} onPageChange={() => {}} />,
  }
)
