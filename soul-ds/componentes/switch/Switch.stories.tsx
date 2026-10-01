import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from './Switch'

const meta = {
  title: 'Componentes/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Controle de alternância binária com efeito imediato. Liga/desliga uma configuração sem necessidade de confirmação.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: 'Rótulo descritivo' },
    icon: { control: 'boolean', description: 'Exibe o ícone dentro do thumb' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

/* ───────────────────────────────────────────────────────────────────────────
   ESTADOS
   ─────────────────────────────────────────────────────────────────────────── */

export const Desligado: Story = {
  args: { label: 'Notificações por e-mail' },
}

export const Ligado: Story = {
  args: { label: 'Notificações por e-mail', defaultChecked: true },
}

export const SemIcone: Story = {
  name: 'Sem ícone no thumb',
  args: { label: 'Modo escuro', icon: false },
}

export const Desabilitado: Story = {
  args: { label: 'Indisponível', disabled: true },
}

export const DesabilitadoLigado: Story = {
  name: 'Desabilitado e ligado',
  args: { label: 'Indisponível', disabled: true, defaultChecked: true },
}

/* ───────────────────────────────────────────────────────────────────────────
   CONTROLADO
   ─────────────────────────────────────────────────────────────────────────── */

export const Controlado: Story = {
  args: { label: 'Modo escuro' },
  render: () => {
    function Exemplo() {
      const [ativo, setAtivo] = useState(false)
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'sans-serif', fontSize: 14 }}>
          <Switch label="Modo escuro" checked={ativo} onCheckedChange={setAtivo} />
          <span>Estado: {ativo ? 'ligado' : 'desligado'}</span>
        </div>
      )
    }
    return <Exemplo />
  },
}
