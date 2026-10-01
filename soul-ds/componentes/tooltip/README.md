# Tooltip — Soul DS

Texto de apoio contextual exibido ao passar o mouse ou focar um elemento.

## 📋 Posições de seta

12 posições (4 bordas × 3 alinhamentos), nomeadas como no Figma:

| Borda da seta | Esquerda/topo | Centro | Direita/base |
|---|---|---|---|
| inferior (balão acima do alvo) | `bottom-left` | `bottom` | `bottom-right` |
| superior (balão abaixo do alvo) | `top-left` | `top` | `top-right` |
| direita (balão à esquerda do alvo) | `right-top` | `right` | `right-bottom` |
| esquerda (balão à direita do alvo) | `left-top` | `left` | `left-bottom` |

## 📖 Uso

```tsx
import { Tooltip } from '@/componentes/tooltip'

<Tooltip texto="Exportar como PDF" arrowPosition="top">
  <button aria-label="Exportar">⬇</button>
</Tooltip>
```

O `children` é o elemento que dispara o tooltip (hover ou foco) — o componente clona esse
elemento para injetar `aria-describedby` e os handlers necessários, sem exigir nenhuma mudança no
elemento em si.

## 🎨 Props

### `texto: string`

Texto de apoio exibido no tooltip. Mantenha curto, idealmente uma linha (regra `must`).

### `arrowPosition?: TooltipArrowPosition`

- Tipo: ver tabela de posições acima
- Padrão: `'top'`

### `children: ReactElement`

Elemento disparador. Deve ser um único elemento React válido (ex: `<button>`, `<span>`, ícone).

### `className?: string`

Classe CSS adicional no balão do tooltip.

## ♿ Acessibilidade

Implementa os três requisitos de WCAG 1.4.13 (Content on Hover or Focus):

- **Dispensável** — pressionar `Escape` fecha o tooltip mesmo com o disparador ainda focado.
- **Hoverable** — mover o mouse do disparador para dentro do próprio balão não o fecha (o balão
  também escuta `onMouseEnter`/`onMouseLeave`).
- **Persistente** — o tooltip só desaparece ao perder hover/foco ou via Escape, nunca sozinho por
  timeout.

Além disso:
- `role="tooltip"` no balão, `aria-describedby` no disparador apontando para o `id` gerado
  (`useId`) — só quando visível.
- Aparece tanto em `onMouseEnter` quanto em `onFocus` — funciona via teclado, não só mouse/hover
  (regra `mustNot`: nem todo input aciona hover).
- A seta é `aria-hidden="true"` (puramente decorativa).

## 🎨 Tokens e Customização

```css
--color-foreground   /* fundo do balão — ver nota abaixo */
--color-background   /* texto do balão — ver nota abaixo */
--spacing-4
--spacing-8
--spacing-12           /* offset da seta nos alinhamentos start/end */
--radius-4
--font-size-xs
--font-weight-regular
```

> **Por que `--color-foreground`/`--color-background` invertidos, e não `--color-popover`?**
> `--color-popover` no tema claro resolve para **branco** (pensado para painéis que seguem a
> superfície normal da página, ex. dropdowns) — usá-lo faria o tooltip desaparecer contra um
> fundo claro. O Figma mostra uma bolha sempre escura com texto claro, contrastando com
> qualquer fundo. Como o DS não tem um token "inverse"/tooltip dedicado, invertemos
> `--color-foreground` (texto normal da página) como fundo e `--color-background` (fundo normal
> da página) como texto — truque padrão de "superfície inversa" usado por outros design systems
> quando falta um token dedicado. No tema claro isso dá exatamente fundo `neutral-800` (#333) +
> texto `neutral-50` (quase branco), batendo com o Figma.

A seta é um triângulo via CSS border-trick preenchido com `var(--color-foreground)` (mesmo tom do
fundo do balão) — não é um asset SVG importado (o Figma usa uma imagem, mas o triângulo é simples
o bastante para não justificar gerenciar 12 arquivos SVG).

## 📝 Regras (copiadas de `components.json`)

**must:**
- Manter o texto curto, idealmente uma linha.

**mustNot:**
- Usar para conteúdo essencial à tarefa — nem todo input (touch/teclado) aciona hover.

## 🚨 Pendências conhecidas

- **O `nodeId` documentado em `components.json` (`581:90`) não existe mais no Figma** — retorna
  erro "invalid node selection" via MCP. Esta implementação foi feita a partir do node atual
  (`817:3179`, frame com as 12 variantes de `arrowPosition`), que é mais completo que o contrato
  anterior (só descrevia a prop `texto`). O `nodeId` no contrato foi atualizado para refletir isso.
- Sem suporte a posicionamento automático (flip quando o tooltip estouraria a viewport) — a
  posição é sempre a definida em `arrowPosition`, sem ajuste dinâmico tipo Floating UI/Popper.

## 📝 Referências

- [Componentes.json](../../data/components.json) — Contrato e status
- [SKILL.md](../../SKILL.md) — Design System documentation
- [WCAG 1.4.13](https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html) — Content on Hover or Focus
