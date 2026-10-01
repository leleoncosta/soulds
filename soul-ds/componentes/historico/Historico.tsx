import React from 'react'
import './Historico.css'

export type HistoricoVariant = 'top' | 'base'

export interface HistoricoProps {
  /** 'top' = primeiro/item intermediário; 'base' = último item, sempre deve fechar a lista */
  variant?: HistoricoVariant

  // variant="top"
  /** Título do item (até 40 caracteres) */
  label?: string
  /** Ícone de ação 1 (padrão: ícone "tipo") */
  icon1?: React.ReactNode
  /** Ícone de ação 2 (padrão: ícone "historico") */
  icon2?: React.ReactNode
  /** Exibe o ícone de ação 1 */
  mostrarIcon1?: boolean
  /** Exibe o ícone de ação 2 */
  mostrarIcon2?: boolean
  /** Callback do ícone 1. Sem ele, o ícone é decorativo */
  onIcon1Click?: () => void
  /** Callback do ícone 2. Sem ele, o ícone é decorativo */
  onIcon2Click?: () => void

  // variant="base"
  /** Título do item final (até 40 caracteres) */
  labelBase?: string
  /** Detalhes complementares do item final */
  textoBase?: string
  /** Ícone do item final (padrão: ícone "historico_usuario") */
  iconBase?: React.ReactNode
  /** Exibe o ícone do item final */
  mostrarIconBase?: boolean

  /** Classe CSS adicional */
  className?: string
}

function TipoIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 15.8947H7.05263V8.31575H2V15.8947ZM7.89474 15.8947H18V8.31575H7.89474V15.8947ZM2 4.10522V7.47365H18V4.10522H2Z" fill="currentColor" />
    </svg>
  )
}

function HistoricoIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.1429 3.14282C7.33333 3.14282 4.28571 6.19044 4.28571 9.99997H2L4.97143 12.9714L5.04762 13.0476L8.09524 9.99997H5.80952C5.80952 7.02854 8.17143 4.66663 11.1429 4.66663C14.1143 4.66663 16.4762 7.02854 16.4762 9.99997C16.4762 12.9714 14.1143 15.3333 11.1429 15.3333C9.69524 15.3333 8.32381 14.7238 7.40952 13.7333L6.34286 14.8C7.5619 16.0952 9.2381 16.8571 11.1429 16.8571C14.9524 16.8571 18 13.8095 18 9.99997C18 6.19044 14.9524 3.14282 11.1429 3.14282ZM10.381 6.95235V10.7619L13.6571 12.6666L14.1905 11.7523L11.5238 10.1523V6.95235H10.381Z"
        fill="currentColor"
      />
    </svg>
  )
}

function HistoricoUsuarioIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.599 14.3285C15.5266 14.3285 16.2995 13.5555 16.2995 12.628C16.2995 11.7005 15.5266 10.9275 14.599 10.9275C13.6715 10.9275 12.8986 11.7005 12.8986 12.628C12.8986 13.5555 13.6715 14.3285 14.599 14.3285ZM14.599 15.1787C13.4396 15.1787 11.1981 15.7198 11.1981 16.8792V17.7294H18V16.8792C18 15.7198 15.7585 15.1787 14.599 15.1787ZM11.2754 13.2464L12.3575 14.2512C11.6618 14.4831 10.9662 14.6377 10.2705 14.6377C8.49275 14.6377 6.94686 13.942 5.94203 12.7826L6.86957 11.855C7.71981 12.7826 8.95652 13.3236 10.2705 13.3236C10.5797 13.3236 10.9662 13.3236 11.2754 13.2464ZM10.657 8.60867L13.1304 10.0773L12.5894 10.9275L9.57488 9.14973V5.67147H10.657V8.60867ZM15.0628 8.29949C14.9855 5.67147 12.8213 3.58452 10.1932 3.58452C7.48792 3.58452 5.40097 5.74877 5.40097 8.45408H7.48792L4.70531 11.2367V11.1594L2 8.45408H4.08696C4.08696 5.05312 6.86957 2.27051 10.2705 2.27051C13.5942 2.27051 16.3768 4.97582 16.4541 8.29949H15.0628Z"
        fill="currentColor"
      />
    </svg>
  )
}

interface IconSlotProps {
  icon: React.ReactNode
  show: boolean
  onClick?: () => void
  label?: string
}

function IconSlot({ icon, show, onClick, label }: IconSlotProps) {
  if (!show) return null

  if (onClick) {
    return (
      <button type="button" className="historico__icone historico__icone--acao" onClick={onClick} aria-label={label}>
        {icon}
      </button>
    )
  }

  return (
    <span className="historico__icone" aria-hidden="true">
      {icon}
    </span>
  )
}

/**
 * Componente Historico da Soul DS
 *
 * Linha de histórico ou timeline de eventos. Exibe registros ordenados
 * cronologicamente. Sempre finalize a lista com `variant="base"` (regra do
 * contrato).
 *
 * @example
 * <Historico variant="top" label="Consulta registrada" />
 * <Historico variant="base" labelBase="Cadastro criado" textoBase="por Ana Beatriz em 02/04/2026" />
 */
export const Historico = React.forwardRef<HTMLDivElement, HistoricoProps>(
  (
    {
      variant = 'top',
      label = 'Título',
      icon1,
      icon2,
      mostrarIcon1 = true,
      mostrarIcon2 = true,
      onIcon1Click,
      onIcon2Click,
      labelBase = 'Título',
      textoBase = 'Descrição',
      iconBase,
      mostrarIconBase = true,
      className = '',
    },
    ref
  ) => {
    const finalClassName = ['historico', `historico--${variant}`, className].filter(Boolean).join(' ')

    if (variant === 'base') {
      return (
        <div ref={ref} className={finalClassName}>
          <IconSlot icon={iconBase ?? <HistoricoUsuarioIcon />} show={mostrarIconBase} />
          <div className="historico__textos">
            <p className="historico__label-base">{labelBase}</p>
            <p className="historico__texto-base">{textoBase}</p>
          </div>
        </div>
      )
    }

    return (
      <div ref={ref} className={finalClassName}>
        <p className="historico__label">{label}</p>
        <div className="historico__icones">
          <IconSlot icon={icon1 ?? <TipoIcon />} show={mostrarIcon1} onClick={onIcon1Click} label="Ação 1" />
          <IconSlot icon={icon2 ?? <HistoricoIcon />} show={mostrarIcon2} onClick={onIcon2Click} label="Ação 2" />
        </div>
      </div>
    )
  }
)

Historico.displayName = 'Historico'
