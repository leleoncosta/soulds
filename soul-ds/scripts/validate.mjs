#!/usr/bin/env node
/**
 * Soul DS — validate.mjs
 *
 * Roda o checklist da seção 8 do SKILL.md como asserção de verdade, não
 * como lista de bullets que ninguém confere. Uso pensado para um agente
 * rodar sobre o próprio código gerado ANTES de entregar.
 *
 * Uso:
 *   node scripts/validate.mjs <arquivo.html|arquivo.css>
 *   node scripts/validate.mjs <arquivo> --json
 *
 * Sai com código 0 se não houver ERROR (avisos não bloqueiam).
 * Escopo desta versão: HTML e CSS via regex/varredura de texto — não é um
 * parser de AST. Ver references/rules.md § Limitações para o que isso
 * significa na prática.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const alvo = process.argv[2];
const JSON_OUT = process.argv.includes('--json');

if (!alvo || !existsSync(alvo)) {
  console.error('uso: node scripts/validate.mjs <arquivo.html|.css> [--json]');
  process.exit(1);
}

const rules = JSON.parse(readFileSync(join(ROOT, 'data/rules.json'), 'utf8'));
const components = JSON.parse(readFileSync(join(ROOT, 'data/components.json'), 'utf8'));
const texto = readFileSync(alvo, 'utf8');

const achados = []; // { id, severidade, linha, trecho, mensagem, escapado }

const linhaDe = (idx) => texto.slice(0, idx).split('\n').length;
const trechoDe = (idx, len = 80) => texto.slice(idx, idx + len).replace(/\s+/g, ' ').trim();

/** Procura [DS-TEMP] com motivo na janela de caracteres anteriores a `idx`. */
function estaEscapado(idx) {
  const inicio = Math.max(0, idx - rules.escapeJanela);
  const janela = texto.slice(inicio, idx);
  const marcador = rules.escapeMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`${marcador}\\s+(\\S.*?)(?:\\*/|-->|$)`, 'gs');
  let ultimo = null;
  let m;
  while ((m = re.exec(janela))) ultimo = m; // o mais próximo da ocorrência, não o primeiro da janela
  return ultimo ? ultimo[1].trim() : null;
}

/* ── 1. Tokens: cor, espaçamento, radius, fonte ──────────────────────── */

let m;

// Casa `prop: valor;` dentro de blocos CSS, incluindo style="" inline.
/** Divide um valor CSS por espaço no nível 0 de parênteses — "2px var(--x)"
 *  vira ["2px","var(--x)"], sem quebrar o interior de var(...) ou rgba(...). */
function segmentos(valor) {
  const partes = [];
  let atual = '';
  let profundidade = 0;
  for (const ch of valor) {
    if (ch === '(') profundidade++;
    if (ch === ')') profundidade--;
    if (/\s/.test(ch) && profundidade === 0) {
      if (atual) partes.push(atual);
      atual = '';
    } else {
      atual += ch;
    }
  }
  if (atual) partes.push(atual);
  return partes;
}

const declaracao = /([a-z-]+)\s*:\s*([^;"'>]+)[;"]/gi;
while ((m = declaracao.exec(texto))) {
  const [full, prop, valor] = m;
  const propNorm = prop.toLowerCase().trim();

  for (const [grupo, spec] of Object.entries(rules.tokenProps)) {
    if (!spec.props.includes(propNorm)) continue;

    // Shorthand pode misturar token com valor hardcoded — ex: padding: 2px var(--spacing-4).
    // Checa cada segmento, não a declaração inteira: um var() em qualquer parte não
    // deve blindar o resto do valor.
    for (const seg of segmentos(valor)) {
      if (seg.startsWith('var(')) continue;

      const temOfensor =
        spec.ofensor === 'hex' ? /#[0-9a-fA-F]{3,8}\b/.test(seg) :
        spec.ofensor === 'px'  ? /\b\d+(\.\d+)?px\b/.test(seg) && !/^(0|none)$/.test(seg) :
        false;

      if (!temOfensor) continue;

      const idx = m.index;
      const escapo = estaEscapado(idx);
      achados.push({
        id: `token-${grupo}`,
        severidade: escapo ? 'escapado' : 'error',
        linha: linhaDe(idx),
        trecho: trechoDe(idx),
        mensagem: `${spec.mensagem} (segmento "${seg}" em "${propNorm}: ${valor.trim()}")`,
        motivo: escapo,
      });
    }
  }
}

/* ── 2. Ícones e botões icon-only ────────────────────────────────────── */

// span.icon — decorativo precisa aria-hidden, semântico precisa role+aria-label
const iconSpan = /<span\s+class="icon[^"]*"([^>]*)>/gi;
while ((m = iconSpan.exec(texto))) {
  const attrs = m[1];
  const temRole = /role="img"/.test(attrs);
  const temAriaLabel = /aria-label="[^"]+"/.test(attrs);
  const temAriaHidden = /aria-hidden="true"/.test(attrs);

  if (temRole && !temAriaLabel) {
    achados.push({ id: 'icon-semantico-aria-label', severidade: 'error', linha: linhaDe(m.index), trecho: trechoDe(m.index), mensagem: 'role="img" sem aria-label no mesmo elemento.' });
  } else if (!temRole && !temAriaHidden) {
    achados.push({ id: 'icon-decorativo-aria-hidden', severidade: 'error', linha: linhaDe(m.index), trecho: trechoDe(m.index), mensagem: 'Ícone sem role="img" precisa de aria-hidden="true".' });
  }
}

