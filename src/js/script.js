// Variables globales para almacenar los datos
console.log("🚀 Script.js cargado correctamente");

// Formatea un número como moneda argentina
function formatearMoneda(valor) {
  if (isNaN(valor) || valor === "" || valor === null) return "$0,00";
  return (
    "$" +
    Number(valor).toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

// Función para formatear fecha en formato latinoamericano
function formatearFechaLatinoamericana(fechaISO) {
  if (!fechaISO) return "-";

  // Parsear la fecha ISO manualmente para evitar problemas de zona horaria
  if (fechaISO.includes("-")) {
    const partes = fechaISO.split("-");
    if (partes.length === 3) {
      const año = parseInt(partes[0]);
      const mes = parseInt(partes[1]);
      const dia = parseInt(partes[2]);

      if (!isNaN(año) && !isNaN(mes) && !isNaN(dia)) {
        return `${dia.toString().padStart(2, "0")}/${mes
          .toString()
          .padStart(2, "0")}/${año}`;
      }
    }
  }

  // Fallback al método anterior si no es formato ISO estándar
  const fecha = new Date(fechaISO);
  if (isNaN(fecha.getTime())) return "-";

  const dia = fecha.getDate().toString().padStart(2, "0");
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const año = fecha.getFullYear();

  return `${dia}/${mes}/${año}`;
}

// Función para formatear fecha para input en formato latinoamericano
function formatearFechaLatinoamericanaParaInput(fecha) {
  const dia = fecha.getDate().toString().padStart(2, "0");
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const año = fecha.getFullYear();

  return `${dia}/${mes}/${año}`;
}

// Función para convertir fecha latinoamericana a ISO
function convertirFechaLatinoamericanaAISO(fechaLatinoamericana) {
  if (!fechaLatinoamericana || !fechaLatinoamericana.includes("/")) return null;

  const partes = fechaLatinoamericana.split("/");
  if (partes.length !== 3) return null;

  const dia = parseInt(partes[0]);
  const mes = parseInt(partes[1]) - 1; // Los meses en JS van de 0 a 11
  const año = parseInt(partes[2]);

  if (isNaN(dia) || isNaN(mes) || isNaN(año)) return null;

  const fecha = new Date(año, mes, dia);
  if (
    fecha.getDate() !== dia ||
    fecha.getMonth() !== mes ||
    fecha.getFullYear() !== año
  ) {
    return null; // Fecha inválida
  }

  // Usar toLocaleDateString para evitar problemas de zona horaria
  // Formato: YYYY-MM-DD
  const añoStr = fecha.getFullYear().toString();
  const mesStr = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const diaStr = fecha.getDate().toString().padStart(2, "0");

  return `${añoStr}-${mesStr}-${diaStr}`;
}

// Función auxiliar para obtener fecha actual en formato ISO sin problemas de zona horaria
function obtenerFechaActualISO() {
  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = (hoy.getMonth() + 1).toString().padStart(2, "0");
  const dia = hoy.getDate().toString().padStart(2, "0");
  return `${año}-${mes}-${dia}`;
}

// Función auxiliar para obtener hora actual en formato HH:MM
function obtenerHoraActual() {
  const ahora = new Date();
  return ahora.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// Función para establecer hora actual en el campo de hora
function establecerHoraActual() {
  const horaActual = obtenerHoraActual();
  const horaVentaInput = document.getElementById("horaVenta");
  if (horaVentaInput) {
    horaVentaInput.value = horaActual;
    console.log("🔍 Hora actual establecida:", horaActual);
  }
}

// Función para formatear input de fecha
function formatearFechaInput(input) {
  let valor = input.value.replace(/\D/g, ""); // Solo números

  if (valor.length >= 2) {
    valor = valor.substring(0, 2) + "/" + valor.substring(2);
  }
  if (valor.length >= 5) {
    valor = valor.substring(0, 5) + "/" + valor.substring(5, 9);
  }

  input.value = valor;
}

// Función para formatear monto en tiempo real
function formatearMontoEnTiempoReal(valor) {
  // Limpiar caracteres no numéricos excepto punto
  const montoLimpio = valor.replace(/[^\d.]/g, "");

  if (montoLimpio === "" || montoLimpio === ".") {
    montoFormateadoElement.textContent = "$0,00";
    return;
  }

  const monto = parseFloat(montoLimpio);
  if (!isNaN(monto)) {
    montoFormateadoElement.textContent = formatearMoneda(monto);
  } else {
    montoFormateadoElement.textContent = "$0,00";
  }
}

let ventas = [];
let ventasFiltradas = [];

// Elementos del DOM
const ventaForm = document.getElementById("ventaForm");
const montoInput = document.getElementById("monto");
const montoFormateadoElement = document.getElementById("montoFormateado");
const fechaVentaInput = document.getElementById("fechaVenta");
const totalVentasElement = document.getElementById("totalVentas");
const montoTotalElement = document.getElementById("montoTotal");
const promedioVentaElement = document.getElementById("promedioVenta");
const ventasTableBody = document.getElementById("ventasTableBody");
const fechaInicioInput = document.getElementById("fechaInicio");
const fechaFinInput = document.getElementById("fechaFin");
const aplicarFiltroBtn = document.getElementById("aplicarFiltro");
const limpiarFiltroBtn = document.getElementById("limpiarFiltro");

// Variables para eliminación individual
let ventaAEliminar = null;

// ===== FUNCIONES DE FORMATEO =====
const API_URL = "http://localhost:3000/api/ventas";

// Función para registrar una nueva venta usando la API
async function registrarVenta() {
  const montoTexto = montoInput.value;
  if (!montoTexto || montoTexto === "") {
    alert("Por favor ingresa un monto válido");
    return;
  }

  const montoLimpio = parseFloat(montoTexto.replace(/[^\d.]/g, ""));
  if (isNaN(montoLimpio) || montoLimpio <= 0) {
    alert("Por favor ingresa un monto válido mayor a 0");
    return;
  }

  let fechaSeleccionada = fechaVentaInput.value;
  console.log("🔍 Fecha del input:", fechaSeleccionada);

  if (!fechaSeleccionada) {
    // Usar fecha local en lugar de UTC para evitar problemas de zona horaria
    fechaSeleccionada = obtenerFechaActualISO();
    console.log("🔍 No hay fecha, usando fecha actual:", fechaSeleccionada);
  } else if (fechaSeleccionada.includes("/")) {
    console.log(
      "🔍 Convirtiendo fecha latinoamericana a ISO:",
      fechaSeleccionada
    );
    const fechaISO = convertirFechaLatinoamericanaAISO(fechaSeleccionada);
    if (!fechaISO) {
      alert("Por favor ingresa una fecha válida en formato dd/mm/aaaa");
      return;
    }
    fechaSeleccionada = fechaISO;
    console.log("🔍 Fecha convertida a ISO:", fechaSeleccionada);
  } else {
    console.log("🔍 Fecha ya en formato ISO:", fechaSeleccionada);
  }

  if (fechaSeleccionada === "Invalid Date" || !fechaSeleccionada) {
    alert("Por favor ingresa una fecha válida");
    return;
  }

  // Obtener la hora del input para mostrar en la interfaz
  let horaVenta = document.getElementById("horaVenta").value;
  console.log("🔍 Hora del input:", horaVenta);

  // SIEMPRE usar la hora actual de la computadora al registrar la venta
  // Solo se usa la hora del input si el usuario la modificó manualmente
  let horaParaGuardar = obtenerHoraActual();

  // Función para verificar si la hora fue modificada manualmente por el usuario
  function horaFueModificadaPorUsuario(horaInput, horaActual) {
    if (!horaInput || horaInput.trim() === "") return false;

    // Convertir ambas horas a minutos para comparación más precisa
    const [horasInput, minutosInput] = horaInput.split(":").map(Number);
    const [horasActual, minutosActual] = horaActual.split(":").map(Number);

    const minutosInputTotal = horasInput * 60 + minutosInput;
    const minutosActualTotal = horasActual * 60 + minutosActual;

    // Considerar modificada si hay una diferencia de más de 1 minuto
    return Math.abs(minutosInputTotal - minutosActualTotal) > 1;
  }

  // Si el usuario modificó manualmente la hora, usar esa hora
  if (horaFueModificadaPorUsuario(horaVenta, horaParaGuardar)) {
    horaParaGuardar = horaVenta;
    console.log("🔍 Usando hora modificada por el usuario:", horaParaGuardar);
  } else {
    console.log("🔍 Usando hora actual de la computadora:", horaParaGuardar);
  }

  const venta = {
    producto: "Venta", // Puedes adaptar esto si tienes más campos
    cantidad: 1,
    precio: montoLimpio,
    fecha: fechaSeleccionada,
    hora: horaParaGuardar, // Usar la hora determinada (actual o modificada por usuario)
  };

  console.log("🔍 Fecha seleccionada:", fechaSeleccionada);
  console.log("🔍 Hora que se guardará:", horaParaGuardar);
  console.log("🔍 Venta a enviar:", venta);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(venta),
    });

    if (!res.ok) throw new Error("Error al guardar la venta");

    mostrarNotificacion("Venta registrada exitosamente");
    ventaForm.reset();
    montoFormateadoElement.textContent = "$0,00";

    // Esperar un momento para que el reset se complete completamente
    setTimeout(() => {
      // Restablecer fecha y hora actual después del reset
      const hoy = new Date();
      fechaVentaInput.value = formatearFechaLatinoamericanaParaInput(hoy);
      establecerHoraActual(); // Restablecer la hora actual

      console.log(
        "🔄 Formulario reseteado y hora actualizada después del registro"
      );
    }, 100);

    await cargarVentasDesdeAPI();
  } catch (err) {
    alert("No se pudo guardar la venta: " + err.message);
  }
}

