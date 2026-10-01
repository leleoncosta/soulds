#!/usr/bin/env node
/**
 * Soul DS — build-icons.mjs
 *
 * Gera `data/icons.json` a partir da extração bruta do Figma (`data/.raw-*.txt`)
 * e do dicionário curado `data/icon-stems.json`.
 *
 * Determinístico: mesma entrada → mesma saída, byte a byte.
 * NUNCA edite `data/icons.json` à mão — edite `icon-stems.json` e rode este script.
 *
 * Uso:  node scripts/build-icons.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data');

/* ── Configuração ─────────────────────────────────────────────────────── */

const FILE_KEY = 'N905bwbVakikHDGQzo5aKC';
const FIGMA_URL = `https://www.figma.com/design/${FILE_KEY}/Soul-DS---2026`;

// Arquivo bruto → coleção e id da seção no Figma
const FONTES = [
  { arquivo: '.raw-hosp-1.txt',   colecao: 'mv-hosp',   secao: '468:12183' },
  { arquivo: '.raw-hosp-2.txt',   colecao: 'mv-hosp',   secao: '468:12183' },
  { arquivo: '.raw-basico-1.txt', colecao: 'mv-basico', secao: '482:4081' },
  { arquivo: '.raw-basico-2.txt', colecao: 'mv-basico', secao: '482:4081' },
  { arquivo: '.raw-basico-3.txt', colecao: 'mv-basico', secao: '482:4081' },
  { arquivo: '.raw-basico-4.txt', colecao: 'mv-basico', secao: '482:4081' },
  { arquivo: '.raw-basico-5.txt', colecao: 'mv-basico', secao: '482:4081' },
];

// Ícones cujo nome no Figma diverge do que a doc 1.0.x publicou.
// Mantidos como alias para não quebrar consumidores existentes.
const ALIASES = {
  icon_checkbox: ['checkbox'],
  'card-base': ['card_base'],
  'stack-horizontal': ['stack_horizontal'],
  'sync-alert': ['sync_alert'],
  'text-color': ['cor_texto', 'text_color'],
  'mv-logo': ['mv_logo'],
};

// Anomalias detectadas na varredura de 2026-09-29 (dimensão fora do padrão
// ou variante extra). Ficam marcadas no JSON para não sumirem do radar.
const ANOMALIAS = {
  aprazamento: 'lg=24x25',
  aprazar: 'lg=24x25',
  aprazamento_cancelar: 'lg=24x25',
  documento_nova_versao: 'lg=24x25',
  paciente_encaminhado_rejeitar: 'sm=16x24 md=20x24',
  paciente: 'sm=16x24 md=20x24',
  chave: 'sm=16x24 md=20x24',
  politicas: 'variante extra tamanho4',
};

