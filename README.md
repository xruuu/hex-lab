# Hex Lab

Configurador web del Mars Gaming MMW-HEX16. Proyecto completo preparado para editar con VS Code y publicar en GitHub Pages por HTTPS. Incluye la aplicación autocontenida como `index.html`, fuentes, imagen del ratón, logo, pruebas y despliegue automático.

## Subir directamente desde la web de GitHub (sin terminal)

1. Extrae el ZIP. Entra en la carpeta `hex-lab`: debe contener `index.html`, `package.json`, `build/` y `.github/`.
2. Crea un repositorio **público** llamado `hex-lab` en https://github.com/new. Puedes marcar «Add a README file» para que GitHub cree la rama `main` y muestre la opción de subir archivos.
3. Abre el repositorio y pulsa **Add file → Upload files**. Arrastra **todos los archivos y carpetas que hay dentro de `hex-lab`**, incluida `.github`. No subas el ZIP ni la carpeta contenedora `hex-lab`: `index.html` debe quedar en la raíz del repositorio. Acepta reemplazar el README inicial por el de este proyecto y pulsa **Commit changes** en `main`.
4. Abre **Settings → Pages → Build and deployment → Source** y elige **GitHub Actions**.
5. En **Actions**, abre **Test and publish Hex Lab**. Cuando finalice en verde, la URL aparecerá en **Settings → Pages**. Si la primera ejecución falló porque Pages aún no estaba activado, pulsa **Re-run all jobs**. También puedes usar **Run workflow**.

No tienes que instalar Node, ejecutar comandos ni configurar secretos para esta opción. GitHub instala las dependencias y ejecuta las pruebas. Una comprobación rápida tras subirlo: en la raíz deben aparecer `index.html`, `package.json` y `package-lock.json`; dentro de `.github/workflows` debe aparecer `pages.yml`.

## Abrir y probar con VS Code (opcional)

Instala Node.js 24 LTS y Git si todavía no los tienes. Extrae el ZIP y abre **la carpeta `hex-lab` que contiene este README y package.json** mediante Archivo → Abrir carpeta. Abre Terminal → Nuevo terminal y ejecuta:

```bash
npm ci
npm run build
npm start
```

Abre http://localhost:3000 en Chrome o Edge. Para detener el servidor, pulsa Ctrl+C. Puedes cambiar el puerto mediante la variable `HEX_PORT`.

No hay claves API, servidor externo ni base de datos que configurar. Cada navegador guarda sus propios perfiles; compartir la URL no comparte los datos. Los datos del HTML local y los de localhost o GitHub Pages pertenecen a orígenes distintos: exporta una copia completa desde Perfiles antes de cambiar de dirección e impórtala en la web publicada.

## Subir el código a GitHub

1. Crea en https://github.com/new un repositorio vacío llamado `hex-lab`. Para GitHub Pages con una cuenta gratuita, usa un repositorio público. No añadas README, licencia ni .gitignore al crearlo: esta carpeta ya contiene sus archivos.
2. Desde el terminal de VS Code, dentro de `hex-lab`, ejecuta lo siguiente. Sustituye `TU_USUARIO` por tu usuario real de GitHub:

```bash
git init
git add .
git commit -m "Publicar Hex Lab"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/hex-lab.git
git push -u origin main
```

Si Git pide tu identidad, configura tu nombre y correo con `git config user.name "Tu nombre"` y `git config user.email "tu-correo"`, y repite el commit. Para autenticarte, sigue el inicio de sesión de Git/VS Code; no pongas contraseñas o tokens en los archivos del proyecto.

## Activar la aplicación web

1. En el repositorio de GitHub abre **Settings → Pages**.
2. En **Build and deployment → Source**, selecciona **GitHub Actions**.
3. Abre **Actions → Test and publish Hex Lab** y espera a que termine. Si la primera ejecución falló porque Pages aún no estaba activado, pulsa **Re-run all jobs**. También puedes iniciar el flujo con **Run workflow**.
4. La dirección aparecerá en Settings → Pages y en el despliegue. Para un repositorio `hex-lab` será normalmente `https://TU_USUARIO.github.io/hex-lab/`.

El flujo `.github/workflows/pages.yml` instala dependencias, compila, ejecuta las pruebas y publica únicamente `dist/`. Las pull requests ejecutan las pruebas y no despliegan. No necesitas añadir secretos. Después, cada push a `main` vuelve a comprobar y publicar el proyecto.

Documentación oficial: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages .

## Actualizaciones desde VS Code

Modifica las fuentes, genera la aplicación y comprueba el cambio:

```bash
npm run build
npm test
git add .
git commit -m "Actualizar Hex Lab"
git push
```

`index.html` se genera: para cambiar la aplicación edita los archivos de `build/`, no el HTML generado. Mantén `index.html` actualizado con `npm run build` antes de hacer commit. `output/`, `dist/` y `node_modules/` se generan localmente y están excluidos de Git.

## Pruebas

Antes de la primera ejecución de las pruebas instala Chromium de Playwright:

```bash
npx playwright install chromium
npm test
```

En Linux puede ser necesario `npx playwright install --with-deps chromium`. GitHub Actions ya ejecuta ese paso. Las pruebas comprueban interfaz, catálogo de 172 acciones y codificación HID, colas de transmisión, macros, desconexiones, batería, los seis niveles de DPI mediante reproducción de capturas, diálogos y funcionamiento servido por HTTP. `validation/` incluye los resultados de la preparación del paquete. Las pruebas HID son simuladas; la reproducción utiliza capturas aportadas por el usuario y no equivale a una prueba nueva con hardware físico.

## Archivos

| Ruta | Contenido |
| --- | --- |
| `index.html` | Aplicación completa generada y lista para abrir |
| `build/app.js`, `build/app.css` | Interfaz y comportamiento |
| `build/dialog-ui.js` | Diálogos simplificados |
| `build/telemetry.js` | Batería, nivel DPI y captura pasiva |
| `build/apply-policy.js`, `build/core-bridge.js` | Aplicación de cambios y comunicación con el controlador |
| `build/assemble.cjs` | Generación del HTML autocontenido |
| `controller/` | Controlador original que utiliza el generador |
| `current/` | Imagen original del ratón |
| `design/approved.html` | Origen de los iconos de la propuesta visual aprobada |
| `build/fixtures/` | Informes de prueba de DPI sin trazas USB completas |
| `scripts/` | Preparación de Pages, servidor local y prueba HTTP |
| `.github/workflows/pages.yml` | Pruebas y publicación automática |

## Comportamiento del ratón

Utiliza Chrome o Edge desde HTTPS o localhost para WebHID. Cada usuario autoriza y conecta su propio ratón. Los ajustes compatibles se aplican después de editarlos; las macros requieren pulsar Aplicar macros. Abrir la web, reconectar o elegir un perfil local no envía cambios anteriores. Un fallo de acuse detiene los reintentos automáticos.

La detección del nivel DPI usa el índice 0–5 del informe E9 observado. Los valores DPI numéricos pertenecen al perfil local y no se leen del dispositivo. El perfil del editor tampoco es una lectura de la ranura física activa. Las acciones que carecen de codificador permanecen deshabilitadas.

La captura USB de reconexión del usuario confirma que el receptor E9 declara cinco botones de ratón; Mouse6–Mouse16 no están implementados. Las teclas F13–F24 siguen disponibles en el catálogo, con validación física y compatibilidad de cada juego pendientes. No se incluyen herramientas para modificar el firmware.
