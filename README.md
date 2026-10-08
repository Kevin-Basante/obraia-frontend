# obraia-frontend

Interfaz web de **ObraIA**, plataforma con inteligencia artificial para planear, presupuestar y hacer seguimiento a obras pequeñas.
Proyecto final de Patrones de Software: Kevin Basante y Arley Riascos.

El frontend solo se comunica con el backend (`obraia-backend`). Nunca accede a la base de datos ni al servicio de IA, y no guarda ninguna clave.

## Tecnologías

- React 19
- Vite
- Oxlint para revisar el código

## Requisitos

- Node.js 20 o superior
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

## Estados de la pantalla

La página principal llama a `GET /api/hello` del backend y muestra uno de tres estados:

| Estado    | Qué se ve                                                                 |
| --------- | ------------------------------------------------------------------------- |
| Cargando  | Un indicador mientras responde el servidor (puede tardar si estaba dormido) |
| Error     | El mensaje del backend y un botón **Retry** para intentar de nuevo        |
| Resultado | "Hello world", el estado de la base de datos y los tipos de obra          |

## Estructura

```
public/                Archivos estáticos (ícono)
src/
├── components/        Componentes visuales, cada uno con su CSS
├── config/            Configuración (URL del backend)
├── hooks/             Lógica de estado reutilizable (carga, error y resultado)
├── services/          Llamadas a la API del backend
├── App.jsx            Página principal
├── index.css          Colores y estilos generales (tema claro y oscuro)
└── main.jsx           Punto de entrada
```

Flujo de una petición: componente → hook → servicio → cliente de la API → backend.

## Despliegue en Vercel

1. Importar el repositorio en Vercel; detecta Vite automáticamente.
2. Agregar la variable `VITE_API_URL` con la URL del backend en Render.
3. Cada vez que se sube un commit a `main`, Vercel vuelve a desplegar.

Después de desplegar, la URL de Vercel debe agregarse a `FRONTEND_URL` en Render para que el backend acepte sus peticiones (CORS).

## Convenciones

- Código, comentarios y textos de la interfaz en inglés; documentación en español.
- Commits con prefijo según el tipo de cambio: `feat:`, `fix:`, `style:`, `docs:`, `chore:`.
