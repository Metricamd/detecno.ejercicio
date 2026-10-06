# estilo.md — guía de edición (basada en `ref/referencia.mp4`)

Referencia: 464×832 (9:16), 30 fps, 46,8 s (42,4 s de contenido + 4,4 s de cierre de TikTok que **no** forma parte del estilo).
Valores en px convertidos a lienzo **1080×1920** (factor ×2,33). `[SUPOSICION]` = no medible con certeza en los fotogramas o el audio.

## 1. Ritmo de cortes
- Dos tipos de plano alternados: **A-roll** (persona a cámara) y **plano gráfico** (motion graphics sobre fondo claro).
- Cambios de plano medidos (s): 2,43 · 5,43 · 6,80 · 10,43 · 12,47 · 23,30 · 24,10 · 26,97 · 29,40 · 32,07 · 37,63 · 38,77 · 41,90.
- Duración media de plano: **2,3 s** (mín. 0,8 s, máx. 10,8 s en una explicación con gráfico).
- Dentro de un plano gráfico hay un cambio de estado cada **0,5–1,5 s** (aparece un elemento, se marca un check, cambia un color). Nunca pasan más de **1,5 s** sin movimiento.
- Proporción: **~65 % gráfico / 35 % A-roll**. Empieza con un gráfico (gancho visual) y no con la cara.
- Cero silencios: no hay pausas > 0,15 s por debajo de −45 dB entre 0 y 43,8 s.

## 2. Subtítulos
- Fuente: sans geométrica redondeada en negrita (la "t" tiene la cola curva y la "a" es de dos pisos). [SUPOSICION] Parecida a **Gilroy Bold / Poppins SemiBold**; en Remotion se usa `Poppins` 600/800.
- **Estructura en 3 líneas, centradas:**
  - Línea de contexto: 1–4 palabras, **46 px**, peso 600.
  - Palabra destacada: 1 palabra, **100–110 px**, peso 800, interletrado −2 %.
  - Línea de cola (opcional): 1–2 palabras, **38 px**, peso 600, justo debajo.
- Palabras por bloque: **3–6** (media 4). Un bloque cambia a cada frase o cada **~1,2 s**.
- Aparición: **palabra por palabra**, sincronizada con la voz. Cada palabra entra con desenfoque 8 px → 0, opacidad 0 → 1 y desplazamiento Y +10 px → 0 en **6 fotogramas (0,2 s)**. Las que aún no se han dicho son invisibles: no hay karaoke de color.
- Salida: el bloque entero se desenfoca y se desvanece en 4–6 fotogramas.
- Palabra destacada: la palabra clave de la frase (verbo o sustantivo con más peso: "editado", "fácil", "referencia", "colores", "replicar").
  - Sobre fondo claro: **azul #0353FF**.
  - Sobre A-roll: **blanco #FFFFFF** con sombra `0 2px 12px rgba(0,0,0,.35)`.
- Texto normal: **#131313** sobre fondo claro, **#FFFFFF** sobre A-roll.
- Posición:
  - En A-roll: arriba, con el centro del bloque al **6–12 % de la altura** (y ≈ 115–230 px), sobre la cabeza.
  - En planos gráficos: debajo del gráfico, al **78–88 %** (y ≈ 1500–1700 px), o arriba si el gráfico ocupa la mitad inferior.
- Puntuación: se conservan las comas y el punto final en la palabra destacada ("fácil,", "pídeselo.").

## 3. Textos en pantalla (aparte de los subtítulos)
- **Píldoras/etiquetas:** fondo #131313, radio 999 px, texto en monoespaciada mayúscula de 22 px y blanco, interletrado +8 %, con un punto separador "·". Ej.: `VÍDEO 1 · EDITADO CON IA`. [SUPOSICION] La fuente es JetBrains Mono o similar.
- **Etiquetas de archivo:** chip blanco con icono de archivo y texto mono de 22 px (`referencia.mp4`).
- **Listas numeradas:** tarjeta blanca de 560×70 px, círculo azul #0353FF de 34 px con el número en blanco y texto de 32 px en #131313. Cada ítem entra 0,4 s después del anterior.
- **Números grandes:** cifra de 300 px, peso 800, con degradado vertical #131313 → #3A4A6B y la palabra en cursiva azul de 90 px debajo ("2 pasos").
- **Checklist:** casilla azul #0353FF con check blanco. Los ítems pendientes se muestran al 30 % de opacidad y pasan a 100 % al marcarse, uno cada 0,5 s y sincronizados con la voz.

