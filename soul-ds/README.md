# Soul DS — camada legível por IA

Fase 1 de 7: biblioteca de ícones. Ver `references/icons.md` para uso.

## Princípio

Dados em `data/`, prosa em `references/`. **Prosa nunca repete dado.**
Foi a duplicação — CSS em dois arquivos, contagens em três, keys copiadas
da página errada — que desincronizou a documentação 1.0.x.

## Estrutura

    ds.manifest.json          estado, hashes, pendências. Leia antes de assumir algo.
    data/
      icons.json              GERADO — 739 ícones + índice invertido
      icon-stems.json         CURADO — 423 radicais de sinônimo. Única fonte editável.
      .raw-*.txt              extração bruta do Figma (intermediário)
    dist/icons/               SVGs normalizados (currentColor, sem width/height)
    scripts/
      sync-icons.mjs          Figma → tudo. Requer FIGMA_TOKEN.
      build-icons.mjs         raw + stems → icons.json. Offline, determinístico.
      find-icon.mjs           resolve intenção → ícone. Ponderado por IDF.
      verify-icons.mjs        checa o contrato. Sai ≠ 0 se quebrado. Pronto para CI.
    references/icons.md       como usar

## Fluxo

    sync-icons.mjs  ──►  .raw-*.txt  ──►  build-icons.mjs  ──►  icons.json
                                              ▲                     │
                                     icon-stems.json                ▼
                                                              verify-icons.mjs

## Próximas fases

    2  components.json com campo `status` (stable/beta/planned/deprecated)
    3  rules.json + validate.mjs — checklist executável
    4  tokens.json DTCG + build-css.mjs  (depende do ADR de espaçamento)
    5  SKILL.md enxuto (≤150 linhas) + roteamento
    6  ds.manifest.json ligado ao CI — deriva vira erro de build
    7  descrições estruturadas no Figma (722 ícones sem description)

---

## Fase 2 — componentes (concluída 2026-09-29)

    data/components.json         19 componentes reais + 9 planejados, curado à mão
    scripts/verify-components.mjs        integridade interna, sem rede
    scripts/check-components-drift.mjs   components.json vs Figma real, requer FIGMA_TOKEN
    references/components.md             como usar

Achado principal: 16 dos 19 componentes reais do Figma estavam documentados como
"planejados v1.1" na doc antiga. Nenhum foi descartado — todos entraram com
status correto (`stable`/`designed`/`beta`) e suas keys/props reais.

---

## Fase 3 — checklist executável (concluída 2026-09-29)

    data/rules.json                  regras derivadas de SKILL.md § 3 e § 8
    scripts/validate.mjs              motor de validação (HTML/CSS via regex)
    scripts/test-validate.mjs         teste de regressão — 4/4 casos
    scripts/__fixtures__/             sintetico.html + soul-ds-examples.html (real)
    references/rules.md               como usar + limitações declaradas

Achado ao testar contra o HTML real do projeto: 28 erros — 12 usos de
`.alert`, 4 de `.card`, 2 de `.table`, 9 de `.sidebar` sem `[DS-TEMP]`
(todos componentes ad hoc que não existem no Figma), e 1 `margin-left: 2px`
hardcoded dentro do próprio CSS da DS. `alert` não estava nem na lista de
planejados da Fase 2 — foi adicionado ao descobrir esta lacuna.

Dois bugs de regex apareceram e foram corrigidos na primeira passada do
motor (ver scripts/test-validate.mjs para o que eles protegem).

---

## Resolução do achado mais urgente da Fase 3 (2026-09-29)

28 erros → 2. Os 27 de governança eram falso alarme de categorização: `alert`,
`card`, `table`, `sidebar` e `badge` (achado ao extrair o CSS real — a classe
chama-se `.status`) são implementações reais de produção, só que sem respaldo
no Figma. Criado o status `codeOnly` (espelho de `designed`) e promovidos os 5
de `planejados` para `componentes`, com CSS extraído do arquivo real.

Os 2 erros que sobraram são genuínos: `margin-left: 2px` e `padding: 2px` — um
valor que não existe na escala de espaçamento. Não foram arredondados para o
token mais próximo (isso mudaria o visual); ver `references/patch-soul-ds-examples.md`
para o patch recomendado e `ESP-1` no manifesto para a decisão pendente na Fase 4.

Ao corrigir, o próprio validador revelou mais um bug nele mesmo: shorthand
parcialmente tokenizado (`padding: 2px var(--spacing-4)`) não era checado por
segmento — corrigido, coberto por `test-validate.mjs`.

---

## Fase 5 — SKILL.md enxuto (concluída 2026-09-29)

    project-root/SKILL.md         109 linhas, substitui as 587 originais
    project-root/components.md    stub, substitui as 251 originais
    project-root/icons.md         stub, substitui as 529 originais
    project-root/tokens.css       cópia + cabeçalho de aviso — CSS intocado

