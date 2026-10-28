# PARPAL corre · Bucaramanga 2026

Web estática basada en el layout deportivo aprobado: azul marino, amarillo, carrusel de fotos y resultados del equipo. Lista para GitHub Pages, sin instalación, dependencias ni compilación.

## Abrir en tu editor

1. Descomprime el ZIP.
2. Abre la carpeta `parpal-corre` en VS Code o tu editor.
3. Abre `index.html` en el navegador. También puedes usar Live Server.

Todo funciona con archivos locales. No requiere Node, npm, claves ni conexión con Google Sheets. Los enlaces externos sí requieren conexión.

## Publicar en GitHub Pages

1. Crea un repositorio, por ejemplo `parpal-corre`.
2. Sube **el contenido de esta carpeta a la raíz del repositorio**. `index.html` debe quedar directamente en la raíz, junto a los archivos CSS/JS, `.nojekyll` y la carpeta `assets`.
3. En el repositorio abre **Settings → Pages**.
4. En **Build and deployment → Source**, elige **Deploy from a branch**.
5. Selecciona la rama que contiene los archivos (normalmente `main`) y **/(root)**. Guarda con **Save**.
6. Espera a que GitHub complete la publicación. La dirección aparecerá en Settings → Pages. Normalmente tendrá la forma `https://TU-USUARIO.github.io/parpal-corre/`.

Para usar GitHub Pages con un repositorio público basta el plan gratuito; las opciones para repositorios privados dependen del plan de la cuenta. La publicación muestra los nombres y tiempos incluidos en `data.js`.

No necesitas configurar GitHub Actions, subir este ZIP sin extraer, ni crear un archivo `CNAME`. Todos los recursos usan rutas relativas, compatibles con un repositorio de proyecto. Más adelante puedes conectar un subdominio desde Settings → Pages.

Guías oficiales:
- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Archivos

```text
parpal-corre/
├── index.html                 Página y textos
├── styles.css                 Diseño y adaptación a celular
├── app.js                     Buscador, filtros, orden y contadores
├── data.js                    Resultados que puedes editar
├── photos.js                  Lista de fotos y segundos entre cambios
├── carousel.js                Transiciones, flechas, indicadores y pausa
├── .nojekyll                  Publicación estática sin Jekyll
├── .gitignore
├── README.md
├── ASSETS.md                  Origen de imágenes y prompt
└── assets/
    ├── parpal-logo.svg        Logo original de la web corporativa
    └── equipo-carrera-01.jpeg Foto real original, sin retoques
```

## Actualizar resultados

Edita únicamente los registros de `data.js`. Cada persona tiene esta estructura:

```js
{
  "name": "SERGIO PARDO PALENCIA",
  "distance": 21,
  "bib": "1423",
  "official": "2:26:43",
  "net": "2:26:14"
}
```

- `distance`: `21`, `10.5` o `6` (número, sin comillas).
- `official`: tiempo oficial en `h:mm:ss`.
- `net`: tiempo real en `h:mm:ss`.
- Para una persona sin resultado verificado, usa `null` en distancia, dorsal y tiempos. Aparecerá en «Participantes por confirmar», sin inventar tiempos.
- Conserva comas, llaves y comillas del archivo. Sube los cambios al repositorio para actualizar la web.
- Los contadores se calculan automáticamente. Los datos **no se sincronizan automáticamente con Sheets**.
- Actualiza también la fecha de consulta en `index.html` cuando revises nuevos resultados.

Esta entrega contiene 30 personas: 28 resultados verificados (6 de 21 km, 17 de 10,5 km y 5 de 6 km) y 2 por confirmar. Datos leídos de la hoja el 27 de octubre de 2026. La hoja sigue siendo tu registro editable, pero esta web funciona con una copia incluida para que no haga falta publicar el documento de Google.

## Agregar fotos al carrusel

1. Copia tus fotos a `assets/`. Usa nombres sin espacios, por ejemplo `equipo-carrera-02.jpeg`.
2. Abre `photos.js` y agrega una entrada a la lista `photos` por cada imagen. Se mostrarán en el orden de la lista.
3. Cambia `intervalMs: 6000` si quieres otro intervalo: `8000` significa 8 segundos. El mínimo es 3 segundos.
4. Sube los archivos y las fotos al repositorio para actualizar la web.

Ejemplo completo de `photos.js` cuando ya tengas DOS fotos reales. Antes de usarlo, debes añadir el archivo `equipo-carrera-02.jpeg`:

```js
window.PARPAL_GALLERY = {
  intervalMs: 6000,
  photos: [
    {
      src: 'assets/equipo-carrera-01.jpeg',
      alt: 'El equipo PARPAL reunido con sus medallas.',
      caption: 'Equipo PARPAL · Bucaramanga 2026',
      fit: 'contain',
      position: 'center'
    },
    {
      src: 'assets/equipo-carrera-02.jpeg',
      alt: 'Describe aquí la segunda foto real.',
      caption: 'Otro momento de la carrera',
      fit: 'contain',
      position: 'center'
    }
  ]
};
```

- Con una foto, se muestra fija y se ocultan los controles. Con dos o más, comienza el cambio automático con fundido suave.
- `fit: 'contain'` muestra la imagen completa para que no se corte a nadie. `cover` llena el espacio, pero puede recortar personas en los extremos; úsalo solo para fotos adecuadas.
- El fondo de cada diapositiva usa la misma foto oscurecida; la imagen principal no se altera.
- Flechas, puntos y deslizamiento horizontal en celular permiten avanzar manualmente.
- Se puede pausar; además se detiene temporalmente al poner el cursor encima, al enfocar los controles con teclado, al salir de la portada o al ocultar la pestaña.
- Si el visitante tiene activada la opción de reducir movimiento, comienza pausado y sin transición.
- Una foto que no carga se omite para no interrumpir el carrusel.
- La foto actual es el archivo original recibido del usuario: no se retocaron caras, cuerpos ni poses. La versión generada que modificó rostros NO se incluye.

## Cambiar marca

- Los colores principales están al inicio de `styles.css`: `--navy`, `--yellow` y `--ink`.
- El escudo original se muestra mediante una ventana de CSS, sin modificar el archivo de marca. El nombre PARPAL y el subtítulo se escriben en texto para mantener su lectura en pantallas pequeñas.

## Funciones incluidas

- Filtros de 21 km, 10,5 km, 6 km y todas las distancias.
- Búsqueda por nombre o dorsal, ignorando mayúsculas y tildes.
- Orden por tiempo real, tiempo oficial o nombre. En «Todos», las distancias permanecen agrupadas.
- Vista para celulares y escritorio, navegación por teclado y estado vacío con botón para restablecer.
- Los resultados por confirmar están separados de los verificados.
- Acceso a la fuente oficial de Finalap.
- Carrusel automático de fotos con pausa y navegación manual (se activa al añadir la segunda foto).

No se ha desplegado todavía: estos son los archivos para que los publiques desde tu cuenta de GitHub.
