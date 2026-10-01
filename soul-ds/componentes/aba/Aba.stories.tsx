import type { Meta, StoryObj } from '@storybook/react'
import { Aba } from './Aba'

const meta = {
  title: 'Componentes/Aba',
  component: Aba,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Item individual de navegação por abas. Sempre utilizado dentro de um grupo de abas.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'active'],
      description: 'Estado visual da aba',
    },
    label: {
      control: 'text',
      description: 'Rótulo da aba',
    },
  },
} satisfies Meta<typeof Aba>

export default meta
type Story = StoryObj<typeof meta>

/* ───────────────────────────────────────────────────────────────────────────
   ESTADOS
   ─────────────────────────────────────────────────────────────────────────── */

export const Default: Story = {
  args: {
    label: 'Aba 01',
  },
}

export const Active: Story = {
  args: {
    label: 'Aba 01',
    state: 'active',
  },
}

/* ───────────────────────────────────────────────────────────────────────────
   GRUPO DE ABAS
   ─────────────────────────────────────────────────────────────────────────── */

export const TabList: Story = {
  render: () => (
    <div role="tablist" style={{ display: 'flex' }}>
      <Aba label="Aba 01" state="active" />
      <Aba label="Aba 02" />
      <Aba label="Aba 03" />
    </div>
  ),
}
