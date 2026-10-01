import React, { useEffect, useId, useRef } from 'react'
import './Dialog.css'

export interface DialogProps {
  /** Controla se o dialog está aberto */
  open: boolean
  /** Disparado ao fechar — pelo X, clique fora da caixa, ou Escape */
  onClose: () => void
  /** Título exibido no cabeçalho */
  titulo: string
  /** Conteúdo do corpo do dialog */
  children?: React.ReactNode
  /** Exibe/oculta o rodapé de ações */
  btn?: boolean
  /** Conteúdo do rodapé de ações — ex: `<Button variant="outline">Cancelar</Button>` + `<Button variant="primary">Salvar</Button>` */
  footer?: React.ReactNode
  /** Classe CSS adicional */
  className?: string
}

/**
 * Componente Dialog da Soul DS
 *
 * Janela modal para confirmações, formulários curtos ou detalhamento de um
 * item sem sair do contexto atual. Usa `<dialog>` nativo com `showModal()`
 * para focus trap e `::backdrop` automáticos.
 *
 * @example
 * <Dialog
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   titulo="Excluir paciente"
 *   footer={
 *     <>
 *       <Button variant="outline" label="Cancelar" onClick={() => setOpen(false)} />
 *       <Button variant="primary" label="Excluir" onClick={handleExcluir} />
 *     </>
 *   }
 * >
 *   Tem certeza que deseja excluir este paciente? Essa ação não pode ser desfeita.
 * </Dialog>
 */
export const Dialog = ({ open, onClose, titulo, children, btn = true, footer, className = '' }: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return

    if (open && !el.open) {
      el.showModal()
    } else if (!open && el.open) {
      el.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className={['dialog', className].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={onClose}
    >
      <div className="dialog__titulo">
        <h2 id={titleId} className="dialog__titulo-texto">
          {titulo}
        </h2>
        <button type="button" className="dialog__fechar" onClick={onClose} aria-label="Fechar">
          {/* ícone resolvido via find-icon.mjs "fechar" → mv-basico/acao/fechar */}
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 3.61143L16.3886 2L10 8.38857L3.61143 2L2 3.61143L8.38857 10L2 16.3886L3.61143 18L10 11.6114L16.3886 18L18 16.3886L11.6114 10L18 3.61143Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      <div className="dialog__conteudo">{children}</div>

      {btn && footer && <div className="dialog__rodape">{footer}</div>}
    </dialog>
  )
}

Dialog.displayName = 'Dialog'