// Función para actualizar el resumen
function actualizarResumen() {
  totalVentasElement.textContent = ventas.length;
  montoTotalElement.textContent = formatearMoneda(
    ventas.reduce((acc, v) => acc + (v.precio || v.monto || 0), 0)
  );
  promedioVentaElement.textContent = formatearMoneda(
    ventas.length > 0
      ? ventas.reduce((acc, v) => acc + (v.precio || v.monto || 0), 0) /
          ventas.length
      : 0
  );
}

// Función para mostrar el historial de ventas
function mostrarHistorial() {
  ventasTableBody.innerHTML = "";
  const ventasAMostrar = ventasFiltradas.length > 0 ? ventasFiltradas : ventas;

  if (ventasAMostrar.length === 0) {
    ventasTableBody.innerHTML =
      '<tr><td colspan="4" style="text-align: center; color: #666;">No hay ventas registradas</td></tr>';
    return;
  }

  const ventasRecientes = [...ventasAMostrar].reverse();
  ventasRecientes.forEach((venta) => {
    // Debug de la fecha y hora antes de formatear
    console.log(`🔍 Venta ID ${venta.id}:`);
    console.log(`  - Fecha en BD: ${venta.fecha}`);
    console.log(`  - Hora en BD: ${venta.hora}`);
    console.log(
      `  - Fecha formateada: ${formatearFechaLatinoamericana(venta.fecha)}`
    );

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${formatearFechaLatinoamericana(venta.fecha)}</td>
      <td>${venta.hora ? venta.hora : "-"}</td>
      <td>${formatearMoneda(venta.precio || venta.monto)}</td>
      <td>
        <button class="delete-btn" onclick="mostrarModalEliminar(${
          venta.id
        })" title="Eliminar venta">
          🗑️
        </button>
      </td>
    `;
    ventasTableBody.appendChild(row);
  });
}

// Función global para cargar ventas desde la API
async function cargarVentasDesdeAPI() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener ventas");
    ventas = await res.json();
    actualizarResumen();
    mostrarHistorial();
  } catch (err) {
    console.error("Error al cargar ventas:", err);
    // Si no se puede cargar desde la API, mostrar mensaje de error
    ventas = [];
    actualizarResumen();
    mostrarHistorial();
  }
}

// Función para aplicar filtro por fecha
function aplicarFiltro() {
  const fechaInicio = fechaInicioInput.value;
  const fechaFin = fechaFinInput.value;

  if (!fechaInicio || !fechaFin) {
    alert("Por favor selecciona ambas fechas");
    return;
  }

  // Convertir fechas del formato latinoamericano al ISO para comparación
  const fechaInicioISO = convertirFechaLatinoamericanaAISO(fechaInicio);
  const fechaFinISO = convertirFechaLatinoamericanaAISO(fechaFin);

  if (!fechaInicioISO || !fechaFinISO) {
    alert("Por favor ingresa fechas válidas en formato dd/mm/aaaa");
    return;
  }

  if (fechaInicioISO > fechaFinISO) {
    alert("La fecha de inicio no puede ser mayor a la fecha final");
    return;
  }

  // Filtrar ventas por rango de fechas
  ventasFiltradas = ventas.filter((venta) => {
    return venta.fecha >= fechaInicioISO && venta.fecha <= fechaFinISO;
  });

  // Actualizar resumen con ventas filtradas
  actualizarResumenFiltrado();
  mostrarHistorial();

  mostrarNotificacion(
    `Filtro aplicado: ${ventasFiltradas.length} ventas encontradas`
  );
}

// Función para limpiar filtro
function limpiarFiltro() {
  ventasFiltradas = [];

  // Restaurar fechas actuales en formato latinoamericano
  const hoy = new Date();
  fechaInicioInput.value = formatearFechaLatinoamericanaParaInput(hoy);
  fechaFinInput.value = formatearFechaLatinoamericanaParaInput(hoy);

  // Restaurar resumen original
  actualizarResumen();
  mostrarHistorial();

  mostrarNotificacion("Filtro limpiado");
}

// Función para actualizar resumen con ventas filtradas
function actualizarResumenFiltrado() {
  if (ventasFiltradas.length === 0) {
    totalVentasElement.textContent = "0";
    montoTotalElement.textContent = formatearMoneda(0);
    promedioVentaElement.textContent = formatearMoneda(0);
    return;
  }

  const totalVentasFiltradas = ventasFiltradas.length;
  const montoTotalFiltrado = ventasFiltradas.reduce(
    (sum, venta) => sum + (venta.precio || venta.monto || 0),
    0
  );
  const promedioFiltrado = montoTotalFiltrado / totalVentasFiltradas;

  totalVentasElement.textContent = totalVentasFiltradas;
  montoTotalElement.textContent = formatearMoneda(montoTotalFiltrado);
  promedioVentaElement.textContent = formatearMoneda(promedioFiltrado);
}

// Función para mostrar modal de eliminación
function mostrarModalEliminar(ventaId) {
  console.log("🔍 Mostrando modal de eliminación para venta ID:", ventaId);

  // Buscar la venta por ID
  const venta = ventas.find((v) => v.id === ventaId);
  if (!venta) {
    console.error("❌ No se encontró la venta con ID:", ventaId);
    return;
  }

  ventaAEliminar = venta;

  // Llenar el modal con los datos de la venta
  document.getElementById("deleteVentaFecha").textContent =
    formatearFechaLatinoamericana(venta.fecha);
  document.getElementById("deleteVentaMonto").textContent = formatearMoneda(
    venta.precio || venta.monto
  );

  // Mostrar el modal
  document.getElementById("deleteModal").style.display = "block";
}

// Función para cerrar modal de eliminación
function cerrarModalEliminar() {
  console.log("🔍 Cerrando modal de eliminación");
  document.getElementById("deleteModal").style.display = "none";
  ventaAEliminar = null;
}

// Función para confirmar eliminación de venta
async function confirmarEliminarVenta() {
  if (!ventaAEliminar) {
    console.error("❌ No hay venta seleccionada para eliminar");
    return;
  }

  console.log("🔍 Confirmando eliminación de venta ID:", ventaAEliminar.id);

  try {
    const response = await fetch(`${API_URL}/${ventaAEliminar.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la venta");
    }

    // Cerrar modal
    cerrarModalEliminar();

    // Recargar ventas desde la API
    await cargarVentasDesdeAPI();

    mostrarNotificacion("Venta eliminada exitosamente");
  } catch (error) {
    console.error("❌ Error al eliminar venta:", error);
    alert("No se pudo eliminar la venta: " + error.message);
  }
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
  // Crear elemento de notificación
  const notificacion = document.createElement("div");
  notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
  notificacion.textContent = mensaje;

  // Agregar estilos de animación
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
  document.head.appendChild(style);

  // Agregar al DOM
  document.body.appendChild(notificacion);

  // Remover después de 3 segundos
  setTimeout(() => {
    notificacion.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      if (document.body.contains(notificacion)) {
        document.body.removeChild(notificacion);
      }
    }, 300);
  }, 3000);
}

