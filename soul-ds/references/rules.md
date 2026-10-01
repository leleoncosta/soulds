# Regras — Soul DS

> Esta página descreve **como usar**. As regras estão em `data/rules.json`.
> O checklist da seção 8 do `SKILL.md` virou asserção — ou passa, ou não passa.

---

## Uso

```bash
node scripts/validate.mjs caminho/para/arquivo.html
node scripts/validate.mjs caminho/para/arquivo.css
node scripts/validate.mjs caminho/para/arquivo.html --json   # para consumo programático
```

Sai com código `0` se não houver nenhum **erro** (avisos e escapados não bloqueiam). Um agente deve rodar isso sobre o próprio código gerado antes de entregar — é o "rode o checklist" do `SKILL.md § 8`, mas de verdade.

---

## O que é checado

| Regra | O quê | Severidade |
|---|---|---|
| `token-cor` | `color`/`background`/`fill`/`stroke` etc. em hex fora de `var(--color-*)` | error |
| `token-espacamento` | `padding`/`margin`/`gap` em px fora de `var(--spacing-*)` | error |
| `token-radius` | `border-radius` em px fora de `var(--radius-*)` | error |
| `token-fonte` | `font-size` em px fora de `var(--font-size-*)` | error |
| `icon-btn-aria-label` | botão cujo único conteúdo é `.icon` sem `aria-label` | error |
| `icon-decorativo-aria-hidden` | `.icon` sem `role="img"` e sem `aria-hidden="true"` | error |
| `icon-semantico-aria-label` | `.icon` com `role="img"` sem `aria-label` | error |
| `input-label-associado` | `<input id="x">` sem `<label for="x">` nem `aria-label` | error |
| `svg-inline-currentcolor` | `<svg>` colado com `fill`/`stroke` em hex | error |
| `componente-planejado-sem-marcacao` | classe bate com um componente `status: planned` em `components.json` | error |
| `contraste-*` | uso de um token com contraste já medido abaixo do alvo WCAG na Fase 0 | **warn**, não recalcula |

---

## O escape hatch

```html
<!-- [DS-TEMP] motivo real, não "temporário" -->
<span class="badge badge--contagem">3</span>
```

```css
/* [DS-TEMP] motivo real */
.ajuste-fino { margin-top: 1px; }
```

Funciona com os dois estilos de comentário (`<!-- -->` e `/* */`) — o validador procura o marcador nos 400 caracteres anteriores à ocorrência e exige um motivo não vazio depois dele. Sem motivo, não escapa.

Um achado escapado ainda aparece no relatório (categoria "ESCAPADOS"), só não bloqueia o exit code. É rastreável, não é silenciado.

---

## Limitações — o que este validador NÃO faz

Isto é varredura de texto/regex, não um parser de AST de CSS ou HTML. Ele é proporcional ao que dá para verificar com confiança sem depender de bibliotecas externas — não finge ser mais do que é:

- **Não recalcula contraste.** As entradas de `contrasteConhecido` citam a razão já medida na Fase 0 contra os valores reais de `tokens.css`. Se o token mudar, os números aqui ficam desatualizados até a próxima auditoria — não há recomputo automático nesta fase.
- **`outline: none` não é checado.** Detectar se existe um substituto de foco visível em outro lugar do arquivo exigiria entender cascata e especificidade — fora do escopo de regex. Revisão manual continua necessária para 2.4.7.
- **Coleção de ícone (mv-hosp vs mv-basico) não é validada.** Julgar se o contexto da tela é clínico é uma decisão semântica, não estrutural — arriscaria falsos positivos.
- **`componente-planejado-sem-marcacao` é um piso, não um teto.** Ele casa pelo nome BEM literal da classe contra a chave em `components.json → planejados`. Se um componente sai de `planejados` (porque foi promovido a `codeOnly`, por exemplo), a regra para de vigiar aquele nome — mesmo que a implementação real use uma classe diferente do conceito. Caso real: `badge` foi promovido a `codeOnly` nesta fase, mas o CSS de produção chama-se `.status`, não `.badge`. Um `<span class="badge">` novo, sem relação com a implementação real, não seria mais sinalizado. Isso é uma lacuna conhecida, documentada em `data/components.json → componentes.badge.pendencias`, não um bug deste validador.
- **Valores shorthand são checados por segmento, não pela declaração inteira.** `padding: 2px var(--spacing-4)` tem uma parte tokenizada e uma hardcoded — a primeira versão do validador via `var(` em qualquer lugar do valor e pulava a declaração inteira, deixando passar o `2px`. Corrigido para dividir o valor por espaço (respeitando parênteses) e checar cada pedaço.
- **Um arquivo por vez.** Não segue `<link>` nem resolve imports — valide cada arquivo que o agente gerar.

---

## Testes de regressão

```bash
node scripts/test-validate.mjs
```

Existe porque o próprio motor teve dois bugs de regex na primeira versão: `id="..."` casando dentro de `aria-invalid="true"` (correção: `\b` antes de `id=`), e o motivo do `[DS-TEMP]` vazando para o comentário seguinte quando havia dois marcadores no mesmo arquivo (correção: reconhecer `-->` além de `*/`, e pegar o match mais próximo da ocorrência, não o primeiro da janela). Um terceiro bug apareceu ao resolver o achado mais urgente da Fase 3 (ver abaixo): shorthand misto não era checado por segmento. Os fixtures em `scripts/__fixtures__/` fixam esse comportamento.

---

## Resolução do achado mais urgente (2026-09-29)

A primeira passada do validador contra `soul-ds-examples.html` real achou 28 erros: 12 usos de `.alert`, 4 de `.card`, 2 de `.table`, 9 de `.sidebar` sem `[DS-TEMP]`. Investigando, nenhum dos quatro era código malfeito — eram implementações reais, com tokens corretos e ARIA correto, que simplesmente não existem no Figma e por isso não tinham entrada em `components.json`.

A correção não foi marcar tudo com `[DS-TEMP]` — isso trataria sintoma, não causa, e o próprio `rules.md` define `[DS-TEMP]` como motivo real, não bula genérica para lacuna de documentação. A correção foi criar um status novo, `codeOnly` (espelho de `designed`: em vez de "no Figma, sem código", é "em código, sem Figma"), e promover `alert`, `card`, `table`, `sidebar` e `badge` (achado durante a extração — a classe real chama-se `.status`) de `planejados` para `componentes`, com o CSS real extraído do arquivo, não reconstruído de memória.

Resultado: **28 → 2 erros.** Os 2 que sobraram são reais e não são de governança — são `margin-left: 2px` (asterisco de campo obrigatório) e `padding: 2px var(--spacing-4)` (ponto do badge de status), ambos usando um valor que não existe na escala de espaçamento (`--spacing-1`=1px, `--spacing-1-5`=1.5px, `--spacing-2`=4px — nenhum é 2px). Isso não foi silenciosamente arredondado para o token mais próximo — é uma decisão de design (a Fase 4 deve resolver isso junto do ADR de espaçamento), registrada em `ds.manifest.json` como pendência ESP-1.

