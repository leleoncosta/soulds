# Ícones — Soul DS

> Este arquivo tinha 529 linhas listando nome e key de cada ícone à mão.
> Bastava um ícone ser adicionado, removido ou corrigido no Figma para essa
> lista ficar desatualizada — e ficou: a versão anterior dizia "zero issues
> na varredura" quando havia 8 reais. Por isso a lista deixou de viver aqui.

## Onde está o dado de verdade agora

- **Índice completo + busca por intenção**: `soul-ds/data/icons.json`
- **Resolver um ícone**: `node soul-ds/scripts/find-icon.mjs "<intenção>"`
- **Como usar, contrato de markup**: `soul-ds/references/icons.md`
- **Checar integridade** (SVG órfão, cor hardcoded, anomalia dimensional):
  `node soul-ds/scripts/verify-icons.mjs`

## Resumo para não abrir o JSON à toa

| Coleção | Ícones | Quando usar |
|---|---|---|
| `mv-hosp` | 250 | Contexto clínico — prescrição, prontuário, leito, triagem |
| `mv-basico` | 489 | UI genérica — salvar, editar, filtro, setas |

**Nunca escolha um ícone de memória e nunca gere SVG à mão.** Resolva
sempre por `find-icon.mjs` — ele existe exatamente para substituir a leitura
desta lista, com busca ponderada em vez de escaneamento visual de 739 linhas.

Estado da exportação de SVG: ver `soul-ds/ds.manifest.json → artefatos →
"dist/icons/"`. Nem todo ícone indexado tem arquivo em disco ainda — se
`find-icon.mjs` apontar um caminho que não existe, isso é uma lacuna a
sinalizar, não uma licença para desenhar o SVG.
