# Padrões de composição — Soul DS

> Esta página descreve **como compor telas** a partir dos componentes de
> `data/components.json`. Não redefine props — cada padrão aqui referencia
> o componente pelo id (`button`, `input`, `celulas`...), você consulta o
> contrato real no JSON.

---

## Formulário

**Componentes usados:** `input` (`designed`) · `check`/`radio`/`switch` (`designed`) · `button` (`stable`)

```
<form>
  [aviso de campos obrigatórios]
  [grupo de campos: input + input + input]
  [divider]
  [grupo de campos: input + input]
  [rodapé: button variant=outline (cancelar) + button variant=primary (submit)]
</form>
```

**Regras:**
- Gap entre campos: `var(--spacing-8)` · gap entre grupos: `var(--spacing-12)` · padding do container: `var(--spacing-16)` *(nomes pós-migração ADR-001 — se o arquivo ainda não foi migrado, ver `adr-001-spacing.md` para o nome antigo equivalente)*.
- Submit sempre à direita, cancelar à esquerda — nunca o inverso.
- Validar depois do submit. Nunca desabilitar o botão de submit para impedir envio — usar mensagem de erro inline (`input` com `state=error`) em vez disso. Ver `components.json → input.rules`.
- Todo campo obrigatório: `obrigatorio=true` no `input`, nunca só visual.

## Tabela + paginação

**Componentes usados:** `celulas`/`cell-slot` (`designed`, átomos) **ou** `table` (`codeOnly`) · `pagination`+`dots` (`designed`)

Duas implementações coexistem hoje sem reconciliação (achado `CMP-8`,
Fase 3): `celulas`/`cell-slot` são os átomos desenhados no Figma;
`table`/`table-wrapper` é a implementação real em produção
(`soul-ds-examples.html`), que usa `<table>` nativo direto, sem consumir
esses átomos. Ao compor uma tabela nova, escolha um dos dois — não
misture os dois padrões na mesma tela.

```
<div class="table-wrapper">
  <table>
    <thead> [header, fundo muted, Semi Bold, th scope="col"] </thead>
    <tbody> [linhas zebra: --color-background / --color-muted] </tbody>
  </table>
  [pagination]
</div>
```

**Regras:**
- Padding de célula: `var(--spacing-4)` vertical, `var(--spacing-8)` horizontal.
- Ações de linha só aparecem no hover.
- Paginação obrigatória acima de 20 itens — sempre com o total: "1–20 de N resultados".
- Estado vazio: ícone (resolvido via `find-icon.mjs`, nunca hardcoded) + texto + CTA.

## Card com formulário

**Componentes usados:** `card` (`codeOnly`) · `input` (`designed`) · `button` (`stable`)

```
<div class="card">
  <div class="card__header">
    <div><h3 class="card__title">…</h3><p class="card__subtitle">…</p></div>
    <button variant="outline">Limpar</button>
  </div>
  <form>…</form>
</div>
```

`card` não tem respaldo no Figma (`status: codeOnly`) — nenhum designer
revisou este padrão de composição ainda. Use, mas trate como pendente de
revisão visual, não como referência definitiva de espaçamento interno.

## Layout com sidebar

**Componentes usados:** `sidebar` (`codeOnly`)

```
<div class="layout">
  <nav aria-label="lateral" class="sidebar">
    [grupo de itens com label]
  </nav>
  <div class="main-content">…</div>
</div>
```

`sidebar` também é `codeOnly` — mesma ressalva do `card`. O `<nav
aria-label="lateral">` não está no CSS, é uma adição obrigatória na
implementação (ver `a11y.md`).

---

## Templates de página

**List page:**
```
[header: título H1 + botão primary de ação]
[barra de filtros]
[tabela com paginação]
```

**Detail page:**
```
[breadcrumb]
[header: título H1 + ações secundárias]
[grid de dados]
[ações primárias no rodapé]
```

**Form page:**
```
[breadcrumb]
[título H1]
[formulário conforme padrão acima]
```

**Dashboard:**
```
[header]
[grid de cards métricas (2–4 colunas)]
[gráficos]
[tabela resumida]
```

Nenhum destes 4 templates tem componente Figma correspondente — são
convenções de composição, não contratos verificáveis. Trate como ponto de
partida, não como especificação fechada.
