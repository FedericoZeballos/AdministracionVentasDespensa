// src/js/db.js
// Configuración y funciones para manejar la base de datos SQLite3

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../../data/ventas.db");
const db = new sqlite3.Database(dbPath);

// Crear tabla ventas si no existe
const initDB = () => {
  db.run(`CREATE TABLE IF NOT EXISTS ventas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto TEXT NOT NULL,
    cantidad INTEGER NOT NULL,
    precio REAL NOT NULL,
    fecha TEXT NOT NULL,
    hora TEXT
  )`);
  
  // Verificar si la columna hora existe antes de agregarla
  db.get("PRAGMA table_info(ventas)", (err, rows) => {
    if (err) {
      console.error("Error al verificar estructura de la tabla:", err);
      return;
    }
    
    // Buscar si la columna hora ya existe
    db.all("PRAGMA table_info(ventas)", (err, columns) => {
      if (err) {
        console.error("Error al obtener columnas de la tabla:", err);
        return;
      }
      
      const horaColumnExists = columns.some(col => col.name === 'hora');
      
      if (!horaColumnExists) {
        console.log("Agregando columna 'hora' a la tabla ventas...");
        db.run(`ALTER TABLE ventas ADD COLUMN hora TEXT`, (err) => {
          if (err) {
            console.error("Error al agregar columna hora:", err);
          } else {
            console.log("Columna 'hora' agregada exitosamente");
          }
        });
      } else {
        console.log("La columna 'hora' ya existe en la tabla ventas");
      }
    });
  });
};

// Insertar una venta
const insertarVenta = (venta, callback) => {
  const { producto, cantidad, precio, fecha, hora } = venta;
  db.run(
    `INSERT INTO ventas (producto, cantidad, precio, fecha, hora) VALUES (?, ?, ?, ?, ?)`,
    [producto, cantidad, precio, fecha, hora],
    function (err) {
      callback(err, this?.lastID);
    }
  );
};

// Obtener todas las ventas
const obtenerVentas = (callback) => {
  db.all(`SELECT * FROM ventas`, [], (err, rows) => {
    callback(err, rows);
  });
};

// Eliminar una venta
const eliminarVenta = (id, callback) => {
  db.run(`DELETE FROM ventas WHERE id = ?`, [id], function (err) {
    if (err) {
      callback(err);
    } else if (this.changes === 0) {
      callback(new Error("Venta no encontrada"));
    } else {
      callback(null);
    }
  });
};

module.exports = {
  db,
  initDB,
  insertarVenta,
  obtenerVentas,
  eliminarVenta,
};
