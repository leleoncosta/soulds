#!/usr/bin/env node
/**
 * Soul DS — verify-icons.mjs
 *
 * Verifica que o índice e o disco contam a mesma história.
 * Feito para rodar em CI: sai com código ≠ 0 quando o contrato quebra.
 *
 * Uso:  node scripts/verify-icons.mjs [--strict]
 *
 * --strict  também reprova quando faltam SVGs (use depois do sync completo)
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STRICT = process.argv.includes('--strict');

const icons = JSON.parse(readFileSync(join(ROOT, 'data/icons.json'), 'utf8'));
const entradas = Object.entries(icons.icones);

const erros = [];
const avisos = [];

/* ── 1. Todo registro aponta para um SVG existente ────────────────────── */

const semSvg = entradas.filter(([, i]) => !existsSync(join(ROOT, i.svg)));
if (semSvg.length) {
  const msg = `${semSvg.length} de ${entradas.length} ícones sem SVG em disco`;
  (STRICT ? erros : avisos).push(msg);
}

/* ── 2. Todo SVG em disco tem registro no índice ──────────────────────── */

const indexados = new Set(entradas.map(([, i]) => i.svg));
const emDisco = [];
const varrer = (dir) => {
  if (!existsSync(dir)) return;
  for (const nome of readdirSync(dir)) {
    const p = join(dir, nome);
    if (statSync(p).isDirectory()) varrer(p);
    else if (nome.endsWith('.svg')) emDisco.push(relative(ROOT, p));
  }
};
varrer(join(ROOT, 'dist/icons'));

const orfaos = emDisco.filter((p) => !indexados.has(p));
if (orfaos.length) erros.push(`${orfaos.length} SVG(s) órfão(s), sem registro no índice: ${orfaos.slice(0, 5).join(', ')}`);

/* ── 3. Os SVGs presentes respeitam o contrato da DS ──────────────────── */

for (const p of emDisco) {
  const svg = readFileSync(join(ROOT, p), 'utf8');
  if (/fill="#[0-9a-fA-F]/.test(svg) || /stroke="#[0-9a-fA-F]/.test(svg))
    erros.push(`${p}: cor hardcoded — deve ser currentColor`);
  if (/\swidth="/.test(svg) || /\sheight="/.test(svg))
    erros.push(`${p}: width/height fixos — o tamanho é responsabilidade do CSS`);
  if (!/viewBox=/.test(svg)) erros.push(`${p}: sem viewBox`);
}

/* ── 4. Chaves do Figma íntegras e únicas ─────────────────────────────── */

const porKey = new Map();
for (const [id, i] of entradas) {
  if (!/^[0-9a-f]{40}$/.test(i.figmaKey)) erros.push(`${id}: figmaKey malformada`);
  if (porKey.has(i.figmaKey)) erros.push(`figmaKey duplicada entre ${porKey.get(i.figmaKey)} e ${id}`);
  porKey.set(i.figmaKey, id);
}

/* ── 5. Todo ícone tem keywords úteis ─────────────────────────────────── */

const poucasKw = entradas.filter(([, i]) => i.keywords.length < 3);
if (poucasKw.length)
  avisos.push(
    `${poucasKw.length} ícone(s) com menos de 3 keywords — adicione o radical em data/icon-stems.json: ` +
      poucasKw.slice(0, 8).map(([id]) => id.split('/').pop()).join(', ')
  );

/* ── 6. Anomalias e duplicatas conhecidas ─────────────────────────────── */

const anomalias = entradas.filter(([, i]) => i.anomalia);
const duplicatas = entradas.filter(([, i]) => i.duplicadoDe);
if (anomalias.length) avisos.push(`${anomalias.length} ícone(s) com anomalia dimensional no Figma`);
if (duplicatas.length) avisos.push(`${duplicatas.length} nome(s) colidente(s) no Figma`);

/* ── Relatório ────────────────────────────────────────────────────────── */

console.log(`\nSoul DS · verificação de ícones`);
console.log(`  índice:   ${entradas.length} registros`);
console.log(`  em disco: ${emDisco.length} SVGs`);
console.log(`  termos:   ${Object.keys(icons.indice).length} indexados\n`);

avisos.forEach((a) => console.log(`  ⚠ ${a}`));
erros.forEach((e) => console.log(`  ✗ ${e}`));

if (erros.length) {
  console.log(`\n✗ ${erros.length} erro(s). Contrato violado.\n`);
  process.exit(1);
}
console.log(`\n✓ contrato íntegro${avisos.length ? ` (${avisos.length} aviso(s))` : ''}\n`);
