# Componentes — Soul DS

> Esta página descreve **como usar**. O contrato está em `data/components.json`.
> Nenhuma prop, variante ou regra é repetida aqui.

---

## Contrato

1. **Leia `status` antes de tudo.** Ele decide a ação:

   | status | significa | o que fazer |
   |---|---|---|
   | `stable` | existe em código, testado | use o `selector` direto |
   | `designed` | existe no Figma, sem código | implemente a partir de `props` + tokens — não reinvente a estrutura |
   | `beta` | existe, mas com lacuna conhecida (ver `pendencias`) | use com a lacuna em mente |
   | `planned` | não existe em lugar nenhum | HTML semântico nativo + `/* [DS-TEMP] motivo */` |

2. **Nunca reimplemente do zero um componente `stable` ou `designed`.** 16 dos 19 componentes reais desta DS estavam documentados como "planejados v1.1" na versão anterior — essa é a razão deste arquivo existir. Antes de escrever HTML novo para algo que parece um padrão de UI, procure em `data/components.json`.

3. **`rules.must` / `rules.mustNot` vêm do texto de Diretrizes do próprio Figma**, não são inventadas. Quando um componente não tem Diretrizes (`input-calendar`), o campo diz isso explicitamente em vez de simular autoridade que não existe.

---

## Buscar um componente

Só 19 itens — não há resolvedor como o de ícones. Abra `data/components.json` e procure pela chave (`button`, `input`, `celulas`...) ou pelo `atomic` (`atom`/`molecule`/`organism`).

```bash
node -e 'console.log(Object.keys(require("./data/components.json").componentes))'
node -e 'const d=require("./data/components.json"); console.log(d.componentes["celulas"])'
```

---

## Os 16 componentes com código (`stable`)

`button` (`.btn`), `input` (`.input-field`), `aba` (`.aba`), `avatar` (`.avatar`), `breadcrumb` (`.breadcrumb`), `digito` (`.digito`), `calendario` (`.calendario`), `chips` (`.chips`), `dots` (`.dots`), `pagination` (`.pagination`), `tooltip` (`.tooltip`), `dialog` (`.dialog`), `historico` (`.historico`), `check` (`.check`), `radio` (`.radio`) e `switch` (`.switch`) têm CSS real, Code Connect e uso comprovado (`soul-ds/componentes/<nome>/`). Use como estão.

`digito` é sub-componente interno do `calendario`; `dots` é consumido pelo `pagination` (mas pode ser usado standalone, ex. carrossel); `dialog` reaproveita o próprio `Button` no rodapé — ver `rules.mustNot` de cada um.

## Os 2 documentados sem código (`designed`)

`celulas` · `cell-slot`

Existem no Figma, com props, variantes e Diretrizes documentadas — mas **nenhum tem CSS no repositório**. Ao implementar um destes:

- Use as `props` de `data/components.json` como a especificação — não invente variantes.
- Consuma os tokens semânticos (`--color-*`, `--spacing-*`, `--radius-*`) — nunca hardcode.
- Siga `a11y.nota` quando presente: são requisitos que o Figma não modela (ex: `role="switch"` em `switch`, focus trap em `dialog`) mas que a implementação precisa ter.
- Componentes marcados como internos (`cell-slot`, `digito`) não devem virar padrão de uso standalone — leia `rules.mustNot`.

## `input-calendar` (`beta`)

Único componente sem descrição no Figma e o único cujo enum de estado se chama `status` em vez de `state`. Use com essas duas lacunas em mente; não são erros deste arquivo, são o que o Figma realmente tem hoje.

## Os 9 que não existem (`planejados`)

`select` · `table` · `card` · `toast` · `badge` · `tab` · `skeleton` · `navbar` · `sidebar`

Cada um tem um `equivalenteNativo` em `data/components.json → planejados`. Use HTML semântico + `[DS-TEMP]` até serem desenhados. Duas notas importantes:

- **`card-base` não é `card`.** `card-base` é um **ícone** em `mv-basico/sistema` (confirmado na Fase 1). Se você viu "card-base" na documentação antiga pensando que era um componente de card, essa é exatamente a confusão que a Fase 1 corrigiu.
- **`table` já tem metade construída.** `celulas` e `cell-slot` (ambos `designed`) são os átomos de célula — falta o organism que os compõe em `<table>` com cabeçalho, zebra e paginação.

---

## Achados desta fase (não são bugs deste arquivo — são do Figma/doc original)

- `celulas`: a descrição menciona `variant=chips`, mas o enum real é `slot`. A prosa não foi atualizada quando a variante foi renomeada.
- `button`: `state=active` existe só em `toggle`; as outras 4 variantes não têm. E `state=focus` não existe no enum de nenhum componente — só o CSS implementa `:focus-visible`.
- `button`: `btn--destructive` existe no CSS e no `soul-ds-examples.html` mas não é uma variante no Figma.
- `dialog`: sem variante de confirmação destrutiva — achado crítico já registrado na Fase 0 (heurística de Nielsen #3).

---

## Manter atualizado

```bash
node scripts/verify-components.mjs           # integridade interna do arquivo — sem rede
FIGMA_TOKEN=figd_... node scripts/check-components-drift.mjs   # components.json vs Figma real
```

`components.json` é curado à mão — `status`, `rules` e `selector` exigem julgamento que um script não deveria automatizar. O drift-check não corrige nada, só aponta onde o arquivo ficou atrás do Figma publicado (foi assim que a Fase 1 encontrou o bug de `mv-logo`).
