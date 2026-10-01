import React from 'react'
import './Aba.css'

export type AbaState = 'default' | 'active'

export interface AbaProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Estado visual da aba */
  state?: AbaState
  /** Rótulo da aba */
  label?: string
  /** Classe CSS adicional */
  className?: string
}

/**
 * Componente Aba da Soul DS
 *
 * Item individual de navegação por abas. Sempre utilizado dentro de um grupo de abas.
 *
 * @example
 * <div role="tablist">
 *   <Aba label="Aba 01" state="active" />
 *   <Aba label="Aba 02" />
 * </div>
 */
export const Aba = React.forwardRef<HTMLButtonElement, AbaProps>(
  ({ state = 'default', label, className = '', ...rest }, ref) => {
    const baseClasses = 'aba'
    const stateClasses = state !== 'default' ? `aba--${state}` : ''

    const finalClassName = [baseClasses, stateClasses, className].filter(Boolean).join(' ')

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={state === 'active'}
        tabIndex={state === 'active' ? 0 : -1}
        className={finalClassName}
        {...rest}
      >
        {label}
      </button>
    )
  }
)

Aba.displayName = 'Aba'
