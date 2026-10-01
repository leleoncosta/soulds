import type { Meta, StoryObj } from '@storybook/react'
import { Dots } from './Dots'

const meta = {
  title: 'Componentes/Dots',
  component: Dots,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Indicador de paginação por pontos. Representa a posição atual em um conjunto de páginas ou slides. Use em carrosséis, wizards e paginações com até 10 itens.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'active'],
      description: 'Estado visual do ponto',
    },
  },
} satisfies Meta<typeof Dots>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { state: 'default', 'aria-label': 'Ir para página 1' },
}

export const Active: Story = {
  args: { state: 'active', 'aria-label': 'Página 2', 'aria-current': 'true' },
}

export const Grupo: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Dots aria-label="Página 1" />
      <Dots state="active" aria-label="Página 2" aria-current="true" />
      <Dots aria-label="Página 3" />
    </div>
  ),
}
