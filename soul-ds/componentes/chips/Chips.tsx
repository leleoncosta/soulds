import React from 'react'
import './Chips.css'

export type ChipsVariant = 'default' | 'success' | 'warning' | 'info' | 'danger'

export interface ChipsProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Estilo visual do chip */
  variant?: ChipsVariant
  /** Texto exibido no chip */
  texto?: string
  /** Exibe o ícone de fechar à esquerda do texto */
  iconLeft?: boolean
  /** Exibe o ícone de fechar à direita do texto */
  iconRight?: boolean
  /** Callback ao clicar no ícone esquerdo. Sem ele, o ícone é apenas decorativo (aria-hidden) */
  onIconLeftClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  /** Callback ao clicar no ícone direito. Sem ele, o ícone é apenas decorativo (aria-hidden) */
  onIconRightClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  /** Classe CSS adicional */
  className?: string
}

function CloseIcon() {
  // ícone resolvido via find-icon.mjs "fechar" → mv-basico/acao/fechar
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18 3.61143L16.3886 2L10 8.38857L3.61143 2L2 3.61143L8.38857 10L2 16.3886L3.61143 18L10 11.6114L16.3886 18L18 16.3886L11.6114 10L18 3.61143Z"
        fill="currentColor"
      />
    </svg>
  )
}

/**
 * Componente Chips da Soul DS
 *
 * Marcador compacto de categoria, status ou filtro ativo. Comunicam atributos de forma visual.
 *
 * @example
 * <Chips variant="default" texto="Categoria" />
 * <Chips variant="success" texto="Aprovado" iconLeft />
 * <Chips variant="danger" texto="Filtro ativo" iconRight onIconRightClick={handleRemove} />
 */
export const Chips = React.forwardRef<HTMLSpanElement, ChipsProps>(
  (
    { variant = 'default', texto, iconLeft = false, iconRight = false, onIconLeftClick, onIconRightClick, className = '', ...rest },
    ref
  ) => {
    const finalClassName = ['chips', `chips--${variant}`, className].filter(Boolean).join(' ')

    return (
      <span ref={ref} className={finalClassName} {...rest}>
        {iconLeft &&
          (onIconLeftClick ? (
            <button type="button" className="chips__icon" onClick={onIconLeftClick} aria-label="Remover">
              <CloseIcon />
            </button>
          ) : (
            <span className="chips__icon" aria-hidden="true">
              <CloseIcon />
            </span>
          ))}
        {texto && <span className="chips__texto">{texto}</span>}
        {iconRight &&
          (onIconRightClick ? (
            <button type="button" className="chips__icon" onClick={onIconRightClick} aria-label="Remover">
              <CloseIcon />
            </button>
          ) : (
            <span className="chips__icon" aria-hidden="true">
              <CloseIcon />
            </span>
          ))}
      </span>
    )
  }
)

Chips.displayName = 'Chips'
