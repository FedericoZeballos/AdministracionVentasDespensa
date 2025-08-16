# Control de Ventas - Aplicación Web

Una aplicación web simple para registrar y controlar las ventas realizadas en tiempo real.

## Características

- **Registro de Ventas**: Ingresa el monto total y selecciona la fecha de la venta
- **Formateo en Tiempo Real**: Los montos se formatean automáticamente con separadores de miles en pesos argentinos
- **Resumen en Tiempo Real**: Muestra el total de ventas, monto total y promedio del día
- **Filtrado por Fecha**: Filtra ventas por rangos de fechas específicos usando calendarios personalizados
- **Historial de Ventas**: Tabla con todas las ventas registradas, ordenadas por fecha y hora
- **Formato Latinoamericano**: Las fechas se muestran en formato día/mes/año
- **Persistencia de Datos**: Los datos se guardan automáticamente en el navegador
- **Interfaz Responsiva**: Diseño moderno que funciona en dispositivos móviles y de escritorio

## Cómo Usar

1. **Abrir la aplicación**: Simplemente abre el archivo `index.html` en tu navegador web
2. **Registrar una venta**:
   - Ingresa el monto total de la venta
   - Selecciona la fecha de la venta usando el calendario o escribe en formato dd/mm/aaaa
   - Haz clic en "Registrar Venta"
3. **Ver el resumen**: Los totales se actualizan automáticamente en las tarjetas superiores
4. **Filtrar ventas**: Usa los campos de fecha con calendarios para filtrar por rangos específicos
5. **Revisar el historial**: Todas las ventas aparecen en la tabla inferior con hora de registro
6. **Limpiar datos**: Usa el botón "Limpiar Historial" para reiniciar todos los contadores

## Archivos del Proyecto

- `index.html` - Estructura de la página web
- `styles.css` - Estilos y diseño visual
- `script.js` - Lógica de la aplicación y funcionalidades
- `README.md` - Este archivo de documentación

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica de la página
- **CSS3**: Estilos modernos con gradientes y animaciones
- **JavaScript ES6+**: Lógica de la aplicación y manejo de datos
- **LocalStorage**: Almacenamiento local de datos en el navegador

## Funcionalidades Técnicas

- Validación de formularios
- Almacenamiento local de datos
- Cálculos automáticos en tiempo real
- Interfaz responsiva para móviles
- Notificaciones visuales
- Persistencia de datos entre sesiones

## Instalación y Uso

1. Descarga todos los archivos en una carpeta
2. Abre `index.html` en tu navegador web
3. ¡Listo! Ya puedes empezar a registrar ventas

## Notas Importantes

- Los datos se guardan en el navegador local, no en un servidor
- Al limpiar el historial se pierden todos los datos permanentemente
- La aplicación funciona offline una vez cargada
- Compatible con todos los navegadores modernos

## Personalización

Puedes modificar fácilmente:
- Colores y estilos en `styles.css`
- Funcionalidades en `script.js`
- Estructura en `index.html`

¡Disfruta usando tu sistema de control de ventas! 