#!/usr/bin/env node
/**
 * Soul DS — migrate-spacing-refs.mjs
 *
 * ADR-001 renomeia --spacing-N de índice para valor. O perigo: quase todo
 * nome NOVO já existe como nome ANTIGO com valor diferente —
 * --spacing-8 antigo = 16px, novo = 8px. Um find-replace sequencial (rodar
 * "--spacing-4 → --spacing-8" e depois "--spacing-8 → --spacing-16") reescreve
 * o resultado do primeiro passo no segundo. Este script faz a substituição
 * num único passe, usando o valor de cada ocorrência para decidir o nome
 * novo — não encadeia substituições.
 *
 * Uso:
 *   node scripts/migrate-spacing-refs.mjs <arquivo>              # mostra o diff
 *   node scripts/migrate-spacing-refs.mjs <arquivo> --write       # aplica
 */

import { readFileSync, writeFileSync } from 'node:fs';

const MAPA_INDICE_PARA_VALOR = {
  0: 0, 1: 1, '1-5': 1.5, 2: 4, 3: 6, 4: 8, 5: 10, 6: 12, 7: 14, 8: 16,
  10: 20, 12: 24, 14: 28, 16: 32, 18: 36, 20: 40, 22: 44, 24: 48,
  28: 56, 32: 64, 40: 80, 48: 96,
};

function nomeNovo(indice) {
  const valor = MAPA_INDICE_PARA_VALOR[indice];
  if (valor === undefined) return null; // índice desconhecido — não mexe, sinaliza
  return String(valor).replace('.', '-');
}

const alvo = process.argv[2];
const ESCREVER = process.argv.includes('--write');

if (!alvo) {
  console.error('uso: node scripts/migrate-spacing-refs.mjs <arquivo> [--write]');
  process.exit(1);
}

const original = readFileSync(alvo, 'utf8');
const naoMapeados = new Set();
let trocas = 0;

// Casa tanto declaração (--spacing-N: ...) quanto uso (var(--spacing-N))
const atualizado = original.replace(/--spacing-([\d-]+)\b/g, (match, indice) => {
  const novo = nomeNovo(indice);
  if (novo === null) { naoMapeados.add(indice); return match; }
  trocas++;
  return `--spacing-${novo}`;
});

console.log(`\nSoul DS · migração de espaçamento (ADR-001) · ${alvo}\n`);
console.log(`  ${trocas} ocorrência(s) de --spacing-N remapeadas`);
if (naoMapeados.size) {
  console.log(`  ⚠ índice(s) sem mapeamento conhecido, não tocados: ${[...naoMapeados].join(', ')}`);
}

if (!ESCREVER) {
  console.log('\n  (modo somente leitura — rode com --write para aplicar)\n');
  // mostra um diff simples por linha
  const antes = original.split('\n');
  const depois = atualizado.split('\n');
  for (let i = 0; i < antes.length; i++) {
    if (antes[i] !== depois[i]) {
      console.log(`  L${i + 1}:`);
      console.log(`    - ${antes[i].trim()}`);
      console.log(`    + ${depois[i].trim()}`);
    }
  }
  console.log();
} else {
  writeFileSync(alvo, atualizado);
  console.log(`\n✓ ${alvo} atualizado\n`);
}
