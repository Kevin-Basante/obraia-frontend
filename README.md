# obraia-frontend

Interfaz web de **ObraIA**, plataforma con inteligencia artificial para planear, presupuestar y hacer seguimiento a obras pequeñas.
Proyecto final de Patrones de Software: Kevin Basante y Arley Riascos.

El frontend solo se comunica con el backend (`obraia-backend`). Nunca accede a la base de datos ni al servicio de IA, y no guarda ninguna clave.

## Tecnologías

- React 19
- Vite
- React Router 7 (navegación entre páginas)
- Vitest (pruebas)
- Oxlint para revisar el código

## Requisitos

- Node.js 22.12 o superior (lo pide Vitest)
- Git
- El backend corriendo (en local o en Render)

## Instalación

```bash
git clone https://github.com/Kevin-Basante/obraia-frontend.git
cd obraia-frontend
npm install
```

## Variables de entorno

1. Copia `.env.example` y renómbralo a `.env`.
2. Por defecto apunta al backend local (`http://localhost:8080`).

| Variable       | Descripción                                                                     |
| -------------- | ------------------------------------------------------------------------------- |
| `VITE_API_URL` | URL del backend, sin barra al final. Ejemplo: `https://obraia-backend.onrender.com` |

Esta variable solo guarda la URL pública del backend. Las claves (base de datos, IA) nunca van en el frontend.

## Comandos

| Comando           | Qué hace                                                  |
| ----------------- | --------------------------------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo en <http://localhost:5173> |
| `npm run build`   | Genera la versión de producción en `dist/`                |
| `npm run preview` | Muestra localmente la versión de producción               |
| `npm run lint`    | Revisa el código con Oxlint                               |
| `npm test`        | Ejecuta las pruebas con Vitest                            |

## Páginas

| Ruta               | Página                                                         | Acceso                  |
| ------------------ | -------------------------------------------------------------- | ----------------------- |
| `/`                | Inicio: qué hace ObraIA y estado del servidor (`/api/hello`)   | Todos                   |
| `/register`        | Crear cuenta                                                   | Sin sesión              |
| `/check-email`     | Aviso de correo enviado y botón para reenviarlo                | Todos                   |
| `/verify-email`    | Confirma el correo con el enlace recibido (`?token=`)          | Todos                   |
| `/login`           | Iniciar sesión o entrar como invitado                          | Sin sesión              |
| `/forgot-password` | Pedir el enlace para cambiar la contraseña                     | Sin sesión              |
| `/reset-password`  | Elegir una contraseña nueva con el enlace recibido (`?token=`) | Todos                   |
| `/dashboard`       | Panel del usuario con sus datos                                | Con sesión o invitado   |
| `/catalog/materials` | Materiales con precio de referencia, filtro por categoría y búsqueda | Todos           |
| `/catalog/project-types` | Tipos de obra                                              | Todos                   |
| `/catalog/project-types/:id` | Fases estándar según el tamaño o el área, y materiales por elemento | Todos      |
| `/catalog/cities`  | Ciudades, filtro por departamento y búsqueda                   | Todos                   |
| `/projects`        | Mis obras, con filtro por estado y búsqueda por nombre o ciudad | Con cuenta             |
| `/projects/new`    | Crear una obra                                                 | Con cuenta              |
| `/projects/:id`    | Detalle de la obra: estado, datos, maestro de obra y miembros  | Con cuenta (miembros)   |
| `/projects/:id/edit` | Editar una obra que no esté terminada ni cancelada           | Con cuenta (miembros)   |
| `/projects/:id/delete` | Advertencias y envío del correo para eliminar la obra      | Con cuenta (creador)    |
| `/site-managers`   | Mis maestros de obra: agregar, editar y borrar                 | Con cuenta              |
| `/confirm-deletion` | Confirma la eliminación con el enlace recibido (`?token=`)    | Todos                   |

Una ruta desconocida muestra "Page not found". Un invitado que abre una página de obras ve una invitación a crear su cuenta, porque las obras se guardan en la cuenta. Si alguien sin sesión abre `/dashboard`, se le envía a `/login` y, al entrar, vuelve a la página que pidió.

## Catálogo

- Lee los catálogos públicos del backend (`/api/catalogs/...`), así que funciona con sesión, como invitado o sin sesión.
- Las búsquedas esperan a que el usuario deje de escribir (300 ms) antes de llamar al backend, para no enviar una petición por cada tecla.
- Mientras llega una respuesta nueva, la lista anterior sigue visible y atenuada; si llega una respuesta vieja, se ignora.
- Los precios se muestran en pesos colombianos (`$ 33.000`) y las cantidades con coma decimal (`12,5`).
- En el detalle de un tipo de obra, el área construida decide el tamaño: hasta 120 m² es pequeña y más de 120 m² es grande.

## Sesión

- Al iniciar sesión, el backend entrega un **access token** (dura 15 minutos) y un **refresh token** (dura 7 días).
- El access token se guarda solo en memoria. El refresh token se guarda en `localStorage` para que la sesión siga al recargar la página.
- Si una petición protegida responde 401, el frontend pide tokens nuevos una sola vez y repite la petición. Si varias peticiones lo necesitan a la vez, comparten la misma renovación.
- Al cerrar sesión se borra el token del navegador y se avisa al backend para revocarlo.
- El modo **invitado** permite probar la aplicación sin cuenta; no guarda nada.

Flujo de una petición: página → hook → servicio → cliente de la API → backend.

## Estructura

```
public/                Archivos estáticos (ícono)
src/
├── components/        Componentes visuales, cada uno con su CSS (los del catálogo en components/catalog/)
├── config/            Configuración (URL del backend)
├── context/           Estado de la sesión compartido por toda la app
├── hooks/             Lógica reutilizable: sesión, formularios y carga de datos
├── layouts/           Marcos comunes: la app completa y la sección de catálogo
├── pages/             Una página por ruta (las del catálogo en pages/catalog/)
├── routes/            Rutas y protección de páginas según la sesión
├── services/          Llamadas a la API del backend y manejo de tokens
├── utils/             Validaciones, formato de precios y fechas, y filtros de búsqueda
├── App.jsx            Enrutador y proveedor de sesión
├── index.css          Colores y estilos generales (tema claro y oscuro)
└── main.jsx           Punto de entrada
```

Las pruebas están junto al archivo que prueban (`*.test.js`).

## Despliegue en Vercel

1. Importar el repositorio en Vercel; detecta Vite automáticamente.
2. Agregar la variable `VITE_API_URL` con la URL del backend en Render.
3. Cada vez que se sube un commit a `main`, Vercel vuelve a desplegar.
4. `vercel.json` envía todas las rutas a `index.html`, para que los enlaces de los correos (`/verify-email`, `/reset-password`) abran la página correcta.

Después de desplegar, la URL de Vercel debe agregarse a `FRONTEND_URL` en Render para que el backend acepte sus peticiones (CORS).

## Equipo y responsabilidades

| Integrante    | Responsabilidad                                   |
| ------------- | ------------------------------------------------- |
| Kevin Basante | Backend (`obraia-backend`) y servicio de IA (`obraia-ia`) |
| Arley Riascos | Frontend (`obraia-frontend`)                      |

## Convenciones

- Código, comentarios y textos de la interfaz en inglés; documentación en español.
- Commits con prefijo según el tipo de cambio: `feat:`, `fix:`, `style:`, `docs:`, `test:`, `refactor:`, `chore:`.
