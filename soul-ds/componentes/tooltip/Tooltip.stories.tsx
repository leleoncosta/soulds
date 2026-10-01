import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from './Tooltip'

const meta = {
  title: 'Componentes/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Texto de apoio contextual exibido ao passar o mouse ou focar um elemento. Use para complementar informação não crítica.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    texto: { control: 'text', description: 'Texto de apoio exibido no tooltip' },
    arrowPosition: {
      control: 'select',
      options: [
        'bottom-left', 'bottom', 'bottom-right',
        'top-left', 'top', 'top-right',
        'right-top', 'right', 'right-bottom',
        'left-top', 'left', 'left-bottom',
      ],
      description: 'Posição da seta na caixa do tooltip',
    },
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

/* ───────────────────────────────────────────────────────────────────────────
   POSIÇÕES PRINCIPAIS
   ─────────────────────────────────────────────────────────────────────────── */

export const Top: Story = {
  args: {
    texto: 'Label',
    arrowPosition: 'top',
    children: <button>Passe o mouse</button>,
  },
}

export const Bottom: Story = {
  args: {
    texto: 'Label',
    arrowPosition: 'bottom',
    children: <button>Passe o mouse</button>,
  },
}

export const Left: Story = {
  args: {
    texto: 'Label',
    arrowPosition: 'left',
    children: <button>Passe o mouse</button>,
  },
}

export const Right: Story = {
  args: {
    texto: 'Label',
    arrowPosition: 'right',
    children: <button>Passe o mouse</button>,
  },
}

/* ───────────────────────────────────────────────────────────────────────────
   TEXTO MAIS LONGO
   ─────────────────────────────────────────────────────────────────────────── */

export const TextoLongo: Story = {
  args: {
    texto: 'Exportar relatório completo em PDF',
    arrowPosition: 'top',
    children: <button>⬇ Exportar</button>,
  },
}

/* ───────────────────────────────────────────────────────────────────────────
   TODAS AS 12 POSIÇÕES
   ─────────────────────────────────────────────────────────────────────────── */

export const TodasAsPosicoes: Story = {
  args: { texto: 'Label', children: <button>trigger</button> },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '48px',
        padding: '48px',
      }}
    >
      {(
        [
          'bottom-left', 'bottom', 'bottom-right',
          'top-left', 'top', 'top-right',
          'right-top', 'right', 'right-bottom',
          'left-top', 'left', 'left-bottom',
        ] as const
      ).map((pos) => (
        <Tooltip key={pos} texto={pos} arrowPosition={pos}>
          <button>{pos}</button>
        </Tooltip>
      ))}
    </div>
  ),
}
