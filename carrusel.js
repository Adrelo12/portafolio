/* =====================================================
   CARRUSEL DE PROYECTOS — script reutilizable
   Busca <div class="carrusel" data-prefijo="..." data-max="N">
   y lo rellena solo con las imágenes img/<prefijo>-1.*, -2.*...
   que realmente existan. Sin librerías.
===================================================== */

const CARPETA_IMAGENES = "img/";
const EXTENSIONES_IMAGEN = [".jpg", ".jpeg", ".png", ".webp"];

/* ===== COMPROBAR SI UNA IMAGEN EXISTE ===== */
function existeImagen(ruta) {
  return new Promise((resolver) => {
    const imagen = new Image();
    imagen.onload = () => resolver(true);
    imagen.onerror = () => resolver(false);
    imagen.src = ruta;
  });
}

/* ===== BUSCAR LA PRIMERA EXTENSION QUE EXISTA PARA UN NUMERO ===== */
async function buscarRuta(prefijo, numero) {
  for (const extension of EXTENSIONES_IMAGEN) {
    const ruta = `${CARPETA_IMAGENES}${prefijo}-${numero}${extension}`;
    if (await existeImagen(ruta)) return ruta;
  }
  return null;
}

/* ===== DETECTAR LAS IMAGENES NUMERADAS DE UN PROYECTO ===== */
async function detectarImagenes(prefijo, maximo) {
  const numeros = Array.from({ length: maximo }, (_, i) => i + 1);
  const rutas = await Promise.all(numeros.map((numero) => buscarRuta(prefijo, numero)));
  return rutas.filter((ruta) => ruta !== null);
}

/* ===== CONSTRUIR EL CARRUSEL DENTRO DE SU CONTENEDOR ===== */
function construirCarrusel(contenedor, rutas) {
  if (rutas.length === 0) return; // se queda el fondo de color por defecto

  const ajuste = contenedor.dataset.ajuste || "cover";
  contenedor.classList.add(`carrusel-ajuste-${ajuste}`);
  contenedor.innerHTML = "";

  const pista = document.createElement("div");
  pista.className = "pista-carrusel";

  rutas.forEach((ruta, indice) => {
    const diapositiva = document.createElement("div");
    diapositiva.className = "diapositiva-carrusel";

    const img = document.createElement("img");
    img.src = ruta;
    img.alt = `Imagen ${indice + 1} del proyecto`;
    img.loading = "lazy";
    img.addEventListener("click", () => abrirLightbox(rutas, indice));

    diapositiva.appendChild(img);
    pista.appendChild(diapositiva);
  });

  contenedor.appendChild(pista);

  if (rutas.length > 1) {
    agregarControles(contenedor, pista, rutas.length);
  }
}

/* ===== FLECHAS Y PUNTOS DE NAVEGACION ===== */
function agregarControles(contenedor, pista, totalImagenes) {
  const anterior = document.createElement("button");
  anterior.type = "button";
  anterior.className = "flecha-carrusel flecha-carrusel-anterior";
  anterior.setAttribute("aria-label", "Imagen anterior");
  anterior.innerHTML = "&#10094;";

  const siguiente = document.createElement("button");
  siguiente.type = "button";
  siguiente.className = "flecha-carrusel flecha-carrusel-siguiente";
  siguiente.setAttribute("aria-label", "Imagen siguiente");
  siguiente.innerHTML = "&#10095;";

  const puntos = document.createElement("div");
  puntos.className = "puntos-carrusel";
  for (let i = 0; i < totalImagenes; i++) {
    const punto = document.createElement("button");
    punto.type = "button";
    punto.className = "punto-carrusel";
    punto.setAttribute("aria-label", `Ir a la imagen ${i + 1}`);
    puntos.appendChild(punto);
  }

  contenedor.appendChild(anterior);
  contenedor.appendChild(siguiente);
  contenedor.appendChild(puntos);

  const puntosElementos = [...puntos.children];

  function diapositivaActual() {
    return Math.round(pista.scrollLeft / pista.clientWidth);
  }

  function irADiapositiva(indice) {
    pista.scrollTo({ left: pista.clientWidth * indice, behavior: "smooth" });
  }

  function marcarPuntoActivo() {
    const actual = diapositivaActual();
    puntosElementos.forEach((punto, indice) => {
      punto.classList.toggle("punto-carrusel-activo", indice === actual);
    });
  }

  anterior.addEventListener("click", () => irADiapositiva(Math.max(0, diapositivaActual() - 1)));
  siguiente.addEventListener("click", () => irADiapositiva(Math.min(totalImagenes - 1, diapositivaActual() + 1)));
  puntosElementos.forEach((punto, indice) => punto.addEventListener("click", () => irADiapositiva(indice)));

  // ponytail: debounce simple con setTimeout, suficiente para marcar el punto activo al deslizar
  let temporizadorScroll;
  pista.addEventListener("scroll", () => {
    clearTimeout(temporizadorScroll);
    temporizadorScroll = setTimeout(marcarPuntoActivo, 100);
  });

  marcarPuntoActivo();
}

