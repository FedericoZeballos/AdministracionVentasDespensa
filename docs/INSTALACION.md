# Guía de Instalación

## 🚀 Instalación Rápida

### Opción 1: Abrir Directamente
1. Descarga todos los archivos del proyecto
2. Abre `index.html` en tu navegador web
3. ¡Listo! Ya puedes usar la aplicación

### Opción 2: Servidor Local (Recomendado)
1. Abre una terminal en la carpeta del proyecto
2. Ejecuta uno de estos comandos:

#### Con Python 3:
```bash
python -m http.server 8000
```

#### Con Python 2:
```bash
python -m SimpleHTTPServer 8000
```

#### Con Node.js:
```bash
npx http-server
```

3. Abre tu navegador y ve a `http://localhost:8000`

## 📋 Requisitos del Sistema

### Mínimos:
- Navegador web moderno (Chrome 60+, Firefox 55+, Safari 12+)
- 10 MB de espacio en disco
- No requiere servidor web

### Recomendados:
- Navegador web actualizado
- 50 MB de espacio en disco
- Servidor local para desarrollo

## 🔧 Configuración

### Archivo de Configuración
Edita `config.json` para personalizar:

```json
{
  "ui": {
    "idioma": "es",
    "moneda": "USD"
  },
  "funcionalidades": {
    "filtradoPorFecha": true,
    "metricas": true
  }
}
```

### Base de Datos
- Los datos se guardan automáticamente en `src/data/ventas.json`
- No requiere configuración adicional
- Los datos persisten entre sesiones

## 📁 Estructura de Archivos

```
proyecto/
├── index.html              # Abrir este archivo
├── src/
│   ├── css/styles.css     # Estilos
│   ├── js/script.js       # Funcionalidades
│   └── data/ventas.json   # Base de datos
└── docs/                  # Documentación
```

## 🐛 Solución de Problemas

### La aplicación no carga:
- Verifica que todos los archivos estén en su lugar
- Abre la consola del navegador (F12) para ver errores
- Asegúrate de usar un servidor local

### Los datos no se guardan:
- Verifica permisos de escritura en la carpeta
- Asegúrate de que `src/data/` exista
- Revisa la consola del navegador

### Problemas de estilo:
- Verifica que `src/css/styles.css` esté en su lugar
- Limpia la caché del navegador
- Verifica la consola para errores CSS

## 🔄 Actualizaciones

1. Descarga la nueva versión
2. Reemplaza los archivos existentes
3. Mantén tu archivo `ventas.json` si quieres conservar datos
4. Recarga la página

## 📞 Soporte

- Revisa la documentación en `docs/`
- Abre un issue en GitHub
- Verifica la consola del navegador para errores
