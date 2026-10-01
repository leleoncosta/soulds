#!/usr/bin/env node
/**
 * Soul DS — build-css.mjs
 *
 * Gera dist/soul-ds.css a partir de data/tokens.json (primitivos),
 * data/themes.json (semântico × 4 temas) e data/typography.json
 * (tipografia × 3 modos de família). Determinístico — mesma entrada,
 * mesma saída byte a byte.
 *
 * Substitui tokens.css escrito à mão. Nomeia por VALOR (ADR-001) —
 * --spacing-16 agora significa 16px, sempre, igual ao Figma.
 *
 * Uso:  node scripts/build-css.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data');
const DIST = join(ROOT, 'dist');

const tokens = JSON.parse(readFileSync(join(DATA, 'tokens.json'), 'utf8'));
const themes = JSON.parse(readFileSync(join(DATA, 'themes.json'), 'utf8'));
const typo = JSON.parse(readFileSync(join(DATA, 'typography.json'), 'utf8'));

/* ── Helpers ──────────────────────────────────────────────────────────── */

/** Resolve um path tipo "color.bluesoul.700" até o valor final — usado só
 *  para VALIDAR que o path é real (path quebrado deve estourar erro aqui,
 *  não silenciosamente virar CSS quebrado) e para cálculo de contraste. */
function resolver(path) {
  const partes = path.split('.');
  let no = tokens;
  for (const p of partes) {
    if (no == null) throw new Error(`path quebrado em "${path}" — falta "${p}"`);
    no = no[p];
  }
  if (no && typeof no === 'object' && '$value' in no) return no.$value;
  throw new Error(`"${path}" não resolveu para um token folha`);
}

/** Nome da variável CSS do PRIMITIVO correspondente a um path — usado para
 *  emitir var(--primitive-...) em vez de achatar para o valor literal.
 *  Mantém a cascata primitivo→semântico que o tokens.css original já usava:
 *  sobrescrever um primitivo continua propagando, e o CSS gerado mostra a
 *  origem do valor em vez de só o hex final. */
function varPrimitivo(path) {
  resolver(path); // valida que o path existe antes de gerar o nome
  return `--primitive-${kebab(path.replace(/\./g, '-'))}`;
}

/** camelCase → kebab-case, para nome de variável CSS. */
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/** Valor de fontFamily (array) vira lista CSS com fallback. */
const cssValor = (v) => (Array.isArray(v) ? v.map((f) => (/\s/.test(f) ? `'${f}'` : f)).join(', ') : v);

let avisos = [];

/* ── 1. Primitivos — nunca usar direto, mas ficam disponíveis ────────── */

/** Percorre tokens.json recursivamente e emite uma linha CSS por token folha.
 *  Bug corrigido nesta sessão: uma versão anterior só descia 2 níveis fixos,
 *  o que deixava de fora as 10 paletas de cor inteiras (bluesoul, neutral,
 *  red...) porque elas ficam um nível abaixo de "color" — só white/black/
 *  transparent, que são folhas diretas de "color", passavam por acidente. */
function blocoPrimitivos() {
  const linhas = ['  /* Primitivos — nunca use direto em componente, sempre via token semântico abaixo */'];
  function percorrer(no, caminho) {
    if (no && typeof no === 'object' && '$value' in no) {
      linhas.push(`  --primitive-${kebab(caminho.join('-'))}: ${cssValor(no.$value)};`);
      return;
    }
    if (no && typeof no === 'object') {
      for (const [chave, filho] of Object.entries(no)) {
        if (chave.startsWith('$')) continue;
        percorrer(filho, [...caminho, chave]);
      }
    }
  }
  for (const [grupo, itens] of Object.entries(tokens)) {
    if (grupo.startsWith('$')) continue;
    percorrer(itens, [grupo]);
  }
  return linhas.join('\n');
}

/* ── 2. Semântico por tema ────────────────────────────────────────────── */

function blocoTema(temaKey) {
  const linhas = [];
  for (const [tokenPath, resolucao] of Object.entries(themes.tokens)) {
    if (tokenPath.startsWith('$')) continue;
    const alvo = resolucao[temaKey];
    if (!alvo) { avisos.push(`themes.json: "${tokenPath}" não tem valor para o tema "${temaKey}"`); continue; }
    let varNome;
    try { varNome = varPrimitivo(alvo); } catch (e) { avisos.push(`${tokenPath}[${temaKey}] → ${e.message}`); continue; }
    const nomeCss = '--color-' + kebab(tokenPath.replace(/^color\./, ''));
    linhas.push(`  ${nomeCss}: var(${varNome});`);
  }
  for (const [tokenPath, alvo] of Object.entries(themes.literais)) {
    if (tokenPath.startsWith('$')) continue;
    const nomeCss = '--color-' + kebab(tokenPath.replace(/^color\./, ''));
    linhas.push(`  ${nomeCss}: var(${varPrimitivo(alvo)});`);
  }
  return linhas.join('\n');
}