/* ===== LIGHTBOX (una sola instancia compartida) ===== */
let lightboxOverlay = null;
let lightboxImagenes = [];
let lightboxIndice = 0;

function crearLightbox() {
  const overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.innerHTML = `
    <button type="button" class="lightbox-cerrar" aria-label="Cerrar">&times;</button>
    <button type="button" class="lightbox-anterior" aria-label="Imagen anterior">&#10094;</button>
    <img class="lightbox-imagen" src="" alt="">
    <button type="button" class="lightbox-siguiente" aria-label="Imagen siguiente">&#10095;</button>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector(".lightbox-cerrar").addEventListener("click", cerrarLightbox);
  overlay.querySelector(".lightbox-anterior").addEventListener("click", () => moverLightbox(-1));
  overlay.querySelector(".lightbox-siguiente").addEventListener("click", () => moverLightbox(1));
  overlay.addEventListener("click", (evento) => {
    if (evento.target === overlay) cerrarLightbox();
  });

  return overlay;
}

function abrirLightbox(imagenes, indiceInicial) {
  if (!lightboxOverlay) lightboxOverlay = crearLightbox();

  lightboxImagenes = imagenes;
  lightboxIndice = indiceInicial;
  actualizarImagenLightbox();

  lightboxOverlay.classList.add("lightbox-overlay-visible");
  document.body.classList.add("bloquear-scroll");
}

function actualizarImagenLightbox() {
  lightboxOverlay.querySelector(".lightbox-imagen").src = lightboxImagenes[lightboxIndice];

  const haySeveras = lightboxImagenes.length > 1;
  lightboxOverlay.querySelector(".lightbox-anterior").style.display = haySeveras ? "" : "none";
  lightboxOverlay.querySelector(".lightbox-siguiente").style.display = haySeveras ? "" : "none";
}

function moverLightbox(delta) {
  lightboxIndice = (lightboxIndice + delta + lightboxImagenes.length) % lightboxImagenes.length;
  actualizarImagenLightbox();
}

function cerrarLightbox() {
  if (!lightboxOverlay) return;
  lightboxOverlay.classList.remove("lightbox-overlay-visible");
  document.body.classList.remove("bloquear-scroll");
}

document.addEventListener("keydown", (evento) => {
  if (!lightboxOverlay || !lightboxOverlay.classList.contains("lightbox-overlay-visible")) return;
  if (evento.key === "Escape") cerrarLightbox();
  if (evento.key === "ArrowLeft") moverLightbox(-1);
  if (evento.key === "ArrowRight") moverLightbox(1);
});

/* ===== INICIO: busca todos los carruseles de la página ===== */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".carrusel").forEach(async (contenedor) => {
    const prefijo = contenedor.dataset.prefijo;
    const maximo = parseInt(contenedor.dataset.max, 10) || 6;
    const rutas = await detectarImagenes(prefijo, maximo);
    construirCarrusel(contenedor, rutas);
  });
});
