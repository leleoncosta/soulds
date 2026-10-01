# Componentes — Soul DS

> Este arquivo tinha 251 linhas de props e CSS escritos à mão. 16 dos 19
> componentes reais do Figma estavam listados aqui como "planejados v1.1"
> — não estavam planejados, existiam, com descrição e Diretrizes completas.
> Esse erro concreto é a razão de este arquivo ter sido reduzido a um
> redirecionamento em vez de mantido como fonte de prop.

## Onde está o dado de verdade agora

- **Contrato completo** (props, variantes, regras, status, a11y):
  `soul-ds/data/components.json`
- **Como usar, o que fazer por status**: `soul-ds/references/components.md`
- **Validar uso de componente planejado sem marcação**:
  `node soul-ds/scripts/validate.mjs <arquivo>`

## Resumo para não abrir o JSON à toa

| Status | Quantos | O que fazer |
|---|---|---|
| `stable` | 2 (`button`, `input`) | Use o CSS direto |
| `designed` | 16 | Existe no Figma, sem CSS — implemente a partir do contrato |
| `codeOnly` | 5 (`alert`, `card`, `table`, `sidebar`, `badge`) | Existe em código de produção, sem Figma — use, mas sem revisão de design ainda |
| `beta` | 1 (`input-calendar`) | Existe, com lacuna conhecida (sem description no Figma) |
| `planned` | 5 (`select`, `toast`, `tab`, `skeleton`, `navbar`) | Não existe — HTML nativo + `[DS-TEMP]` |

Não confie neste resumo para decisão de implementação — ele existe só para
você saber qual chave procurar em `components.json`. Os detalhes reais
(props, enum de variante, regra de uso, nota de acessibilidade) estão lá,
não aqui.
