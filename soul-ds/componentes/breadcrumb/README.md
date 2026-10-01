# Breadcrumb — Soul DS

Item de trilha de navegação hierárquica. Indica a posição do usuário dentro da estrutura do produto.

## 📋 Estados

O componente Breadcrumb não tem variantes — apenas 2 estados:

- **default** — Página pai, clicável.
- **active** — Página atual. Último item da trilha, **não clicável**.

## 📖 Uso

```tsx
import { Breadcrumb } from '@/componentes/breadcrumb'

<nav aria-label="breadcrumb">
  <ol style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
    <Breadcrumb nomePagina="Início" href="/" />
    <Breadcrumb nomePagina="Pacientes" href="/pacientes" />
    <Breadcrumb nomePagina="Ficha do paciente" state="active" separador={false} />
  </ol>
</nav>
```

## 🎨 Props

### `state?: BreadcrumbState`

Define o estado visual do item.

- Tipo: `'default' | 'active'`
- Padrão: `'default'`

### `nomePagina?: string`

Nome da página exibido no item.

- Tipo: `string`
- Padrão: `undefined`

### `separador?: boolean`

Exibe a seta separadora à direita do texto. Oculte no último item ao compor a trilha manualmente
(veja o exemplo acima, onde o item `active` passa `separador={false}`).

- Tipo: `boolean`
- Padrão: `true`

### `href?: string`

URL do link. Ignorado quando `state="active"`. Sem `href`, o item renderiza um `<button>`
acessível (para navegação via `onClick`/router em vez de link direto).

- Tipo: `string`
- Padrão: `undefined`

### `onClick?: (e) => void`

Callback de clique. Ignorado quando `state="active"`.

- Tipo: `function`
- Padrão: `undefined`

### `className?: string`

Classes CSS adicionais (para customizações).

- Tipo: `string`
- Padrão: `''`

## ♿ Acessibilidade

- Envolver sempre em `<nav aria-label="breadcrumb"><ol>...</ol></nav>` — o componente renderiza
  um `<li>`, cabe ao consumidor prover o `nav`/`ol` ao redor (ver exemplo de uso).
- O item `active` usa `aria-current="page"` em vez de link, sinalizando a página atual para
  tecnologia assistiva.
- Item `default` sem `href` renderiza `<button>` em vez de esconder a interatividade —
  nunca um `<span onClick>`.
- `:focus-visible` com `var(--color-ring)` em todo item clicável.
- Seta separadora é puramente decorativa (`aria-hidden="true"`, `focusable="false"`).

## 🎨 Tokens e Customização

O componente usa **Design Tokens CSS** da Soul DS:

```css
/* Cores */
--color-primary   /* texto e seta — mesma cor em ambos os estados */
--color-ring      /* outline de foco */

/* Espaçamento */
--spacing-8
--spacing-12

/* Tipografia */
--font-family-base
--font-size-sm
--font-weight-regular    /* state=default */
--font-weight-semibold   /* state=active */
--line-height-normal
```

A seta (`mv-basico/setas/seta_direita_simples`) foi resolvida via
`node soul-ds/scripts/find-icon.mjs "seta_direita_simples"` — não foi desenhada à mão.

## 📝 Regras (copiadas de `components.json`)

**must:**
- Último item da trilha sempre com state=active, não clicável.

**mustNot:**
- Exibir breadcrumb em telas de nível 1 (home/dashboard).

## 🚨 Pendências conhecidas

- Comportamento mobile ("exibir apenas o item pai imediato com seta de voltar", citado nas
  diretrizes do Figma) não está modelado neste componente — ele renderiza o item individual;
  a lógica de colapso em mobile fica a cargo do componente de grupo/trilha que ainda não existe.

## 📝 Referências

- [Componentes.json](../../data/components.json) — Contrato e status
- [SKILL.md](../../SKILL.md) — Design System documentation
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) — Padrões acessibilidade
