import React from 'react'
import './Breadcrumb.css'

export type BreadcrumbState = 'default' | 'active'

export interface BreadcrumbProps {
  /** Estado visual do item. 'active' é a página atual — não clicável */
  state?: BreadcrumbState
  /** Nome da página exibido no item */
  nomePagina?: string
  /** Exibe a seta separadora à direita do texto. Oculte no último item ao compor a trilha manualmente */
  separador?: boolean
  /** href do link (ignorado quando state="active"). Sem href, renderiza um botão acessível */
  href?: string
  /** Callback de clique (ignorado quando state="active") */
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void
  /** Classe CSS adicional */
  className?: string
}

/**
 * Componente Breadcrumb da Soul DS
 *
 * Item de trilha de navegação hierárquica. Indica a posição do usuário dentro da estrutura do produto.
 * Sempre utilizado dentro de um <nav aria-label="breadcrumb"><ol>.
 *
 * @example
 * <nav aria-label="breadcrumb">
 *   <ol style={{ display: 'flex', listStyle: 'none' }}>
 *     <Breadcrumb nomePagina="Início" href="/" />
 *     <Breadcrumb nomePagina="Pacientes" href="/pacientes" />
 *     <Breadcrumb nomePagina="Ficha" state="active" separador={false} />
 *   </ol>
 * </nav>
 */
export const Breadcrumb = React.forwardRef<HTMLLIElement, BreadcrumbProps>(
  ({ state = 'default', nomePagina, separador = true, href, onClick, className = '' }, ref) => {
    const baseClasses = 'breadcrumb'
    const stateClasses = state !== 'default' ? `breadcrumb--${state}` : ''
    const finalClassName = [baseClasses, stateClasses, className].filter(Boolean).join(' ')

    return (
      <li ref={ref} className={finalClassName}>
        {state === 'active' ? (
          <span className="breadcrumb__label" aria-current="page">
            {nomePagina}
          </span>
        ) : href ? (
          <a className="breadcrumb__label" href={href} onClick={onClick}>
            {nomePagina}
          </a>
        ) : (
          <button type="button" className="breadcrumb__label breadcrumb__label--button" onClick={onClick}>
            {nomePagina}
          </button>
        )}
        {separador && (
          // ícone resolvido via find-icon.mjs "seta_direita_simples" → mv-basico/setas/seta_direita_simples
          <svg
            className="breadcrumb__separador"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6.94006 2L5.06006 3.88L11.1667 10L5.06006 16.12L6.94006 18L14.9401 10L6.94006 2Z" fill="currentColor" />
          </svg>
        )}
      </li>
    )
  }
)

Breadcrumb.displayName = 'Breadcrumb'
