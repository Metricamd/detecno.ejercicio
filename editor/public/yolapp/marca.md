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
- **En todo momento se ve el video**: sin cortinillas/planos de corte a pantalla completa y sin filtros de color sobre el video (pedido en el reel 5; aplica a los siguientes).
- **Pocos efectos de sonido, suaves y bajitos**; sin whoosh/soplos.
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

## Reel 2 "3 recomendaciones para recaudar más"

- Composición: `Yolapp2Reel` (`src/yolapp2/Reel.tsx`, datos en `src/yolapp2/datos.ts`); reutiliza `src/yolapp/parts.tsx`. Mismas reglas de edición que el reel 1.
- Crudo: `v2/crudo.mp4` (480×854, 3:13). Final: **67 s**. Música: `v2/musica.wav`. Cierre congelado: `v2/final.jpg` (el crudo no trae pantalla de CapCut).
- Entrega: `entregas/yolapp/yolapp-reel2-borrador-2.mp4`.
- Cara aprox. y = 320–1100 (mismas zonas que el reel 1).
- Este audio tiene más ruido de fondo (≈ −42 dB): los tramos de voz se detectan a −32 dB.
- Transcripción por tramos con una sola carga del modelo: `node scripts/transcribe_segments.mjs <audio16k.wav> <segmentos.json> <out.json>`.

### Cortes del crudo
| Se quitó | Motivo |
|---|---|
| 0,6–1,6 s "¿Sabes que puedes recibir…" | Arranque en falso |
| 31–42 s "y conectar con personas que quieren…" (×3) | Repetido; queda "…que quieran sumarse a ayudarte" |
| 52–55 s "Pero si ya creaste tu causa, aguas con esto" | Reformulado después ("Pero si ya subiste tu causa…") |
| 70,6–71,2 s "donativos" | Repetido |
| 101,1–101,7 s "agrega ev…" | Reiniciado; queda "agrega evidencia…" |
| 116,6 s "y" suelto | Muletilla |
| 124,7–127,4 s "y 3 y el más importante de todos" | Repetido |
| 137,9–139,2 s "comparte tu link" | Repetido |
| 154,8–155,3 s "Pero por…" | Reiniciado |
| 183,7–184,4 s "copia tu link" | Repetido |
| Todos los silencios | ~2 min de pausas |

### Notas de guion
- Subtítulos corregidos respecto a Whisper: "Yolapp" (oyó "Jolap"/"yo el app"), "Agrega" (oyó "Agregue"), "Muy fácil: entra a Yolapp".
- Datos ilustrativos: "yolapp.com/tu-causa", contador de 1,250 visitas.

## Reel 3 "Conviértete en Yoler"

- Composición: `Yolapp3Reel` (`src/yolapp3/Reel.tsx`, datos en `src/yolapp3/datos.ts`, ilustraciones SVG propias en `src/yolapp3/ilustraciones.tsx`: perrito, comida, hospital, moneda, publicación). Reutiliza `src/yolapp/parts.tsx`.
- Crudo: `v3/crudo.mp4` (**1080×1920**, 1:56). Final: **53 s**. Música: `v3/musica.wav`. Cierre congelado: `v3/final.jpg` (a partir de 113,9 s el crudo cambia a un plano abierto).
- Entrega: `entregas/yolapp/yolapp-reel3-borrador-2.mp4`.
- **Encuadre más cerrado**: la cara ocupa y ≈ 420–1300. Tarjetas en la franja y ≈ 1345–1675 (más compactas); subtítulos abajo en y ≈ 1380 sin tarjeta y arriba (y ≈ 130) con tarjeta; zoom suave 1.0 / 1.08.
- Término de marca: **"Yoler"** (persona que comparte causas y gana por los donativos que ayuda a generar).
- Diagramas: publicación → redes → "una lanita"; flujo Compartes → Donativos → Tú ganas + Ayudas.

### Cortes del crudo
| Se quitó | Motivo |
|---|---|
| 20,2–21,6 s "para perritos, para manuten…" | Repetido; queda "para perritos, para comida, para circunstancias hospitalarias" |
| 35,4–40,7 s "¿Y tú qué puedes hacer? Si no puedes donarles algún…" | Reiniciado; queda la segunda pregunta |
| 51,0–52,2 s "lo único que es…" | Arranque en falso |
| 77,2–78,0 s "por los honet…" | Reiniciado |
| 85,3 s y 94,7 s "y" sueltos | Muletillas |
| 56,7–57,1 s pausa tras "Y en" | Pausa rara; queda "Y en muy pocos pasos" |
| 58,4–59,3 s "Número uno" | Mira hacia otro lado (la tarjeta "Paso 1" lo dice) |
| 86,9–87,2 s, 93,6–94,0 s, 96,4–96,7 s, 111,0–111,4 s | Mira hacia otro lado al inicio/final de frase |
| Todos los silencios | ~1 min de pausas |

