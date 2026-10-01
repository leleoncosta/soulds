import React from 'react'
import './Pagination.css'
import { Dots } from '../dots/Dots'

export interface PaginationProps {
  /** Página atual (1-indexed) */
  page: number
  /** Total de páginas */
  totalPages: number
  /** Disparado ao navegar para outra página */
  onPageChange: (page: number) => void
  /** Rótulo do botão anterior */
  anterior?: string
  /** Rótulo do botão próximo */
  proximo?: string
  /** Exibe o rótulo de texto no botão anterior (o botão em si nunca é ocultado) */
  textoEsquerdo?: boolean
  /** Exibe o rótulo de texto no botão próximo (o botão em si nunca é ocultado) */
  textoDireito?: boolean
  /** Classe CSS adicional */
  className?: string
}

/**
 * Componente Pagination da Soul DS
 *
 * Navegação entre páginas de uma listagem ou tabela, usando o indicador de
 * pontos (`Dots`) para até 10 páginas. Acima disso, prefira paginação
 * numérica (ainda não modelada neste design system).
 *
 * @example
 * <Pagination page={page} totalPages={5} onPageChange={setPage} anterior="Anterior" proximo="Próximo" />
 */
export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      page,
      totalPages,
      onPageChange,
      anterior = 'Anterior',
      proximo = 'Próximo',
      textoEsquerdo = true,
      textoDireito = true,
      className = '',
    },
    ref
  ) => {
    const isFirstPage = page <= 1
    const isLastPage = page >= totalPages

    const finalClassName = ['pagination', className].filter(Boolean).join(' ')

    return (
      <nav ref={ref} className={finalClassName} aria-label="Paginação">
        <button
          type="button"
          className="pagination__link"
          disabled={isFirstPage}
          onClick={() => onPageChange(page - 1)}
          aria-label={textoEsquerdo ? undefined : anterior}
        >
          {textoEsquerdo ? anterior : null}
        </button>

        <div className="pagination__dots">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Dots
              key={p}
              state={p === page ? 'active' : 'default'}
              aria-label={`Página ${p}`}
              aria-current={p === page ? 'true' : undefined}
              onClick={() => onPageChange(p)}
            />
          ))}
        </div>

        <button
          type="button"
          className="pagination__link"
          disabled={isLastPage}
          onClick={() => onPageChange(page + 1)}
          aria-label={textoDireito ? undefined : proximo}
        >
          {textoDireito ? proximo : null}
        </button>
      </nav>
    )
  }
)

Pagination.displayName = 'Pagination'
