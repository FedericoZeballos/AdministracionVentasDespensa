// src/js/server.js
// Servidor Express para manejar las ventas con SQLite3

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { initDB, insertarVenta, obtenerVentas, eliminarVenta } = require("./db");

const app = express();
const PORT = 3000;

initDB();
app.use(cors());
app.use(bodyParser.json());

// Endpoint para obtener todas las ventas
app.get("/api/ventas", (req, res) => {
  obtenerVentas((err, ventas) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(ventas);
  });
});

// Endpoint para agregar una venta
app.post("/api/ventas", (req, res) => {
  const venta = req.body;
  insertarVenta(venta, (err, id) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id });
  });
});

// Endpoint para eliminar una venta
app.delete("/api/ventas/:id", (req, res) => {
  const id = req.params.id;
  eliminarVenta(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Venta eliminada exitosamente" });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
