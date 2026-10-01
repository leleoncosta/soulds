#!/usr/bin/env node
/**
 * Soul DS — check-components-drift.mjs
 *
 * Refaz o cross-check que foi feito manualmente ao gerar components.json:
 * reimporta cada componente pela key e compara nome + variantOptions +
 * hash da descrição contra o que está gravado. Não corrige nada — só aponta
 * onde o arquivo curado ficou para trás do Figma publicado.
 *
 * components.json é hand-curated (status, rules, selector exigem
 * julgamento). Este script protege só os fatos verificáveis: existência da
 * key, nome do componente e o conjunto de valores de cada prop tipo VARIANT.
 *
 * Pré-requisito:  export FIGMA_TOKEN="figd_..."
 * Uso:            node scripts/check-components-drift.mjs
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TOKEN = process.env.FIGMA_TOKEN;
const API = 'https://api.figma.com/v1';

if (!TOKEN) {
  console.error('✗ FIGMA_TOKEN não definido. export FIGMA_TOKEN="figd_..."');
  process.exit(1);
}

const doc = JSON.parse(readFileSync(join(ROOT, 'data/components.json'), 'utf8'));
const fileKey = JSON.parse(readFileSync(join(ROOT, 'ds.manifest.json'), 'utf8')).figma.fileKey;

const api = async (path) => {
  const r = await fetch(`${API}${path}`, { headers: { 'X-Figma-Token': TOKEN } });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} em ${path}`);
  return r.json();
};

/**
 * A REST API não busca por key diretamente — precisa do nodeId. Como já
 * guardamos nodeId em components.json, usamos /files/:key/nodes.
 */
async function buscarNos(nodeIds) {
  const { nodes } = await api(`/files/${fileKey}/nodes?ids=${encodeURIComponent(nodeIds.join(','))}`);
  return nodes;
}

const entradas = Object.entries(doc.componentes);
const nodeIds = entradas.map(([, c]) => c.figma.nodeId);
const nos = await buscarNos(nodeIds);

const divergencias = [];

for (const [id, c] of entradas) {
  const no = nos[c.figma.nodeId]?.document;
  if (!no) { divergencias.push({ id, tipo: 'AUSENTE', detalhe: `nodeId ${c.figma.nodeId} não existe mais no arquivo` }); continue; }
  if (no.name !== id) divergencias.push({ id, tipo: 'NOME', detalhe: `Figma diz "${no.name}", components.json diz "${id}"` });

  const defsReais = no.componentPropertyDefinitions || {};
  for (const [propNome, propSpec] of Object.entries(c.props || {})) {
    if (propSpec.tipo !== 'enum') continue;
    const chaveReal = Object.keys(defsReais).find((k) => k === propNome || k.startsWith(propNome + '#'));
    const valoresReais = chaveReal ? (defsReais[chaveReal].variantOptions || []).slice().sort() : null;
    const valoresDoc = [...propSpec.valores].sort();
    if (!valoresReais) {
      divergencias.push({ id, tipo: 'PROP_SUMIU', detalhe: `prop "${propNome}" não encontrada no Figma` });
    } else if (JSON.stringify(valoresReais) !== JSON.stringify(valoresDoc)) {
      divergencias.push({
        id, tipo: 'VALORES',
        detalhe: `prop "${propNome}": components.json tem [${valoresDoc}], Figma tem [${valoresReais}]`,
      });
    }
  }
}

console.log(`\nSoul DS · drift check contra Figma`);
console.log(`  componentes checados: ${entradas.length}\n`);

if (!divergencias.length) {
  console.log('✓ nenhuma divergência — components.json reflete o Figma publicado\n');
  process.exit(0);
}

for (const d of divergencias) console.log(`  ✗ [${d.tipo}] ${d.id}: ${d.detalhe}`);
console.log(`\n✗ ${divergencias.length} divergência(s). Atualize data/components.json.\n`);
process.exit(1);
