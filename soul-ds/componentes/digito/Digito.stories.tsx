import type { Meta, StoryObj } from '@storybook/react'
import { Digito } from './Digito'

const meta = {
  title: 'Componentes/Digito',
  component: Digito,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Célula interna do calendário. Representa um dia, mês ou ano selecionável. Sub-componente interno — não use fora do `calendario`.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['digit', 'text'],
      description: "'digit' = número de dia; 'text' = abreviação de mês/ano",
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'active', 'disabled'],
      description: 'Estado visual da célula',
    },
    weight: {
      control: 'select',
      options: ['bold', 'normal'],
      description: "'bold' = dia do mês exibido; 'normal' = dia de preenchimento dos extremos",
    },
  },
} satisfies Meta<typeof Digito>

export default meta
type Story = StoryObj<typeof meta>

/* ───────────────────────────────────────────────────────────────────────────
   VARIANT: digit
   ─────────────────────────────────────────────────────────────────────────── */

export const DigitBoldDefault: Story = {
  args: { variant: 'digit', weight: 'bold', children: '12' },
}

export const DigitBoldActive: Story = {
  args: { variant: 'digit', weight: 'bold', state: 'active', children: '12' },
}

export const DigitBoldDisabled: Story = {
  args: { variant: 'digit', weight: 'bold', disabled: true, children: '12' },
}

export const DigitNormal: Story = {
  name: 'Digit normal (preenchimento dos extremos)',
  args: { variant: 'digit', weight: 'normal', children: '30' },
}

/* ───────────────────────────────────────────────────────────────────────────
   VARIANT: text
   ─────────────────────────────────────────────────────────────────────────── */

export const Text: Story = {
  args: { variant: 'text', children: 'Jan' },
}

export const TextActive: Story = {
  args: { variant: 'text', state: 'active', children: 'Abr' },
}

/* ───────────────────────────────────────────────────────────────────────────
   GRADE (como usado dentro do calendario)
   ─────────────────────────────────────────────────────────────────────────── */

export const Semana: Story = {
  args: { children: null },
  render: () => (
    <div style={{ display: 'flex', gap: '4px' }}>
      <Digito variant="digit" weight="normal">
        30
      </Digito>
      <Digito variant="digit" weight="bold">
        1
      </Digito>
      <Digito variant="digit" weight="bold" state="active">
        2
      </Digito>
      <Digito variant="digit" weight="bold">
        3
      </Digito>
      <Digito variant="digit" weight="bold" disabled>
        4
      </Digito>
    </div>
  ),
}
