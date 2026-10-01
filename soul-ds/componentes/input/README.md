# Input — Soul DS

Campo de entrada de texto. Suporta label, placeholder, ícone, hint e validação.

> ⚠️ **Esta é a implementação real do componente `input`**, que estava marcado como `stable` no
> contrato sem nenhum código correspondente (só um exemplo HTML legado desalinhado em
> `soul-ds-examples.html`, usando inclusive um token inexistente `--radius-md`). Esta divergência
> foi corrigida nesta sessão — ver pendências abaixo.

## 📋 Estados

| Estado | Como ativar |
|---|---|
| `default` | padrão |
| `focus` | `:focus-within` nativo — sem prop |
| `error` | prop `error` |
| `disabled` | prop nativa `disabled` |

> O Figma modela `variant=text`/`variant=placeholder` como dois símbolos estáticos (campo
> preenchido vs. vazio). Na implementação real isso é comportamento nativo do HTML — **não existe
> prop `variant`**: use `placeholder` para o texto de sugestão e `value`/`defaultValue` para o
> valor digitado, como em qualquer `<input>`.

## 📖 Uso

```tsx
import { Input } from '@/componentes/input'

<Input label="Nome completo" obrigatorio />

<Input label="CPF" placeholder="000.000.000-00" />

<Input
  label="E-mail"
  error
  hint
  textoAuxiliar="Informe um e-mail válido"
/>

<Input label="Observações" disabled defaultValue="Edição restrita" />

// Controlado
const [value, setValue] = useState('')
<Input label="E-mail" value={value} onChange={(e) => setValue(e.target.value)} />
```

## 🎨 Props

### `label: string`

Rótulo do campo. **Sempre obrigatório** — nunca use `placeholder` como substituto (regra
`mustNot`).

### `hasLabel?: boolean`

Exibe o rótulo visivelmente. Quando `false`, o rótulo continua existindo para leitores de tela
(classe `sr-only`), nunca é removido do DOM.

- Padrão: `true`

### `obrigatorio?: boolean`

Asterisco visual + `required` + `aria-required="true"` (regra `must`).

- Padrão: `false`

### `hint?: boolean` / `textoAuxiliar?: string`

Exibe o texto auxiliar abaixo do campo. Quando `error` é `true`, `textoAuxiliar` deve explicar o
problema (regra `must`) — o texto ganha `role="alert"` automaticamente.

### `error?: boolean`

Estado de validação com erro.

- Padrão: `false`

### `icone?: boolean` / `icon?: ReactNode`

Exibe o ícone à direita do campo (padrão: ícone "menu_secundario"). Sempre decorativo
(`aria-hidden`) — não é um botão de ação.

### `className?: string`

Classes CSS adicionais no wrapper externo (label + campo + hint).

Demais props (`placeholder`, `value`, `defaultValue`, `onChange`, `disabled`, `type`, etc.) são
repassadas diretamente ao `<input>` nativo.

## ♿ Acessibilidade

- `<label htmlFor>` sempre associado ao `<input id>` (gerado via `useId` se `id` não for passado).
- `obrigatorio` adiciona `required` + `aria-required="true"` no input real.
- `error` adiciona `aria-invalid="true"` e, com `textoAuxiliar`, `aria-describedby` apontando para
  o hint, que recebe `role="alert"`.
- `hasLabel=false` nunca remove o rótulo do DOM — usa `sr-only` (clip/overflow), preservando
  leitura por tecnologia assistiva.
- `:focus-within` no wrapper com `box-shadow` (equivalente visual ao `:focus-visible` de outros
  componentes, já que o foco real é no `<input>` interno, não no wrapper).

## 🎨 Tokens e Customização

```css
--color-background          /* fundo do campo */
--color-foreground            /* texto digitado e label */
--color-muted-foreground     /* borda default, placeholder, hint, ícone */
--color-muted                  /* fundo/borda disabled */
--color-error                   /* borda/texto/label em error */
--color-primary                /* borda em focus */
--border-width-1
--radius-2
--spacing-2 / -4 / -6 / -10
--font-size-sm / -xs
--font-weight-regular
```

O ícone padrão (`mv-basico/sistema/menu_secundario`) foi resolvido via `find-icon.mjs` — não
desenhado à mão. O brilho de foco usa `color-mix()` sobre `--color-primary`, mesma convenção do
`Digito`/`Calendario`/`Dialog`.

## 📝 Regras (copiadas de `components.json`)

**must:**
- Sempre exibir label visível.
- state=error sempre com Texto auxiliar explicando o problema, role="alert".
- obrigatorio=true + required + aria-required="true".

**mustNot:**
- Usar placeholder como substituto de label.

## 🚨 Pendências conhecidas

- **Esta implementação não existia antes desta sessão** apesar do contrato dizer `status:
  "stable"` com `codeConnect: "input.figma.js"` (arquivo inexistente). A causa provável: o
  contrato foi atualizado manualmente em algum momento sem o código correspondente ter sido
  criado — um caso real do tipo de drift que `check-components-drift.mjs` deveria pegar. Corrigido
  agora; `codeConnect`/`selector` no contrato foram atualizados para os valores reais.
- O CSS legado em `soul-ds-examples.html` (`--radius-md`) **não foi reaproveitado** — o token não
  existe em `dist/soul-ds.css`; a implementação usa `--radius-2`, confirmado contra o Figma.
- Sem variante de ícone à esquerda — o Figma só modela o ícone à direita (`icone`/`icon`).

## 📝 Referências

- [Componentes.json](../../data/components.json) — Contrato e status
- [SKILL.md](../../SKILL.md) — Design System documentation
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) — Padrões acessibilidade
