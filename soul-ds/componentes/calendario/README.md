# Calendario — Soul DS

Seletor de data com navegação entre visualizações de dia, mês e ano. Composto internamente pelo
sub-componente [`Digito`](../digito/README.md).

## 📋 Views

| View | Grade | Uso |
|---|---|---|
| `day` | dias do mês (com preenchimento dos extremos) | seleção de data única — **view inicial obrigatória** |
| `month` | 12 meses | seleção de mês (navegação para `day`) |
| `year` | 12 anos (intervalo deslizante) | seleção de ano (navegação para `month`) |

Clicar no título do cabeçalho avança de `day` → `month` → `year`; clicar em um mês/ano volta
para a view mais específica (`year` → `month` → `day`).

## 📖 Uso

```tsx
import { Calendario } from '@/componentes/calendario'

// Não controlado
<Calendario defaultValue={new Date()} onChange={(data) => console.log(data)} />

// Controlado
const [data, setData] = useState<Date>()
<Calendario value={data} onChange={setData} />

// Com restrição de datas (ex: não permitir datas passadas)
<Calendario minDate={new Date()} />

// Combine com o componente input para exibir a data selecionada (regra do contrato)
<Input label="Data" value={data?.toLocaleDateString('pt-BR') ?? ''} readOnly />
```

## 🎨 Props

### `view?: CalendarioView`

View inicial.

- Tipo: `'day' | 'month' | 'year'`
- Padrão: `'day'`

### `value?: Date`

Data selecionada (modo controlado).

### `defaultValue?: Date`

Data selecionada inicial (modo não controlado).

### `onChange?: (date: Date) => void`

Disparado quando uma data é selecionada em `view="day"`.

### `minDate?: Date` / `maxDate?: Date`

Limites de seleção. Dias fora do intervalo renderizam `Digito` com `state="disabled"`.

### `className?: string`

Classes CSS adicionais.

## ♿ Acessibilidade

- Grade de dias usa `role="grid"`/`role="row"` com cada dia como `<button>` (via `Digito`) com
  `aria-label` descritivo completo (ex: "2 de abril de 2026"), não apenas o número visível.
- Setas de navegação (`calendario__nav`) têm `aria-label` dinâmico ("mês anterior", "ano
  anterior", etc., conforme a view ativa).
- Dias fora do mês exibido (preenchimento dos extremos) são sempre `disabled` — não é possível
  navegar de mês clicando neles, evitando seleção acidental de data ambígua.
- `:focus-visible` com `var(--color-ring)` em toda célula e botão de navegação.

### 🚧 Pendência de navegação por teclado

O Figma não documenta navegação por setas entre dias (confirmado em `a11y.nota` do contrato).
Esta implementação cobre foco sequencial via `Tab` (ordem do DOM) e ativação via `Enter`/`Espaço`
(padrão nativo de `<button>`), mas **não implementa** roving tabindex com setas do teclado entre
dias da grade — ver pendências abaixo.

## 🎨 Tokens e Customização

```css
--color-background   /* fundo do painel */
--color-foreground    /* texto do cabeçalho e dias da semana */
--color-primary        /* sombra do painel (color-mix) e ícones de navegação no hover */
--color-ring            /* outline de foco */
--spacing-8
--spacing-12
--spacing-16
--spacing-24
--font-family-base
--font-size-base        /* título do cabeçalho */
--font-size-sm           /* dias da semana (via Digito) */
--font-weight-semibold
```

As setas de navegação (`mv-basico/setas/seta_esquerda_simples`,
`mv-basico/setas/seta_direita_simples`) foram resolvidas via `find-icon.mjs` — não desenhadas à mão.

## 📝 Regras (copiadas de `components.json`)

**must:**
- Iniciar sempre em view=day para seleção de data única.
- Combinar com o componente input para exibir a data selecionada.

**mustNot:** (nenhuma registrada no contrato)

## 🚨 Pendências conhecidas

- **Navegação por teclado com setas entre dias não implementada** (só `Tab`/`Enter`/`Espaço`
  nativos) — o Figma não modela esse comportamento; registrar como melhoria futura.
- **Fora do mês = sempre disabled.** O exemplo do Figma mostra todos os dias de preenchimento
  dos extremos como `state=disabled`; esta implementação segue essa convenção (impede navegar de
  mês clicando no dia), mas o contrato não documenta isso explicitamente como regra — é uma
  inferência a partir do exemplo visual.
- **`weight` nos dias do Figma é inconsistente no exemplo inspecionado** (a maioria dos dias do
  mês corrente aparece com `weight=normal` em vez de `bold`, contrariando a regra textual do
  contrato). Esta implementação segue a regra escrita ("bold = dias do mês exibido"), não o
  exemplo visual especificamente — se o Figma for corrigido, reconfirme.
- Sem locale configurável — nomes de mês/dia da semana em pt-BR fixos no componente (o contrato
  não define prop de locale).

## 📝 Referências

- [Componentes.json](../../data/components.json) — Contrato e status
- [Digito](../digito/README.md) — Sub-componente interno da grade
- [SKILL.md](../../SKILL.md) — Design System documentation
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) — Padrões acessibilidade
