# Chips — Soul DS

Marcador compacto de categoria, status ou filtro ativo. Comunicam atributos de forma visual.

## 📋 Variantes

O componente Chips suporta 5 variantes:

- **default** — Categorias sem conotação semântica (fundo neutro, borda).
- **success** — Status positivo (ex: aprovado, ativo).
- **warning** — Status de atenção (ex: pendente).
- **info** — Status informativo (ex: em análise).
- **danger** — Status negativo (ex: cancelado, erro).

## 📖 Uso

```tsx
import { Chips } from '@/componentes/chips'

// Categoria neutra
<Chips variant="default" texto="VIP" />

// Status
<Chips variant="success" texto="Aprovado" />
<Chips variant="warning" texto="Pendente" />
<Chips variant="info" texto="Em análise" />
<Chips variant="danger" texto="Cancelado" />

// Com ícones de fechar (decorativos por padrão)
<Chips variant="success" texto="Ativo" iconLeft iconRight />

// Removível (ícone vira botão acessível quando há callback)
<Chips variant="info" texto="Filtro: Ativo" iconRight onIconRightClick={handleRemove} />

// Grupo (máx. 3 por célula de tabela — regra do contrato)
<div style={{ display: 'flex', gap: 4 }}>
  <Chips variant="success" texto="Ativo" />
  <Chips variant="default" texto="VIP" />
  <Chips variant="warning" texto="Revisão" />
</div>
```

## 🎨 Props

### `variant?: ChipsVariant`

- Tipo: `'default' | 'success' | 'warning' | 'info' | 'danger'`
- Padrão: `'default'`

### `texto?: string`

Texto exibido no chip.

### `iconLeft?: boolean` / `iconRight?: boolean`

Exibe o ícone de fechar (✕) à esquerda/direita do texto.

- Tipo: `boolean`
- Padrão: `false`

### `onIconLeftClick?` / `onIconRightClick?: (e) => void`

Callback ao clicar no respectivo ícone. **Sem um callback, o ícone é puramente decorativo**
(`aria-hidden`) — passe um callback para torná-lo um botão acessível de remoção.

### `className?: string`

Classes CSS adicionais.

## ♿ Acessibilidade

- A cor nunca é o único diferenciador — o texto (`texto`) sempre acompanha a cor de variante
  (regra `a11y.nota` do contrato).
- Ícone de fechar sem `onClick` é decorativo (`aria-hidden="true"`) — nunca um elemento clicável
  sem rótulo.
- Ícone de fechar com `onClick` vira `<button aria-label="Remover">` real, nunca um `<span
  onClick>`.
- `:focus-visible` com `var(--color-ring)` no ícone interativo.

## 🎨 Tokens e Customização

```css
--color-background            /* fundo variant=default */
--color-foreground            /* borda e texto variant=default */
--color-success / -foreground
--color-warning / -foreground
--color-info / -foreground
--color-destructive / -foreground   /* variant=danger */
--color-ring                   /* outline de foco */
--spacing-2
--spacing-4
--radius-2
--font-size-sm
--font-weight-regular    /* variant=default */
--font-weight-semibold   /* demais variantes */
```

O ícone de fechar (`mv-basico/acao/fechar`) foi resolvido via
`node soul-ds/scripts/find-icon.mjs "fechar"` — não foi desenhado à mão.

## 📝 Regras (copiadas de `components.json`)

**must:**
- success/warning/danger para comunicar status de registros ou alertas.

**mustNot:**
- Mais de 3 chips por célula de tabela — acima disso, usar ícone com tooltip.

## 🚨 Pendências conhecidas

- O Figma nomeia os dois ícones como `icon left`/`icon right`, ambos renderizando o mesmo ícone
  de fechar (✕) — o contrato não define uma ação de remoção explícita; esta implementação
  adiciona `onIconLeftClick`/`onIconRightClick` opcionais para cobrir o caso de uso óbvio (chip
  removível/filtro ativo) sem forçar interatividade onde o Figma só define visual.

## 📝 Referências

- [Componentes.json](../../data/components.json) — Contrato e status
- [SKILL.md](../../SKILL.md) — Design System documentation
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) — Padrões acessibilidade
