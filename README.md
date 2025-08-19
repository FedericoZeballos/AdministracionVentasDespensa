# Control de Ventas - Aplicación Web

Una aplicación web completa para registrar y controlar las ventas realizadas en tiempo real, con base de datos SQLite y servidor Node.js.

## Características

- **Registro de Ventas**: Ingresa el monto total, selecciona la fecha y hora de la venta
- **Formateo en Tiempo Real**: Los montos se formatean automáticamente con separadores de miles en pesos argentinos
- **Resumen en Tiempo Real**: Muestra el total de ventas, monto total y promedio del día
- **Filtrado por Fecha**: Filtra ventas por rangos de fechas específicos usando calendarios personalizados
- **Historial de Ventas**: Tabla con todas las ventas registradas, ordenadas por fecha y hora
- **Formato Latinoamericano**: Las fechas se muestran en formato día/mes/año
- **Base de Datos SQLite**: Persistencia robusta de datos con base de datos local
- **Interfaz Responsiva**: Diseño moderno que funciona en dispositivos móviles y de escritorio
- **Eliminación Individual**: Elimina ventas específicas con confirmación modal
- **Campo de Hora**: Registra la hora exacta de cada venta

## Arquitectura del Sistema

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Node.js con Express.js
- **Base de Datos**: SQLite3 (archivo local)
- **API REST**: Endpoints para CRUD de ventas

## Cómo Usar

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar el servidor**:
   ```bash
   npm start
   # o para desarrollo
   npm run dev
   ```

3. **Abrir la aplicación**: Navega a `http://localhost:3000` en tu navegador

4. **Registrar una venta**:
   - Ingresa el monto total de la venta
   - Selecciona la fecha de la venta usando el calendario o escribe en formato dd/mm/aaaa
   - La hora se establece automáticamente (puedes modificarla)
   - Haz clic en "Registrar Venta"

5. **Ver el resumen**: Los totales se actualizan automáticamente en las tarjetas superiores

6. **Filtrar ventas**: Usa los campos de fecha con calendarios para filtrar por rangos específicos

7. **Revisar el historial**: Todas las ventas aparecen en la tabla inferior con fecha y hora

8. **Eliminar ventas**: Usa el botón 🗑️ para eliminar ventas individuales con confirmación

## Archivos del Proyecto

- `index.html` - Estructura de la página web
- `src/css/styles.css` - Estilos y diseño visual
- `src/js/script.js` - Lógica del frontend y funcionalidades
- `src/js/server.js` - Servidor Node.js con Express
- `src/js/db.js` - Configuración y operaciones de SQLite
- `package.json` - Dependencias y scripts del proyecto
- `README.md` - Este archivo de documentación

## Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica de la página
- **CSS3**: Estilos modernos con gradientes, flexbox y animaciones
- **JavaScript ES6+**: Lógica de la aplicación y manejo de datos

### Backend
- **Node.js**: Runtime de JavaScript en el servidor
- **Express.js**: Framework web para crear la API REST
- **SQLite3**: Base de datos embebida local

## Base de Datos

La aplicación utiliza **SQLite** como base de datos local:

- **Archivo**: `data/ventas.db` (se crea automáticamente)
- **Tabla**: `ventas`
  - `id` - Identificador único (autoincremental)
  - `producto` - Nombre del producto (por defecto "Venta")
  - `cantidad` - Cantidad vendida
  - `precio` - Precio unitario
  - `fecha` - Fecha de la venta (formato YYYY-MM-DD)
  - `hora` - Hora de la venta (formato HH:MM)

## API Endpoints

- `GET /api/ventas` - Obtener todas las ventas
- `POST /api/ventas` - Crear una nueva venta
- `DELETE /api/ventas/:id` - Eliminar una venta específica

## Funcionalidades Técnicas

- Validación de formularios en frontend y backend
- Base de datos SQLite con operaciones CRUD
- API REST para comunicación cliente-servidor
- Cálculos automáticos en tiempo real
- Interfaz responsiva para móviles
- Notificaciones visuales
- Calendario personalizado para selección de fechas
- Formateo automático de fechas y monedas
- Filtrado avanzado por rangos de fechas

## Instalación y Configuración

1. **Requisitos previos**:
   - Node.js (versión 14 o superior)
   - npm (incluido con Node.js)

2. **Clonar o descargar el proyecto**

3. **Instalar dependencias**:
   ```bash
   npm install
   ```

4. **Iniciar la aplicación**:
   ```bash
   npm start
   ```

5. **Abrir en el navegador**: `http://localhost:3000`

## Scripts Disponibles

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo
- `npm run open` - Abre la aplicación en el navegador

## Notas Importantes

- Los datos se guardan en una base de datos SQLite local
- La base de datos se crea automáticamente en la carpeta `data/`
- La aplicación requiere que el servidor Node.js esté ejecutándose
- Compatible con todos los navegadores modernos
- Funciona offline una vez cargada la interfaz

## Personalización

Puedes modificar fácilmente:
- Colores y estilos en `src/css/styles.css`
- Funcionalidades del frontend en `src/js/script.js`
- Lógica del servidor en `src/js/server.js`
- Estructura de la base de datos en `src/js/db.js`
- Estructura en `index.html`

## Estructura de Carpetas

```
AdministracionVentasDespensa/
├── src/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── script.js
│       ├── server.js
│       └── db.js
├── data/          # Base de datos SQLite (se crea automáticamente)
├── index.html
├── package.json
└── README.md
```

¡Disfruta usando tu sistema de control de ventas con base de datos SQLite! 