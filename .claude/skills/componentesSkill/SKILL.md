---
name: componentesSkill
description: Cria um novo componente React/TypeScript da Soul DS a partir do Figma, seguindo a estrutura, tokens e convenções já estabelecidas em soul-ds/componentes/button. Use quando o usuário pedir para criar, gerar ou implementar um componente (ex: "cria o componente Input", "implementa o Card do Figma", "preciso do componente Select em React").
---

# componentesSkill — Gerar componentes React da Soul DS

Esta skill existe para que a criação do **próximo** componente não repita os
erros cometidos na primeira vez (Button): tokens CSS inventados que não
existiam no design system, e erros de tipo no Code Connect só descobertos no
`typecheck`. Siga os passos na ordem — eles existem para pegar esses erros
**antes** de escrever código, não depois.

## 0. Pré-requisito: identifique o componente no contrato

Antes de tocar no Figma, leia `soul-ds/data/components.json` e procure o
componente pelo nome (ex.: `"input"`, `"card"`).

- Se `status` for `"stable"` → já existe implementação. **Não reimplemente do
  zero.** Leia o código existente em `soul-ds/componentes/<nome>/` e ajuste.
- Se `status` for `"designed"` → existe no Figma, sem código. É o caso ideal
  para esta skill: implemente a partir do contrato (`props`, `rules`, `a11y`)
  já documentado — não invente props novas sem necessidade.
- Se `status` for `"codeOnly"` → existe em produção sem respaldo no Figma.
  Pule a etapa de Figma, mas ainda documente isso como pendência de design.
- Se `status` for `"planned"` ou o componente não existir no JSON → confirme
  com o usuário antes de prosseguir; pode ser um componente genuinamente novo
  que ainda nem foi desenhado.

Anote: `figma.key`, `figma.nodeId`, `props`, `rules.must`/`mustNot`, `a11y.wcag`.
Isso evita reinventar variantes/estados que o Figma já define.

## 1. Explore o componente no Figma

Use as ferramentas MCP do Figma (carregue a skill `figma-use` se as tools
ainda não estiverem disponíveis):

1. `get_metadata` no `nodeId` do componente → lista variantes/estados (ex.:
   `variant=primary, state=hover`).
2. `get_screenshot` do mesmo node → confirma visualmente o que cada
   variante/estado parece.

Não pule o screenshot — metadata sozinha não mostra se um "outline" tem
borda de 1px ou 2px, por exemplo.

## 2. Descubra os tokens REAIS antes de escrever qualquer CSS

**Este é o passo que faltou na primeira vez e gerou retrabalho.** Nunca
assuma o nome de um token — grep o CSS gerado:

```bash
cd soul-ds
grep -E "^\s*--(color-|font-|spacing-|radius-|line-height)" dist/soul-ds.css | sort -u
```

Use só os nomes que aparecerem aí. Se precisar de uma variação que não
existe como token semântico (ex.: cor de hover), **não invente um novo
token** — use `filter: brightness(0.9)` / `brightness(0.8)` sobre o token
base, como foi feito em `Button.css`. Essa é a convenção já estabelecida
neste design system para hover/active sem token dedicado.

Se o token que você precisa genuinamente não existe e `filter()` não resolve,
isso é uma **pendência a registrar** (ver `soul-ds/ds.manifest.json` →
`pendencias`), não uma licença para hardcode.

## 3. Estrutura de arquivos (copie o padrão de `button/`)

Crie em `soul-ds/componentes/<nome>/`:

```
<nome>/
├── <Nome>.tsx           componente — props tipadas, React.forwardRef, variant+state via className
├── <Nome>.css           só var(--token) do passo 2, nunca valor hardcoded
├── <Nome>.stories.tsx   uma story por combinação variant×state relevante
├── <Nome>.connect.tsx   figma.connect() por nodeId de cada variante/estado
├── index.ts             export do componente + tipos
└── README.md            variantes, props, acessibilidade, regras must/mustNot
```

Convenções de classe CSS (consistentes com `.btn`):
- Base: `.{prefixo}` (ex. `.input`)
- Variante: `.{prefixo}--{variant}` (ex. `.input--outline`)
- Estado: `.{prefixo}--{state}` quando não for o pseudo-estado nativo do HTML
  (ex. `.input--active`); para `disabled`/`:hover` nativos, use a
  pseudo-classe real do elemento (`:disabled`, `:hover`) sempre que possível,
  e mantenha a classe `--hover`/`--active` só como fallback para quando o
  Storybook/Figma precisa forçar o estado via prop (veja `Button.tsx`, função
  que calcula `state`).

## 4. Code Connect — evite o erro de tipo mais comum

Ao escrever `<Nome>.connect.tsx`, todo literal de `variant`/`state` dentro de
um objeto `props: {...}` precisa de `as const`, senão o TypeScript infere
`string` genérico e quebra contra o tipo da prop:

```tsx
// ERRADO — 'outline' vira `string`, não `ButtonVariant`
props: { variant: 'outline', state: 'hover' }

// CERTO
props: { variant: 'outline' as const, state: 'hover' as const }
```

Quando o valor vier de `figma.enum(...)`, aplique `as const` no objeto de
mapeamento, não no resultado:

```tsx
variant: figma.enum('variant', {
  primary: 'primary',
  outline: 'outline',
} as const)
```

Não importe `React` no topo do arquivo — o projeto usa `jsx: "react-jsx"`
(`tsconfig.json`), import manual gera erro `TS6133` (não utilizado).

## 5. Acessibilidade — confira contra `rules` e `a11y` do JSON

Antes de considerar pronto, confirme contra o que `components.json` already
exige para esse componente (não invente requisito novo nem ignore um
existente):

- Todo estado interativo precisa de `:focus-visible` (use `var(--color-ring)`).
- Campos/ícones sem rótulo visível precisam de `aria-label`.
- Nunca "esconder" um elemento para desabilitá-lo — use o atributo real
  (`disabled`, `aria-disabled`) mantendo-o visível e com feedback.

## 6. Valide antes de entregar (nesta ordem)

```bash
cd soul-ds
npm run typecheck        # pega erros de tipo (ex: Code Connect sem `as const`)
npm run build-storybook  # builda de verdade — pega import quebrado, CSS ausente
npm run verify:components # confere components.json ainda íntegro
```

Se `typecheck` ou `build-storybook` falhar, **corrija antes de reportar como
pronto** — não entregue um componente que você não rodou de fato.

## 7. Documentação final

No `README.md` do componente, inclua pelo menos:
- Variantes e estados (tabela)
- Exemplo de uso mínimo
- Regras `must`/`mustNot` copiadas de `components.json` (não reescreva com
  palavras diferentes — copie, para não divergir)
- Pendências conhecidas (ex.: estado que o Figma não cobre)

## Checklist resumido

- [ ] Consultei `components.json` para status e contrato antes de começar
- [ ] Vi o componente no Figma (metadata + screenshot)
- [ ] Rodei `grep` em `dist/soul-ds.css` e só usei tokens que existem de verdade
- [ ] Usei `filter: brightness()` para hover/active sem token dedicado, em vez de inventar cor
- [ ] Toda variante/estado no `.connect.tsx` tem `as const`
- [ ] Sem `import React` desnecessário (jsx: react-jsx)
- [ ] `npm run typecheck` passa
- [ ] `npm run build-storybook` builda sem erro
- [ ] aria-label em elementos sem rótulo visível, `:focus-visible` em todo estado interativo
- [ ] README do componente documenta rules must/mustNot do contrato
