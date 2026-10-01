# Dots — Soul DS

Indicador de paginação por pontos. Representa a posição atual em um conjunto de páginas ou slides.

## 📋 Estados

- **default** — Página inativa.
- **active** — Página atual.

## 📖 Uso

```tsx
import { Dots } from '@/componentes/dots'

<div style={{ display: 'flex', gap: 12 }}>
  <Dots aria-label="Página 1" onClick={() => goTo(1)} />
  <Dots state="active" aria-label="Página 2" aria-current="true" />
  <Dots aria-label="Página 3" onClick={() => goTo(3)} />
</div>
```

Normalmente consumido via o slot `dots` do componente [`Pagination`](../pagination/README.md), não
isolado.

## 🎨 Props

### `state?: DotsState`

- Tipo: `'default' | 'active'`
- Padrão: `'default'`

### `className?: string`

Classes CSS adicionais.

Demais props são repassadas para o `<button>` nativo (`onClick`, `aria-label`, etc.).

## ♿ Acessibilidade

- Renderiza um `<button type="button">` real — clicável e focável.
- O consumidor deve fornecer `aria-label` descritivo (ex: "Página 2") e `aria-current="true"` no
  dot ativo — o componente não assume texto algum sozinho.
- `:focus-visible` com `var(--color-ring)`.

## 🎨 Tokens e Customização

```css
--color-muted-foreground   /* fundo default */
--color-primary             /* fundo active */
--color-ring                 /* outline de foco */
--radius-full
```

## 📝 Regras (copiadas de `components.json`)

**must:**
- Usar em carrosséis, wizards e paginações com até 10 itens.

**mustNot:**
- Usar acima de 10 páginas — preferir paginação numérica (componente pagination).

## 🚨 Pendências conhecidas

- Nenhuma — componente simples, visual 1:1 com o Figma (círculo preenchido, só muda a cor).

## 📝 Referências

- [Componentes.json](../../data/components.json) — Contrato e status
- [Pagination](../pagination/README.md) — Componente que consome `Dots` via slot
- [SKILL.md](../../SKILL.md) — Design System documentation
