import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Radio } from './Radio'

const meta = {
  title: 'Componentes/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Seleção exclusiva dentro de um grupo. Apenas um item pode estar selecionado por vez.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamanho do radio',
    },
    label: { control: 'text', description: 'Rótulo visível ao lado do radio' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

/* ───────────────────────────────────────────────────────────────────────────
   TAMANHOS
   ─────────────────────────────────────────────────────────────────────────── */

export const Pequeno: Story = {
  args: { size: 'sm', label: 'Opção', name: 'tamanho-sm', defaultChecked: true },
}

export const Medio: Story = {
  args: { size: 'md', label: 'Opção', name: 'tamanho-md', defaultChecked: true },
}

export const Grande: Story = {
  args: { size: 'lg', label: 'Opção', name: 'tamanho-lg', defaultChecked: true },
}

/* ───────────────────────────────────────────────────────────────────────────
   ESTADOS
   ─────────────────────────────────────────────────────────────────────────── */

export const Desmarcado: Story = {
  args: { label: 'Opção', name: 'estado-desmarcado' },
}

export const Desabilitado: Story = {
  args: { label: 'Indisponível', name: 'estado-disabled', disabled: true },
}

export const DesabilitadoMarcado: Story = {
  name: 'Desabilitado e marcado',
  args: { label: 'Indisponível', name: 'estado-disabled-checked', disabled: true, defaultChecked: true },
}

/* ───────────────────────────────────────────────────────────────────────────
   GRUPO (fieldset + legend, regra must)
   ─────────────────────────────────────────────────────────────────────────── */

export const Grupo: Story = {
  render: () => {
    function Exemplo() {
      const [frequencia, setFrequencia] = useState('diario')
      return (
        <fieldset style={{ border: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <legend style={{ fontFamily: 'sans-serif', fontSize: 14, marginBottom: 8 }}>Frequência</legend>
          <Radio name="frequencia" value="diario" label="Diário" checked={frequencia === 'diario'} onChange={() => setFrequencia('diario')} />
          <Radio name="frequencia" value="semanal" label="Semanal" checked={frequencia === 'semanal'} onChange={() => setFrequencia('semanal')} />
          <Radio name="frequencia" value="mensal" label="Mensal" checked={frequencia === 'mensal'} onChange={() => setFrequencia('mensal')} />
        </fieldset>
      )
    }
    return <Exemplo />
  },
}