/* ── 3. Tipografia por modo de família ────────────────────────────────── */

function blocoTipografiaModo(modoKey) {
  return `  --font-family-base: var(${varPrimitivo(typo.familia[modoKey])});`;
}

function blocoTipografiaComum() {
  const linhas = [];
  for (const [nome, alvo] of Object.entries(typo.peso)) {
    if (nome.startsWith('$')) continue;
    const path = typeof alvo === 'string' ? alvo : alvo.$valor;
    linhas.push(`  --font-weight-${kebab(nome)}: var(${varPrimitivo(path)});`);
  }
  for (const [nome, alvo] of Object.entries(typo.tamanho)) {
    linhas.push(`  --font-size-${kebab(nome)}: var(${varPrimitivo(alvo)});`);
  }
  for (const [nome] of Object.entries(tokens.fontSize)) {
    linhas.push(`  --font-size-${kebab(nome)}: var(${varPrimitivo('fontSize.' + nome)});`);
  }
  for (const [nome, tok] of Object.entries(tokens.lineHeight)) {
    linhas.push(`  --line-height-${kebab(nome)}: ${tok.$value};`);
  }
  linhas.push(`  --font-family-alt: var(${varPrimitivo('fontFamily.roboto')});`);
  linhas.push(`  --font-family-inter: var(${varPrimitivo('fontFamily.inter')});`);
  linhas.push(`  --font-family-mono: var(${varPrimitivo('fontFamily.mono')});`);
  return linhas.join('\n');
}

/* ── 4. Escalas simples (spacing, radius, shadow, border-width) ──────── */

function blocoEscala(grupo, prefixoCss) {
  const linhas = [];
  for (const [nome, tok] of Object.entries(tokens[grupo])) {
    if (nome.startsWith('$')) continue;
    linhas.push(`  --${prefixoCss}-${nome}: ${tok.$value};`);
  }
  return linhas.join('\n');
}

/* ── Montagem ─────────────────────────────────────────────────────────── */

const TEMA_ATTR = { blueLight: 'blue-light', blueDark: 'blue-dark', greenLight: 'green-light', greenDark: 'green-dark' };

const css = `/*
 * Soul DS — dist/soul-ds.css
 * GERADO por scripts/build-css.mjs a partir de data/tokens.json + themes.json + typography.json
 * Não editar à mão — editar os JSONs de origem e rodar o build novamente.
 *
 * ADR-001: variáveis de espaçamento nomeadas por VALOR, não por índice.
 * --spacing-16 = 16px, sempre — igual ao Figma. Ver references/adr-001-spacing.md
 * para o mapa de migração se você vem da versão anterior (índice-based).
 */

:root {
${blocoPrimitivos()}

  /* Escalas — semânticas, prontas para uso direto em componente */
${blocoEscala('spacing', 'spacing')}
${blocoEscala('radius', 'radius')}
${blocoEscala('borderWidth', 'border-width')}
${blocoEscala('shadow', 'shadow')}

${blocoTipografiaComum()}
}

/* ── Temas — cor semântica, uma property por conceito, 4 temas ────────── */

:root,
[data-theme="${TEMA_ATTR.blueLight}"] {
${blocoTema('blueLight')}
${blocoTipografiaModo('openSans')}
}

[data-theme="${TEMA_ATTR.blueDark}"] {
${blocoTema('blueDark')}
}

[data-theme="${TEMA_ATTR.greenLight}"] {
${blocoTema('greenLight')}
}

[data-theme="${TEMA_ATTR.greenDark}"] {
${blocoTema('greenDark')}
}

/* ── Modos de família tipográfica — independentes do tema de cor ─────── */

[data-font="roboto"] {
${blocoTipografiaModo('roboto')}
}

[data-font="inter"] {
${blocoTipografiaModo('inter')}
}
`;

mkdirSync(DIST, { recursive: true });
writeFileSync(join(DIST, 'soul-ds.css'), css);

const hash = createHash('sha256').update(css).digest('hex').slice(0, 16);
console.log(`✓ dist/soul-ds.css  ·  ${css.split('\n').length} linhas  ·  sha256:${hash}`);
if (avisos.length) {
  console.log(`  ⚠ ${avisos.length} aviso(s):`);
  avisos.forEach((a) => console.log(`    ${a}`));
}
