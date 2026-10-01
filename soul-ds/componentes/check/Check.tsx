import React, { useId } from 'react'
import './Check.css'

export type CheckSize = 'sm' | 'md' | 'lg'

export interface CheckProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Tamanho da caixa de seleção */
  size?: CheckSize
  /** Rótulo visível ao lado do checkbox */
  label?: string
  /** Classe CSS adicional no wrapper (label) */
  className?: string
}

function ConfirmarIcon() {
  // ícone resolvido via find-icon.mjs "confirmar" → mv-basico/acao/confirmar
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.09091 13.5455L3.27273 9.72736L2 11.0001L7.09091 16.091L18 5.18191L16.7273 3.90918L7.09091 13.5455Z" fill="currentColor" />
    </svg>
  )
}

/**
 * Componente Check da Soul DS
 *
 * Seleção múltipla independente. Cada checkbox opera de forma autônoma.
 * Use quando o usuário pode selecionar zero, um ou vários itens de uma
 * lista — para seleção exclusiva, use `Radio`.
 *
 * @example
 * <Check label="Ativo" defaultChecked />
 * <Check size="lg" label="Selecionar todos" />
 */
export const Check = React.forwardRef<HTMLInputElement, CheckProps>(
  ({ size = 'md', label, id, className = '', ...rest }, ref) => {
    const generatedId = useId()
    const checkId = id ?? generatedId

    return (
      <label className={['check', `check--${size}`, className].filter(Boolean).join(' ')} htmlFor={checkId}>
        <span className="check__box">
          <input ref={ref} id={checkId} type="checkbox" className="check__input" {...rest} />
          <span className="check__marca">
            <ConfirmarIcon />
          </span>
        </span>
        {label && <span className="check__label">{label}</span>}
      </label>
    )
  }
)

Check.displayName = 'Check'
