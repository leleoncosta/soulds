import type { Meta, StoryObj } from '@storybook/react'
import { Breadcrumb } from './Breadcrumb'

const meta = {
  title: 'Componentes/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Item de trilha de navegação hierárquica. Indica a posição do usuário dentro da estrutura do produto.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'active'],
      description: 'Estado visual do item',
    },
    nomePagina: {
      control: 'text',
      description: 'Nome da página exibido no item',
    },
    separador: {
      control: 'boolean',
      description: 'Exibe a seta separadora à direita do texto',
    },
  },
  decorators: [
    (Story) => (
      <ol style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
        <Story />
      </ol>
    ),
  ],
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

/* ───────────────────────────────────────────────────────────────────────────
   ESTADOS
   ─────────────────────────────────────────────────────────────────────────── */

export const Default: Story = {
  args: {
    nomePagina: 'Página 1',
    href: '#',
  },
}

export const Active: Story = {
  args: {
    nomePagina: 'Página 1',
    state: 'active',
  },
}

/* ───────────────────────────────────────────────────────────────────────────
   TRILHA COMPLETA
   ─────────────────────────────────────────────────────────────────────────── */

export const Trilha: Story = {
  decorators: [],
  render: () => (
    <nav aria-label="breadcrumb">
      <ol style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
        <Breadcrumb nomePagina="Início" href="/" />
        <Breadcrumb nomePagina="Pacientes" href="/pacientes" />
        <Breadcrumb nomePagina="Ficha do paciente" state="active" separador={false} />
      </ol>
    </nav>
  ),
}