// ===== FUNCIONES DEL CALENDARIO =====

// Variables globales del calendario
let calendarioFechaActual = new Date();
let calendarioCampoActivo = null;

// Función para mostrar el calendario
function mostrarCalendario(campoId) {
  console.log("🔍 Función mostrarCalendario llamada con campoId:", campoId);
  calendarioCampoActivo = campoId;
  calendarioFechaActual = new Date();

  // Si el campo ya tiene una fecha, usarla como punto de partida
  const campo = document.getElementById(campoId);
  console.log("🔍 Campo encontrado:", campo);
  if (campo.value && campo.value.includes("/")) {
    const fechaISO = convertirFechaLatinoamericanaAISO(campo.value);
    if (fechaISO) {
      calendarioFechaActual = new Date(fechaISO);
    }
  }

  renderizarCalendario();
  const modal = document.getElementById("calendarModal");
  console.log("🔍 Modal encontrado:", modal);
  if (modal) {
    modal.style.display = "block";
    console.log("✅ Calendario mostrado correctamente");
  } else {
    console.error("❌ No se encontró el modal del calendario");
  }
}

// Función para cerrar el calendario
function cerrarCalendario() {
  console.log("🔍 Función cerrarCalendario llamada");
  const modal = document.getElementById("calendarModal");
  if (modal) {
    modal.style.display = "none";
    console.log("✅ Calendario cerrado correctamente");
  } else {
    console.error("❌ No se encontró el modal del calendario para cerrar");
  }
}

