import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Pagination } from './Pagination'

const meta = {
  title: 'Componentes/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Navegação entre páginas de uma listagem ou tabela, usando o indicador de pontos (Dots) para até 10 páginas.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    page: { control: 'number', description: 'Página atual (1-indexed)' },
    totalPages: { control: 'number', description: 'Total de páginas' },
    anterior: { control: 'text', description: 'Rótulo do botão anterior' },
    proximo: { control: 'text', description: 'Rótulo do botão próximo' },
    textoEsquerdo: { control: 'boolean', description: 'Exibe o rótulo de texto no botão anterior' },
    textoDireito: { control: 'boolean', description: 'Exibe o rótulo de texto no botão próximo' },
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

/* ───────────────────────────────────────────────────────────────────────────
   ESTADOS
   ─────────────────────────────────────────────────────────────────────────── */

export const PaginaDoMeio: Story = {
  args: { page: 2, totalPages: 3, onPageChange: () => {} },
}

export const PrimeiraPagina: Story = {
  name: 'Primeira página (Anterior desabilitado)',
  args: { page: 1, totalPages: 3, onPageChange: () => {} },
}

export const UltimaPagina: Story = {
  name: 'Última página (Próximo desabilitado)',
  args: { page: 3, totalPages: 3, onPageChange: () => {} },
}

export const SemTextos: Story = {
  name: 'Sem rótulos de texto (apenas aria-label)',
  args: { page: 2, totalPages: 3, onPageChange: () => {}, textoEsquerdo: false, textoDireito: false },
}

/* ───────────────────────────────────────────────────────────────────────────
   CONTROLADO
   ─────────────────────────────────────────────────────────────────────────── */

export const Controlado: Story = {
  args: { page: 1, totalPages: 5, onPageChange: () => {} },
  render: () => {
    function Exemplo() {
      const [page, setPage] = useState(1)
      return <Pagination page={page} totalPages={5} onPageChange={setPage} />
    }
    return <Exemplo />
  },
}