⚠️ **Estes 4 arquivos NÃO foram aplicados ao projeto real.** `/mnt/project`
é read-only neste ambiente — o que está em `project-root/` é o que copiar
manualmente por cima de `SKILL.md`, `components.md`, `icons.md` e
`tokens.css` na raiz do projeto. Até essa cópia acontecer, um agente que
abrir o projeto ainda lê os originais de 1367 linhas combinadas, com os
erros que as Fases 0–3 documentaram.

O novo SKILL.md não duplica nenhum dado — só declara invariantes, roteia
para `soul-ds/data/*.json` e `soul-ds/scripts/*.mjs`, e diz explicitamente
o que ainda não existe (tokens.json, patterns.md, a11y.md, os 731 SVGs que
faltam exportar) em vez de deixar essas lacunas subentendidas.

---

## Fase 4 — tokens DTCG + ADR-001 (concluída 2026-09-29)

    data/tokens.json                  primitivos (cor, spacing, radius, shadow, tipografia)
    data/themes.json                  32 tokens semânticos × 4 temas
    data/typography.json              tipografia × 3 modos de família
    scripts/build-css.mjs             gera dist/soul-ds.css a partir dos 3 JSONs
    scripts/verify-tokens.mjs         integridade — paths quebrados, temas incompletos
    scripts/migrate-spacing-refs.mjs  migração atômica índice→valor (ADR-001)
    scripts/test-migrate-spacing.mjs  4/4 — inclui o caso perigoso de colisão
    references/adr-001-spacing.md     decisão + tabela de migração completa
    references/tokens.md              como usar

**ADR-001 decidido**: espaçamento passa a nomear por valor (`--spacing-16`
= 16px, igual ao Figma), eliminando a ambiguidade de índice vs valor que
era o achado mais crítico da auditoria original. **Ainda não aplicado em
produção** — ver pendência ADR-001 no manifesto.

Dois bugs pegos pelo próprio processo: `build-css.mjs` tinha uma travessia
de só 2 níveis que descartava as 10 paletas de cor inteiras (só
white/black/transparent passavam por coincidência de profundidade); e a
estrutura de `$extensions.soul.correcao` em `tokens.json` não batia com o
que `verify-tokens.mjs` checava (chave com ponto literal vs aninhamento
real) — os dois foram achados pelos próprios verificadores, não por
inspeção manual.

Achado ao migrar: a maioria dos nomes novos de espaçamento já existe como
nome antigo com valor diferente (`--spacing-8` antigo=16px, novo=8px) — um
find-replace sequencial reescreveria o resultado do passo anterior. Por
isso `migrate-spacing-refs.mjs` faz a troca num único passe, e não em
etapas.

---

## Fase 6 — CI + sync fim-a-fim (concluída 2026-09-29)

    .github/workflows/verify.yml   CI sem rede — roda em todo push/PR
    .github/workflows/sync.yml     CI com rede — manual/semanal, requer secret FIGMA_TOKEN
    package.json                   npm run ci amarra tudo — testado localmente, exit 0

**Cobertura de ícones subiu de 8/739 (1%) para 53/739 (7%)** — exportação
real via Figma MCP nesta própria sessão, não apenas o script escrito e
nunca executado. Escolhidos para cobrir as consultas testadas na Fase 1
(`"cama do paciente"`, `"dose excessiva"`, `"agendar horario"` etc. agora
resolvem para arquivo real em disco, confirmado por teste).

**15 dos 24 componentes reconfirmados sem drift** contra o Figma nesta
fase (drift-check formal, mesma lógica de `check-components-drift.mjs`,
rodada ao vivo).

**O que não foi possível fingir**: `.github/workflows/sync.yml` nunca
rodou como GitHub Action de verdade — não há ambiente de CI real
disponível nesta sessão. A exportação de ícones que funcionou usou o
Figma MCP (Plugin API), um canal diferente do que `sync-icons.mjs` usa
(REST API + `FIGMA_TOKEN`). A primeira execução real do workflow é o
teste de que os dois caminhos produzem o mesmo resultado — registrado
como `CI-2`, severidade alta, no manifesto.

---

## Roadmap original — as 6 fases

| Fase | O que | Status |
|---|---|---|
| 0 | Auditoria completa do DS | ✓ |
| 1 | Ícones — índice + busca | ✓ validado contra Figma |
| 2 | Componentes — contrato + status | ✓ validado contra Figma |
| 3 | Regras executáveis (`validate.mjs`) | ✓ achado urgente resolvido |
| 4 | Tokens DTCG + ADR-001 | ✓ decidido, migração de produção pendente |
| 5 | `SKILL.md` enxuto | ✓ pronto, pendente de cópia manual (`SKL-1`) |
| 6 | CI + sync fim-a-fim | ✓ CI real, sync parcial (53/739 ícones, 15/24 componentes) |

Pendências que não fecham sozinhas, por decisão deliberada e não por
lacuna de execução: `SKL-1` (cópia manual dos arquivos de `project-root/`),
`ADR-001` (migração de espaçamento em produção), `CI-2` (primeira
execução real do workflow de sync). Todas exigem uma decisão ou uma
janela de mudança do time — nenhuma é "terminar de escrever código".
