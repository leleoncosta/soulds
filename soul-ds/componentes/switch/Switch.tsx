import React, { useId, useState } from 'react'
import './Switch.css'

export interface SwitchProps {
  /** Estado ligado/desligado (modo controlado) */
  checked?: boolean
  /** Estado inicial (modo não controlado) */
  defaultChecked?: boolean
  /** Disparado ao alternar */
  onCheckedChange?: (checked: boolean) => void
  /** Exibe o ícone dentro do thumb (✕ desligado, ✓ ligado) */
  icon?: boolean
  /** Rótulo descritivo — sempre acompanhe o switch de um (regra must) */
  label?: string
  /** Desabilita o switch */
  disabled?: boolean
  /** id do botão — gerado via useId se omitido */
  id?: string
  /** Classe CSS adicional no wrapper externo */
  className?: string
}

function FecharIcon() {
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

function ConfirmarIcon() {
  // ícone resolvido via find-icon.mjs "confirmar" → mv-basico/acao/confirmar
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.09091 13.5455L3.27273 9.72736L2 11.0001L7.09091 16.091L18 5.18191L16.7273 3.90918L7.09091 13.5455Z" fill="currentColor" />
    </svg>
  )
}

/**
 * Componente Switch da Soul DS
 *
 * Controle de alternância binária com efeito imediato. Liga/desliga uma
 * configuração sem necessidade de confirmação — para formulários com botão
 * salvar, use `Check` em vez deste.
 *
 * @example
 * <Switch label="Notificações por e-mail" defaultChecked />
 * <Switch label="Modo escuro" checked={ativo} onCheckedChange={setAtivo} />
 */
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, defaultChecked = false, onCheckedChange, icon = true, label, disabled = false, id, className = '' }, ref) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked)
    const isChecked = checked ?? internalChecked
    const generatedId = useId()
    const switchId = id ?? generatedId

    const toggle = () => {
      const next = !isChecked
      if (checked === undefined) setInternalChecked(next)
      onCheckedChange?.(next)
    }

    return (
      <span className={['switch-wrapper', className].filter(Boolean).join(' ')}>
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={isChecked}
          id={switchId}
          className={['switch', isChecked ? 'switch--checked' : ''].filter(Boolean).join(' ')}
          disabled={disabled}
          onClick={toggle}
        >
          <span className="switch__thumb">{icon && (isChecked ? <ConfirmarIcon /> : <FecharIcon />)}</span>
        </button>
        {label && (
          <label className="switch__label" htmlFor={switchId}>
            {label}
          </label>
        )}
      </span>
    )
  }
)

Switch.displayName = 'Switch'
