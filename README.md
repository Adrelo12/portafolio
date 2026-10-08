# Portafolio — Adrián Reyes López

Portafolio web personal para presentar en las prácticas de 2º DAW. Hecho solo
con HTML y CSS (sin frameworks); el único JavaScript es el `onclick="window.print()"`
del botón de descarga del CV, imprescindible para abrir el diálogo de impresión.

## Archivos

- `index.html` — página principal: portada, sobre mí, proyectos, tecnologías, formación y contacto.
- `cv.html` — CV de una sola página en formato A4, listo para imprimir o guardar como PDF (`Ctrl+P`).
- `estilos.css` — estilos de ambas páginas.
- `img/` — imágenes del sitio (ver abajo).

## Imágenes necesarias

Coloca estos archivos dentro de `img/` con esos nombres exactos:

- `perfil.jpg`
- `mugiwara.jpg`
- `kaboom.jpg`
- `lucia-duque.jpg`
- `pequenos-viajeros.jpg`
- `spring-angular.jpg`
- `ubuntu-server.jpg`

Las imágenes se cargan como `background-image` en CSS, no con `<img>`. Si falta
algún archivo, el navegador simplemente muestra el color de fondo azul en su
lugar, sin romper el diseño ni mostrar un icono de imagen rota.

## Antes de publicar

En `index.html`, sección de contacto, cambia los placeholders `TU-USUARIO` y
`TU-PERFIL` por tu usuario real de GitHub y LinkedIn.
