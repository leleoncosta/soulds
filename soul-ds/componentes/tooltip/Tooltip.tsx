import React, { useId, useRef, useState } from 'react'
import './Tooltip.css'

export type TooltipArrowPosition =
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'right-top'
  | 'right'
  | 'right-bottom'
  | 'left-top'
  | 'left'
  | 'left-bottom'

export interface TooltipProps {
  /** Texto de apoio exibido no tooltip. Mantenha curto, idealmente uma linha */
  texto: string
  /** Posição da seta na caixa do tooltip — indica de qual lado o tooltip "aponta" para o elemento de referência */
  arrowPosition?: TooltipArrowPosition
  /** Elemento disparador — recebe aria-describedby e os handlers de hover/foco automaticamente */
  children: React.ReactElement
  /** Classe CSS adicional no balão do tooltip */
  className?: string
}

const ARROW_CONFIG: Record<TooltipArrowPosition, { edge: 'top' | 'bottom' | 'left' | 'right'; align: 'start' | 'center' | 'end' }> = {
  'bottom-left': { edge: 'bottom', align: 'start' },
  bottom: { edge: 'bottom', align: 'center' },
  'bottom-right': { edge: 'bottom', align: 'end' },
  'top-left': { edge: 'top', align: 'start' },
  top: { edge: 'top', align: 'center' },
  'top-right': { edge: 'top', align: 'end' },
  'right-top': { edge: 'right', align: 'start' },
  right: { edge: 'right', align: 'center' },
  'right-bottom': { edge: 'right', align: 'end' },
  'left-top': { edge: 'left', align: 'start' },
  left: { edge: 'left', align: 'center' },
  'left-bottom': { edge: 'left', align: 'end' },
}

/**
 * Componente Tooltip da Soul DS
 *
 * Texto de apoio contextual exibido ao passar o mouse ou focar um elemento.
 * Use para complementar informação não crítica — nunca para conteúdo
 * essencial à tarefa, pois nem todo input (touch/teclado) aciona hover.
 *
 * Dispensável (Escape fecha), persistente (não desaparece sozinho) e
 * hoverable (mover o mouse para dentro do próprio tooltip não o fecha) —
 * requisitos WCAG 1.4.13.
 *
 * @example
 * <Tooltip texto="Exportar como PDF" arrowPosition="top">
 *   <button aria-label="Exportar">⬇</button>
 * </Tooltip>
 */
export const Tooltip = ({ texto, arrowPosition = 'top', children, className = '' }: TooltipProps) => {
  const [visible, setVisible] = useState(false)
  const id = useId()
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const show = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current)
    setVisible(true)
  }

  const hide = () => {
    hideTimeout.current = setTimeout(() => setVisible(false), 80)
  }

  const { edge, align } = ARROW_CONFIG[arrowPosition]

  const trigger = React.cloneElement(children, {
    'aria-describedby': visible ? id : undefined,
    onMouseEnter: (e: React.MouseEvent) => {
      children.props.onMouseEnter?.(e)
      show()
    },
    onMouseLeave: (e: React.MouseEvent) => {
      children.props.onMouseLeave?.(e)
      hide()
    },
    onFocus: (e: React.FocusEvent) => {
      children.props.onFocus?.(e)
      show()
    },
    onBlur: (e: React.FocusEvent) => {
      children.props.onBlur?.(e)
      hide()
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      children.props.onKeyDown?.(e)
      if (e.key === 'Escape') setVisible(false)
    },
  })

  return (
    <span className="tooltip__wrapper">
      {trigger}
      {visible && (
        <span
          role="tooltip"
          id={id}
          className={['tooltip', className].filter(Boolean).join(' ')}
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          {texto}
          <span className={`tooltip__arrow tooltip__arrow--${edge} tooltip__arrow--${align}`} aria-hidden="true" />
        </span>
      )}
    </span>
  )
}

Tooltip.displayName = 'Tooltip'
