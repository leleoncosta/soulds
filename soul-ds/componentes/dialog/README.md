# Dialog — Soul DS

Janela modal para confirmações, formulários curtos ou detalhamento de um item sem sair do
contexto atual.

## 📖 Uso

```tsx
import { Dialog } from '@/componentes/dialog'
import { Button } from '@/componentes/button'

const [open, setOpen] = useState(false)

<Button variant="primary" label="Abrir" onClick={() => setOpen(true)} />

<Dialog
  open={open}
  onClose={() => setOpen(false)}
  titulo="Excluir paciente"
  footer={
    <>
      <Button variant="outline" label="Cancelar" onClick={() => setOpen(false)} />
      <Button variant="primary" label="Excluir" onClick={handleExcluir} />
    </>
  }
>
  Tem certeza que deseja excluir este paciente? Essa ação não pode ser desfeita.
</Dialog>

// Sem rodapé de ações
<Dialog open={open} onClose={() => setOpen(false)} titulo="Detalhes" btn={false}>
  Conteúdo apenas informativo.
</Dialog>
```

Os botões do rodapé são instâncias do próprio [`Button`](../button/README.md) — o Figma modela
"Sencundário" (`variant=outline`) e "Principal" (`variant=primary`), reaproveitados aqui em vez
de recriados com markup cru.

## 🎨 Props

### `open: boolean`

Controla se o dialog está aberto. O componente chama `showModal()`/`close()` no `<dialog>` nativo
conforme essa prop muda.

### `onClose: () => void`

Disparado ao fechar — pelo X, clique fora da caixa (backdrop), ou tecla Escape. É
responsabilidade do consumidor setar `open=false` nesse callback.

### `titulo: string`

Título exibido no cabeçalho (fundo `--color-primary`).

### `children?: ReactNode`

Conteúdo do corpo do dialog.

### `btn?: boolean`

Exibe/oculta o rodapé de ações.

- Tipo: `boolean`
- Padrão: `true`

### `footer?: ReactNode`

Conteúdo do rodapé de ações — normalmente dois `Button` (outline + primary). Só é renderizado se
`btn` for `true` **e** `footer` for passado.

### `className?: string`

Classes CSS adicionais na caixa do dialog.

## ♿ Acessibilidade

- Usa `<dialog>` nativo com `showModal()` — focus trap, `::backdrop` e fechamento por Escape vêm
  de graça do navegador (regra `a11y.nota` do contrato).
- `aria-labelledby` aponta para o título (`id` gerado via `useId`).
- Botão de fechar (X) com `aria-label="Fechar"` — ícone é decorativo (`aria-hidden`).
- `:focus-visible` com `var(--color-ring)` no botão de fechar.
- Clique no backdrop e tecla Escape dispatcham o evento nativo `cancel`/`close`, que o componente
  traduz para `onClose` — sempre oferece saída explícita (regra `must`).

## 🎨 Tokens e Customização

```css
--color-background          /* fundo da caixa */
--color-primary              /* fundo do cabeçalho */
--color-primary-foreground   /* texto/ícone do cabeçalho */
--color-foreground            /* texto do corpo */
--color-black                  /* backdrop (via color-mix) */
--color-ring                    /* outline de foco */
--spacing-8 / -16 / -32
--radius-2
--font-size-xl                  /* título */
--font-size-sm                  /* corpo */
--font-weight-semibold
```

O ícone de fechar (`mv-basico/acao/fechar`) foi resolvido via `find-icon.mjs` — mesmo usado em
[Chips](../chips/README.md). A sombra sutil da caixa e o escurecimento do backdrop usam
`color-mix()` sobre tokens existentes (`--color-primary`, `--color-black`), seguindo a mesma
convenção do `Digito`/`Calendario` — sem inventar token novo.

## 📝 Regras (copiadas de `components.json`)

**must:**
- Sempre oferecer saída explícita (fechar/cancelar).
- Nomear o botão primário de ação destrutiva pela ação ("Excluir"), nunca "OK".

**mustNot:** (nenhuma registrada no contrato)

## 🚨 Pendências conhecidas

- **Sem variante de confirmação destrutiva documentada no Figma** — achado já registrado na Fase
  0 do projeto (Nielsen #3, controle e liberdade). A story `ConfirmacaoDestrutiva` demonstra o
  padrão recomendado (nomear o botão pela ação), mas não há um `variant="danger"` dedicado no
  Figma para o cabeçalho/botão nesse cenário.
- Sem suporte a tamanhos (`sm`/`lg`) — a largura mínima de 450px é fixa, replicando o único
  exemplo visto no Figma.

## 📝 Referências

- [Componentes.json](../../data/components.json) — Contrato e status
- [Button](../button/README.md) — Reaproveitado no rodapé de ações
- [SKILL.md](../../SKILL.md) — Design System documentation
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) — Padrões acessibilidade
