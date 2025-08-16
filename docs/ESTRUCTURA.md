# Estructura del Proyecto

## 📁 Organización de Carpetas

```
AdministracionVentasDespensa/
├── index.html                 # Página principal de la aplicación
├── package.json              # Configuración del proyecto
├── config.json              # Configuración de la aplicación
├── .gitignore               # Archivos a ignorar en Git
├── src/                     # Código fuente
│   ├── css/                 # Estilos CSS
│   │   └── styles.css      # Estilos principales
│   ├── js/                  # JavaScript
│   │   └── script.js       # Lógica de la aplicación
│   └── data/                # Datos y base de datos
│       └── ventas.json     # Archivo JSON de ventas
└── docs/                    # Documentación
    ├── README.md            # Documentación principal
    └── ESTRUCTURA.md        # Este archivo
```

## 🔧 Archivos Principales

### `index.html`
- Página principal de la aplicación
- Formulario para registrar ventas
- Resumen y métricas
- Filtros por fecha
- Historial de ventas

### `src/css/styles.css`
- Estilos CSS principales
- Diseño responsivo
- Temas y colores
- Animaciones

### `src/js/script.js`
- Lógica de la aplicación
- Manejo de datos
- Filtros y búsquedas
- Persistencia de datos

### `src/data/ventas.json`
- Base de datos local en formato JSON
- Estructura de datos de ventas
- Configuración de la aplicación

## 📊 Estructura de Datos

### Venta Individual
```json
{
  "id": 1234567890,
  "fecha": "2025-08-15",
  "fechaMostrar": "15/08/2025",
  "hora": "22:30:45",
  "monto": 25.50,
  "fechaVenta": "2025-08-15"
}
```

### Base de Datos Completa
```json
{
  "ventas": [...],
  "totalVentas": 0,
  "montoTotal": 0,
  "ultimaActualizacion": "",
  "version": "1.0"
}
```

## 🚀 Funcionalidades

- ✅ Registro de ventas por monto
- ✅ Filtrado por fecha usando calendario
- ✅ Métricas en tiempo real
- ✅ Almacenamiento local en JSON
- ✅ Interfaz responsiva
- ✅ Historial completo

## 🔄 Flujo de Datos

1. **Entrada**: Usuario ingresa monto de venta
2. **Procesamiento**: Se crea objeto de venta con fecha/hora
3. **Almacenamiento**: Se guarda en archivo JSON local
4. **Visualización**: Se actualiza interfaz y métricas
5. **Filtrado**: Opcional por rango de fechas

## 📱 Responsive Design

- **Desktop**: Layout de 3 columnas
- **Tablet**: Layout de 2 columnas
- **Mobile**: Layout de 1 columna
- **Breakpoint**: 768px
