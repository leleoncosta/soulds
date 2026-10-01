# Ícones — Soul DS

> Esta página descreve **como usar**. Os dados estão em `data/icons.json`.
> Nenhum nome, key ou contagem é repetido aqui — repetir é como a doc 1.0.x se desincronizou.

---

## Contrato

1. **Nunca escreva o `d=` de um path.** Importe o arquivo apontado em `icones[id].svg`.
2. **Nunca escolha um ícone de memória.** Resolva pelo índice: `node scripts/find-icon.mjs "<intenção>"`.
3. Se a busca não retornar nada adequado, **não invente**. Sinalize a lacuna com `[DS-TEMP]` e registre.
4. Cor herda via `currentColor`. Defina `color` no elemento pai com token semântico.
5. Tamanho é responsabilidade do CSS. O SVG não tem `width`/`height`.

---

## Resolver um ícone

```bash
node scripts/find-icon.mjs "dose excessiva"
node scripts/find-icon.mjs "leito ocupado" --colecao mv-hosp
node scripts/find-icon.mjs "filtro" --json     # para consumo programático
node scripts/find-icon.mjs "excluir" --html    # snippet pronto
```

O resolvedor pondera por IDF: termos raros (`alergia`, `aprazamento`) pesam mais que genéricos (`paciente`, `documento`), e o nome base vence o derivado — `notificacao` antes de `notificacao_email`.

Coleção certa: `mv-hosp` para domínio clínico (prescrição, prontuário, leito, triagem), `mv-basico` para UI genérica (salvar, editar, filtro, setas). O resolvedor sinaliza quando o melhor resultado é clínico.

---

## Markup

```html
<!-- decorativo: o texto ao lado já comunica -->
<span class="icon icon--md" aria-hidden="true">
  <!-- conteúdo de dist/icons/mv-basico/acao/salvar.svg -->
</span>

<!-- com significado próprio -->
<span class="icon icon--md" role="img" aria-label="Paciente em isolamento">
  <!-- conteúdo de dist/icons/mv-hosp/status/leito_isolamento.svg -->
</span>

<!-- botão icon-only: o label vai no button, nunca no ícone -->
<button class="btn btn--icon" aria-label="Excluir prescrição">
  <span class="icon icon--md" aria-hidden="true">
    <!-- conteúdo de dist/icons/mv-basico/acao/excluir.svg -->
  </span>
</button>
```

```css
.icon     { display: inline-flex; align-items: center; justify-content: center; }
.icon--sm { width: var(--icon-size-sm); height: var(--icon-size-sm); }
.icon--md { width: var(--icon-size-md); height: var(--icon-size-md); }
.icon--lg { width: var(--icon-size-lg); height: var(--icon-size-lg); }
.icon svg { width: 100%; height: 100%; fill: currentColor; }
```

> Os tokens `--icon-size-*` ainda não existem em `tokens.css` — a doc 1.0.x usava `16px`/`20px`/`24px` hardcoded, violando a própria regra. Criar na Fase 4.

`md` é o padrão. `sm` só para densidade real (tabela densa, badge inline), `lg` só para destaque (header, navegação principal).

---

## Por que existe um SVG por ícone, e não três

As variantes `sm`/`md`/`lg` do Figma são **a mesma geometria com padding absoluto de 2px** — verificado por export comparado: `leito` gera 311 bytes idênticos nos três tamanhos, mudando só as coordenadas.

Dimensionar por CSS a partir de um único arquivo é visualmente equivalente, com diferença de padding sub-pixel (0,4px no `sm`). 739 arquivos em vez de 2.217.

Se algum ícone específico precisar de ajuste óptico por tamanho, exporte os três e registre a exceção no `icon-stems.json`.

---

## Regenerar

```bash
export FIGMA_TOKEN="figd_..."        # Settings → Security → Personal access tokens

node scripts/sync-icons.mjs          # Figma → raw → SVGs → icons.json → manifesto
node scripts/sync-icons.mjs --svg-only
node scripts/build-icons.mjs         # só reconstrói o índice (sem rede)
node scripts/verify-icons.mjs        # checa o contrato; --strict reprova SVG faltando
```

**Editar keywords:** só em `data/icon-stems.json`, por radical. `data/icons.json` é gerado — qualquer edição manual é perdida no próximo build.

Adicionar um sinônimo a `"salvar"` propaga para `salvar_como`, `salvar_avancar`, `salvar_padrao` e `salvar_avaliar` automaticamente. É por isso que o dicionário é por radical e não por ícone.

---

## Estado atual

Leia `ds.manifest.json` antes de assumir qualquer coisa sobre o disco. O campo `artefatos["dist/icons/"].estado` diz se a exportação está completa ou parcial.

Enquanto estiver `PARCIAL`, um agente deve tratar ausência de arquivo como lacuna a sinalizar — nunca como permissão para gerar SVG.

As pendências conhecidas estão em `ds.manifest.json → pendencias`, com id, ação e severidade.
