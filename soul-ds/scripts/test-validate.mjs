#!/usr/bin/env node
/**
 * Soul DS — test-validate.mjs
 *
 * Teste de regressão do motor de validação. Existe porque, ao escrever
 * validate.mjs, dois bugs de regex silenciosos apareceram na primeira
 * passada (id="..." casando dentro de aria-invalid="true"; motivo do
 * [DS-TEMP] vazando para o próximo comentário do arquivo). Sem este teste,
 * a próxima edição no motor pode reintroduzir qualquer um dos dois sem
 * ninguém perceber.
 *
 * Uso:  node scripts/test-validate.mjs
 */

import { execFileSync } from 'node:child_process';
import { join, dirname, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function rodar(fixture) {
  const caminho = isAbsolute(fixture) ? fixture : join(ROOT, 'scripts/__fixtures__', fixture);
  try {
    return JSON.parse(execFileSync('node', [join(ROOT, 'scripts/validate.mjs'), caminho, '--json'], { encoding: 'utf8' }));
  } catch (e) {
    // exit code 1 é esperado quando há erro — stdout ainda tem o JSON
    return JSON.parse(e.stdout);
  }
}

const casos = [
  {
    fixture: 'sintetico.html',
    descricao: '11 casos desenhados a dedo: 6 tipos de violação real, 3 corretos, 2 escapados',
    esperado: { error: 7, warn: 0, escapado: 2 },
  },
  {
    fixture: 'soul-ds-examples.html',
    descricao: 'HTML real do projeto — 2 achados reais restantes após promover alert/card/table/sidebar/badge para codeOnly (Fase 3, resolução do achado mais urgente)',
    esperado: { error: 2, warn: 6, escapado: 0 },
  },
  {
    fixture: join(ROOT, 'project-root/soul-ds-examples.html'),
    descricao: 'versão totalmente remediada (execução pós-Fase 6): espaçamento migrado (ADR-001) + os 2 usos de 2px usando o token --spacing-2 que passou a existir — deve dar ZERO erros',
    esperado: { error: 0, warn: 6, escapado: 0 },
  },
];

let falhas = 0;

for (const caso of casos) {
  const r = rodar(caso.fixture);
  const totais = r.totais;
  const ok = Object.entries(caso.esperado).every(([k, v]) => (totais[k] || 0) === v);
  const nome = isAbsolute(caso.fixture) ? caso.fixture.split('/').slice(-2).join('/') : caso.fixture;
  console.log(`${ok ? '✓' : '✗'} ${nome} — ${caso.descricao}`);
  console.log(`    esperado: ${JSON.stringify(caso.esperado)}`);
  console.log(`    obtido:   ${JSON.stringify(totais)}`);
  if (!ok) falhas++;
}

// Casos pontuais que devem passar limpo — regressão específica dos dois bugs corrigidos
const sint = rodar('sintetico.html');
const idsEncontrados = sint.achados.map((a) => a.id + '|' + (a.linha ?? ''));

const naoDeveExistir = [
  { motivo: 'bug do id="true" dentro de aria-invalid', teste: () => sint.achados.some((a) => a.mensagem?.includes('input#true')) },
  { motivo: 'motivo do DS-TEMP vazando entre comentários', teste: () => sint.achados.some((a) => a.motivo?.includes('-->')) },
];

for (const t of naoDeveExistir) {
  const falhou = t.teste();
  console.log(`${falhou ? '✗' : '✓'} regressão: ${t.motivo}`);
  if (falhou) falhas++;
}

console.log(falhas ? `\n✗ ${falhas} teste(s) falharam\n` : '\n✓ todos os testes passaram\n');
process.exit(falhas ? 1 : 0);
