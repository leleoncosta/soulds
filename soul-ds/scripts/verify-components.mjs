#!/usr/bin/env node
/**
 * Soul DS — verify-components.mjs
 *
 * Checa a integridade interna de data/components.json: enums válidos,
 * keys no formato certo, nenhuma duplicata, nenhuma contradição entre
 * status e os campos que ele implica, totais batendo com a contagem real.
 *
 * Não toca a rede — para confirmar que o arquivo ainda reflete o Figma,
 * rode scripts/check-components-drift.mjs (requer FIGMA_TOKEN).
 *
 * Uso:  node scripts/verify-components.mjs
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const doc = JSON.parse(readFileSync(join(ROOT, 'data/components.json'), 'utf8'));

const STATUS_VALIDOS = new Set(doc.contrato.statusEnum);
const ATOMIC_VALIDOS = new Set(doc.contrato.atomicEnum);

const erros = [];
const avisos = [];

const entradas = Object.entries(doc.componentes);
const chaves = new Set();
const nodeIds = new Set();

for (const [id, c] of entradas) {
  if (!STATUS_VALIDOS.has(c.status)) erros.push(`${id}: status "${c.status}" fora do enum`);
  if (!ATOMIC_VALIDOS.has(c.atomic)) erros.push(`${id}: atomic "${c.atomic}" fora do enum`);

  const exigeFigma = ['stable', 'designed', 'beta'].includes(c.status);

  if (exigeFigma) {
    const key = c.figma?.key;
    if (!key || !/^[0-9a-f]{40}$/.test(key)) erros.push(`${id}: figma.key ausente ou malformada`);
    else if (chaves.has(key)) erros.push(`${id}: figma.key duplicada (${key})`);
    else chaves.add(key);

    const nodeId = c.figma?.nodeId;
    if (!nodeId) erros.push(`${id}: figma.nodeId ausente`);
    else if (nodeIds.has(nodeId)) erros.push(`${id}: figma.nodeId duplicado (${nodeId})`);
    else nodeIds.add(nodeId);
  } else if (c.status === 'codeOnly') {
    if (c.figma !== null) erros.push(`${id}: status=codeOnly deve ter figma=null — não inventar key/nodeId para o que não existe no Figma`);
    if (!c.selector) erros.push(`${id}: status=codeOnly sem selector — contradição, é a única razão de existir esse status`);
  }

  // status=stable implica selector real e codeConnect ou pelo menos CSS conhecido
  if (c.status === 'stable' && !c.selector) erros.push(`${id}: status=stable mas sem selector — contradição`);

  // status=designed/beta não deveria ter codeConnect (não existe implementação para conectar)
  if (['designed', 'beta'].includes(c.status) && c.codeConnect) {
    avisos.push(`${id}: status=${c.status} mas tem codeConnect — confirmar se não deveria ser 'stable'`);
  }

  // todo componente deve ter ao menos 1 critério de rules ou motivo para lista vazia
  if (!c.rules || (!c.rules.must.length && !c.rules.mustNot.length)) {
    avisos.push(`${id}: rules.must e rules.mustNot vazios — sem diretriz de uso registrada`);
  }

  // tokenAdoption deve existir para todo componente real
  if (!c.tokenAdoption) avisos.push(`${id}: sem tokenAdoption registrado`);
}

// nenhum nome de "planejado" pode coincidir com um componente real (é exatamente
// o bug que originou esta Fase 2 — 13 dos 19 reais estavam listados como v1.1)
const nomesReais = new Set(entradas.map(([id]) => id));
for (const nome of Object.keys(doc.planejados)) {
  if (nome.startsWith('$')) continue;
  if (nomesReais.has(nome)) erros.push(`planejados.${nome}: existe também em componentes — remova de um dos dois`);
}

// totais declarados devem bater com a contagem real (o arquivo é editado à mão,
// esse número diverge com facilidade se alguém adicionar um componente e
// esquecer de atualizar o resumo)
const porStatusReal = {};
for (const [, c] of entradas) porStatusReal[c.status] = (porStatusReal[c.status] || 0) + 1;
const totaisDeclarados = doc.totais.porStatus;
for (const [status, n] of Object.entries(porStatusReal)) {
  if (totaisDeclarados[status] !== n) {
    erros.push(`totais.porStatus.${status} declarado como ${totaisDeclarados[status]}, real é ${n}`);
  }
}
if (doc.totais.componentesReais !== entradas.length) {
  erros.push(`totais.componentesReais declarado como ${doc.totais.componentesReais}, real é ${entradas.length}`);
}
const planejadosReal = Object.keys(doc.planejados).filter((k) => !k.startsWith('$')).length;
if (doc.totais.planejados !== planejadosReal) {
  erros.push(`totais.planejados declarado como ${doc.totais.planejados}, real é ${planejadosReal}`);
}
const semCssReal = entradas.filter(([, c]) => !c.selector).length;
if (doc.totais.semImplementacaoCss !== semCssReal) {
  erros.push(`totais.semImplementacaoCss declarado como ${doc.totais.semImplementacaoCss}, real é ${semCssReal}`);
}

/* ── Relatório ────────────────────────────────────────────────────────── */

console.log(`\nSoul DS · verificação de componentes`);
console.log(`  componentes reais: ${entradas.length}`);
console.log(`  planejados: ${planejadosReal}`);
console.log(`  por status: ${JSON.stringify(porStatusReal)}\n`);

avisos.forEach((a) => console.log(`  ⚠ ${a}`));
erros.forEach((e) => console.log(`  ✗ ${e}`));

if (erros.length) {
  console.log(`\n✗ ${erros.length} erro(s). Corrija data/components.json.\n`);
  process.exit(1);
}
console.log(`\n✓ contrato íntegro${avisos.length ? ` (${avisos.length} aviso(s))` : ''}\n`);
