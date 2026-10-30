# Portafolio — Adrián Reyes López

Portafolio web personal para presentar en las prácticas de 2º DAW. Hecho solo
con HTML y CSS (sin frameworks); el único JavaScript es el `onclick="window.print()"`
del botón de descarga del CV, imprescindible para abrir el diálogo de impresión.

## Archivos

- `index.html` — página principal: portada, sobre mí, proyectos, tecnologías, formación y contacto.
- `cv.html` — CV de una sola página en formato A4, listo para imprimir o guardar como PDF (`Ctrl+P`).
- `estilos.css` — estilos de todas las páginas.
- `carrusel.js` — carrusel de imágenes reutilizable con flechas, puntos y lightbox (ver abajo).
- `img/` — imágenes del sitio (ver abajo).

## Imágenes necesarias

Imagen suelta, dentro de `img/` con ese nombre exacto:

- `perfil.jpg`

Se carga como `background-image` en CSS, no con `<img>`. Si falta el
archivo, el navegador simplemente muestra el color de fondo azul en su lugar,
sin romper el diseño ni mostrar un icono de imagen rota.

Las tarjetas de Pequeños Viajeros, Prácticas full stack y Servidor Linux no
tienen foto de proyecto (son trabajos de diseño/configuración sin capturas
que mostrar): llevan un fondo con degradado e icono SVG en línea en
`index.html` en su lugar, sin depender de ningún archivo de imagen.

### Carruseles de proyectos

Las tarjetas de Mugiwara Box, Kaboom y Lucía Duque usan un carrusel en vez de
una imagen fija. Añade las que tengas en `img/`, numeradas desde 1:

- `mugiwara-1`, `mugiwara-2`, `mugiwara-3`...
- `kaboom-1`, `kaboom-2`, `kaboom-3`...
- `lucia-duque-1`, `lucia-duque-2`...

Acepta `.jpg`, `.jpeg`, `.png` o `.webp` (prueba esas extensiones en ese
orden). `carrusel.js` comprueba en el navegador cuáles existen (hasta un
máximo de 6 por tarjeta, configurable con el atributo `data-max` en
`index.html`) y solo monta el carrusel con las que carguen correctamente; si
no hay ninguna, se queda el fondo de color, igual que con las demás imágenes.

Para añadir un carrusel a un proyecto nuevo solo hace falta este bloque, sin
tocar `carrusel.js`:

```html
<div class="carrusel" data-prefijo="nombre-proyecto" data-max="6"></div>
```

Añade `data-ajuste="contain"` cuando la imagen sea un logo y no deba
recortarse (fondo claro, sin recorte); por defecto usa `cover`.
