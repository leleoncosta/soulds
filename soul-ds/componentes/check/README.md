# Check — Soul DS

Seleção múltipla independente. Cada checkbox opera de forma autônoma.

## 📋 Tamanhos

- **sm** — 16×16px
- **md** — 20×20px (padrão)
- **lg** — 24×24px

## 📖 Uso

```tsx
import { Check } from '@/componentes/check'

<Check label="Ativo" />
<Check size="lg" label="Selecionar todos" />
<Check label="Indisponível" disabled />

// Controlado
const [checked, setChecked] = useState(false)
<Check label="Aceito os termos" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
```

## 🎨 Props

### `size?: CheckSize`

- Tipo: `'sm' | 'md' | 'lg'`
- Padrão: `'md'`

### `label?: string`

Rótulo visível ao lado do checkbox. Sem ele, forneça `aria-label` para manter a acessibilidade.

### `className?: string`

Classe CSS adicional no `<label>` wrapper.

Demais props (`checked`, `defaultChecked`, `onChange`, `disabled`, etc.) são repassadas
diretamente ao `<input type="checkbox">` nativo.

## ♿ Acessibilidade

- Usa `<input type="checkbox">` nativo + `<label>` associado via `htmlFor`/`id` (gerado via
  `useId` se `id` não for passado) — conforme `a11y.nota` do contrato.
- A marca visual (`check__marca`) é puramente decorativa; o estado real vem do input nativo
  (`:checked`), então leitores de tela e navegação por teclado funcionam sem JS adicional.
- `:focus-visible` com `var(--color-ring)` na marca quando o input real recebe foco.
- Desabilitação via atributo nativo `disabled`, nunca ocultando o checkbox.

## 🎨 Tokens e Customização

```css
--color-background          /* fundo desmarcado */
--color-muted-foreground    /* borda desmarcado */
--color-primary               /* fundo/borda marcado */
--color-primary-foreground   /* cor da marca (check) */
--color-muted                  /* fundo/borda desabilitado */
--color-foreground             /* texto do label */
--color-ring                     /* outline de foco */
--border-width-1
--radius-2
--spacing-8
--font-size-sm
```

O ícone de confirmação (`mv-basico/acao/confirmar`) foi resolvido via `find-icon.mjs` — não
desenhado à mão.

## 📝 Regras (copiadas de `components.json`)

**must:**
- Usar quando o usuário pode selecionar zero, um ou vários itens de uma lista.

**mustNot:**
- Usar para seleção exclusiva — nesse caso usar radio.

## 🚨 Pendências conhecidas

- Nenhuma — componente simples, visual 1:1 com o Figma (3 tamanhos × 2 estados).

## 📝 Referências

- [Componentes.json](../../data/components.json) — Contrato e status
- [SKILL.md](../../SKILL.md) — Design System documentation
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) — Padrões acessibilidade
