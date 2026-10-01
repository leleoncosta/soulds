# Soul DS — Skill para agentes de IA

> Versão: 2.0.0 · Substituição em 2026-09-29 do SKILL.md de 587 linhas.
> Se você está lendo isto por engano ao lado do SKILL.md antigo, use ESTE.
> O antigo tinha 13 de 19 componentes reais listados como "planejados" e
> contagem de ícones desatualizada — essa é a razão desta reescrita existir.

---

## O que mudou

Este arquivo não contém mais CSS, tabela de token, lista de ícone ou prop de
componente. Esses dados vivem em `soul-ds/data/*.json`, gerados ou curados a
partir do Figma real e validados contra ele — não escritos à mão e deixados
para dessincronizar. Este arquivo só faz três coisas: declara invariantes,
roteia para o dado certo, e diz como validar antes de entregar.

**Antes de qualquer tarefa de UI, leia `soul-ds/ds.manifest.json`.** Ele diz
o que está resolvido, o que está pendente, e a versão de cada artefato. Se
ele disser que um artefato está desatualizado em relação ao Figma, não
confie cegamente no `data/*.json` sem checar a pendência.

---

## Invariantes (sempre, sem exceção)

1. Todo valor de cor, espaçamento, radius ou fonte vem de `var(--token)`.
   Nunca hardcode. Se o token que você precisa não existe, isso é uma
   descoberta a registrar (`ds.manifest.json → pendencias`), não uma licença
   para inventar um valor.
2. Nunca reimplemente do zero um componente com `status` diferente de
   `planned` em `soul-ds/data/components.json`. Ícones nunca são
   desenhados à mão — sempre resolvidos por
   `node soul-ds/scripts/find-icon.mjs "<intenção>"`.
3. Todo componente ou ícone fora da DS leva
   `/* [DS-TEMP] motivo real */` — motivo genuíno, não "temporário" genérico.
4. **Antes de entregar qualquer HTML/CSS gerado:**
   `node soul-ds/scripts/validate.mjs <arquivo>`. Zero `error` no resultado.
   Avisos (`warn`) e itens `escapado` não bloqueiam, mas leia-os.

---

## Roteamento

| Preciso de… | Comando ou arquivo |
|---|---|
| um ícone | `node soul-ds/scripts/find-icon.mjs "<intenção>"` |
| contrato de um componente (props, variantes, regras, status) | `soul-ds/data/components.json` |
| validar HTML/CSS gerado | `node soul-ds/scripts/validate.mjs <arquivo>` |
| valor de token de cor/espaço/radius/fonte | `soul-ds/data/tokens.json` (primitivo) + `themes.json`/`typography.json` (semântico) — CSS gerado em `dist/soul-ds.css` |
| decisão de acessibilidade WCAG já mapeada | `soul-ds/data/rules.json → contrasteConhecido` |
| composição de tela (form, tabela, sidebar) | `soul-ds/references/patterns.md` |
| decisão de acessibilidade transversal (foco, ARIA não modelado, contraste) | `soul-ds/references/a11y.md` |
| estado geral da DS, o que está resolvido/pendente | `soul-ds/ds.manifest.json` |

Nenhuma dessas respostas está duplicada aqui. Se você achar um valor de
token, uma lista de ícone ou uma prop de componente escrita nesta prosa,
é sinal de regressão — abra uma pendência.

---

## O que ainda não existe / o que já foi resolvido nos artefatos, mas exige uma ação sua

- **`project-root/tokens.css` já está migrado e corrigido** (espaçamento
  por valor, ADR-001; os 2 valores de cor divergentes; o primitivo de
  2px). O que falta é **você aplicar** — rode
  `scripts/apply-project-root.sh` (testado de ponta a ponta em ambiente
  simulado, ver `ds.manifest.json`) ou copie manualmente. Até essa cópia
  acontecer, o `tokens.css` real do projeto continua na versão antiga.
- **`project-root/soul-ds-examples.html`** é a versão totalmente
  remediada do exemplo — `validate.mjs` dá zero erros nela (era 28 no
  início da Fase 3). Mesma ressalva: precisa ser copiada para valer.
- **739 ícones indexados, 68 com SVG real em disco (9%).** Cobertura
  ampliada nesta sessão via Figma MCP — o restante precisa de
  `node soul-ds/scripts/sync-icons.mjs` (requer `FIGMA_TOKEN` e rede,
  nunca executado como GitHub Action de verdade ainda, ver `CI-2`). Se
  `find-icon.mjs` apontar um ícone sem arquivo em `dist/icons/`, isso é
  uma lacuna a sinalizar — nunca gere o SVG à mão.
- **5 componentes reais sem respaldo no Figma** (`alert`, `card`, `table`,
  `sidebar`, `badge` — status `codeOnly`). Existem em produção, funcionam,
  mas nenhum designer os revisou ainda.
- **Contraste de `muted-foreground`, `border` e `ring` (temas Green)**
  continua abaixo do alvo WCAG — achado de paleta, não de token. Ver
  `references/a11y.md` para o detalhamento completo.

---

## Para quem trabalha com este arquivo

**Devs (Cursor / VS Code / Claude Code):** ao pedir uma tarefa de UI,
informe o template de página e os dados/campos — Claude já lê
`components.json` e `icons.json` automaticamente, não repita prop nem
nome de ícone no seu prompt.

**Designers (Figma + MCP):** o Figma é a fonte de verdade dos componentes
`stable`/`designed`/`beta`. Para os `codeOnly` (`alert`, `card`, `table`,
`sidebar`, `badge`), o código é hoje a única fonte — ainda não têm
componente Figma correspondente.

**Tech leads:** `node soul-ds/scripts/verify-icons.mjs`,
`verify-components.mjs` e `test-validate.mjs` rodam sem rede e devem ser
parte de qualquer CI. `check-components-drift.mjs` e `sync-icons.mjs`
precisam de `FIGMA_TOKEN` e ainda não foram plugados em pipeline nenhum.

---

## Referências

- Estado completo, versão de cada artefato, pendências: `soul-ds/ds.manifest.json`
- Ícones: `soul-ds/references/icons.md`
- Componentes: `soul-ds/references/components.md`
- Regras/validação: `soul-ds/references/rules.md`
- Figma: `https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026`
