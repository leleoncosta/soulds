#!/usr/bin/env node
/**
 * Soul DS — test-migrate-spacing.mjs
 *
 * Prova que a migração é atômica: um par onde o nome NOVO de um token é
 * igual ao nome ANTIGO de outro (--spacing-4 antigo=8px, novo=4px;
 * --spacing-8 antigo=16px, novo=8px) precisa remapear os dois corretamente
 * na mesma declaração, sem um sobrescrever o resultado do outro.
 */

import { writeFileSync, readFileSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const tmp = join(ROOT, 'scripts/__fixtures__/.tmp-migracao.css');

const casos = [
  {
    entrada: '.x { padding: var(--spacing-4) var(--spacing-8); }',
    esperado: '.x { padding: var(--spacing-8) var(--spacing-16); }',
    descricao: 'caso perigoso: nome novo de um colide com nome antigo do outro, na mesma linha',
  },
  {
    entrada: '.y { gap: var(--spacing-2); }',
    esperado: '.y { gap: var(--spacing-4); }',
    descricao: '--spacing-2 antigo (4px) → --spacing-4',
  },
  {
    entrada: '.z { margin: var(--spacing-0) var(--spacing-1) var(--spacing-1-5); }',
    esperado: '.z { margin: var(--spacing-0) var(--spacing-1) var(--spacing-1-5); }',
    descricao: 'valores que não mudam de nome (0, 1, 1.5) ficam iguais',
  },
  {
    entrada: '.w { top: var(--spacing-99); }',
    esperado: '.w { top: var(--spacing-99); }',
    descricao: 'índice desconhecido não é tocado, só sinalizado',
  },
];

let falhas = 0;

for (const caso of casos) {
  writeFileSync(tmp, caso.entrada);
  execFileSync('node', [join(ROOT, 'scripts/migrate-spacing-refs.mjs'), tmp, '--write']);
  const resultado = readFileSync(tmp, 'utf8');
  const ok = resultado === caso.esperado;
  console.log(`${ok ? '✓' : '✗'} ${caso.descricao}`);
  if (!ok) {
    console.log(`    esperado: ${caso.esperado}`);
    console.log(`    obtido:   ${resultado}`);
    falhas++;
  }
}

unlinkSync(tmp);
console.log(falhas ? `\n✗ ${falhas} teste(s) falharam\n` : '\n✓ todos os testes passaram\n');
process.exit(falhas ? 1 : 0);