### Miradas a otro lado
- **Regla**: no se ven momentos en que voltea a otro lado. Si caen al inicio/final de frase, se recorta la toma; si caen a mitad de frase, se tapan con un **plano de corte a pantalla completa** (degradado de marca + ilustración + texto, ~0,5 s) y el audio sigue (`CUTAWAYS` en `datos.ts`).
- Planos de corte: 13,95–14,5 s "Necesitan ayuda", 18,5–19,0 s "Muchas personas", 103,9–104,45 s "Comparte causas".
- Cómo se detectan: tiras de cuadros de la cara a 4–8 fps de cada toma conservada y revisión visual.

### Notas de guion
- Subtítulos corregidos respecto a Whisper: "Yolapp" (oyó "Yolab"/"yo el app"), "Yoler" (oyó "Joeler"; confirmado por la clienta).

## Reel 4 "No cometas este error"

- Composición: `Yolapp4Reel` (`src/yolapp4/Reel.tsx`, datos en `src/yolapp4/datos.ts`); reutiliza `src/yolapp/parts.tsx` y las ilustraciones de `src/yolapp3/ilustraciones.tsx`.
- Crudo: `v4/crudo.mp4` (1080×1920, 1:38). Final: **41 s**. Música: `v4/musica.wav`. Cierre congelado: `v4/final.jpg` (a partir de 97,6 s el crudo cambia a un plano abierto).
- Entrega: `entregas/yolapp/yolapp-reel4-borrador-1.mp4`.
- Cara aprox. y = 380–1150 (mismas zonas que el reel 1); zoom 1.0 / 1.1.
- Gráficos: pasos 1/3 ("solo el primer paso"), "Nadie la conoce", copiar link + Facebook/WhatsApp/Redes/Grupos/Donde sea (sin logos de marcas), gráfica "más personas → más donativos", app con "¡Copiado!" y "¡Hoy mismo!", checklist final con monedas.

### Cortes del crudo
| Se quitó | Motivo |
|---|---|
| 76,9–78,4 s "Porque alguien querría…" | Arranque en falso |
| 80,5–81,9 s "Porque alguien quería…" | Arranque en falso; queda "Porque alguien podría querer ayudarte…" |
| 63,8–64,1 s y 86,27–86,43 s | Pausas dentro de frase |
| Todos los silencios | ~57 s de pausas |

### Miradas a otro lado
- 21,85–22,35 s (final de "Aquí viene lo importante"): plano de corte "Lo importante".
- Resto revisado a 6–10 fps: gestos con la mirada a cámara, se conservan.

### Notas de guion
- Subtítulos corregidos respecto a Whisper: "Yolapp" (oyó "your lab"/"yo al app"), "y haz que" (oyó "y es que"), "Cuantas más personas…, más oportunidades…".

## Reel 5 "Déjate cuidar" (versión emotiva)

- Composición: `Yolapp5Reel` (`src/yolapp5/Reel.tsx`, datos en `src/yolapp5/datos.ts`, ilustraciones de trazo blanco en `src/yolapp5/ilustraciones.tsx`: manos con corazón, abrazo, casa con corazón, mano ofrecida, balanza).
- Crudo: `v5/crudo.mp4` (1080×1920, 4:31). Final: **1:38**. Cierre congelado: `v5/final.jpg` (desde 269,7 s estira la mano a la cámara).
- Entrega: `entregas/yolapp/yolapp-reel5-borrador-2.mp4`.
- Cara aprox. y = 380–1050.

### Estilo emotivo (cuando se pida "más emotivo")
- **Música**: `scripts/make_music_emotiva.py` — piano en arpegios + cuerdas + bajo, 72 BPM, La m – Fa – Do – Sol; entra solo piano, cuerdas desde 8 s, crece hacia el final. Volumen 0,15 bajo la voz, 0,5 en el cierre.
- **SFX**: muy pocos y bajitos (5–6 en todo el video): `sfx/brillo.wav` (campanita, vol. 0,07) y `sfx/latido.wav` (vol. 0,18), de `scripts/make_sfx_emotiva.py`. **Sin soplos/whoosh** ni caja registradora ni clics.
- **Animación**: fundidos lentos con desenfoque (16–18 cuadros) en vez de rebotes; tarjetas de vidrio translúcido (morado oscuro 38 % + blur) en vez de blancas; frases clave en Poppins 700 *cursiva* arriba de la cabeza; subtítulos Poppins 600 con brillo cálido (palabra activa en durazno, claves en rosa).
- **Ambiente**: luces cálidas flotando por los lados y corazones que suben en los momentos más emotivos; fundido a negro solo al final. **Sin filtro sobre el video** (ni tono cálido, ni viñeta, ni sombras, ni entrada desde negro).
- **Sin planos de corte / cortinillas**: en todo momento se ve el video (la clienta los pidió quitar en el reel 5).

