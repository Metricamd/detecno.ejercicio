# Yolapp — marca y reel

## Marca

Fuente: `logo/Yolapp_Logotipo.ai` (6 versiones, 1080×1080). `logo-N.svg` / `preview-N.png` = página N.

1. Color (degradado) sobre blanco  2. Negro  3–6. Blanco sobre degradados

**Logo oficial: el de degradado** → `logo/logo-color.png` (PNG sin fondo, 1400 px de ancho).
Va tal cual encima del video: sin contorno blanco, sin sombra ni filtros.

### Paleta (extraída del logo)
- Azul `#027BEB`
- Turquesa `#03C7C1`
- Índigo `#3E58F8`
- Morado `#7D0ED5`
- Rosa fucsia `#FF0566`
- Coral `#FF4A3A`

Degradados: morado→azul→turquesa, azul→turquesa, coral→fucsia→morado, morado→índigo→azul.

## Reel "Dale confianza a tu causa"

- Composición: `YolappReel` (`src/yolapp/Reel.tsx`, datos en `src/yolapp/datos.ts`), 1080×1920, 30 fps.
- Crudo: `crudo.mp4` (480×854, 2:40). Final: **54 s**.
- Entregas: `entregas/yolapp/yolapp-reel-borrador-3.mp4` (versión aprobada).
- Música: `musica.wav` (sintetizada con `scripts/make_music_upbeat.py`). SFX: `sfx/` (whoosh, pop, ding, click, `cash.wav` de `scripts/make_sfx_cash.py`).

### Reglas de edición (aprobadas)
- **Sin silencios ni repeticiones**: de cada frase repetida o equivocada se deja solo la toma buena, para que el discurso suene como una sola toma.
- **Video siempre a pantalla completa.** Nada de recortes en círculo ni burbujas.
- **No tapar la cara**: la cara ocupa aprox. y = 380–1150. Las tarjetas animadas van en el tercio inferior (y ≈ 1190–1660) y los subtítulos suben arriba de la cabeza mientras hay tarjeta; si no hay tarjeta, van abajo (y ≈ 1250).
- Stickers de frases clave arriba de la cabeza (y ≈ 150–450).
- Zoom alterno 1.0 / 1.14 en cada corte; sin zoom mientras hay tarjeta.
- Subtítulos palabra por palabra, Poppins 800; palabra activa en pastilla fucsia, palabras clave en turquesa.
- Gesto de dinero con las manos → sonido de caja registradora + "¡Ka-ching!" y monedas a los lados.
- Cierre: último cuadro congelado (antes de la pantalla de CapCut del crudo, que empieza en 159,4 s) con el logo de degradado tal cual y "Comparte tu causa".

### Cortes del crudo
| Se quitó | Motivo |
|---|---|
| 21–39 s "¿O le comprarías…?" (×4) | Arranques en falso |
| 49–51 s "desde todos los ángulos" | Repetido |
| 58–61 s "Pues eso es lo que pasa exactamente" | Reiniciado |
| 67–69 s "Sube un video contando tu causa" | Corregido a "tu historia" |
| 74–75 s "agrega foto de tu…" | Reiniciado |
| 88–89 s "sea tu causa" | Repetido |
| 112,5–113,9 s "pero si no… comp…" | Reiniciado; se deja "pero si no compartes tu link…" |
| Todos los silencios | ~1:45 de pausas en total |

Se conserva 141,1–142,2 s (silencio) por el gesto de dinero.

### Notas de guion
- Dice "pero si no compartes **tu link**" y "es el **primer** paso para recibir"; los subtítulos siguen el audio.
- Subtítulos corregidos respecto a Whisper: "Sube" (oyó "Suba"), "Yolapp" (oyó "Yolab").
- Datos ilustrativos en animaciones: "4.9 · 128 reseñas", "1,250 visitas", "yolapp.com/tu-causa".

### Cómo renderizar
```bash
cd editor
npx remotion render src/index.ts YolappReel ../entregas/yolapp/<nombre>.mp4 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell \
  --concurrency=4 --crf=20
```
Transcripción: `node scripts/transcribe.mjs <audio16k.wav> <out.json> spanish` (modelo Whisper small q8 en `editor/models/`, no versionado).
