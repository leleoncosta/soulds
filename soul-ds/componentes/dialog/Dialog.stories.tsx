import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Dialog } from './Dialog'
import { Button } from '../button/Button'

const meta = {
  title: 'Componentes/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Janela modal para confirmações, formulários curtos ou detalhamento de um item sem sair do contexto atual.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

/* ───────────────────────────────────────────────────────────────────────────
   BÁSICO
   ─────────────────────────────────────────────────────────────────────────── */

export const Basico: Story = {
  args: { open: false, onClose: () => {}, titulo: 'Título do dialog' },
  render: () => {
    function Exemplo() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <Button variant="primary" label="Abrir dialog" onClick={() => setOpen(true)} />
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            titulo="Título do dialog"
            footer={
              <>
                <Button variant="outline" label="Secundário" onClick={() => setOpen(false)} />
                <Button variant="primary" label="Principal" onClick={() => setOpen(false)} />
              </>
            }
          >
            Conteúdo do dialog.
          </Dialog>
        </>
      )
    }
    return <Exemplo />
  },
}

/* ───────────────────────────────────────────────────────────────────────────
   CONFIRMAÇÃO DESTRUTIVA
   ─────────────────────────────────────────────────────────────────────────── */

export const ConfirmacaoDestrutiva: Story = {
  name: 'Confirmação destrutiva (botão nomeado pela ação)',
  args: { open: false, onClose: () => {}, titulo: 'Excluir paciente' },
  render: () => {
    function Exemplo() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <Button variant="outline" label="Excluir paciente" onClick={() => setOpen(true)} />
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            titulo="Excluir paciente"
            footer={
              <>
                <Button variant="outline" label="Cancelar" onClick={() => setOpen(false)} />
                <Button variant="primary" label="Excluir" onClick={() => setOpen(false)} />
              </>
            }
          >
            Tem certeza que deseja excluir este paciente? Essa ação não pode ser desfeita.
          </Dialog>
        </>
      )
    }
    return <Exemplo />
  },
}

/* ───────────────────────────────────────────────────────────────────────────
   SEM RODAPÉ DE AÇÕES (btn=false)
   ─────────────────────────────────────────────────────────────────────────── */

export const SemRodape: Story = {
  name: 'Sem rodapé de ações (btn=false)',
  args: { open: false, onClose: () => {}, titulo: 'Detalhes do item' },
  render: () => {
    function Exemplo() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <Button variant="primary" label="Ver detalhes" onClick={() => setOpen(true)} />
          <Dialog open={open} onClose={() => setOpen(false)} titulo="Detalhes do item" btn={false}>
            Apenas informativo — feche pelo X ou Escape.
          </Dialog>
        </>
      )
    }
    return <Exemplo />
  },
}
