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
| `/catalog/cities`  | Ciudades con su % de transporte, filtro por departamento y búsqueda | Todos              |
| `/projects`        | Mis obras, con filtro por estado y búsqueda por nombre o ciudad | Con cuenta             |
| `/projects/new`    | Crear una obra                                                 | Con cuenta              |
| `/projects/:id`    | Detalle de la obra: estado, datos, maestro de obra y miembros  | Con cuenta (miembros)   |
| `/projects/:id/edit` | Editar una obra que no esté terminada ni cancelada           | Con cuenta (miembros)   |
| `/projects/:id/delete` | Advertencias y envío del correo para eliminar la obra      | Con cuenta (creador)    |
| `/projects/:id/blueprints` | Planos de la obra: subir fotos o PDF y borrarlos        | Con cuenta (miembros)   |
| `/projects/:id/blueprints/:blueprintId` | Ver un plano dentro de la página y descargarlo | Con cuenta (miembros) |
| `/projects/:id/measurements` | Medidas manuales: agregar, editar, borrar y filtrar por piso | Con cuenta (miembros) |
| `/projects/:id/measurements/comparison` | Totales manuales contra los de la IA       | Con cuenta (miembros)   |
| `/projects/:id/phases` | Plan de trabajo: crear las fases, tareas, estados y avance | Con cuenta (miembros)   |
| `/projects/:id/tasks/:taskId` | Avance de una tarea: reportar y ver los reportes       | Con cuenta (miembros)   |
| `/projects/:id/budgets` | Cotización actual de la obra y versiones guardadas del presupuesto | Con cuenta (miembros) |
| `/projects/:id/budgets/:budgetId` | Una versión del presupuesto con sus capas de costo y el botón para aprobarla | Con cuenta (miembros) |
| `/projects/:id/materials` | Materiales a comprar según la última versión guardada | Con cuenta (miembros)   |
| `/site-managers`   | Mis maestros de obra: agregar, editar y borrar                 | Con cuenta              |
| `/confirm-deletion` | Confirma la eliminación con el enlace recibido (`?token=`)    | Todos                   |

Una ruta desconocida muestra "Page not found". Un invitado que abre una página de obras ve una invitación a crear su cuenta, porque las obras se guardan en la cuenta. Si alguien sin sesión abre `/dashboard`, se le envía a `/login` y, al entrar, vuelve a la página que pidió.

## Catálogo

- Lee los catálogos públicos del backend (`/api/catalogs/...`), así que funciona con sesión, como invitado o sin sesión.
- Las búsquedas esperan a que el usuario deje de escribir (300 ms) antes de llamar al backend, para no enviar una petición por cada tecla.
- Mientras llega una respuesta nueva, la lista anterior sigue visible y atenuada; si llega una respuesta vieja, se ignora.
- Los precios se muestran en pesos colombianos (`$ 33.000`) y las cantidades con coma decimal (`12,5`).
- En el detalle de un tipo de obra, el área construida decide el tamaño: hasta 120 m² es pequeña y más de 120 m² es grande.

## Obras

- Una obra nueva empieza en borrador. La página de la obra muestra solo los cambios de estado que permite el backend (`nextStatuses`); terminar o cancelar pide confirmación, porque después la obra ya no se puede editar.
- El área acepta coma o punto decimal (`120,5`). El formulario revisa los mismos límites que el backend antes de enviarlo: nombre de 3 a 150 caracteres, área de 1 a 2000 m², 1 o 2 pisos y la fecha de fin no antes que la de inicio.
- Cada usuario guarda sus maestros de obra en `/site-managers` y los asigna desde la página de la obra.
- Cualquier miembro puede agregar a otra persona con cuenta verificada escribiendo su correo. Al creador no se le puede quitar.
- Eliminar tiene dos pasos: la página muestra lo que se va a perder y envía un correo; la obra se elimina solo cuando el creador abre el enlace (`/confirm-deletion`), que vence en 30 minutos.

## Planos y medidas

