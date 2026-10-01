import React, { useId } from 'react'
import './Radio.css'

export type RadioSize = 'sm' | 'md' | 'lg'

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Tamanho do radio */
  size?: RadioSize
  /** Rótulo visível ao lado do radio */
  label?: string
  /** Classe CSS adicional no wrapper (label) */
  className?: string
}

/**
 * Componente Radio da Soul DS
 *
 * Seleção exclusiva dentro de um grupo. Apenas um item pode estar
 * selecionado por vez. Agrupe sempre dois ou mais dentro de um
 * `<fieldset>` com `<legend>` — um único radio isolado nunca faz sentido
 * (regra `mustNot`). Para mais de 5 opções, prefira um select/dropdown.
 *
 * @example
 * <fieldset>
 *   <legend>Frequência</legend>
 *   <Radio name="freq" value="diario" label="Diário" defaultChecked />
 *   <Radio name="freq" value="semanal" label="Semanal" />
 * </fieldset>
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ size = 'md', label, id, className = '', ...rest }, ref) => {
    const generatedId = useId()
    const radioId = id ?? generatedId

    return (
      <label className={['radio', `radio--${size}`, className].filter(Boolean).join(' ')} htmlFor={radioId}>
        <span className="radio__box">
          <input ref={ref} id={radioId} type="radio" className="radio__input" {...rest} />
          <span className="radio__marca" />
        </span>
        {label && <span className="radio__label">{label}</span>}
      </label>
    )
  }
)

Radio.displayName = 'Radio'
