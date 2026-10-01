# Patch recomendado — soul-ds-examples.html

> `soul-ds-examples.html` é read-only neste ambiente (fica em `/mnt/project/`).
> Este arquivo documenta exatamente o que aplicar na cópia real do projeto.
> Depois de aplicar, `node scripts/validate.mjs soul-ds-examples.html` deve dar 0 erros.

## Contexto

Rodar `validate.mjs` contra o arquivo real encontrou 28 erros. 27 eram de governança
(uso de `.alert`/`.card`/`.table`/`.sidebar` sem `[DS-TEMP]`) — resolvidos promovendo
esses 4 padrões (+ `badge`, achado na extração) de "planejado" para `codeOnly` em
`data/components.json`. Isso não exige nenhuma mudança no HTML: a governança para de
sinalizar automaticamente porque os componentes deixaram de ser "planejados".

Sobraram 2 erros reais, ambos o mesmo problema em dois lugares: **`2px` hardcoded**,
um valor que não existe na escala de espaçamento da DS.

## Achado 1 — `.input-field__required`

```diff
- .input-field__required { color: var(--color-error); margin-left: 2px; }
+ /* [DS-TEMP] 2px não existe na escala de spacing (--spacing-1=1px, --spacing-2=4px) — ver ds.manifest.json ESP-1 */
+ .input-field__required { color: var(--color-error); margin-left: 2px; }
```

## Achado 2 — `.status`

```diff
  .status {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-2);
-   padding: 2px var(--spacing-4);
+   /* [DS-TEMP] 2px não existe na escala de spacing — ver ds.manifest.json ESP-1 */
+   padding: 2px var(--spacing-4);
    border-radius: var(--radius-full);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
  }
```

## Por que não arredondar para um token existente

`--spacing-1-5` (1.5px) é o mais próximo abaixo, `--spacing-2` (4px) é o mais próximo
acima — mas **dobrar** o padding vertical do ponto de status ou do asterisco muda o
resultado visual, e isso não é uma decisão que um validador deveria tomar sozinho.
As duas ocorrências de `2px` são idênticas e independentes uma da outra — não é ruído,
é sinal de que a escala de espaçamento tem um buraco real nesse valor.

## Recomendação para a Fase 4

Ao decidir o ADR de renomeação do namespace de espaçamento (Figma nomeia por valor,
CSS por índice — achado da Fase 0), incluir um primitivo de 2px na escala, já que há
pelo menos dois usos de produção genuínos que precisam dele. Depois disso, os dois
`[DS-TEMP]` acima podem virar `var(--spacing-2px)` (ou o nome que o ADR decidir) e o
comentário sai.
