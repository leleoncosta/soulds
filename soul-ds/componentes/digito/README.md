# Digito — Soul DS

Célula interna do calendário. Representa um dia, mês ou ano selecionável.

> ⚠️ **Sub-componente interno.** Não use `Digito` diretamente fora do `calendario` —
> ver regra `mustNot` abaixo.

## 📋 Variantes, estados e peso

| Variante | Tamanho | Uso |
|---|---|---|
| `digit` | 20×20, circular quando `hover`/`active` | número de dia |
| `text` | 46×46, quadrado | abreviação de mês (`Jan`) ou ano (`2026`) |

| Estado | Efeito |
|---|---|
| `default` | fundo `--color-background`, texto `--color-foreground` |
| `hover` | + sombra sutil (`color-mix` sobre `--color-primary`) |
| `active` | fundo `--color-primary`, texto `--color-primary-foreground` |
| `disabled` | bloqueia interação (ver pendência abaixo) |

| Peso (`weight`, só aplica a `variant="digit"`) | Uso |
|---|---|
| `bold` | dias do mês exibido |
| `normal` | dias de preenchimento dos extremos (mês anterior/seguinte) |

## 📖 Uso

```tsx
import { Digito } from '@/componentes/digito'

<Digito variant="digit" weight="bold">12</Digito>
<Digito variant="digit" weight="bold" state="active">12</Digito>
<Digito variant="digit" weight="normal">30</Digito>
<Digito variant="digit" weight="bold" disabled>4</Digito>

<Digito variant="text">Jan</Digito>
<Digito variant="text" state="active">Abr</Digito>
```

## 🎨 Props

### `variant?: DigitoVariant`

- Tipo: `'digit' | 'text'`
- Padrão: `'digit'`

### `state?: DigitoState`

Estado visual (css-driven, ignorado se `disabled` for passado).

- Tipo: `'default' | 'hover' | 'active' | 'disabled'`
- Padrão: `'default'`

### `weight?: DigitoWeight`

Só tem efeito visual relevante em `variant="digit"`.

- Tipo: `'bold' | 'normal'`
- Padrão: `'normal'`

### `children: ReactNode`

Conteúdo da célula — número do dia ou abreviação de mês/ano.

### `disabled?: boolean`

Desabilita a célula e impede cliques.

- Tipo: `boolean`
- Padrão: `false`

### `className?: string`

Classes CSS adicionais.

## ♿ Acessibilidade

- Renderiza um `<button type="button">` real — nunca uma `<div onClick>`.
- `aria-pressed` reflete `state === 'active'` (célula selecionada).
- Desabilitação via atributo `disabled` real, nunca ocultando a célula.
- `:focus-visible` com `var(--color-ring)`.

## 🎨 Tokens e Customização

```css
--color-background          /* fundo default */
--color-foreground          /* texto default */
--color-primary              /* fundo active */
--color-primary-foreground   /* texto active */
--color-ring                  /* outline de foco */
--font-family-base
--font-size-sm
--font-weight-semibold   /* weight=bold */
--font-weight-regular    /* weight=normal */
--radius-full             /* variant=digit */
```

O brilho de `hover` é computado com `color-mix(in srgb, var(--color-primary) 40%, transparent)` —
o Figma define uma sombra colorida (`rgba(32,94,126,0.4)`) sem token semântico dedicado; em vez de
hardcodar o hex, calculamos a partir do token `--color-primary` já existente (mesma filosofia de
`filter: brightness()` usada em `Button.css`).

## 📝 Regras (copiadas de `components.json`)

**must:**
- state=disabled para datas bloqueadas por regra de negócio.

**mustNot:**
- Usar diretamente fora do calendario — é um sub-componente interno.

## 🚨 Pendências conhecidas

- **O Figma não diferencia visualmente `default` e `disabled`** (mesma cor em ambos os estados,
  nos 12 nodes inspecionados). A implementação aplica o bloqueio real de interação
  (`disabled`, `cursor: not-allowed`) sem inventar uma cor "acinzentada" que o Figma não define —
  se o design evoluir para diferenciar visualmente, atualize este componente e remova esta nota.
- `weight="bold"` só existe documentado para `variant="digit"` — `variant="text"` no Figma só tem
  a variação `weight=normal`.

## 📝 Referências

- [Componentes.json](../../data/components.json) — Contrato e status
- [SKILL.md](../../SKILL.md) — Design System documentation
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) — Padrões acessibilidade
