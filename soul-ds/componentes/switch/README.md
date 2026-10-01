# Switch — Soul DS

Controle de alternância binária com efeito imediato. Liga/desliga uma configuração sem
necessidade de confirmação.

## 📋 Estados

| selected | state | Visual |
|---|---|---|
| `false` | `default` | trilho claro, thumb cinza com ✕ |
| `true` | `default` | trilho azul (`--color-primary`), thumb claro com ✓ |
| `false` | `disabled` | trilho/thumb acinzentados, não clicável |
| `true` | `disabled` | trilho acinzentado, thumb acinzentado com ✓ apagado |

## 📖 Uso

```tsx
import { Switch } from '@/componentes/switch'

// Não controlado
<Switch label="Notificações por e-mail" defaultChecked />

// Controlado
const [ativo, setAtivo] = useState(false)
<Switch label="Modo escuro" checked={ativo} onCheckedChange={setAtivo} />

// Sem ícone no thumb
<Switch label="Modo escuro" icon={false} />

// Desabilitado
<Switch label="Indisponível" disabled />
```

## 🎨 Props

### `checked?: boolean` / `defaultChecked?: boolean`

Estado ligado/desligado — controlado ou não controlado.

### `onCheckedChange?: (checked: boolean) => void`

Disparado ao alternar.

### `icon?: boolean`

Exibe o ícone dentro do thumb (✕ desligado, ✓ ligado).

- Padrão: `true`

### `label?: string`

Rótulo descritivo. **Sempre acompanhe o switch de um label** à esquerda ou acima (regra `must`) —
este componente já renderiza o label ao lado, associado via `htmlFor`.

### `disabled?: boolean`

Desabilita o switch.

### `className?: string`

Classe CSS adicional no wrapper externo (switch + label).

## ♿ Acessibilidade

- `<button role="switch" aria-checked>` — não documentado no Figma, mas obrigatório (regra
  `a11y.nota` do contrato: padrão ARIA para switches, já que `<input type="checkbox">` sozinho não
  comunica "alternância imediata" a leitores de tela).
- `<label htmlFor>` associado ao botão via `id` (gerado por `useId` se não passado) — clicar no
  texto do label também alterna o switch.
- `:focus-visible` com `var(--color-ring)`.
- Desabilitação via atributo nativo `disabled` no `<button>`, nunca ocultando o switch.

## 🎨 Tokens e Customização

```css
--color-background          /* trilho desligado, thumb ligado */
--color-muted-foreground    /* borda desligado, thumb desligado */
--color-primary               /* trilho ligado, ícone do thumb ligado */
--color-muted                  /* trilho/thumb desabilitado */
--color-white                   /* ícone do thumb desligado */
--color-foreground             /* texto do label */
--color-ring                     /* outline de foco */
--border-width-1
--radius-full
--spacing-4 / -8
--font-size-sm
```

Os ícones (`mv-basico/acao/fechar`, `mv-basico/acao/confirmar`) já haviam sido resolvidos via
`find-icon.mjs` para os componentes `Chips`/`Dialog` — reaproveitados aqui.

## 📝 Regras (copiadas de `components.json`)

**must:**
- Acompanhar sempre de label descritivo à esquerda ou acima.

**mustNot:**
- Usar para configurações que exigem confirmação/submit — nesse caso usar checkbox.
- Usar como substituto de checkbox em formulários com botão salvar.

## 🚨 Pendências conhecidas

- Nenhuma — componente simples, visual 1:1 com o Figma (4 combinações de estado).

## 📝 Referências

- [Componentes.json](../../data/components.json) — Contrato e status
- [Check](../check/README.md) — Use para formulários com submit, em vez de Switch
- [SKILL.md](../../SKILL.md) — Design System documentation
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) — Padrões acessibilidade
