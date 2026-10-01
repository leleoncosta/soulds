import React, { useMemo, useState } from 'react'
import './Calendario.css'
import { Digito } from '../digito/Digito'

export type CalendarioView = 'day' | 'month' | 'year'

export interface CalendarioProps {
  /** Data selecionada (modo controlado) */
  value?: Date
  /** Data selecionada inicial (modo não controlado) */
  defaultValue?: Date
  /** Disparado quando uma data é selecionada em view="day" */
  onChange?: (date: Date) => void
  /** Data mínima selecionável — datas anteriores ficam state=disabled */
  minDate?: Date
  /** Data máxima selecionável — datas posteriores ficam state=disabled */
  maxDate?: Date
  /** View inicial. Regra do contrato: sempre iniciar em "day" para seleção de data única */
  view?: CalendarioView
  /** Classe CSS adicional */
  className?: string
}

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const MONTHS_LONG = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

interface DayCell {
  date: Date
  inMonth: boolean
}

function isSameDay(a?: Date, b?: Date) {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function buildDayGrid(viewDate: Date): DayCell[][] {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const startWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells: DayCell[] = []

  for (let i = startWeekday - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, daysInPrevMonth - i), inMonth: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true })
  }
  let nextDay = 1
  while (cells.length < 42) {
    cells.push({ date: new Date(year, month + 1, nextDay), inMonth: false })
    nextDay += 1
  }

  const weeks: DayCell[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

/**
 * Componente Calendario da Soul DS
 *
 * Seletor de data com navegação entre visualizações de dia, mês e ano.
 * Composto internamente pelo sub-componente `Digito` — não reimplemente a
 * grade manualmente.
 *
 * @example
 * <Calendario value={data} onChange={setData} minDate={new Date()} />
 */
export const Calendario = React.forwardRef<HTMLDivElement, CalendarioProps>(
  ({ value, defaultValue, onChange, minDate, maxDate, view: viewProp, className = '' }, ref) => {
    const [view, setView] = useState<CalendarioView>(viewProp ?? 'day')
    const [internalSelected, setInternalSelected] = useState<Date | undefined>(defaultValue)
    const [viewingDate, setViewingDate] = useState<Date>(value ?? defaultValue ?? new Date())

    const selected = value ?? internalSelected

    const isDisabledDate = (date: Date) => {
      const d = startOfDay(date)
      if (minDate && d.getTime() < startOfDay(minDate).getTime()) return true
      if (maxDate && d.getTime() > startOfDay(maxDate).getTime()) return true
      return false
    }

    const handleSelectDay = (date: Date, inMonth: boolean) => {
      if (!inMonth || isDisabledDate(date)) return
      if (value === undefined) setInternalSelected(date)
      onChange?.(date)
    }

    const goPrev = () => {
      setViewingDate((d) => {
        if (view === 'day') return new Date(d.getFullYear(), d.getMonth() - 1, 1)
        if (view === 'month') return new Date(d.getFullYear() - 1, d.getMonth(), 1)
        return new Date(d.getFullYear() - 12, d.getMonth(), 1)
      })
    }

    const goNext = () => {
      setViewingDate((d) => {
        if (view === 'day') return new Date(d.getFullYear(), d.getMonth() + 1, 1)
        if (view === 'month') return new Date(d.getFullYear() + 1, d.getMonth(), 1)
        return new Date(d.getFullYear() + 12, d.getMonth(), 1)
      })
    }

    const weeks = useMemo(() => buildDayGrid(viewingDate), [viewingDate])

    const yearRangeStart = useMemo(() => Math.floor(viewingDate.getFullYear() / 12) * 12, [viewingDate])
    const years = useMemo(() => Array.from({ length: 12 }, (_, i) => yearRangeStart + i), [yearRangeStart])

    const title =
      view === 'day'
        ? `${MONTHS_LONG[viewingDate.getMonth()]} de ${viewingDate.getFullYear()}`
        : view === 'month'
          ? `${viewingDate.getFullYear()}`
          : `${years[0]} - ${years[years.length - 1]}`

    const navAriaLabel = view === 'day' ? 'mês' : view === 'month' ? 'ano' : 'intervalo de anos'

    return (
      <div ref={ref} className={['calendario', className].filter(Boolean).join(' ')}>
        <div className="calendario__header">
          <button type="button" className="calendario__nav" onClick={goPrev} aria-label={`${navAriaLabel} anterior`}>
            {/* ícone resolvido via find-icon.mjs "seta_esquerda_simples" → mv-basico/setas/seta_esquerda_simples */}
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.9333 3.86667L13.0666 2L5.06665 10L13.0666 18L14.9333 16.1333L8.79998 10L14.9333 3.86667Z" fill="currentColor" />
            </svg>
          </button>

          <button
            type="button"
            className="calendario__title"
            onClick={() => setView((v) => (v === 'day' ? 'month' : 'year'))}
            disabled={view === 'year'}
          >
            {title}
          </button>

          <button type="button" className="calendario__nav" onClick={goNext} aria-label={`Próximo ${navAriaLabel}`}>
            {/* ícone resolvido via find-icon.mjs "seta_direita_simples" → mv-basico/setas/seta_direita_simples */}
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.94006 2L5.06006 3.88L11.1667 10L5.06006 16.12L6.94006 18L14.9401 10L6.94006 2Z" fill="currentColor" />
            </svg>
          </button>
        </div>

        {view === 'day' && (
          <div className="calendario__body">
            <div className="calendario__weekdays">
              {WEEKDAYS.map((w, i) => (
                <span key={i} className="calendario__weekday" aria-hidden="true">
                  {w}
                </span>
              ))}
            </div>
            <div role="grid" aria-label="Dias do mês">
              {weeks.map((week, wi) => (
                <div className="calendario__week" role="row" key={wi}>
                  {week.map(({ date, inMonth }) => (
                    <Digito
                      key={date.toISOString()}
                      variant="digit"
                      weight={inMonth ? 'bold' : 'normal'}
                      state={isSameDay(date, selected) ? 'active' : 'default'}
                      disabled={!inMonth || isDisabledDate(date)}
                      onClick={() => handleSelectDay(date, inMonth)}
                      aria-label={date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    >
                      {date.getDate()}
                    </Digito>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'month' && (
          <div className="calendario__grid calendario__grid--month">
            {MONTHS.map((m, i) => (
              <Digito
                key={m}
                variant="text"
                state={viewingDate.getMonth() === i ? 'active' : 'default'}
                onClick={() => {
                  setViewingDate(new Date(viewingDate.getFullYear(), i, 1))
                  setView('day')
                }}
              >
                {m}
              </Digito>
            ))}
          </div>
        )}

        {view === 'year' && (
          <div className="calendario__grid calendario__grid--year">
            {years.map((y) => (
              <Digito
                key={y}
                variant="text"
                state={viewingDate.getFullYear() === y ? 'active' : 'default'}
                onClick={() => {
                  setViewingDate(new Date(y, viewingDate.getMonth(), 1))
                  setView('month')
                }}
              >
                {y}
              </Digito>
            ))}
          </div>
        )}
      </div>
    )
  }
)

Calendario.displayName = 'Calendario'
