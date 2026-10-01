import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta = {
  title: 'Componentes/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Button da Soul DS. Ação principal da interface. Use para disparar eventos, enviar formulários ou navegar entre telas.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'outline', 'link', 'toggle', 'icon'],
      description: 'Estilo visual do botão',
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'active', 'disabled'],
      description: 'Estado visual do botão',
    },
    label: {
      control: 'text',
      description: 'Rótulo do botão',
    },
    iconLeft: {
      description: 'Ícone à esquerda do texto',
    },
    iconRight: {
      description: 'Ícone à direita do texto',
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o botão',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/* ───────────────────────────────────────────────────────────────────────────
   PRIMARY VARIANT
   ─────────────────────────────────────────────────────────────────────────── */

export const Primary: Story = {
  args: {
    variant: 'primary',
    label: 'Clique em mim',
  },
}

export const PrimaryHover: Story = {
  args: {
    variant: 'primary',
    label: 'Clique em mim',
    state: 'hover',
  },
}

export const PrimaryActive: Story = {
  args: {
    variant: 'primary',
    label: 'Clique em mim',
    state: 'active',
  },
}

export const PrimaryDisabled: Story = {
  args: {
    variant: 'primary',
    label: 'Desabilitado',
    disabled: true,
  },
}

/* ───────────────────────────────────────────────────────────────────────────
   OUTLINE VARIANT
   ─────────────────────────────────────────────────────────────────────────── */

export const Outline: Story = {
  args: {
    variant: 'outline',
    label: 'Cancelar',
  },
}

export const OutlineHover: Story = {
  args: {
    variant: 'outline',
    label: 'Cancelar',
    state: 'hover',
  },
}

export const OutlineActive: Story = {
  args: {
    variant: 'outline',
    label: 'Cancelar',
    state: 'active',
  },
}

export const OutlineDisabled: Story = {
  args: {
    variant: 'outline',
    label: 'Cancelar',
    disabled: true,
  },
}

/* ───────────────────────────────────────────────────────────────────────────
   LINK VARIANT
   ─────────────────────────────────────────────────────────────────────────── */

export const Link: Story = {
  args: {
    variant: 'link',
    label: 'Saiba mais',
  },
}

export const LinkHover: Story = {
  args: {
    variant: 'link',
    label: 'Saiba mais',
    state: 'hover',
  },
}

export const LinkActive: Story = {
  args: {
    variant: 'link',
    label: 'Saiba mais',
    state: 'active',
  },
}

export const LinkDisabled: Story = {
  args: {
    variant: 'link',
    label: 'Saiba mais',
    disabled: true,
  },
}

/* ───────────────────────────────────────────────────────────────────────────
   TOGGLE VARIANT
   ─────────────────────────────────────────────────────────────────────────── */

export const ToggleDefault: Story = {
  args: {
    variant: 'toggle',
    label: 'Opção 1',
    state: 'default',
  },
}

export const ToggleActive: Story = {
  args: {
    variant: 'toggle',
    label: 'Opção 1',
    state: 'active',
  },
}

export const ToggleHover: Story = {
  args: {
    variant: 'toggle',
    label: 'Opção 1',
    state: 'hover',
  },
}

export const ToggleDisabled: Story = {
  args: {
    variant: 'toggle',
    label: 'Opção 1',
    disabled: true,
  },
}

/* ───────────────────────────────────────────────────────────────────────────
   ICON VARIANT
   ─────────────────────────────────────────────────────────────────────────── */

export const Icon: Story = {
  args: {
    variant: 'icon',
    label: '⚙️',
    'aria-label': 'Configurações',
  },
}

export const IconHover: Story = {
  args: {
    variant: 'icon',
    label: '⚙️',
    state: 'hover',
    'aria-label': 'Configurações',
  },
}

export const IconActive: Story = {
  args: {
    variant: 'icon',
    label: '⚙️',
    state: 'active',
    'aria-label': 'Configurações',
  },
}

export const IconDisabled: Story = {
  args: {
    variant: 'icon',
    label: '⚙️',
    disabled: true,
    'aria-label': 'Configurações (desabilitado)',
  },
}

/* ───────────────────────────────────────────────────────────────────────────
   COMPOSIÇÕES
   ─────────────────────────────────────────────────────────────────────────── */

export const WithIconLeft: Story = {
  args: {
    variant: 'primary',
    label: 'Enviar',
    iconLeft: '✉️',
  },
}

export const WithIconRight: Story = {
  args: {
    variant: 'primary',
    label: 'Próximo',
    iconRight: '→',
  },
}

export const WithBothIcons: Story = {
  args: {
    variant: 'outline',
    label: 'Compartilhar',
    iconLeft: '↗️',
    iconRight: '✓',
  },
}

/* ───────────────────────────────────────────────────────────────────────────
   GRUPOS DE BOTÕES
   ─────────────────────────────────────────────────────────────────────────── */

export const ButtonGroup: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Button variant="primary" label="Salvar" />
      <Button variant="outline" label="Cancelar" />
    </div>
  ),
}

export const ToggleGroup: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button variant="toggle" label="Diário" state="active" />
      <Button variant="toggle" label="Semanal" />
      <Button variant="toggle" label="Mensal" />
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h3>Primary</h3>
        <Button variant="primary" label="Primário" />
      </div>
      <div>
        <h3>Outline</h3>
        <Button variant="outline" label="Outline" />
      </div>
      <div>
        <h3>Link</h3>
        <Button variant="link" label="Link" />
      </div>
      <div>
        <h3>Toggle</h3>
        <Button variant="toggle" label="Toggle" />
      </div>
      <div>
        <h3>Icon</h3>
        <Button variant="icon" label="⚙️" aria-label="Configurações" />
      </div>
    </div>
  ),
}
