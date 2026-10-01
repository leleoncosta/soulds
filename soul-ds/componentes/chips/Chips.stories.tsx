import type { Meta, StoryObj } from '@storybook/react'
import { Chips } from './Chips'

const meta = {
  title: 'Componentes/Chips',
  component: Chips,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Marcador compacto de categoria, status ou filtro ativo. Comunicam atributos de forma visual.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'info', 'danger'],
      description: 'Estilo visual do chip',
    },
    texto: {
      control: 'text',
      description: 'Texto exibido no chip',
    },
    iconLeft: {
      control: 'boolean',
      description: 'Exibe o ícone de fechar à esquerda',
    },
    iconRight: {
      control: 'boolean',
      description: 'Exibe o ícone de fechar à direita',
    },
  },
} satisfies Meta<typeof Chips>

export default meta
type Story = StoryObj<typeof meta>

/* ───────────────────────────────────────────────────────────────────────────
   VARIANTES
   ─────────────────────────────────────────────────────────────────────────── */

export const Default: Story = {
  args: { variant: 'default', texto: 'Texto', iconLeft: true, iconRight: true },
}

export const Success: Story = {
  args: { variant: 'success', texto: 'Aprovado', iconLeft: true, iconRight: true },
}

export const Warning: Story = {
  args: { variant: 'warning', texto: 'Pendente', iconLeft: true, iconRight: true },
}

export const Info: Story = {
  args: { variant: 'info', texto: 'Em análise', iconLeft: true, iconRight: true },
}

export const Danger: Story = {
  args: { variant: 'danger', texto: 'Cancelado', iconLeft: true, iconRight: true },
}

/* ───────────────────────────────────────────────────────────────────────────
   SEM ÍCONES
   ─────────────────────────────────────────────────────────────────────────── */

export const SemIcones: Story = {
  args: { variant: 'success', texto: 'Ativo' },
}

/* ───────────────────────────────────────────────────────────────────────────
   REMOVÍVEL (ícone com ação)
   ─────────────────────────────────────────────────────────────────────────── */

export const Removivel: Story = {
  args: {
    variant: 'info',
    texto: 'Filtro: Ativo',
    iconRight: true,
    onIconRightClick: () => alert('Filtro removido'),
  },
}

/* ───────────────────────────────────────────────────────────────────────────
   GRUPO (ex: célula de tabela — máx. 3 por regra do contrato)
   ─────────────────────────────────────────────────────────────────────────── */

export const Grupo: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '4px' }}>
      <Chips variant="success" texto="Ativo" />
      <Chips variant="default" texto="VIP" />
      <Chips variant="warning" texto="Revisão" />
    </div>
  ),
}
