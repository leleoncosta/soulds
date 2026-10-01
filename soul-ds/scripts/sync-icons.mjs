#!/usr/bin/env node
/**
 * Soul DS — sync-icons.mjs
 *
 * Sincroniza a biblioteca de ícones do Figma para o repositório:
 *   1. lê a árvore do arquivo e regenera os `.raw-*.txt`
 *   2. exporta os 739 SVGs via REST API, em lotes
 *   3. normaliza cada SVG (fill → currentColor, remove width/height fixos)
 *   4. reconstrói data/icons.json e atualiza ds.manifest.json
 *
 * Pré-requisito:  export FIGMA_TOKEN="figd_..."   (token pessoal, escopo file:read)
 *
 * Uso:
 *   node scripts/sync-icons.mjs              # tudo
 *   node scripts/sync-icons.mjs --svg-only   # só reexporta os SVGs
 *   node scripts/sync-icons.mjs --dry-run    # não escreve nada
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data');
const DIST = join(ROOT, 'dist/icons');

const FILE_KEY = 'N905bwbVakikHDGQzo5aKC';
const API = 'https://api.figma.com/v1';
const TOKEN = process.env.FIGMA_TOKEN;

const DRY = process.argv.includes('--dry-run');
const SVG_ONLY = process.argv.includes('--svg-only');

// A REST API aceita muitos ids por chamada, mas a renderização é o gargalo.
// 100 é o ponto de equilíbrio observado entre throughput e timeout.
const LOTE = 100;

if (!TOKEN) {
  console.error('✗ FIGMA_TOKEN não definido.');
  console.error('  Gere em figma.com → Settings → Security → Personal access tokens');
  console.error('  export FIGMA_TOKEN="figd_..."');
  process.exit(1);
}

const api = async (path) => {
  const r = await fetch(`${API}${path}`, { headers: { 'X-Figma-Token': TOKEN } });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} em ${path}`);
  return r.json();
};

/* ── Normalização de SVG ──────────────────────────────────────────────── */

/**
 * O Figma exporta com a cor resolvida do tema ativo (ex.: fill="#205E7E") e
 * com width/height fixos. Ambos quebram o contrato da DS: o ícone precisa
 * herdar cor via currentColor e ser dimensionado pelo container.
 */
export function normalizarSvg(svg) {
  return svg
    .replace(/\s(width|height)="[^"]*"/g, '')                  // dimensiona via CSS
    .replace(/fill="(?!none")[^"]*"/g, 'fill="currentColor"')  // preserva fill="none"
    .replace(/stroke="(?!none")#[^"]*"/g, 'stroke="currentColor"')
    .replace(/<svg /, '<svg focusable="false" aria-hidden="true" ')
    .replace(/\n\s*\n/g, '\n')
    .trim() + '\n';
}

/* ── 1. Árvore do arquivo ─────────────────────────────────────────────── */

const SECOES = {
  'mv-hosp': '468:12183',
  'mv-basico': '482:4081',
};

async function lerArvore() {
  console.log('→ lendo árvore do arquivo…');
  const ids = Object.values(SECOES).join(',');
  const { nodes } = await api(`/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(ids)}`);

  const registros = [];
  for (const [colecao, secaoId] of Object.entries(SECOES)) {
    const raiz = nodes[secaoId]?.document;
    if (!raiz) throw new Error(`seção ${secaoId} (${colecao}) não encontrada`);

    for (const categoria of raiz.children || []) {
      if (categoria.type !== 'FRAME') continue;
      const percorrer = (no) => {
        if (no.type === 'COMPONENT_SET') {
          registros.push({
            nome: no.name,
            nodeId: no.id,
            categoria: categoria.name,
            colecao,
            secao: secaoId,
            // a variante md é a referência de export
            mdId: (no.children || []).find((c) => /md/.test(c.name))?.id || no.children?.[0]?.id,
          });
          return;
        }
        (no.children || []).forEach(percorrer);
      };
      percorrer(categoria);
    }
  }
  console.log(`  ${registros.length} component sets`);
  return registros;
}

/* ── 2. Export dos SVGs ───────────────────────────────────────────────── */

