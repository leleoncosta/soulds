import type { Meta, StoryObj } from '@storybook/react'
import { Check } from './Check'

const meta = {
  title: 'Componentes/Check',
  component: Check,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Seleção múltipla independente. Cada checkbox opera de forma autônoma.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamanho da caixa de seleção',
    },
    label: { control: 'text', description: 'Rótulo visível ao lado do checkbox' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Check>

export default meta
type Story = StoryObj<typeof meta>

/* ───────────────────────────────────────────────────────────────────────────
   TAMANHOS
   ─────────────────────────────────────────────────────────────────────────── */

export const Pequeno: Story = {
  args: { size: 'sm', label: 'Ativo' },
}

export const Medio: Story = {
  args: { size: 'md', label: 'Ativo' },
}

export const Grande: Story = {
  args: { size: 'lg', label: 'Ativo' },
}

/* ───────────────────────────────────────────────────────────────────────────
   ESTADOS
   ─────────────────────────────────────────────────────────────────────────── */

export const Marcado: Story = {
  args: { label: 'Ativo', defaultChecked: true },
}

export const Desabilitado: Story = {
  args: { label: 'Indisponível', disabled: true },
}

export const DesabilitadoMarcado: Story = {
  name: 'Desabilitado e marcado',
  args: { label: 'Indisponível', disabled: true, defaultChecked: true },
}

/* ───────────────────────────────────────────────────────────────────────────
   LISTA
   ─────────────────────────────────────────────────────────────────────────── */

export const Lista: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Check label="Selecionar todos" />
      <Check label="Item 1" defaultChecked />
      <Check label="Item 2" />
      <Check label="Item 3" defaultChecked />
    </div>
  ),
}
