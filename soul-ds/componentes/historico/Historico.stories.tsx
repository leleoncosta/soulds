import type { Meta, StoryObj } from '@storybook/react'
import { Historico } from './Historico'

const meta = {
  title: 'Componentes/Historico',
  component: Historico,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Linha de histórico ou timeline de eventos. Exibe registros ordenados cronologicamente.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['top', 'base'],
      description: "'top' = item intermediário; 'base' = fecha a lista",
    },
  },
} satisfies Meta<typeof Historico>

export default meta
type Story = StoryObj<typeof meta>

/* ───────────────────────────────────────────────────────────────────────────
   VARIANTES
   ─────────────────────────────────────────────────────────────────────────── */

export const Top: Story = {
  args: { variant: 'top', label: 'Consulta registrada' },
}

export const TopSemIcones: Story = {
  name: 'Top sem ícones de ação',
  args: { variant: 'top', label: 'Consulta registrada', mostrarIcon1: false, mostrarIcon2: false },
}

export const Base: Story = {
  args: { variant: 'base', labelBase: 'Cadastro criado', textoBase: 'por Ana Beatriz em 02/04/2026' },
}

/* ───────────────────────────────────────────────────────────────────────────
   ÍCONES COM AÇÃO
   ─────────────────────────────────────────────────────────────────────────── */

export const ComAcoes: Story = {
  name: 'Ícones com ação (editar/excluir)',
  args: {
    variant: 'top',
    label: 'Prescrição atualizada',
    onIcon1Click: () => alert('Editar'),
    onIcon2Click: () => alert('Ver histórico'),
  },
}

/* ───────────────────────────────────────────────────────────────────────────
   TIMELINE COMPLETA (top... + base obrigatório no fim)
   ─────────────────────────────────────────────────────────────────────────── */

export const Timeline: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Historico variant="top" label="Consulta registrada" />
      <Historico variant="top" label="Exame solicitado" />
      <Historico variant="top" label="Prescrição atualizada" />
      <Historico variant="base" labelBase="Cadastro criado" textoBase="por Ana Beatriz em 02/04/2026" />
    </div>
  ),
}