// <button ...>...</button> cujo único filho é .icon, sem aria-label no button
const botao = /<button([^>]*)>([\s\S]*?)<\/button>/gi;
while ((m = botao.exec(texto))) {
  const [, attrs, miolo] = m;
  const soIcone = /^\s*<span class="icon[^>]*>[\s\S]*?<\/span>\s*$/.test(miolo);
  if (soIcone && !/aria-label="[^"]+"/.test(attrs)) {
    achados.push({ id: 'icon-btn-aria-label', severidade: 'error', linha: linhaDe(m.index), trecho: trechoDe(m.index), mensagem: 'Botão icon-only sem aria-label.' });
  }
}

// SVG inline com cor hardcoded
const svgFill = /<svg[\s\S]*?(fill|stroke)="(#[0-9a-fA-F]{3,8})"[\s\S]*?<\/svg>/gi;
while ((m = svgFill.exec(texto))) {
  achados.push({ id: 'svg-inline-currentcolor', severidade: 'error', linha: linhaDe(m.index), trecho: trechoDe(m.index, 60), mensagem: `SVG inline com ${m[1]}="${m[2]}" — deveria ser currentColor. Importe de dist/icons/ em vez de colar SVG.` });
}

/* ── 3. Label associado a input ──────────────────────────────────────── */

const inputComId = /<input\s+[^>]*?\bid="([^"]+)"[^>]*>/gi;
while ((m = inputComId.exec(texto))) {
  const id = m[1];
  const temLabel = new RegExp(`<label[^>]*for="${id}"`).test(texto);
  const temAriaLabel = new RegExp(`id="${id}"[^>]*aria-label=`).test(m[0]) || /aria-label="[^"]+"/.test(m[0]);
  if (!temLabel && !temAriaLabel) {
    achados.push({ id: 'input-label-associado', severidade: 'error', linha: linhaDe(m.index), trecho: trechoDe(m.index), mensagem: `input#${id} sem <label for="${id}"> nem aria-label.` });
  }
}

/* ── 4. Governança: uso de componente "planned" sem [DS-TEMP] ────────── */

const planejados = Object.keys(components.planejados).filter((k) => !k.startsWith('$'));
const classeAttr = /class="([^"]+)"/g;
while ((m = classeAttr.exec(texto))) {
  const tokens = m[1].split(/\s+/);
  for (const key of planejados) {
    const bate = tokens.some((t) => t === key || t.startsWith(`${key}-`) || t.startsWith(`${key}__`) || t.startsWith(`${key}--`));
    if (!bate) continue;
    const idx = m.index;
    const escapo = estaEscapado(idx);
    achados.push({
      id: 'componente-planejado-sem-marcacao',
      severidade: escapo ? 'escapado' : 'error',
      linha: linhaDe(idx),
      trecho: trechoDe(idx),
      mensagem: `Classe usa o componente planejado "${key}" (data/components.json → planejados.${key}) sem marcação.`,
      motivo: escapo,
    });
    break; // um achado por atributo class é suficiente
  }
}

/* ── 5. Contraste conhecido: citação, não recálculo ──────────────────── */

for (const par of rules.contrasteConhecido.pares) {
  const usaAlgumToken = par.tokens.some((t) => texto.includes(t));
  if (usaAlgumToken) {
    const correcao = par.corrigido
      ? ` Corrigido em ${par.corrigido.fonte}: ${par.corrigido.ratio}:1${par.corrigido.aindaAbaixoDoAlvo ? ' — ainda abaixo do alvo.' : '.'}`
      : '';
    achados.push({
      id: `contraste-${par.id}`,
      severidade: 'warn',
      linha: null,
      trecho: par.tokens.join(' / '),
      mensagem: `Contraste medido na Fase 0: ${par.ratio}:1 (alvo ${par.alvo}:1) — ${par.contexto}.${correcao}`,
    });
  }
}

/* ── Relatório ────────────────────────────────────────────────────────── */

const porSeveridade = { error: [], warn: [], escapado: [] };
for (const a of achados) (porSeveridade[a.severidade] ??= []).push(a);

if (JSON_OUT) {
  console.log(JSON.stringify({ arquivo: alvo, totais: Object.fromEntries(Object.entries(porSeveridade).map(([k, v]) => [k, v.length])), achados }, null, 2));
} else {
  console.log(`\nSoul DS · validate  ·  ${alvo}\n`);
  for (const [sev, label, marca] of [['error', 'ERROS', '✗'], ['warn', 'AVISOS', '⚠'], ['escapado', 'ESCAPADOS COM [DS-TEMP]', '○']]) {
    const lista = porSeveridade[sev];
    if (!lista.length) continue;
    console.log(`${label} (${lista.length})`);
    for (const a of lista) {
      const onde = a.linha ? `L${a.linha}` : '—';
      console.log(`  ${marca} [${onde}] ${a.mensagem}`);
      if (a.motivo) console.log(`      motivo declarado: "${a.motivo}"`);
      if (a.trecho) console.log(`      ${a.trecho}`);
    }
    console.log();
  }
  const total = achados.length;
  if (!total) console.log('✓ nenhum achado — contrato cumprido\n');
  else console.log(`${porSeveridade.error.length} erro(s) · ${porSeveridade.warn.length} aviso(s) · ${porSeveridade.escapado.length} escapado(s) com [DS-TEMP]\n`);
}

process.exit(porSeveridade.error.length ? 1 : 0);
