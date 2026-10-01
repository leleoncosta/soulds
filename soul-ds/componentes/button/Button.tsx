import React, { ReactNode } from 'react'
import './Button.css'

export type ButtonVariant = 'primary' | 'outline' | 'link' | 'toggle' | 'icon'
export type ButtonState = 'default' | 'hover' | 'active' | 'disabled'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Estilo visual do botão */
  variant?: ButtonVariant
  /** Estado visual do botão */
  state?: ButtonState
  /** Rótulo do botão (texto principal) */
  label?: string
  /** Ícone à esquerda do texto */
  iconLeft?: ReactNode
  /** Ícone à direita do texto */
  iconRight?: ReactNode
  /** Conteúdo customizável do botão */
  children?: ReactNode
  /** Desabilita o botão */
  disabled?: boolean
  /** Classe CSS adicional */
  className?: string
  /** Callback ao clicar */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

/**
 * Componente Button da Soul DS
 *
 * Ação principal da interface. Use para disparar eventos, enviar formulários ou navegar entre telas.
 *
 * @example
 * <Button variant="primary" label="Clique em mim" />
 * <Button variant="outline" label="Cancelar" disabled />
 * <Button variant="icon" iconLeft={<IconHome />} aria-label="Home" />
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      state: stateProp,
      label,
      iconLeft,
      iconRight,
      children,
      disabled = false,
      className = '',
      ...rest
    },
    ref
  ) => {
    // Determina o estado baseado na prop ou se está desabilitado
    const state = disabled ? 'disabled' : stateProp || 'default'

    // Classes base + variante + estado
    const baseClasses = 'btn'
    const variantClasses = `btn--${variant}`
    const stateClasses = state !== 'default' ? `btn--${state}` : ''

    const finalClassName = [baseClasses, variantClasses, stateClasses, className]
      .filter(Boolean)
      .join(' ')

    // Conteúdo do botão
    const content = children || (
      <>
        {iconLeft && <span className="btn__icon btn__icon--left">{iconLeft}</span>}
        {label && <span className="btn__label">{label}</span>}
        {iconRight && <span className="btn__icon btn__icon--right">{iconRight}</span>}
      </>
    )

    // Para botões de ícone puro sem label, adiciona aria-label obrigatório
    const ariaLabel =
      variant === 'icon' && !label && !children
        ? rest['aria-label'] || 'Button'
        : undefined

    return (
      <button
        ref={ref}
        className={finalClassName}
        disabled={disabled}
        aria-label={ariaLabel}
        {...rest}
      >
        {content}
      </button>
    )
  }
)

Button.displayName = 'Button'
