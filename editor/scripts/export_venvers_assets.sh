#!/usr/bin/env bash
# Renders every loose Venvers element (src/venvers/Assets.tsx) at 2x on a
# transparent canvas and crops it to its visible bounds.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=${1:-../entregas/venvers-cuentas-por-pagar/elementos}
mkdir -p "$OUT"
NAMES=$(node -e 'console.log(require("fs").readFileSync("src/venvers/Assets.tsx","utf8").match(/^  "([^"]+)": \(\)/gm).map(s=>s.match(/"([^"]+)"/)[1]).join(" "))')
for n in $NAMES icono-funcionalidad-1 icono-funcionalidad-2 icono-funcionalidad-3; do
  npx remotion still VenversAsset "$OUT/$n.png" --props="{\"name\":\"$n\"}" --frame=50 --scale=2 --image-format=png --gl=swangle --log=error >/dev/null
done
python3 scripts/crop_assets.py "$OUT"
cp public/venvers/logo-venvers.png "$OUT/logo-venvers.png"
