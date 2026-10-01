# Radio — Soul DS

Seleção exclusiva dentro de um grupo. Apenas um item pode estar selecionado por vez.

## 📋 Tamanhos

- **sm** — 16×16px
- **md** — 20×20px (padrão)
- **lg** — 24×24px

## 📖 Uso

```tsx
import { Radio } from '@/componentes/radio'

// Sempre agrupado em <fieldset> com <legend> (regra must) e name compartilhado
<fieldset>
  <legend>Frequência</legend>
  <Radio name="frequencia" value="diario" label="Diário" defaultChecked />
  <Radio name="frequencia" value="semanal" label="Semanal" />
  <Radio name="frequencia" value="mensal" label="Mensal" />
</fieldset>

// Controlado
const [valor, setValor] = useState('diario')
<Radio name="frequencia" value="diario" label="Diário" checked={valor === 'diario'} onChange={() => setValor('diario')} />
```

## 🎨 Props

### `size?: RadioSize`

- Tipo: `'sm' | 'md' | 'lg'`
- Padrão: `'md'`

### `label?: string`

Rótulo visível ao lado do radio. Sem ele, forneça `aria-label` para manter a acessibilidade.

### `className?: string`

Classe CSS adicional no `<label>` wrapper.

Demais props (`name`, `value`, `checked`, `defaultChecked`, `onChange`, `disabled`, etc.) são
repassadas diretamente ao `<input type="radio">` nativo — `name` compartilhado entre os radios do
grupo é o que garante a exclusividade mútua (comportamento nativo do HTML).

## ♿ Acessibilidade

- Usa `<input type="radio">` nativo + `<label>` associado via `htmlFor`/`id` (gerado via `useId`
  se `id` não for passado) — conforme `a11y.nota` do contrato.
- **Sempre envolva o grupo em `<fieldset>` com `<legend>` descritiva** — regra `must`. Um radio
  isolado fora de um grupo nunca faz sentido (regra `mustNot`).
- A marca visual (`radio__marca`) é puramente decorativa; o estado real vem do input nativo
  (`:checked`), navegação por teclado (setas entre radios do mesmo `name`) funciona nativamente.
- `:focus-visible` com `var(--color-ring)`.
- Desabilitação via atributo nativo `disabled`, nunca ocultando o radio.

## 🎨 Tokens e Customização

```css
--color-background          /* fundo desmarcado */
--color-muted-foreground    /* borda desmarcado */
--color-primary               /* borda + bolinha marcado */
--color-muted                  /* fundo/borda desabilitado */
--color-foreground             /* texto do label */
--color-ring                     /* outline de foco */
--border-width-1
--radius-full
--spacing-8
--font-size-sm
```

## 📝 Regras (copiadas de `components.json`)

**must:**
- Agrupar sempre dois ou mais radio buttons dentro de `<fieldset>`.

**mustNot:**
- Usar um único radio isolado.
- Usar para mais de 5 opções — nesse caso preferir select.

## 🚨 Pendências conhecidas

- Nenhuma — componente simples, visual 1:1 com o Figma (3 tamanhos × 2 estados).
- Sem componente de grupo dedicado (`RadioGroup`) que force a regra "sempre `<fieldset>`" — fica
  a cargo do consumidor, mesmo padrão adotado em `Check`/`Historico`.

## 📝 Referências

- [Componentes.json](../../data/components.json) — Contrato e status
- [Check](../check/README.md) — Componente irmão (seleção múltipla)
- [SKILL.md](../../SKILL.md) — Design System documentation
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) — Padrões acessibilidade