- Cada obra acepta hasta 10 planos: PDF o imagen (PNG, JPG o WEBP) de máximo 10 MB. El navegador revisa la extensión y el tamaño antes de subir; el backend revisa además el tipo real del archivo.
- El archivo se sube como `multipart/form-data` (campo `file`). Para verlo, el frontend lo descarga con el token y lo muestra desde una dirección temporal del navegador (`URL.createObjectURL`), que se libera al salir de la página.
- El formulario de medidas pide solo las dimensiones del elemento elegido, según `/api/catalogs/element-types`: largo, ancho y alto para cimentación, columnas, vigas y losas (m³); largo y alto para muros, y largo y ancho para piso y cubierta (m²). Mientras se escribe, muestra la cantidad que calculará el backend.
- Las medidas aceptan coma decimal (`3,5`) y el piso no puede ser mayor que los pisos de la obra.
- **Analyze with AI** envía el plano al backend (`POST /blueprints/{id}/analyze`), que lo pasa al servicio de IA. Mientras lee, el botón dice **Reading…** y la página avisa que la primera lectura del día puede tardar cerca de un minuto. Al terminar se ven las medidas que guardó, las que descartó y las advertencias de la IA, con un enlace a la comparación.
- La columna **AI reading** muestra el estado del plano: `Pending`, `Completed` o `Failed`. Un plano leído se puede volver a leer (**Analyze again**); si el archivo es el mismo, el backend responde desde su caché sin llamar a la IA.
- Los errores de la IA se explican en la página: servicio sin configurar (503), límite de lecturas por hora de la obra (429) o fallo de la IA (502).
- Las medidas leídas por la IA no tienen botones para editar ni borrar, y muestran cuánto se alejan del total manual de su elemento y piso. Mientras la IA no lea planos, la comparación muestra solo los totales manuales.
- En una obra terminada o cancelada, los planos y las medidas se pueden ver pero no cambiar.

## Fases y tareas

- Mientras la obra no tiene plan, la página muestra las fases que se crearían (`/phases/preview`): las del catálogo según el tipo y el tamaño de la obra. El local comercial trae además la fase "Adecuación comercial". El botón **Create plan** las guarda con sus tareas iniciales.
- Las fechas de las fases salen de la fecha de inicio planeada de la obra, contando de lunes a sábado. Si la obra no tiene fecha, el plan se crea sin fechas y se pueden poner a mano en cada fase.
- Cada fase y tarea muestra solo los botones de los cambios de estado que permite el backend (`nextStatuses`): **Start**, **Mark as delayed**, **Complete**, **Resume** o **Reopen**. Una fase o tarea que pasó su fecha de fin sin completarse aparece como **Late**.
- Las tareas se pueden agregar, editar, pasar a otra fase y borrar. El formulario revisa el nombre (3 a 150 caracteres) y que la fecha de fin no sea antes que la de inicio.
- En la página de una tarea se reporta el avance de 0 a 100 % (acepta coma decimal) con fecha opcional, que no puede ser futura. Si la obra tiene maestro de obra, se puede marcar que el reporte lo dio él. Más de 0 % inicia la tarea, 100 % la completa y la fase se completa sola cuando todas sus tareas lo están.
- El avance de una tarea es su último reporte; el de la fase y el de la obra son promedios que calcula el backend.
- El plan se puede borrar para crearlo de nuevo solo mientras ninguna tarea tenga reportes. En una obra terminada o cancelada todo se puede ver pero no cambiar.

## Presupuesto

- La página de presupuesto muestra la cotización actual (`/budgets/preview`) sin guardar nada: ciudad, % de transporte, días hábiles y una fila por cada capa de costo (materiales, desperdicio, transporte, mano de obra e IVA), con su tasa, su monto y su parte del total. Las capas las arma el backend con el patrón Decorator.
- Si la obra no tiene medidas manuales, la página lo explica y lleva a la página de medidas.
- **Save as a new version** guarda la cotización como un borrador y abre esa versión. Ahí, **Approve** la aprueba (pide confirmación); la versión aprobada antes pasa a **Superseded**.
- Los días hábiles salen de las fechas de las fases si el plan las tiene; si no, de las fases estándar del tipo de obra. La página dice cuál de los dos usó.
- **Materials to buy** lista las cantidades de la última versión guardada, con desperdicio, precio y subtotal.
- En una obra terminada o cancelada, el presupuesto se puede ver pero no se pueden guardar ni aprobar versiones.

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
├── components/        Componentes visuales, cada uno con su CSS (por sección en blueprints/, budgets/, catalog/, measurements/, phases/, projects/ y siteManagers/)
├── config/            Configuración (URL del backend)
├── context/           Estado de la sesión compartido por toda la app
├── hooks/             Lógica reutilizable: sesión, formularios y carga de datos
├── layouts/           Marcos comunes: la app completa y la sección de catálogo
├── pages/             Una página por ruta (las del catálogo en pages/catalog/ y las de obras en pages/projects/)
├── routes/            Rutas y protección de páginas según la sesión
├── services/          Llamadas a la API del backend y manejo de tokens
├── utils/             Validaciones, formularios de obras, medidas, tareas y avance, estados de trabajo, presupuesto, formato de precios, fechas y tamaños, y filtros
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
