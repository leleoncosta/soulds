# Tokens — Soul DS

> Esta página descreve **como usar**. Os valores estão em
> `data/tokens.json` (primitivo), `data/themes.json` (semântico × 4 temas)
> e `data/typography.json` (tipografia × 3 modos).

---

## Contrato

1. **Nunca use um primitivo direto num componente.** `color.bluesoul.700`
   existe para ser referenciado por `themes.json`, não para aparecer em CSS
   de componente. Use sempre o token semântico (`--color-primary`).
2. **`--spacing-N` nomeia por valor, não por índice** (ADR-001).
   `--spacing-16` = 16px, sempre — igual ao Figma. Se você está vendo
   `--spacing-8` valendo 16px em algum lugar, esse arquivo ainda não foi
   migrado — ver `references/adr-001-spacing.md`.
3. **Todo `$extensions.soul.correcao`** em `tokens.json` marca um valor que
   diverge do que está em produção hoje (`project-root/tokens.css`). O
   valor em `tokens.json` é o certo (confirmado contra o Figma); o CSS em
   produção ainda não foi sincronizado.

---

## Gerar o CSS

```bash
node scripts/build-css.mjs      # gera dist/soul-ds.css a partir dos 3 JSONs
node scripts/verify-tokens.mjs  # confere integridade — paths quebrados, temas com token faltando
```

`dist/soul-ds.css` usa cascata `var()` de verdade — `--color-primary` não é
achatado para `#205E7E`, é `var(--primitive-color-bluesoul-700)`. Sobrescrever
o primitivo continua propagando, igual ao `tokens.css` original.

---

## Migrar um arquivo para a nova nomenclatura de espaçamento

```bash
node scripts/migrate-spacing-refs.mjs arquivo.css              # mostra o diff
node scripts/migrate-spacing-refs.mjs arquivo.css --write      # aplica
```

**Não faça isso com find-replace manual.** A maioria dos nomes novos já
existe como nome antigo com valor diferente (`--spacing-8` antigo = 16px,
novo = 8px) — um find-replace sequencial reescreve o resultado do passo
anterior. O script resolve isso num único passe. Ver `adr-001-spacing.md`
para a tabela completa e o motivo do perigo.

---

## Os 2 valores corrigidos nesta fase

| Token | Produção (`tokens.css`) | Corrigido (`tokens.json`) | Fonte da correção |
|---|---|---|---|
| `color.orange.600` (warning) | `#F05406` (3.37:1, falha AA) | `#CC4705` (4.50:1, passa) | Figma — divergência achada na Fase 0 |
| `color.green.600` (success) | `#43A047` (3.16:1, falha AA) | `#37833A` (4.50:1, passa) | Figma — mesma situação |

Os dois ainda falham contraste quando combinados com o `*-background` do
próprio tema (`.alert--success` fica em 4.18:1, `.alert--warning` em
4.42:1 — ambos abaixo do alvo de 4.5:1, mas mais perto). Ver
`data/rules.json → contrasteConhecido` para os números exatos e
`validate.mjs` para a citação automática quando esses tokens aparecem num
arquivo.

**Isso não foi aplicado a `project-root/tokens.css`** — só a `tokens.json`
(a fonte nova). Sincronizar produção é uma decisão separada, não uma
correção automática.

---

## O primitivo novo: `spacing.2` (2px)

Achado na Fase 3 (`ESP-1`): dois usos reais e independentes de `2px`
hardcoded (`margin-left` do asterisco de campo obrigatório;
`padding` vertical do badge de status) não tinham token correspondente —
a escala pulava de 1.5px para 4px. Adicionado como primitivo formal.

---

## O que ainda não está resolvido

- **`project-root/tokens.css` não foi migrado** para a nomenclatura por
  valor — continua com a ambiguidade original até o time decidir a janela
  de migração (ver `adr-001-spacing.md → Aplicação`).
- **Contraste de `mutedForeground`, `border` e `ring` nos temas Green**
  continua abaixo do alvo — são achados de paleta, não de nomenclatura, e
  não fazem parte do escopo desta fase (ADR de cor separado, ainda não
  aberto).
- **Modos dark (`blueDark`, `greenDark`)** têm `*-background` no tom 800 da
  paleta com texto no tom 600 — dois tons escuros sobrepostos. Ver
  `themes.json → temasComContrasteFalho` para o diagnóstico completo.
