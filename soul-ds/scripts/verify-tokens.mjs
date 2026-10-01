#!/usr/bin/env node
/**
 * Soul DS — verify-tokens.mjs
 *
 * Checa que themes.json e typography.json só referenciam paths que
 * realmente existem em tokens.json, que os 4 temas têm os mesmos 32
 * tokens (nenhum tema com token a menos), e que build-css.mjs roda sem
 * aviso. Não recalcula contraste — isso é scripts/check-contrast.mjs.
 *
 * Uso:  node scripts/verify-tokens.mjs
 */

import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(readFileSync(join(ROOT, 'data/tokens.json'), 'utf8'));
const themes = JSON.parse(readFileSync(join(ROOT, 'data/themes.json'), 'utf8'));
const typo = JSON.parse(readFileSync(join(ROOT, 'data/typography.json'), 'utf8'));

const erros = [];
const avisos = [];

function existe(path) {
  const partes = path.split('.');
  let no = tokens;
  for (const p of partes) {
    if (no == null || !(p in no)) return false;
    no = no[p];
  }
  return no && typeof no === 'object' && '$value' in no;
}

/* ── 1. Todo path em themes.json resolve em tokens.json ──────────────── */

const TEMAS = ['blueLight', 'blueDark', 'greenLight', 'greenDark'];
let totalPaths = 0;
for (const [tokenPath, resolucao] of Object.entries(themes.tokens)) {
  if (tokenPath.startsWith('$')) continue;
  for (const tema of TEMAS) {
    const alvo = resolucao[tema];
    if (!alvo) { erros.push(`themes.json: "${tokenPath}" sem valor para "${tema}"`); continue; }
    totalPaths++;
    if (!existe(alvo)) erros.push(`themes.json: "${tokenPath}[${tema}]" aponta para "${alvo}", que não existe em tokens.json`);
  }
}
for (const [tokenPath, alvo] of Object.entries(themes.literais)) {
  if (tokenPath.startsWith('$')) continue;
  if (!existe(alvo)) erros.push(`themes.json → literais: "${tokenPath}" aponta para "${alvo}", que não existe`);
}

/* ── 2. Todo path em typography.json resolve ─────────────────────────── */

for (const [nome, alvo] of Object.entries(typo.familia)) {
  if (!existe(alvo)) erros.push(`typography.json → familia.${nome}: "${alvo}" não existe`);
}
for (const [nome, alvo] of Object.entries(typo.peso)) {
  if (nome.startsWith('$')) continue;
  const path = typeof alvo === 'string' ? alvo : alvo.$valor;
  if (!existe(path)) erros.push(`typography.json → peso.${nome}: "${path}" não existe`);
}
for (const [nome, alvo] of Object.entries(typo.tamanho)) {
  if (!existe(alvo)) erros.push(`typography.json → tamanho.${nome}: "${alvo}" não existe`);
}

/* ── 3. Nenhum tema com token a menos que outro ──────────────────────── */

const porTema = {};
for (const tema of TEMAS) {
  porTema[tema] = Object.entries(themes.tokens).filter(([k, v]) => !k.startsWith('$') && v[tema]).length;
}
const contagens = new Set(Object.values(porTema));
if (contagens.size > 1) {
  erros.push(`Temas com número diferente de tokens: ${JSON.stringify(porTema)}`);
}

/* ── 4. build-css.mjs roda sem lançar e sem aviso ────────────────────── */

try {
  const saida = execFileSync('node', [join(ROOT, 'scripts/build-css.mjs')], { encoding: 'utf8' });
  if (saida.includes('⚠')) erros.push(`build-css.mjs produziu aviso: ${saida.split('\n').filter((l) => l.includes('⚠')).join(' | ')}`);
  if (!existsSync(join(ROOT, 'dist/soul-ds.css'))) erros.push('build-css.mjs rodou mas dist/soul-ds.css não foi criado');
} catch (e) {
  erros.push(`build-css.mjs falhou: ${e.message}`);
}

/* ── 5. Os 2 valores corrigidos (T-orange/T-green) estão marcados ───── */

const orange600 = tokens.color.orange['600'];
const green600 = tokens.color.green['600'];
if (orange600.$value !== '#CC4705') avisos.push('color.orange.600 não é mais #CC4705 — a correção da Fase 0 foi revertida?');
if (green600.$value !== '#37833A') avisos.push('color.green.600 não é mais #37833A — a correção da Fase 0 foi revertida?');
if (!orange600.$extensions?.soul?.correcao) avisos.push('color.orange.600 não tem $extensions.soul.correcao — perde a rastreabilidade da mudança');
if (!green600.$extensions?.soul?.correcao) avisos.push('color.green.600 não tem $extensions.soul.correcao — perde a rastreabilidade da mudança');

/* ── 6. O primitivo de 2px (ESP-1) existe ────────────────────────────── */

if (!tokens.spacing['2'] || tokens.spacing['2'].$value !== '2px') {
  erros.push('tokens.spacing["2"] deveria valer 2px (achado ESP-1, Fase 3) — não encontrado ou valor errado');
}

/* ── Relatório ────────────────────────────────────────────────────────── */

console.log(`\nSoul DS · verificação de tokens`);
console.log(`  temas: ${TEMAS.length} · tokens semânticos checados: ${totalPaths}`);
console.log(`  primitivos de cor: ${Object.keys(tokens.color).length} paletas`);
console.log(`  primitivos de espaçamento: ${Object.keys(tokens.spacing).length}\n`);

avisos.forEach((a) => console.log(`  ⚠ ${a}`));
erros.forEach((e) => console.log(`  ✗ ${e}`));

if (erros.length) {
  console.log(`\n✗ ${erros.length} erro(s).\n`);
  process.exit(1);
}
console.log(`\n✓ contrato íntegro${avisos.length ? ` (${avisos.length} aviso(s))` : ''}\n`);
