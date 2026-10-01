#!/usr/bin/env node
/**
 * Soul DS — find-icon.mjs
 *
 * Resolve uma intenção em linguagem natural para um ícone da DS.
 * Pensado para ser chamado por um agente antes de gerar qualquer markup com ícone.
 *
 * Uso:
 *   node scripts/find-icon.mjs "salvar"
 *   node scripts/find-icon.mjs "leito ocupado" --colecao mv-hosp
 *   node scripts/find-icon.mjs "filtro" --json
 *   node scripts/find-icon.mjs "excluir" --html
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const { icones, indice } = JSON.parse(readFileSync(join(ROOT, 'data/icons.json'), 'utf8'));

const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith('--')));
const colIdx = argv.indexOf('--colecao');
const colecaoFiltro = colIdx > -1 ? argv[colIdx + 1] : null;
const consulta = argv.filter((a, i) => !a.startsWith('--') && argv[i - 1] !== '--colecao').join(' ');

if (!consulta) {
  console.error('uso: node scripts/find-icon.mjs "<intenção>" [--colecao mv-hosp|mv-basico] [--json] [--html]');
  process.exit(1);
}

const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const STOP = new Set(['de', 'do', 'da', 'dos', 'das', 'e', 'em', 'a', 'o', 'para', 'com', 'no', 'na', 'um', 'uma']);
const termos = norm(consulta).split(/\s+/).filter((t) => t && !STOP.has(t));

/* ── Pontuação ────────────────────────────────────────────────────────── */
/* Por termo da consulta conta apenas o MELHOR match do ícone, nunca a soma.
   Somar premiaria ícones que só têm mais sinônimos cadastrados. */

const pontos = new Map();
const somar = (id, p) => pontos.set(id, (pontos.get(id) || 0) + p);

const N = Object.keys(icones).length;

// IDF: "paciente" indexa dezenas de ícones e quase não informa;
// "cama" ou "alergia" indexam poucos e são o sinal real da consulta.
function idf(termo) {
  const df = (indice[termo] || []).length;
  if (!df) return 1;
  return Math.max(0.3, Math.log(N / df) / Math.log(N / 2));
}

for (const termo of termos) {
  const peso = idf(termo);
  const melhor = new Map();
  const propor = (id, p) => melhor.set(id, Math.max(melhor.get(id) || 0, p));

  for (const id of indice[termo] || []) propor(id, 10);

  for (const [chave, ids] of Object.entries(indice)) {
    if (chave === termo) continue;
    if (chave.startsWith(termo)) ids.forEach((id) => propor(id, 4));
    else if (chave.includes(termo) && termo.length >= 4) ids.forEach((id) => propor(id, 2));
  }

  for (const [id, p] of melhor) somar(id, p * peso);
}

// bônus: nome do ícone bate exatamente com a consulta inteira
const consultaSlug = norm(consulta).replace(/\s+/g, '_');
for (const [id, ico] of Object.entries(icones)) {
  if (norm(ico.nome) === consultaSlug) somar(id, 40);
  if (norm(ico.nome).startsWith(consultaSlug)) somar(id, 12);
}

// Penalidade de especificidade: `notificacao` deve vencer `notificacao_email`
// quando a busca não pede o qualificador — MAS só quando `notificacao` (o
// nome sem o último segmento) também existe como ícone no corpus. Sem essa
// condição, a penalidade acerta esse caso e erra outros: `senha_alterar` e
// `adicionar_horario` são nomes compostos que SÃO o conceito, não uma
// especialização de um ícone `senha` ou `adicionar` que não existem.
const nomesExistentes = new Set(Object.values(icones).map((i) => i.nome));
for (const id of pontos.keys()) {
  const partes = icones[id].nome.split(/[_-]/);
  const baseExiste = partes.length > 1 && nomesExistentes.has(partes.slice(0, -1).join('_'));
  if (baseExiste) somar(id, -1.5);
}

let resultados = [...pontos.entries()]
  .filter(([id]) => !colecaoFiltro || icones[id].colecao === colecaoFiltro)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .slice(0, 8)
  .map(([id, score]) => ({ id, score, ...icones[id] }));

if (!resultados.length) {
  console.error(`Nenhum ícone corresponde a "${consulta}".`);
  console.error('Não invente um SVG. Opções: refine a busca, ou marque a lacuna com [DS-TEMP].');
  process.exit(2);
}

/* ── Saída ────────────────────────────────────────────────────────────── */

if (flags.has('--json')) {
  console.log(JSON.stringify(resultados, null, 2));
  process.exit(0);
}

if (flags.has('--html')) {
  const m = resultados[0];
  console.log(`<!-- ${m.id} · ${m.colecao}/${m.categoria} -->
<span class="icon icon--md" aria-hidden="true">
  <!-- importe: ${m.svg} -->
</span>`);
  process.exit(0);
}

const dica =
  resultados[0].colecao === 'mv-hosp'
    ? 'contexto clínico — confira se a tela é mesmo do domínio HIS'
    : 'uso geral';

console.log(`\n"${consulta}"  →  ${resultados[0].id}   (${dica})\n`);
for (const r of resultados) {
  const flag = r.anomalia ? '  ⚠ ' + r.anomalia : r.duplicadoDe ? '  ⚠ nome duplicado' : '';
  console.log(`  ${r.score.toFixed(1).padStart(6)}  ${r.nome.padEnd(30)} ${r.colecao}/${r.categoria}${flag}`);
}
console.log(`\n  svg:     ${resultados[0].svg}`);
console.log(`  figmaKey: ${resultados[0].figmaKey}`);
console.log(`  tamanhos: ${resultados[0].tamanhos.join(' · ')}   (padrão: md)\n`);