// Función para cambiar mes en el calendario
function cambiarMes(delta) {
  console.log("🔍 Función cambiarMes llamada con delta:", delta);
  calendarioFechaActual.setMonth(calendarioFechaActual.getMonth() + delta);
  renderizarCalendario();
  console.log("✅ Mes cambiado correctamente");
}

// Función para renderizar el calendario
function renderizarCalendario() {
  const año = calendarioFechaActual.getFullYear();
  const mes = calendarioFechaActual.getMonth();

  // Actualizar título del calendario
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  document.getElementById("calendarTitle").textContent = `${meses[mes]} ${año}`;

  // Obtener primer día del mes y último día
  const primerDia = new Date(año, mes, 1);
  const ultimoDia = new Date(año, mes + 1, 0);
  const primerDiaSemana = primerDia.getDay();
  const totalDias = ultimoDia.getDate();

  // Obtener días del mes anterior para completar la primera semana
  const ultimoDiaMesAnterior = new Date(año, mes, 0);
  const diasMesAnterior = ultimoDiaMesAnterior.getDate();

  // Generar días del calendario
  let html = "";

  // Días del mes anterior
  for (let i = primerDiaSemana - 1; i >= 0; i--) {
    const dia = diasMesAnterior - i;
    html += `<div class="calendar-day other-month">${dia}</div>`;
  }

  // Días del mes actual
  const hoy = new Date();
  for (let dia = 1; dia <= totalDias; dia++) {
    const fecha = new Date(año, mes, dia);
    const esHoy = fecha.toDateString() === hoy.toDateString();
    const esSeleccionado =
      calendarioCampoActivo &&
      document.getElementById(calendarioCampoActivo).value ===
        formatearFechaLatinoamericanaParaInput(fecha);

    let clases = "calendar-day";
    if (esHoy) clases += " today";
    if (esSeleccionado) clases += " selected";

    html += `<div class="calendar-day ${clases}" onclick="seleccionarFecha(${año}, ${
      mes + 1
    }, ${dia})">${dia}</div>`;
  }

  // Días del mes siguiente para completar la última semana
  const diasRestantes = 42 - (primerDiaSemana + totalDias);
  for (let dia = 1; dia <= diasRestantes; dia++) {
    html += `<div class="calendar-day other-month">${dia}</div>`;
  }

  document.getElementById("calendarDays").innerHTML = html;
}