// `logo` e `mv-logo` usam escala própria de 9 variantes por decisão de
// identidade visual — não é anomalia. As duas escalas NÃO são iguais:
// confirmado por importComponentSetByKeyAsync em 2026-09-29.
//   logo:    default · md · lg · xl · 2xl · 3xl · 4xl · 5xl · 6xl  (sem sm)
//   mv-logo: sm · md · lg · xl · 2xl · 3xl · 4xl · 5xl · 6xl        (sem default)
const ESCALAS_PROPRIAS = {
  logo: ['default', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'],
  'mv-logo': ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'],
};

// Tokens sem valor semântico para busca.
const STOPWORDS = new Set(['de', 'do', 'da', 'e', 'em', 'a', 'o', 'n', 'icon']);

/* ── Helpers ──────────────────────────────────────────────────────────── */

const semAcento = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const tokenizar = (nome) =>
  semAcento(nome).toLowerCase().split(/[_\-\s]+/).filter((t) => t && !STOPWORDS.has(t));

function keywords(nome, categoria, colecao, stems) {
  const set = new Set();
  const tokens = tokenizar(nome);

  set.add(nome.replace(/_/g, ' '));           // frase legível
  tokens.forEach((t) => set.add(t));          // tokens isolados
  tokens.forEach((t) => (stems[t] || []).forEach((s) => set.add(s)));
  set.add(semAcento(categoria).toLowerCase());
  if (colecao === 'mv-hosp') {
    ['hospitalar', 'clínico', 'his', 'saúde'].forEach((t) => set.add(t));
  }
  (ALIASES[nome] || []).forEach((a) => set.add(a));

  return [...set].sort();
}

/* ── Leitura da extração bruta ────────────────────────────────────────── */

const stems = JSON.parse(readFileSync(join(DATA, 'icon-stems.json'), 'utf8'));
const disponiveis = new Set(readdirSync(DATA));

const registros = [];
let categoriaAtual = null;

for (const fonte of FONTES) {
  if (!disponiveis.has(fonte.arquivo)) {
    console.error(`✗ arquivo bruto ausente: ${fonte.arquivo}`);
    process.exit(1);
  }
  const linhas = readFileSync(join(DATA, fonte.arquivo), 'utf8').split('\n');
  for (const linha of linhas) {
    const l = linha.trim();
    if (!l) continue;
    if (l.startsWith('#')) { categoriaAtual = l.slice(1); continue; }
    const [nome, key] = l.split('|');
    if (!nome || !key) continue;
    registros.push({ nome, key, categoria: categoriaAtual, ...fonte });
  }
}

/* ── Montagem do índice ───────────────────────────────────────────────── */

const icones = {};
const colisoes = [];

for (const r of registros) {
  const catSlug = semAcento(r.categoria).toLowerCase().replace(/\s+/g, '-');
  const idBase = `${r.colecao}/${catSlug}/${r.nome}`;

  // Colisão de nome: nunca descartar em silêncio. Desambigua e marca.
  let id = idBase;
  let duplicado = false;
  if (icones[id]) {
    let n = 2;
    while (icones[`${idBase}--${n}`]) n++;
    id = `${idBase}--${n}`;
    duplicado = true;
    icones[idBase].duplicadoEm = id;
    colisoes.push({ idBase, id, key: r.key });
  }

  const escalaPropria = Object.hasOwn(ESCALAS_PROPRIAS, r.nome);

  icones[id] = {
    nome: r.nome,
    colecao: r.colecao,
    categoria: r.categoria,
    figmaKey: r.key,
    figmaSecao: r.secao,
    tamanhos: escalaPropria ? ESCALAS_PROPRIAS[r.nome] : ['sm', 'md', 'lg'],
    svg: `dist/icons/${r.colecao}/${semAcento(r.categoria).toLowerCase().replace(/\s+/g, '-')}/${r.nome}.svg`,
    keywords: keywords(r.nome, r.categoria, r.colecao, stems),
    ...(ALIASES[r.nome] ? { aliases: ALIASES[r.nome] } : {}),
    ...(escalaPropria ? { escalaPropria: true } : {}),
    ...(ANOMALIAS[r.nome] ? { anomalia: ANOMALIAS[r.nome] } : {}),
    ...(duplicado
      ? { duplicadoDe: idBase, revisar: 'nome colidente no Figma — renomear ou deprecar um dos dois' }
      : {}),
  };
}

/* ── Índice invertido de busca ────────────────────────────────────────── */

// Indexa a frase inteira E cada palavra isolada dela. Sem isso, uma keyword
// como "cama hospitalar" nunca casa com a busca "cama".
const indice = {};
for (const [id, ico] of Object.entries(icones)) {
  for (const kw of ico.keywords) {
    const frase = semAcento(kw).toLowerCase().trim();
    if (!frase) continue;
    (indice[frase] ??= []).push(id);

    const palavras = frase.split(/\s+/);
    if (palavras.length > 1) {
      for (const p of palavras) {
        if (p.length >= 3 && !STOPWORDS.has(p)) (indice[p] ??= []).push(id);
      }
    }
  }
}
for (const k of Object.keys(indice)) indice[k] = [...new Set(indice[k])].sort();

/* ── Saída ────────────────────────────────────────────────────────────── */

const porColecao = {};
const porCategoria = {};
for (const ico of Object.values(icones)) {
  porColecao[ico.colecao] = (porColecao[ico.colecao] || 0) + 1;
  const ck = `${ico.colecao}/${ico.categoria}`;
  porCategoria[ck] = (porCategoria[ck] || 0) + 1;
}

const saida = {
  $schema: 'soul-ds/icons@1',
  $gerado: 'build-icons.mjs — não editar à mão',
  figma: { fileKey: FILE_KEY, url: FIGMA_URL },
  contrato: {
    regra: 'Nunca escreva o path de um SVG. Importe o arquivo apontado em `svg`.',
    tamanhoPadrao: 'md',
    css: { sm: '16px', md: '20px', lg: '24px' },
    cor: 'herda via currentColor — defina `color` no elemento pai com token semântico',
    a11y: {
      decorativo: 'aria-hidden="true" no wrapper',
      semantico: 'role="img" + aria-label no wrapper',
      botaoIconOnly: 'aria-label no <button>, nunca no ícone',
    },
    geometria:
      'As variantes sm/md/lg são a mesma arte com padding absoluto de 2px. ' +
      'Um único SVG por ícone + dimensionamento por CSS é equivalente. ' +
      'Exporte os 3 tamanhos apenas se precisar de fidelidade sub-pixel.',
  },
  totais: {
    icones: Object.keys(icones).length,
    porColecao,
    porCategoria,
    comAnomalia: Object.values(icones).filter((i) => i.anomalia).length,
    colisoesDeNome: colisoes.length,
  },
  indice,
  icones,
};

const json = JSON.stringify(saida, null, 2);
writeFileSync(join(DATA, 'icons.json'), json + '\n');

const hash = createHash('sha256').update(json).digest('hex').slice(0, 16);

console.log(`✓ data/icons.json  ·  ${saida.totais.icones} ícones  ·  sha256:${hash}`);
console.log(`  mv-hosp ${porColecao['mv-hosp']} · mv-basico ${porColecao['mv-basico']}`);
console.log(`  termos indexados: ${Object.keys(indice).length}`);
console.log(`  anomalias: ${saida.totais.comAnomalia}`);
if (colisoes.length) {
  console.log(`  ⚠ colisões de nome (mesma coleção/categoria): ${colisoes.length}`);
  colisoes.forEach((c) => console.log(`    ${c.idBase} → preservado como ${c.id} (key ${c.key})`));
}
