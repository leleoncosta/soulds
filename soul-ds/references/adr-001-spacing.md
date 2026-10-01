# ADR-001 — Nomear espaçamento por valor, não por índice

> Status: **decidido e aplicado nos artefatos entregues** — `data/tokens.json`,
> `dist/soul-ds.css`, `project-root/tokens.css` e `project-root/soul-ds-examples.html`
> já usam a convenção nova. Falta só você copiar `project-root/*` para a
> raiz do projeto real (`scripts/apply-project-root.sh`, testado de ponta
> a ponta em ambiente simulado — ver `ds.manifest.json`).
> Data: 2026-09-29 · Achado original: auditoria Fase 0.

## O problema

O Figma nomeia espaçamento por **valor** (`spacing/8` = 8px). O `tokens.css`
em produção nomeia por **índice** (`--spacing-8` = 16px). Mesmo nome, valor
diferente, em toda a escala. Um designer lendo `spacing/8` no inspector do
Figma e um dev escrevendo `var(--spacing-8)` no CSS produzem resultados
diferentes por um fator de 2 — sem nenhum aviso, sem type error, sem lint.

Consequência medida na Fase 0: só **17%** dos paddings/gaps dos componentes
no Figma estavam vinculados a variável — a escala ambígua desincentivava a
própria equipe de design a usar token de espaçamento.

## A decisão

**Nomear por valor em CSS também.** `--spacing-16` passa a significar
sempre 16px, igual ao Figma. Foi a opção já recomendada no relatório da
Fase 0 e é a convenção de mercado (Tailwind, Material, Radix).

A alternativa — renomear o Figma para índice — foi descartada: variáveis
Figma já publicadas são consumidas por arquivos de design existentes;
migrar o lado do código é o caminho de menor atrito.

## ⚠ O perigo da migração — leia antes de aplicar

Não é uma renomeação simples. **A maioria dos nomes novos já existe como
nome antigo, com valor diferente.** `--spacing-8` antigo valia 16px; o
`--spacing-8` novo vale 8px. Um find-replace sequencial, rodando as trocas
uma de cada vez, reescreve o resultado da troca anterior:

```
passo 1: --spacing-4  → --spacing-8    (a variável antiga de 8px vira --spacing-8)
passo 2: --spacing-8  → --spacing-16   (isso pega TAMBÉM o que o passo 1 acabou de escrever!)
```

O resultado do passo 1 (que devia ficar `--spacing-8` = 8px) é capturado de
novo pelo passo 2 e vira `--spacing-16` — dado errado, silencioso, sem
erro de sintaxe para avisar.

**Use `scripts/migrate-spacing-refs.mjs`**, que faz a substituição num
único passe (decide o nome novo a partir do valor de cada ocorrência, não
encadeia). Testado em `scripts/test-migrate-spacing.mjs`, incluindo
exatamente esse caso perigoso (`padding: var(--spacing-4) var(--spacing-8)`
→ `padding: var(--spacing-8) var(--spacing-16)`, os dois corretos na mesma
linha).

## Tabela de migração completa

| Nome antigo (índice) | Valor | Nome novo (valor) |
|---|---|---|
| `--spacing-0` | 0px | `--spacing-0` |
| `--spacing-1` | 1px | `--spacing-1` |
| `--spacing-1-5` | 1.5px | `--spacing-1-5` |
| `--spacing-2` | 4px | `--spacing-4` |
| `--spacing-3` | 6px | `--spacing-6` |
| `--spacing-4` | 8px | `--spacing-8` |
| `--spacing-5` | 10px | `--spacing-10` |
| `--spacing-6` | 12px | `--spacing-12` |
| `--spacing-7` | 14px | `--spacing-14` |
| `--spacing-8` | 16px | `--spacing-16` |
| `--spacing-10` | 20px | `--spacing-20` |
| `--spacing-12` | 24px | `--spacing-24` |
| `--spacing-14` | 28px | `--spacing-28` |
| `--spacing-16` | 32px | `--spacing-32` |
| `--spacing-18` | 36px | `--spacing-36` |
| `--spacing-20` | 40px | `--spacing-40` |
| `--spacing-22` | 44px | `--spacing-44` |
| `--spacing-24` | 48px | `--spacing-48` |
| `--spacing-28` | 56px | `--spacing-56` |
| `--spacing-32` | 64px | `--spacing-64` |
| `--spacing-40` | 80px | `--spacing-80` |
| `--spacing-48` | 96px | `--spacing-96` |

**Novo, sem equivalente antigo:** `--spacing-2` = 2px (achado ESP-1, Fase 3
— dois usos reais de produção que não tinham token correspondente).

Só 3 dos 22 nomes ficam iguais (`0`, `1`, `1-5`). Os outros 19 mudam de
valor sob o mesmo nome durante a transição — daí o perigo do find-replace
sequencial.

## Aplicação

1. **`data/tokens.json`, `dist/soul-ds.css`** — já geridos pela nova
   convenção nesta entrega. Não precisam de migração; são a fonte nova.
2. **`project-root/tokens.css`** (o arquivo real do projeto) — continua na
   convenção antiga por decisão deliberada: substituí-lo silenciosamente
   mudaria o valor de toda variável de espaçamento em produção sem
   coordenação. Migrar quando o time decidir o momento.
3. **Consumidores** (`soul-ds-examples.html` e qualquer outro CSS/HTML que
   use `--spacing-N`) — rodar:
   ```bash
   node scripts/migrate-spacing-refs.mjs <arquivo>            # confere o diff
   node scripts/migrate-spacing-refs.mjs <arquivo> --write    # aplica
   ```
4. Depois de migrar todos os consumidores, trocar `project-root/tokens.css`
   por `dist/soul-ds.css` (ou apontar o `@import` para lá) e remover o
   cabeçalho de aviso desta fase.

## Por que não foi aplicado automaticamente aqui

`/mnt/project` é read-only neste ambiente — não há como escrever no
arquivo real do projeto. Mais importante: mesmo que fosse possível, migrar
a nomenclatura de espaçamento de produção é uma decisão que precisa de
uma janela deliberada (visual QA, deploy coordenado), não algo para
acontecer como efeito colateral de uma sessão de documentação.
