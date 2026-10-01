# Pagination — Soul DS

Navegação entre páginas de uma listagem ou tabela. Composto internamente pelo sub-componente
[`Dots`](../dots/README.md) — um ponto por página, até 10 páginas (regra do `dots`).

## 📖 Uso

```tsx
import { Pagination } from '@/componentes/pagination'

const [page, setPage] = useState(1)

<Pagination page={page} totalPages={5} onPageChange={setPage} />

// Rótulos customizados
<Pagination page={page} totalPages={3} onPageChange={setPage} anterior="Voltar" proximo="Avançar" />

// Sem rótulo de texto visível (ícone/aria-label apenas)
<Pagination page={page} totalPages={3} onPageChange={setPage} textoEsquerdo={false} textoDireito={false} />
```

## 🎨 Props

### `page: number`

Página atual (1-indexed).

### `totalPages: number`

Total de páginas. Acima de 10, considere paginação numérica (ainda não modelada no Figma — ver
pendência).

### `onPageChange: (page: number) => void`

Disparado ao clicar em Anterior, Próximo, ou em um ponto específico.

### `anterior?: string` / `proximo?: string`

Rótulo de texto dos botões.

- Padrão: `'Anterior'` / `'Próximo'`

### `textoEsquerdo?: boolean` / `textoDireito?: boolean`

Exibe o rótulo de texto no botão correspondente. **O botão em si nunca é ocultado** — apenas o
texto visível some, o botão continua clicável e com `aria-label` (regra `mustNot` do contrato).

- Tipo: `boolean`
- Padrão: `true`

### `className?: string`

Classes CSS adicionais.

## ♿ Acessibilidade

- `<nav aria-label="Paginação">` envolvendo todo o componente (regra `a11y.nota` do contrato).
- Anterior/Próximo são sempre `<button>` reais, desabilitados via atributo `disabled` real na
  primeira/última página — nunca ocultos (regra `mustNot`).
- Quando `textoEsquerdo`/`textoDireito` é `false`, o botão recebe `aria-label` com o texto
  original em vez de ficar sem nome acessível.
- Cada `Dots` tem `aria-label="Página N"` e o ativo recebe `aria-current="true"`.
- `:focus-visible` com `var(--color-ring)` em todos os elementos interativos.

## 🎨 Tokens e Customização

```css
--color-primary   /* texto Anterior/Próximo */
--color-ring       /* outline de foco */
--spacing-8
--spacing-12
--spacing-16
--spacing-20
--font-size-sm
```

Ver também [tokens do Dots](../dots/README.md#-tokens-e-customização).

## 📝 Regras (copiadas de `components.json`)

**must:**
- Sempre exibir o total: "1–20 de N resultados".
- Usar sempre que lista tiver > 20 itens.

**mustNot:**
- Ocultar os botões Anterior/Próximo na primeira/última página — usar state=disabled.

## 🚨 Pendências conhecidas

- **"Sempre exibir o total" não está implementado.** O Figma modela apenas Anterior/dots/Próximo
  — não há um slot de texto "1–20 de N resultados" no componente inspecionado. Se esse requisito
  for necessário, componha manualmente ao redor do `Pagination` até o Figma documentar esse slot.
- **Acima de 10 páginas não é tratado.** O componente renderiza um `Dots` por página
  independente do total — é responsabilidade do consumidor não usar `Pagination` (baseado em
  dots) acima de 10 páginas, conforme a regra do `dots`; não há paginação numérica implementada
  neste design system ainda (`select`/`table`/`pagination numérica` constam como planejados).
- `textoEsquerdo`/`textoDireito` como "esconder só o texto, manter o botão" é uma interpretação —
  o Figma literalmente oculta o bloco de texto inteiro sem modelar um ícone alternativo; optei por
  manter o botão sempre presente (com `aria-label`) para respeitar a regra `mustNot` do contrato.

## 📝 Referências

- [Componentes.json](../../data/components.json) — Contrato e status
- [Dots](../dots/README.md) — Sub-componente interno (indicador de página)
- [SKILL.md](../../SKILL.md) — Design System documentation
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) — Padrões acessibilidade
