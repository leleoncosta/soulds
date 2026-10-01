import React from 'react'
import './Digito.css'

export type DigitoVariant = 'digit' | 'text'
export type DigitoState = 'default' | 'hover' | 'active' | 'disabled'
export type DigitoWeight = 'bold' | 'normal'

export interface DigitoProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** 'digit' = número de dia; 'text' = abreviação de mês/ano */
  variant?: DigitoVariant
  /** Estado visual da célula */
  state?: DigitoState
  /** 'bold' = dia do mês exibido; 'normal' = dia de preenchimento dos extremos (ou mês/ano) */
  weight?: DigitoWeight
  /** Conteúdo da célula: número do dia ou abreviação de mês/ano */
  children: React.ReactNode
  /** Classe CSS adicional */
  className?: string
}

/**
 * Componente Digito da Soul DS
 *
 * Célula interna do calendário. Representa um dia, mês ou ano selecionável.
 *
 * ⚠️ Não use diretamente fora do `calendario` — é um sub-componente interno
 * (ver `rules.mustNot` em `components.json`).
 *
 * @example
 * <Digito variant="digit" weight="bold">12</Digito>
 * <Digito variant="digit" weight="bold" state="active">12</Digito>
 * <Digito variant="text">Jan</Digito>
 */
export const Digito = React.forwardRef<HTMLButtonElement, DigitoProps>(
  ({ variant = 'digit', state: stateProp, weight = 'normal', children, disabled = false, className = '', ...rest }, ref) => {
    // Determina o estado baseado na prop ou se está desabilitado
    const state = disabled ? 'disabled' : stateProp || 'default'

    const baseClasses = 'digito'
    const variantClasses = `digito--${variant}`
    const weightClasses = `digito--weight-${weight}`
    const stateClasses = state !== 'default' ? `digito--${state}` : ''

    const finalClassName = [baseClasses, variantClasses, weightClasses, stateClasses, className]
      .filter(Boolean)
      .join(' ')

    return (
      <button
        ref={ref}
        type="button"
        className={finalClassName}
        disabled={state === 'disabled'}
        aria-pressed={state === 'active'}
        {...rest}
      >
        {children}
      </button>
    )
  }
)

Digito.displayName = 'Digito'