### Cortes del crudo
| Se quitó | Motivo |
|---|---|
| 27,4 s "y" suelto | Muletilla |
| 46,4–48,4 s "Cuando te sientas mal por apoyarte" | Reiniciado |
| 52,6–53,3 s "recuerda" | Repetido al retomar |
| 113,8–114,9 s "aceptar…" | Se corrige a "permitirme" |
| 122,8–124,6 s "Creo que muchas veces valoramos" | Reiniciado |
| 132,3–133,1 s "de cuidar" | Repetido |
| 145,0–146,9 s "Y había algo todavía más profundo" | Reiniciado |
| 214,25–214,65 s | Pausa acortada tras "permítete" |
| Todos los silencios | ~2:50 de pausas |

### Miradas a otro lado
- Se conservan (153,7 s, 157,4 s, 175,0 s, 203,0 s, 267,5 s): la clienta prefiere ver siempre el video antes que cortinillas.

### Notas de guion
- Solo queda "A veces, dejarte cuidar también es una forma de querer" (se quitó la previa "…de crecer", 233,2–235,9 s).
- "¿Por qué me cuesta tanto permitirme ser eso para alguien más?"
- Whisper oyó "de verdad es que"; se subtitula "Y la verdad es que".

## Reel 6 "Modo Yoler: gana comisiones"

- Composición: `Yolapp6Reel` (`src/yolapp6/Reel.tsx`, datos en `src/yolapp6/datos.ts`); reutiliza `src/yolapp/parts.tsx` y las ilustraciones de `src/yolapp3/ilustraciones.tsx`.
- Crudo: `v6/crudo.mp4` (720×1280, 1:05). Final: **30 s**. Voz limpia: `v6/voz.wav` (cadena en `v6/voz-cadena.txt`). Música: `v6/musica.wav` (upbeat, volumen 0,05 bajo la voz). Cierre congelado: `v6/final.jpg`.
- Entrega: `entregas/yolapp/yolapp-reel6-borrador-2.mp4`.
- Cara x ≈ 280–800, y ≈ 380–1320: gráficos solo en el pecho (y ≥ 1400), en las columnas laterales o arriba de la cabeza (y ≤ 330); subtítulos abajo (y ≈ 1420) o arriba (y ≈ 110) con gráfico.
- **Logo de Yolapp tal cual cada vez que dice "Yolapp"** (arriba de la cabeza, ~1,3 s o hasta que termina la toma), con un pop bajito.
- Gráficos (borrador 2, vidrio oscuro + 3D): celular flotante inclinado del que se escapan monedas + contador rojo "Comisiones perdidas"; camino luminoso con un cometa que recorre 4 orbes (causa → link → donan → comisión); interruptor 3D "MONETIZAR" con letras animadas y destello; celular con progreso de pasos + notificaciones "Nueva comisión +$ MXN".
- SFX: 6 en total, volumen 0,12–0,18.

### Cortes del crudo
| Se quitó | Motivo |
|---|---|
| 10,3–10,6 s | Mira hacia abajo a mitad de frase |
| 36,0–36,3 s (imagen) | Cierra los ojos tras "comisión": la imagen se congela en 36,0 s mientras el audio termina la palabra (llega a 36,21 s) |
| 47,7–49,4 s "Así que, ¡deja de compartir!" | Reiniciado |
| 53,2 s "de" suelto | Muletilla |
| Todos los silencios | ~35 s de pausas |

### Notas de guion
- Subtítulos corregidos respecto a Whisper: "Sí, en Yolapp" (oyó "Si en YOLAB"), "Yoler" (oyó "Joller"/"YOLOR"), "Descarga Yolapp".
- Dato ilustrativo: contador de 850 MXN en comisiones.

### Audio (borrador 2)
- **Regla**: la voz se limpia antes de editar y el video se mezcla en silencio. Cadena ffmpeg: `highpass 85 Hz → lowpass 14,5 kHz → afftdn nr=22 nf=-26 → EQ −2,5 dB @220 Hz, +2,5 dB @3,2 kHz, +1,5 dB agudos → de-esser → compresor 2,8:1 → compuerta suave → limitador`. Ruido de fondo de −39 a −56 dB.
- `afftdn` necesita `nf` cerca del ruido real (−25/−26); con −40 no hace nada.
- Master final en 2 pasadas con `loudnorm` a **−14 LUFS, −1,5 dBTP**, AAC 320 kbps. Música a 0,045 bajo la voz.
- **Cortes de palabra**: revisar la envolvente al final de cada toma para no comerse la última sílaba (pasó con "comisión").

