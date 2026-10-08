# estilo-alva.md — guía de edición (basada en `prop_1.mp4`, anuncio de ALVA creative studio)

Referencia: 1080×1920 (9:16), 30 fps, 20,07 s, H.264 ~4,2 Mbps, audio AAC mono. Valores en px sobre lienzo 1080×1920.
`[SUPOSICION]` = no medible con certeza en los fotogramas o el audio. No se pudo transcribir con Whisper (modelo bloqueado por la red), así que el texto hablado se deduce de los subtítulos en pantalla y no se ha oído la voz ni la música.

## 1. Ritmo de cortes
- **Un solo plano 3D continuo** de 0 a 15,0 s (sin cortes: el detector de escena solo marca 1 cambio, a 15,1 s). Después, **1 escena final** de 15,0 a 20,07 s.
- Total: **2 escenas**; duración media de escena 10 s. El movimiento lo hace la cámara y el color, no el montaje.
- Cambios de estado visibles (muestreo a 2 fps): cada **0,5–1,0 s** pasa algo (cámara, color de pared, pantalla, personajes). Nunca hay 1,5 s seguidos sin movimiento.
- Estructura: 0–5 s problema (gris) · 5–11 s transformación (gris → lila → melocotón) · 11–15 s solución (cálido) · 15–20 s cierre de marca.

## 2. Subtítulos
- Fuente: sans geométrica tipo **Poppins**. Normal = Regular (400), énfasis = SemiBold/Bold (600–700). [SUPOSICION] Poppins por la "a" y la "t".
- Tamaño: **≈ 44 px** (interlineado 74 px, ≈ 1,7). En la escena final sube a **≈ 56–60 px**, 3 líneas (alto de bloque 848–1083 px).
- Bloques de **2 líneas** (≈ 5–8 palabras por bloque, ancho máx. ≈ 780 px, centrado en x = 540). Una frase hablada por bloque.
- Aparición: **bloque entero** con fundido (opacidad 0 → 1, ~0,3 s). **No es palabra por palabra** en la referencia. [SUPOSICION] el fundido es de unos 8–10 fotogramas.
- Salida: el bloque desaparece al final de la frase (sin animación apreciable) o se desplaza hacia arriba y se desvanece (visto a 17,5 s). Duración de cada bloque: **2,5 s**.
- Palabra/zona destacada: tramo final de la frase en **SemiBold** ("sin tener que contratarlo."), mismo color. No se usa cambio de color en las frases del 3D.
- Color:
  - Sobre fondo gris (problema): blanco **#FFFFFF**.
  - Sobre fondo melocotón (solución): morado **≈ #7B5AA6** [SUPOSICION: medido a ojo sobre el texto].
  - Sobre degradado final: blanco **#FFFFFF**.
- Posición:
  - Escena 3D: parte baja, 1.ª línea en **y = 1619–1671**, 2.ª en **y = 1693–1745** (centro del bloque ≈ y 1680, **87 % de la altura**). Bloque de una línea (lila): y 1724–1771.
  - Escena final: centrado, **y ≈ 848–1083 (≈ 49 % de la altura)**.
- Puntuación: se conservan la coma y el punto final dentro del bloque ("esta junta,", "contratarlo.").

## 3. Textos en pantalla (aparte de los subtítulos)
- **Marca de agua**: logotipo "av" (monograma de ALVA, trazo blanco) arriba a la derecha, centro en **x ≈ 960, y ≈ 125**, ancho ≈ 80 px, opacidad ≈ 70–80 %. Está presente **todo el vídeo**, también en la escena final.
- **Cierre**: logotipo **"alva."** blanco, ≈ 600 px de ancho, centrado en y ≈ 1000, y debajo `creative studio` en minúsculas, ≈ 28 px, interletrado amplio, opacidad ≈ 70 %. Aparece con fundido tras el texto "Tu departamento de diseño, sin tener que contratarlo.".
- No hay rótulos, píldoras ni números grandes.

## 4. B-roll
- No es vídeo de stock: es **una escena 3D isométrica de sala de reuniones** estilo "diorama" (cubo abierto con 2 paredes y suelo), personajes de plástico/arcilla, mesa de madera clara, sillas grises, planta, pantalla con diapositiva.
- Narrativa visual: la diapositiva pasa de **plantilla genérica** (apretón de manos sobre amarillo, bloques de colores primarios, logo azul) a **diseño ALVA** (degradado lila-naranja con gráfica y texto). La pantalla se apaga en negro ≈ 0,5 s en el cambio (≈ 8,5 s).
- Los personajes cambian de actitud: aburridos/ocupados con el móvil al principio; al final sonríen, escriben y miran a la pantalla.

