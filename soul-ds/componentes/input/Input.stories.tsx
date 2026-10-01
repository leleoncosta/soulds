import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta = {
  title: 'Componentes/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Campo de entrada de texto. Suporta label, placeholder, ícone, hint e validação.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: 'Rótulo do campo' },
    hasLabel: { control: 'boolean', description: 'Exibe o rótulo visivelmente' },
    obrigatorio: { control: 'boolean', description: 'Marca o campo como obrigatório' },
    hint: { control: 'boolean', description: 'Exibe o texto auxiliar' },
    textoAuxiliar: { control: 'text', description: 'Texto auxiliar abaixo do campo' },
    error: { control: 'boolean', description: 'Estado de validação com erro' },
    icone: { control: 'boolean', description: 'Exibe o ícone à direita' },
    disabled: { control: 'boolean', description: 'Desabilita o campo' },
    placeholder: { control: 'text', description: 'Texto de sugestão quando vazio' },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

/* ───────────────────────────────────────────────────────────────────────────
   ESTADOS
   ─────────────────────────────────────────────────────────────────────────── */

export const Default: Story = {
  args: { label: 'Nome completo', obrigatorio: true, hint: true, textoAuxiliar: 'Conforme documento oficial' },
}

export const ComPlaceholder: Story = {
  args: { label: 'CPF', placeholder: '000.000.000-00' },
}

export const ComIcone: Story = {
  args: { label: 'Nome completo', obrigatorio: true, icone: true },
}

export const Erro: Story = {
  args: {
    label: 'E-mail',
    defaultValue: 'email-invalido',
    error: true,
    hint: true,
    textoAuxiliar: 'Informe um e-mail válido',
  },
}

export const Desabilitado: Story = {
  args: { label: 'Observações', defaultValue: 'Edição restrita', disabled: true, hint: true, textoAuxiliar: 'Edição restrita ao perfil administrador' },
}

export const SemLabelVisivel: Story = {
  name: 'Sem label visível (sr-only)',
  args: { label: 'Buscar', hasLabel: false, placeholder: 'Buscar…' },
}

/* ───────────────────────────────────────────────────────────────────────────
   CONTROLADO
   ─────────────────────────────────────────────────────────────────────────── */

export const Controlado: Story = {
  args: { label: 'E-mail' },
  render: () => {
    function Exemplo() {
      const [value, setValue] = useState('')
      const invalido = value.length > 0 && !value.includes('@')
      return (
        <Input
          label="E-mail"
          obrigatorio
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={invalido}
          hint={invalido}
          textoAuxiliar={invalido ? 'Informe um e-mail válido' : undefined}
        />
      )
    }
    return <Exemplo />
  },
}

/* ───────────────────────────────────────────────────────────────────────────
   FORMULÁRIO
   ─────────────────────────────────────────────────────────────────────────── */

export const Formulario: Story = {
  args: { label: 'Nome' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '260px' }}>
      <Input label="Nome" obrigatorio placeholder="Nome completo" />
      <Input label="Data de nascimento" obrigatorio type="date" />
      <Input label="CPF" placeholder="000.000.000-00" />
      <Input label="Telefone" placeholder="(00) 00000-0000" />
    </div>
  ),
}