// Función para seleccionar una fecha
function seleccionarFecha(año, mes, dia) {
  console.log("🔍 Función seleccionarFecha llamada con:", año, mes, dia);
  if (!calendarioCampoActivo) {
    console.error("❌ No hay campo activo para seleccionar fecha");
    return;
  }

  const fecha = new Date(año, mes - 1, dia);
  const fechaFormateada = formatearFechaLatinoamericanaParaInput(fecha);
  console.log("🔍 Fecha formateada:", fechaFormateada);

  const campo = document.getElementById(calendarioCampoActivo);
  if (campo) {
    campo.value = fechaFormateada;
    console.log("✅ Fecha asignada al campo:", calendarioCampoActivo);
  } else {
    console.error("❌ No se encontró el campo:", calendarioCampoActivo);
  }

  cerrarCalendario();

  // Si es un campo de filtro, aplicar el filtro automáticamente
  if (
    calendarioCampoActivo === "fechaInicio" ||
    calendarioCampoActivo === "fechaFin"
  ) {
    console.log("🔍 Aplicando filtro automático");
    // Pequeño delay para que se actualice el valor
    setTimeout(() => {
      if (fechaInicioInput.value && fechaFinInput.value) {
        aplicarFiltro();
      }
    }, 100);
  }
}

// ===== EVENT LISTENERS =====

