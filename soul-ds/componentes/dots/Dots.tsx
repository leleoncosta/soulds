import React from 'react'
import './Dots.css'

export type DotsState = 'default' | 'active'

export interface DotsProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Estado visual do ponto */
  state?: DotsState
  /** Classe CSS adicional */
  className?: string
}

/**
 * Componente Dots da Soul DS
 *
 * Indicador de paginação por pontos. Representa a posição atual em um
 * conjunto de páginas ou slides. Use em carrosséis, wizards e paginações
 * com até 10 itens — acima disso, prefira paginação numérica.
 *
 * @example
 * <Dots state="active" aria-label="Página 1" aria-current="true" />
 * <Dots aria-label="Ir para página 2" onClick={() => goTo(2)} />
 */
export const Dots = React.forwardRef<HTMLButtonElement, DotsProps>(
  ({ state = 'default', className = '', ...rest }, ref) => {
    const finalClassName = ['dots', state === 'active' ? 'dots--active' : '', className].filter(Boolean).join(' ')

    return <button ref={ref} type="button" className={finalClassName} {...rest} />
  }
)

Dots.displayName = 'Dots'