## 5. Transiciones
- Dentro de la escena 3D: **sin corte**. El cambio de "antes" a "después" es una **transformación animada** (≈ 6,0–9,0 s): el fondo pasa de gris a lila a melocotón, las paredes cambian de gris a melocotón y el suelo se reconstruye con piezas de madera.
- 3D → final (≈ 15,0 s): **fundido cruzado con desenfoque** de ≈ 12 fotogramas (0,4 s); el diorama queda fantasma sobre el degradado en el primer fotograma de la escena final.
- Sin cortinillas, sin barridos, sin efectos de glitch.

## 6. Zooms y cámara
- Cámara isométrica con **dolly-in continuo**: de **escala 1,0** (plano general, cubo entero) a **≈ 2,2–2,4** hacia los 5–6 s (la pared derecha sale de cuadro), con ease-in-out.
- Se mantiene cerca (≈ 2,3) de 6 a 14 s con **deriva lenta** (≈ 1–2 % de desplazamiento).
- Cierre del 3D: **dolly-out** de 12,5 a 15,0 s, hasta el plano general.
- Parallax/rotación leve de cámara durante el acercamiento (se ve el ángulo girar unos 5–10°). [SUPOSICION]

## 7. Color
- **Problema**: gris frío, fondo **≈ #6C7278 → #282E30** (se oscurece al acercarse), escena desaturada, sin acento.
- **Transformación**: lila **≈ #8D7BB5** → melocotón **≈ #F1D2BE** (≈ 7,0–9,0 s).
- **Solución**: pared **≈ #CC7B68**, suelo/fondo **≈ #F1D2BE**, acento morado en texto.
- **Escena final**: degradado malla (mesh gradient) con grano suave: naranja/salmón **≈ #F7918B**, melocotón **≈ #FBE7DA** arriba-izquierda, violeta **≈ #AB7FED** arriba-derecha, lila **≈ #B69AE5 / #E39DB0** abajo. Esquina inferior azul-lila.
- Paleta de marca: **salmón #F7918B · violeta #AB7FED · melocotón #FBE7DA · blanco #FFFFFF**.
- Sin LUT apreciable; contraste medio-bajo, aspecto suave.

## 8. Sonido
- Sonoridad integrada: **−22,3 LUFS**; LRA 9,2 LU (rango dinámico alto: voz con partes más bajas, sin compresión fuerte).
- Nivel RMS por tramos: −45 dB (silencio inicial, <0,3 s), después entre **−17 y −30 dB**; el nivel más alto (−17 dB) cae hacia 9–11 s.
- No hay silencios largos (> 0,2 s por debajo de −40 dB) después del primer instante. 
- [SUPOSICION] Voz en off femenina/neutra, cálida, ritmo tranquilo (≈ 2 frases por 5 s).
- [SUPOSICION] Música de fondo ambiental suave, con crecida hacia la "solución".
- [SUPOSICION] Efectos sutiles (whoosh/pop) en la transformación del cuarto y en el cambio de pantalla.

## 9. Resumen del guion de la referencia (lo que dicen los subtítulos)
1. 0,0–2,5 s: "Si llevas semanas preparando esta junta,"
2. 2,5–5,2 s: "¿por qué presentarla con una plantilla como la de todos?"
3. 11,0–12,5 s: "Hazlo con alva" (lila, 1 línea)
4. 12,5–15,0 s: "y deja que tu presentación hable antes que tú."
5. 15,5–17,7 s: "Tu departamento de diseño, **sin tener que contratarlo.**"
6. 18,0–20,0 s: logotipo "alva. creative studio".

---
## Correcciones del usuario (se añaden aquí y tienen prioridad sobre lo anterior)
> Cada corrección que te guste se registra aquí con fecha.
- **Voz femenina, energética y con acento mexicano** (2026-10-08). Voz sintética de Magnific (eleven_v3) con la etiqueta `[Mexican accent]`, `[excited]`, estabilidad 0,3 y velocidad 1,05. Se ofrecen varias candidatas y gana la que elija el usuario.
- **Subtítulos como en la referencia** (2026-10-08). Bloques de 2 líneas que aparecen enteros con fundido (no palabra a palabra), con el tramo final en SemiBold, tal como en §2.
