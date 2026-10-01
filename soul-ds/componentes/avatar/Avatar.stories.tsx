import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const placeholderPhoto =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect width="64" height="64" fill="%23205E7E"/%3E%3Ctext x="32" y="40" font-size="22" fill="white" text-anchor="middle" font-family="sans-serif"%3EAB%3C/text%3E%3C/svg%3E'

const meta = {
  title: 'Componentes/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Representação visual do usuário. Exibe foto de perfil ou ícone substituto.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['image', 'icon'],
      description: 'Variante visual do avatar',
    },
    nome: {
      control: 'text',
      description: 'Nome completo do usuário',
    },
    info: {
      control: 'text',
      description: 'Informação complementar (cargo, e-mail, etc.)',
    },
    textos: {
      control: 'boolean',
      description: 'Exibe nome e info ao lado do avatar',
    },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

/* ───────────────────────────────────────────────────────────────────────────
   VARIANTES
   ─────────────────────────────────────────────────────────────────────────── */

export const Image: Story = {
  args: {
    variant: 'image',
    src: placeholderPhoto,
    alt: 'Ana Beatriz',
    nome: 'Ana Beatriz',
    info: 'Enfermeira',
  },
}

export const Icon: Story = {
  args: {
    variant: 'icon',
    nome: 'Nome completo',
    info: 'Informações',
  },
}

export const ImageFallbackParaIcon: Story = {
  name: 'Fallback automático (image sem src)',
  args: {
    variant: 'image',
    nome: 'Carlos Souza',
    info: 'Sem foto cadastrada — cai para icon automaticamente',
  },
}

export const Compacto: Story = {
  name: 'Compacto (sem textos)',
  args: {
    variant: 'icon',
    textos: false,
  },
}

/* ───────────────────────────────────────────────────────────────────────────
   COMPOSIÇÃO
   ─────────────────────────────────────────────────────────────────────────── */

export const ListaDeUsuarios: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Avatar variant="image" src={placeholderPhoto} alt="Ana Beatriz" nome="Ana Beatriz" info="Enfermeira" />
      <Avatar variant="icon" nome="Carlos Souza" info="Sem foto cadastrada" />
    </div>
  ),
}
