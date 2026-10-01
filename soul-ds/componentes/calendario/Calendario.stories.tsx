import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Calendario } from './Calendario'

const meta = {
  title: 'Componentes/Calendario',
  component: Calendario,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Seletor de data com navegação entre visualizações de dia, mês e ano.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Calendario>

export default meta
type Story = StoryObj<typeof meta>

/* ───────────────────────────────────────────────────────────────────────────
   VIEWS
   ─────────────────────────────────────────────────────────────────────────── */

export const ViewDay: Story = {
  args: {
    defaultValue: new Date(2026, 3, 2),
  },
}

export const ViewMonth: Story = {
  args: {
    view: 'month',
    defaultValue: new Date(2026, 3, 2),
  },
}

export const ViewYear: Story = {
  args: {
    view: 'year',
    defaultValue: new Date(2026, 3, 2),
  },
}

/* ───────────────────────────────────────────────────────────────────────────
   COM RESTRIÇÃO DE DATAS
   ─────────────────────────────────────────────────────────────────────────── */

export const ComDataMinima: Story = {
  name: 'Com minDate (datas passadas bloqueadas)',
  args: {
    minDate: new Date(),
  },
}

/* ───────────────────────────────────────────────────────────────────────────
   CONTROLADO
   ─────────────────────────────────────────────────────────────────────────── */

export const Controlado: Story = {
  render: () => {
    function Exemplo() {
      const [data, setData] = useState<Date | undefined>(new Date(2026, 3, 2))
      return (
        <div>
          <p style={{ marginBottom: 8, fontFamily: 'sans-serif', fontSize: 14 }}>
            Selecionado: {data ? data.toLocaleDateString('pt-BR') : 'nenhuma data'}
          </p>
          <Calendario value={data} onChange={setData} />
        </div>
      )
    }
    return <Exemplo />
  },
}
