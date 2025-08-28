# 🛒 Control de Ventas - Aplicación de Escritorio

Sistema básico de control de ventas para despensa con base de datos SQLite y aplicación de escritorio desarrollada con Electron.

## 🎯 **CARACTERÍSTICAS PRINCIPALES**

- ✅ **Aplicación de Escritorio** - Nativa de Windows
- ✅ **Base de Datos SQLite** - Local, sin servidor requerido
- ✅ **Registro de Ventas** - Con fecha, hora y detalles completos
- ✅ **Historial de Ventas** - Búsqueda y filtrado por fechas
- ✅ **Eliminación Individual** - Borrado seguro con confirmación
- ✅ **Interfaz Moderna** - Diseño limpio y profesional
- ✅ **Funcionamiento Offline** - No requiere conexión a internet

## 🚀 **INSTALACIÓN Y USO**

### **Requisitos Previos**
- **Node.js** (versión 18.x o superior)
- Descargar desde: https://nodejs.org/

### **Ejecutar la Aplicación**
1. **Doble clic** en `Control-Ventas.vbs`
2. La aplicación se abrirá automáticamente
3. ¡Listo para usar!

## 📁 **ESTRUCTURA DEL PROYECTO**

```
AdministracionVentasDespensa/
├── Control-Ventas.vbs          # 🎯 EJECUTAR AQUÍ
├── main.js                     # Lógica principal de Electron
├── preload.js                  # Configuración de seguridad
├── index.html                  # Interfaz de usuario
├── package.json                # Configuración del proyecto
├── electron-builder.json       # Configuración de empaquetado
├── src/
│   ├── css/
│   │   └── styles.css          # Estilos de la aplicación
│   └── js/
│       ├── script.js           # Lógica del frontend
│       ├── db.js               # Operaciones de base de datos
│       └── server.js           # Servidor web (opcional)
├── data/
│   └── ventas.db              # Base de datos SQLite
└── assets/
    └── icon.ico               # Icono de la aplicación
```

## 🛠️ **DESARROLLO**

### **Scripts Disponibles**
```bash
npm start          # Iniciar servidor web
npm run electron   # Ejecutar aplicación Electron
npm run build      # Construir aplicación
npm run build-win  # Construir para Windows
```

### **Tecnologías Utilizadas**
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Node.js, Express.js
- **Base de Datos**: SQLite3
- **Desktop**: Electron
- **Empaquetado**: Electron Builder

## 📊 **FUNCIONALIDADES**

### **Registro de Ventas**
- Producto, cantidad, precio
- Fecha y hora automática
- Cálculo automático de totales

### **Gestión de Historial**
- Visualización de todas las ventas
- Filtrado por fechas
- Búsqueda y ordenamiento

### **Eliminación Segura**
- Botón de eliminación individual
- Modal de confirmación
- Borrado permanente de la base de datos

## 🔧 **CONFIGURACIÓN**

### **Base de Datos**
- Se crea automáticamente en `data/ventas.db`
- No requiere configuración manual
- Persistente entre sesiones

### **Interfaz**
- Diseño responsive
- Tema claro y profesional
- Navegación intuitiva

## 📦 **EMPAQUETADO**

### **Crear Ejecutable**
```bash
npm run build-win
```

### **Archivos Generados**
- `dist/` - Carpeta con archivos de distribución
- `.exe` - Ejecutable para Windows
- `installer.msi` - Instalador automático

## 🐛 **SOLUCIÓN DE PROBLEMAS**

### **Error: "Node.js no está instalado"**
- Descargar e instalar Node.js desde https://nodejs.org/
- Reiniciar la computadora

### **La aplicación no se abre**
- Verificar que no haya otra instancia ejecutándose
- Verificar permisos de escritura en la carpeta

### **Base de datos no funciona**
- Verificar que la carpeta `data/` tenga permisos de escritura
- La base de datos se crea automáticamente

## 📄 **LICENCIA**

MIT License - Ver archivo LICENSE para más detalles.

## 👨‍💻 **DESARROLLADOR**

Sistema de Control de Ventas - Versión 1.0.0

---

**¡Disfruta usando tu sistema de control de ventas!** 🎉 