// Cargar datos guardados al iniciar la página
document.addEventListener("DOMContentLoaded", function () {
  console.log("📄 DOM cargado, inicializando aplicación...");

  // Cargar ventas desde la API y mostrar historial
  cargarVentasDesdeAPI();

  // Establecer fecha actual en los filtros y en el campo de fecha de venta
  const hoy = new Date();
  const fechaActual = obtenerFechaActualISO(); // Usar la función corregida
  const fechaActualLatinoamericana =
    formatearFechaLatinoamericanaParaInput(hoy);

  fechaInicioInput.value = fechaActualLatinoamericana;
  fechaFinInput.value = fechaActualLatinoamericana;
  fechaVentaInput.value = fechaActualLatinoamericana;

  // Establecer hora actual en el campo de hora
  establecerHoraActual();

  console.log("🔍 Fecha actual establecida:", fechaActual);
  console.log(
    "🔍 Fecha actual en formato latinoamericano:",
    fechaActualLatinoamericana
  );

  console.log("✅ Aplicación inicializada correctamente");
});

// Event listener para el formulario de venta
ventaForm.addEventListener("submit", function (e) {
  e.preventDefault();
  registrarVenta();
});

// Event listener para aplicar filtro
aplicarFiltroBtn.addEventListener("click", function () {
  aplicarFiltro();
});

// Event listener para limpiar filtro
limpiarFiltroBtn.addEventListener("click", function () {
  limpiarFiltro();
});

// Event listener para formateo automático del campo de fecha de venta
fechaVentaInput.addEventListener("input", function (e) {
  formatearFechaInput(e.target);
});

// Event listener para formateo automático de los campos de filtro
fechaInicioInput.addEventListener("input", function (e) {
  formatearFechaInput(e.target);
});

fechaFinInput.addEventListener("input", function (e) {
  formatearFechaInput(e.target);
});

// Event listener para formateo en tiempo real del monto
montoInput.addEventListener("input", function (e) {
  formatearMontoEnTiempoReal(e.target.value);
});

// Event listener para refrescar la hora actual
document.addEventListener("DOMContentLoaded", function () {
  const horaVentaInput = document.getElementById("horaVenta");
  if (horaVentaInput) {
    // Refrescar la hora cada vez que se hace focus en el campo
    horaVentaInput.addEventListener("focus", function () {
      // Solo actualizar si el campo está vacío
      if (!this.value || this.value.trim() === "") {
        establecerHoraActual();
      }
    });

    // También refrescar la hora cuando se hace clic en el campo
    horaVentaInput.addEventListener("click", function () {
      // Solo actualizar si el campo está vacío
      if (!this.value || this.value.trim() === "") {
        establecerHoraActual();
      }
    });
  }
});

// Event listener para validar entrada del monto
montoInput.addEventListener("keypress", function (e) {
  // Permitir solo números, punto decimal, backspace y delete
  const charCode = e.which ? e.which : e.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
    e.preventDefault();
  }

  // Permitir solo un punto decimal
  if (charCode === 46 && e.target.value.indexOf(".") !== -1) {
    e.preventDefault();
  }
});

// Cerrar calendario al hacer clic fuera de él
document.addEventListener("click", function (event) {
  const modal = document.getElementById("calendarModal");
  const deleteModal = document.getElementById("deleteModal");

  if (event.target === modal) {
    cerrarCalendario();
  }

  if (event.target === deleteModal) {
    cerrarModalEliminar();
  }
});