## 4. B-roll y gráficos
- El b-roll son **mockups**, no vídeo de stock: un teléfono con contorno negro de 6 px y radio de 60 px, tarjetas blancas, una ventana de terminal oscura (#151826, con tres puntos rojo, amarillo y verde) y capturas de la interfaz.
- Las tarjetas son blancas, con radio de **24 px**, sombra `0 20px 60px rgba(30,60,160,.12)` y borde de 1 px rgba(0,0,0,.05).
- El fondo de los planos gráficos es **#F8F9FF** con dos manchas radiales difuminadas: lavanda #E3E6FF en la esquina superior derecha y azul #DCE7FF en la esquina inferior izquierda, a un 60 % de opacidad.
- Marco de "escaneo": esquinas azules en forma de L (#0353FF, trazo de 6 px) alrededor del mockup.
- Los elementos entran con un spring (damping 14, ~0,4 s) y una escala de 0,9 a 1 con fundido.
- Secuencias de elección (v1, v2, v3): las versiones descartadas se muestran en gris y desaturadas, y la elegida lleva un borde azul de 4 px y una insignia con check.
- Diagramas de nodos con líneas discontinuas azules (dash 6/6) que se dibujan en 0,4 s.

## 5. Transiciones
- Entre A-roll y gráfico: **fundido cruzado con desenfoque de 4–6 fotogramas** (en el fotograma de 10,5 s se ven las dos capas superpuestas).
- Entre estados de un mismo gráfico no hay corte: los elementos se animan dentro de la misma escena.
- Sin cortinillas, sin barridos y sin transiciones 3D.

## 6. Zooms
- A-roll: alterna el encuadre entre segmentos, con un plano normal a escala **1,0** y un punch-in a escala **1,12–1,18** (por ejemplo, 8,0 s frente a 10,5 s). El cambio es un **corte seco**, sin rampa.
- [SUPOSICION] Dentro de cada segmento hay un zoom lento de 1,00 a 1,04.
- En los gráficos, los mockups hacen un zoom lento de 1,0 a 1,05 mientras permanecen en pantalla.

## 7. Color
- Paleta: fondo #F8F9FF · texto #131313 · acento **#0353FF** · blanco #FFFFFF · gris inactivo #C9CDD8.
- Un único color de acento por vídeo, usado en la palabra destacada, los checks, los números y los bordes de selección.
- A-roll: luz natural cálida, sin LUT aparente. [SUPOSICION] Contraste +5 % y saturación −5 %.

## 8. Sonido
- Sonoridad integrada: **−15,5 LUFS**; LRA: 3,6 LU, muy comprimido.
- No hay huecos de silencio en todo el contenido.
- [SUPOSICION] Lleva una música de fondo suave (lo-fi/ambient) a unos −28 LUFS, por debajo de la voz. La señal continua sin silencios lo sugiere, pero no se puede confirmar sin escucharla.
- [SUPOSICION] Lleva *whoosh* suaves en las transiciones a gráfico y *pop*/clic cuando aparecen tarjetas y checks.

## 9. Cierre
- Termina con una frase corta a cámara ("De nada."), con la palabra destacada en grande.
- La tarjeta final de TikTok (42,5–46,8 s) la añade la plataforma y no se replica.

---
## Correcciones del usuario (se añaden aquí y tienen prioridad sobre lo anterior)
- **Voz con acento mexicano** (2026-10-06). Si la voz es sintética, se usa una voz del catálogo marcada como mexicana, con la etiqueta `[Mexican accent]` y velocidad 0,9. La voz elegida para Fispal es la femenina de Araceli Mendoza.
- **Textos legibles, sin prisa** (2026-10-06). Esta corrección sustituye en parte a §1 y §2:
  - Cada bloque de subtítulo es una frase hablada completa y dura **≥ 2 s**. Se queda en pantalla hasta que empieza el siguiente, sin salir antes.
  - Las palabras siguen apareciendo sincronizadas con la voz, pero **0,1 s antes** de que se digan y con una animación de entrada de **8 fotogramas** (antes eran 6).
  - En voces en off, las pausas entre frases se recortan a **0,6 s como máximo**, en lugar de quitar todo lo que supere 0,3 s. Así hay tiempo para leer.
