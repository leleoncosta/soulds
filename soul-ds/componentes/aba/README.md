# Aba — Soul DS

Item individual de navegação por abas. Sempre utilizado dentro de um grupo de abas.

## 📋 Variantes e Estados

O componente Aba não tem variantes — apenas 2 estados:

- **default** — Aba inativa
- **active** — Aba selecionada (sublinhado com `--color-primary`)

## 📖 Uso

```tsx
import { Aba } from '@/componentes/aba'

// Grupo de abas (role="tablist" no container)
<div role="tablist">
  <Aba label="Aba 01" state="active" />
  <Aba label="Aba 02" />
  <Aba label="Aba 03" />
</div>
```

## 🎨 Props

### `label?: string`

Texto/rótulo da aba.

- Tipo: `string`
- Padrão: `undefined`

### `state?: AbaState`

Define o estado visual da aba (css-driven).

- Tipo: `'default' | 'active'`
- Padrão: `'default'`

### `className?: string`

Classes CSS adicionais (para customizações).

- Tipo: `string`
- Padrão: `''`

## ♿ Acessibilidade

- `role="tab"` em cada `Aba`, com o container envolvente usando `role="tablist"`.
- `aria-selected` setado conforme `state === 'active'`.
- `tabIndex` segue o padrão de roving tabindex: apenas a aba ativa é focável via Tab (`tabIndex=0`), as demais ficam em `-1` (navegação entre abas feita via setas pelo grupo, a implementar no componente de grupo/tablist).
- `:focus-visible` com `var(--color-ring)` em todo estado interativo.

## 🎨 Tokens e Customização

O componente usa **Design Tokens CSS** da Soul DS:

```css
/* Cores */
--color-background        /* fundo da aba */
--color-muted-foreground  /* borda inferior — estado default */
--color-primary           /* borda inferior — estado active */
--color-foreground        /* cor do texto */
--color-ring              /* outline de foco */

/* Espaçamento */
--spacing-14
--spacing-16

/* Tipografia */
--font-family-base
--font-size-sm
--font-weight-regular
--line-height-normal
```

## 📝 Regras (copiadas de `components.json`)

**must:**
- A aba ativa deve sempre estar visível e não rolável fora da viewport.

**mustNot:**
- Usar uma aba isolada — sempre agrupar duas ou mais.
- Mais de 7 abas — acima disso, usar dropdown ou menu lateral.

## 🚨 Pendências conhecidas

- Sem estado de foco documentado no Figma — implementado via `:focus-visible` seguindo a convenção do DS.
- Sem estado de hover documentado no Figma — implementado via `filter: brightness()` seguindo a convenção já usada em `Button.css`, sem inventar token novo.
- Componente de grupo (`AbaGroup`/`Tablist`) com navegação por setas (roving tabindex completo) ainda não existe — esta implementação cobre apenas o item individual, conforme escopo do contrato.

## 📝 Referências

- [Componentes.json](../../data/components.json) — Contrato e status
- [SKILL.md](../../SKILL.md) — Design System documentation
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) — Padrões acessibilidade
