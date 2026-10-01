import React, { useId } from 'react'
import './Input.css'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Rótulo do campo — sempre deve existir, visível ou não (regra must: nunca usar placeholder no lugar do label) */
  label: string
  /** Exibe o rótulo visivelmente. Quando false, o rótulo ainda existe para leitores de tela (sr-only) */
  hasLabel?: boolean
  /** Marca o campo como obrigatório — asterisco visual + required + aria-required */
  obrigatorio?: boolean
  /** Exibe o texto auxiliar abaixo do campo */
  hint?: boolean
  /** Texto auxiliar. Obrigatório explicar o problema quando error=true (regra must) */
  textoAuxiliar?: string
  /** Estado de validação com erro */
  error?: boolean
  /** Exibe o ícone à direita do campo */
  icone?: boolean
  /** Ícone customizado (padrão: ícone "menu_secundario") */
  icon?: React.ReactNode
  /** Classe CSS adicional no wrapper externo */
  className?: string
}

function MenuSecundarioIcon() {
  // ícone resolvido via find-icon.mjs "menu_secundario" → mv-basico/sistema/menu_secundario
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 6C11.1 6 12 5.1 12 4C12 2.9 11.1 2 10 2C8.9 2 8 2.9 8 4C8 5.1 8.9 6 10 6ZM10 8C8.9 8 8 8.9 8 10C8 11.1 8.9 12 10 12C11.1 12 12 11.1 12 10C12 8.9 11.1 8 10 8ZM10 14C8.9 14 8 14.9 8 16C8 17.1 8.9 18 10 18C11.1 18 12 17.1 12 16C12 14.9 11.1 14 10 14Z"
        fill="currentColor"
      />
    </svg>
  )
}

/**
 * Componente Input da Soul DS
 *
 * Campo de entrada de texto. Suporta label, placeholder, ícone, hint e validação.
 *
 * O Figma modela `variant=text`/`variant=placeholder` como dois símbolos
 * estáticos (campo preenchido vs. vazio) — na implementação real isso é o
 * comportamento nativo do HTML (`placeholder` mostra o texto cinza quando o
 * campo está vazio, o valor digitado assume a cor normal). Por isso não há
 * uma prop `variant` aqui: use `placeholder` e `value`/`defaultValue` como
 * em qualquer `<input>`.
 *
 * @example
 * <Input label="Nome completo" obrigatorio />
 * <Input label="E-mail" error textoAuxiliar="E-mail inválido" hint />
 * <Input label="CPF" placeholder="000.000.000-00" />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hasLabel = true,
      obrigatorio = false,
      hint = false,
      textoAuxiliar,
      error = false,
      icone = false,
      icon,
      id,
      className = '',
      ...rest
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const hintId = `${inputId}-hint`

    return (
      <div className={['input-field', className].filter(Boolean).join(' ')} data-state={error ? 'error' : undefined}>
        <label className={hasLabel ? 'input-field__label' : 'input-field__label input-field__label--oculto'} htmlFor={inputId}>
          {label}
          {obrigatorio && (
            <span className="input-field__obrigatorio" aria-hidden="true">
              *
            </span>
          )}
        </label>

        <div className="input-field__wrapper">
          <input
            ref={ref}
            id={inputId}
            className="input-field__input"
            required={obrigatorio}
            aria-required={obrigatorio || undefined}
            aria-invalid={error || undefined}
            aria-describedby={hint && textoAuxiliar ? hintId : undefined}
            {...rest}
          />
          {icone && (
            <span className="input-field__icone" aria-hidden="true">
              {icon ?? <MenuSecundarioIcon />}
            </span>
          )}
        </div>

        {hint && textoAuxiliar && (
          <span id={hintId} className="input-field__hint" role={error ? 'alert' : undefined}>
            {textoAuxiliar}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