async function exportarSvgs(registros) {
  const alvos = registros.filter((r) => r.mdId);
  console.log(`→ exportando ${alvos.length} SVGs em lotes de ${LOTE}…`);

  let ok = 0;
  let falhas = [];

  for (let i = 0; i < alvos.length; i += LOTE) {
    const lote = alvos.slice(i, i + LOTE);
    const ids = lote.map((r) => r.mdId).join(',');

    const { images, err } = await api(
      `/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=svg&svg_outline_text=true`
    );
    if (err) throw new Error(`export falhou: ${err}`);

    await Promise.all(
      lote.map(async (r) => {
        const url = images[r.mdId];
        if (!url) { falhas.push(r.nome); return; }

        const res = await fetch(url);
        if (!res.ok) { falhas.push(r.nome); return; }

        const svg = normalizarSvg(await res.text());
        const catSlug = slug(r.categoria);
        const destino = join(DIST, r.colecao, catSlug);

        if (!DRY) {
          mkdirSync(destino, { recursive: true });
          writeFileSync(join(destino, `${r.nome}.svg`), svg);
        }
        ok++;
      })
    );

    process.stdout.write(`\r  ${Math.min(i + LOTE, alvos.length)}/${alvos.length}`);
  }

  console.log(`\n  ${ok} exportados${falhas.length ? `, ${falhas.length} falhas: ${falhas.join(', ')}` : ''}`);
  return { ok, falhas };
}

const slug = (s) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-');

/* ── 3. Regravar os .raw-*.txt ────────────────────────────────────────── */

function gravarRaw(registros) {
  const porColecao = { 'mv-hosp': [], 'mv-basico': [] };
  const vistos = new Set();

  for (const r of registros) {
    const chave = `${r.colecao}|${r.categoria}`;
    if (!vistos.has(chave)) {
      porColecao[r.colecao].push(`#${r.categoria}`);
      vistos.add(chave);
    }
    porColecao[r.colecao].push(`${r.nome}|${r.key || r.nodeId}`);
  }

  if (DRY) return;
  writeFileSync(join(DATA, '.raw-hosp-1.txt'), porColecao['mv-hosp'].join('\n') + '\n');
  writeFileSync(join(DATA, '.raw-basico-1.txt'), porColecao['mv-basico'].join('\n') + '\n');
  // blocos 2..5 ficam vazios: o build tolera ausência apenas se listados em FONTES
}

/* ── 4. Manifesto ─────────────────────────────────────────────────────── */

function atualizarManifesto(stats) {
  const caminho = join(ROOT, 'ds.manifest.json');
  const atual = existsSync(caminho) ? JSON.parse(readFileSync(caminho, 'utf8')) : {};

  const iconsJson = readFileSync(join(DATA, 'icons.json'), 'utf8');
  const hash = createHash('sha256').update(iconsJson).digest('hex');

  const m = {
    ...atual,
    sincronizadoEm: new Date().toISOString(),
    figma: { fileKey: FILE_KEY, url: `https://www.figma.com/design/${FILE_KEY}/Soul-DS---2026` },
    icones: {
      total: stats.total,
      svgsExportados: stats.ok,
      falhas: stats.falhas,
      hashIconsJson: `sha256:${hash}`,
    },
  };

  if (!DRY) writeFileSync(caminho, JSON.stringify(m, null, 2) + '\n');
  console.log(`→ ds.manifest.json atualizado · sha256:${hash.slice(0, 16)}`);
}

/* ── Orquestração ─────────────────────────────────────────────────────── */

const registros = await lerArvore();
const stats = await exportarSvgs(registros);

if (!SVG_ONLY) {
  gravarRaw(registros);
  if (!DRY) execFileSync('node', [join(ROOT, 'scripts/build-icons.mjs')], { stdio: 'inherit' });
}

atualizarManifesto({ ...stats, total: registros.length });

if (stats.falhas.length) {
  console.error(`\n✗ ${stats.falhas.length} ícones não exportaram. Rode novamente com --svg-only.`);
  process.exit(1);
}
console.log('\n✓ sync concluído');
