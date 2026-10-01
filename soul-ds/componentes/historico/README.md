# Historico — Soul DS

Linha de histórico ou timeline de eventos. Exibe registros ordenados cronologicamente.

## 📋 Variantes

- **top** — Primeiro item ou item intermediário. Título + até 2 ícones de ação à direita.
- **base** — Último item da lista. **Sempre finalize a timeline com esta variante** (regra `must`).
  Ícone à esquerda + título/descrição empilhados à direita.

## 📖 Uso

```tsx
import { Historico } from '@/componentes/historico'

<div>
  <Historico variant="top" label="Consulta registrada" />
  <Historico variant="top" label="Exame solicitado" />
  <Historico variant="base" labelBase="Cadastro criado" textoBase="por Ana Beatriz em 02/04/2026" />
</div>

// Ícones de ação com comportamento (editar/ver histórico)
<Historico
  variant="top"
  label="Prescrição atualizada"
  onIcon1Click={handleEditar}
  onIcon2Click={handleVerHistorico}
/>

// Sem ícones de ação
<Historico variant="top" label="Consulta registrada" mostrarIcon1={false} mostrarIcon2={false} />
```

## 🎨 Props

### `variant?: HistoricoVariant`

- Tipo: `'top' | 'base'`
- Padrão: `'top'`

### Props de `variant="top"`

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `label` | `string` | `'Título'` | Título do item (até 40 caracteres) |
| `icon1` / `icon2` | `ReactNode` | ícones padrão (`tipo`/`historico`) | Ícones de ação |
| `mostrarIcon1` / `mostrarIcon2` | `boolean` | `true` | Exibe o respectivo ícone |
| `onIcon1Click` / `onIcon2Click` | `() => void` | `undefined` | Sem callback, o ícone é decorativo |

### Props de `variant="base"`

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `labelBase` | `string` | `'Título'` | Título do item final |
| `textoBase` | `string` | `'Descrição'` | Detalhes complementares |
| `iconBase` | `ReactNode` | ícone padrão (`historico_usuario`) | Ícone do item final |
| `mostrarIconBase` | `boolean` | `true` | Exibe o ícone |

### `className?: string`

Classes CSS adicionais.

## ♿ Acessibilidade

- Ícones de ação (`icon1`/`icon2`) sem `onClick` são decorativos (`aria-hidden`); com `onClick`
  viram `<button aria-label="…">` reais.
- `:focus-visible` com `var(--color-ring)` em todo ícone interativo.
- Hierarquia de texto usa elementos semânticos (`<p>`), sem heading — o componente é uma linha de
  lista, não um título de seção; se usado dentro de uma região nomeada, envolva a lista em
  `<ol>`/`<ul>` ou `<section aria-label="Histórico">` conforme o contexto de uso.

## 🎨 Tokens e Customização

```css
--color-background          /* fundo de cada linha */
--color-muted-foreground    /* borda inferior */
--color-foreground           /* texto */
--color-primary               /* cor dos ícones */
--color-ring                   /* outline de foco */
--border-width-1
--spacing-8 / -16 / -20
--font-size-sm
--font-weight-semibold / -regular
```

Os ícones padrão (`mv-basico/micelanea/tipo`, `mv-basico/sistema/historico`,
`mv-basico/gestao/historico_usuario`) foram resolvidos via `find-icon.mjs` — não desenhados à mão.

## 📝 Regras (copiadas de `components.json`)

**must:**
- Sempre finalizar a lista com variant=base.
- Label curto — até 40 caracteres; detalhes vão em Texto base.

**mustNot:** (nenhuma registrada no contrato)

## 🚨 Pendências conhecidas

- O Figma descreve `variant=top` como tendo "linha conectora" entre itens, mas o node inspecionado
  não modela visualmente essa linha (ambos `top` e `base` têm a mesma borda inferior simples) —
  implementado fielmente ao que o Figma mostra, sem inventar um conector que não está desenhado.
- Sem componente de grupo (`HistoricoLista`/timeline) que force a regra "sempre terminar com
  base" automaticamente — fica a cargo do consumidor montar a lista manualmente (ver exemplo
  "Timeline" no Storybook).

## 📝 Referências

- [Componentes.json](../../data/components.json) — Contrato e status
- [SKILL.md](../../SKILL.md) — Design System documentation
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) — Padrões acessibilidade
