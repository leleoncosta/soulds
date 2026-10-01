#!/usr/bin/env bash
# Soul DS — apply-project-root.sh
#
# Copia os 4 arquivos remediados de project-root/ por cima dos originais
# na raiz do projeto: SKILL.md, components.md, icons.md, tokens.css.
# Também oferece soul-ds-examples.html remediado (espaçamento migrado +
# tokens de cor corrigidos) como quinto arquivo, opcional.
#
# Por que isto não rodou sozinho: este ambiente não tem escrita em
# /mnt/project (read-only). Rode este script no seu checkout real do
# projeto, onde soul-ds/ está ao lado de SKILL.md/tokens.css/etc.
#
# Uso:
#   ./soul-ds/scripts/apply-project-root.sh              # aplica os 4 essenciais
#   ./soul-ds/scripts/apply-project-root.sh --com-exemplo  # + soul-ds-examples.html
#   ./soul-ds/scripts/apply-project-root.sh --dry-run      # só mostra o que faria

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOUL_DS_DIR="$(dirname "$SCRIPT_DIR")"
PROJETO_DIR="$(dirname "$SOUL_DS_DIR")"
ORIGEM="$SOUL_DS_DIR/project-root"

DRY_RUN=false
COM_EXEMPLO=false
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --com-exemplo) COM_EXEMPLO=true ;;
  esac
done

ARQUIVOS=(SKILL.md components.md icons.md tokens.css)
if $COM_EXEMPLO; then
  ARQUIVOS+=(soul-ds-examples.html)
fi

echo "Soul DS — aplicando arquivos remediados"
echo "  origem:  $ORIGEM"
echo "  destino: $PROJETO_DIR"
echo

for arquivo in "${ARQUIVOS[@]}"; do
  src="$ORIGEM/$arquivo"
  dst="$PROJETO_DIR/$arquivo"

  if [[ ! -f "$src" ]]; then
    echo "  ✗ $arquivo — não existe em project-root/, pulando"
    continue
  fi

  if [[ -f "$dst" ]]; then
    linhas_antes=$(wc -l < "$dst")
    linhas_depois=$(wc -l < "$src")
    echo "  → $arquivo  ($linhas_antes → $linhas_depois linhas)"
  else
    echo "  → $arquivo  (novo arquivo, destino não existia)"
  fi

  if ! $DRY_RUN; then
    cp "$dst" "$dst.bak-$(date +%Y%m%d%H%M%S)" 2>/dev/null || true
    cp "$src" "$dst"
  fi
done

echo
if $DRY_RUN; then
  echo "modo --dry-run — nada foi escrito. Rode sem essa flag para aplicar."
else
  echo "✓ aplicado. Backups salvos como <arquivo>.bak-<timestamp> ao lado do original."
  echo
  echo "Próximo passo — se algum outro CSS/HTML do projeto usa --spacing-N,"
  echo "migre ANTES de confiar no tokens.css novo (nomes colidem com valores"
  echo "diferentes entre a convenção antiga e a nova):"
  echo "  node soul-ds/scripts/migrate-spacing-refs.mjs <arquivo> --write"
fi