## Reel 7 "¿Ganar comisiones por compartir un link?"

- Composición: `Yolapp7Reel` (`src/yolapp7/Reel.tsx`, datos en `src/yolapp7/datos.ts`); efectos compartidos (vidrio, celular 3D, destello) en `src/yolapp/fx.tsx`.
- Crudo: `v7/crudo.mp4` (720×1280, 58 s, ya trae transiciones de cámara propias). Final: **42 s**. Voz limpia `v7/voz.wav` (misma cadena que el reel 6, `nf=-26`; ruido de −38 a −49 dB). Música `v7/musica.wav`. Cierre `v7/final.jpg`.
- Entrega: `entregas/yolapp/yolapp-reel7-borrador-1.mp4` (master −14 LUFS, −1,5 dBTP).
- Cara x ≈ 250–830, y ≈ 300–1220: gráficos solo en y ≥ 1380; subtítulos arriba (y ≈ 70) mientras hay gráfico. Si dice "Yolapp" mientras hay gráfico, el logo sale abajo (y ≈ 1700) para no chocar con los subtítulos.
- Gráficos: celular → monedas que entran a "Tus comisiones"; interruptor 3D "MODO YOLER" con el logo; tarjetas de causas, una marcada "Monetizable", que se comparte a Amigos/Familia/Redes; anillo de donativo con "Tu parte %" y "Tu comisión"; ciclo con cometa Tú compartes → Alguien apoya → Tú recibes; celular con pasos + notificaciones de comisión; barra de comisiones que rompe el "Tope" ("¡Sin tope!").

### Cortes del crudo
| Se quitó | Motivo |
|---|---|
| 1,0–1,3 s | Pausa tras "¿Qué?" |
| 35,16–35,36 s | Pausa entre "y esa" y "es tu comisión" |
| Todos los silencios | ~16 s de pausas |
- Sin arranques en falso ni miradas a otro lado claras (revisado a 6 fps).

### Notas de guion
- Subtítulos corregidos respecto a Whisper: "Yolapp" (oyó "YOLAB"), "Yoler" (oyó "YOLES"/"YOLOR"), "ese donativo" (oyó "sedot nativo"), "descarga la aplicación".
- Datos ilustrativos: +$860, +$45, +$120 MXN y contador $9,999+.

## Reel 8 "¿Ya activaste tu modo Yoler?" (diálogo)

- Composición: `Yolapp8Reel` (`src/yolapp8/Reel.tsx`, datos en `src/yolapp8/datos.ts`, cada toma con `who: "ella" | "el"`).
- Crudo: `v8/crudo.mp4` (720×1280, 1:29), conversación de dos personas con el celular. Final: **67 s**. Voz limpia `v8/voz.wav` (`nf=-27`; ruido de −39 a −50 dB). Master −14 LUFS.
- Entrega: `entregas/yolapp/yolapp-reel8-borrador-1.mp4`.
- **Formato diálogo**: quién habla se detectó por tono (ella ≈ 230 Hz, él ≈ 130 Hz). Subtítulos como **burbujas de chat** escritas palabra por palabra (ella a la izquierda en rosa, él a la derecha en turquesa; la burbuja anterior queda atenuada arriba) sobre las manos. Zoom suave hacia quien habla.
- Se miran entre ellos y al celular a propósito: aquí no aplica la regla de mirar a cámara.
- Caras: ella x 0–460 / y 480–1060, él x 600–1080 / y 280–960 → gráficos en la pared (bloque izquierdo y 40–420 o franja superior y 40–260); logo arriba a la derecha.
- Gráficos: interruptor "MODO YOLER" (con "?"), tarjeta "La nueva app de Causas · México", tira de 5 pasos con cometa (Entras → Causa monetizable → Compartes link → Alguien dona → Tu comisión), anillos "Tú ganas / Ayudas" → "¡Ganar-ganar!", checklist de registro, interruptor "MONETIZABLE" con "¡Ojo!", destinos Redes/Amigos/Grupos/Donde sea, barra que rompe el "Tope".

### Cortes del crudo
| Se quitó | Motivo |
|---|---|
| 40,3–40,55 s | Palabra suelta encimada |
| 75,7–76,4 s "mmm" | Muletilla |
| 86–89 s "adiós, goza" + risas | Fuera del mensaje; cierra en "¡Muchas gracias!" |
| Todos los silencios | ~22 s |

### Notas de guion
- Subtítulos corregidos respecto a Whisper: "Yoler" (oyó "yo le"/"YOLOR"), "Yolapp" (oyó "YOLAB"), "¿Modo qué?" (oyó "Y bueno, ok"), "Ok, explícame", "compartes el link" (oyó "compártese").
