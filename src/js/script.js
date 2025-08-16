// Variables globales para almacenar los datos
let ventas = [];
let ventasFiltradas = [];
let totalVentas = 0;
let montoTotal = 0;
let promedioVenta = 0;

// Elementos del DOM
const ventaForm = document.getElementById("ventaForm");
const montoInput = document.getElementById("monto");
const montoFormateadoElement = document.getElementById("montoFormateado");
const fechaVentaInput = document.getElementById("fechaVenta");
const totalVentasElement = document.getElementById("totalVentas");
const montoTotalElement = document.getElementById("montoTotal");
const promedioVentaElement = document.getElementById("promedioVenta");
const ventasTableBody = document.getElementById("ventasTableBody");
const limpiarHistorialBtn = document.getElementById("limpiarHistorial");
const fechaInicioInput = document.getElementById("fechaInicio");
const fechaFinInput = document.getElementById("fechaFin");
const aplicarFiltroBtn = document.getElementById("aplicarFiltro");
const limpiarFiltroBtn = document.getElementById("limpiarFiltro");

// ===== FUNCIONES DE FORMATEO =====

// Función para formatear monto en tiempo real
function formatearMontoEnTiempoReal(valor) {
  if (!valor || valor === "") {
    montoFormateadoElement.textContent = "$0,00";
    return;
  }

  // Limpiar el valor de caracteres no numéricos excepto punto
  let valorLimpio = valor.replace(/[^\d.]/g, "");

  // Asegurar que solo haya un punto decimal
  const partes = valorLimpio.split(".");
  if (partes.length > 2) {
    valorLimpio = partes[0] + "." + partes.slice(1).join("");
  }

  // Convertir a número
  const numero = parseFloat(valorLimpio);

  if (isNaN(numero)) {
    montoFormateadoElement.textContent = "$0,00";
    return;
  }

  // Formatear con separadores de miles y dos decimales
  const montoFormateado = formatearMoneda(numero);
  montoFormateadoElement.textContent = montoFormateado;
}

// Función para formatear moneda con separadores de miles
function formatearMoneda(monto) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(monto);
}

// Función para formatear fecha en formato latinoamericano
function formatearFechaLatinoamericana(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Función para formatear fecha en formato latinoamericano para campos de input
function formatearFechaLatinoamericanaParaInput(fecha) {
  const dia = fecha.getDate().toString().padStart(2, "0");
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const año = fecha.getFullYear();
  return `${dia}/${mes}/${año}`;
}

// Función para convertir fecha del formato latinoamericano (dd/mm/yyyy) al formato ISO (yyyy-mm-dd)
function convertirFechaLatinoamericanaAISO(fechaLatinoamericana) {
  // Validar formato dd/mm/yyyy
  const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const match = fechaLatinoamericana.match(regex);

  if (!match) {
    return null;
  }

  const dia = parseInt(match[1], 10);
  const mes = parseInt(match[2], 10);
  const año = parseInt(match[3], 10);

  // Validar que la fecha sea válida
  const fecha = new Date(año, mes - 1, dia);
  if (
    fecha.getDate() !== dia ||
    fecha.getMonth() !== mes - 1 ||
    fecha.getFullYear() !== año
  ) {
    return null;
  }

  // Convertir a formato ISO
  return fecha.toISOString().split("T")[0];
}

// Función para formatear automáticamente los campos de fecha
function formatearFechaInput(input) {
  let valor = input.value.replace(/\D/g, ""); // Solo números

  if (valor.length >= 2) {
    valor = valor.slice(0, 2) + "/" + valor.slice(2);
  }
  if (valor.length >= 5) {
    valor = valor.slice(0, 5) + "/" + valor.slice(5, 9);
  }

  input.value = valor;
}

// ===== FUNCIONES PRINCIPALES =====

// Función para registrar una nueva venta
function registrarVenta() {
  const montoTexto = montoInput.value;

  if (!montoTexto || montoTexto === "") {
    alert("Por favor ingresa un monto válido");
    return;
  }

  // Limpiar el valor y convertir a número
  const montoLimpio = parseFloat(montoTexto.replace(/[^\d.]/g, ""));

  if (isNaN(montoLimpio) || montoLimpio <= 0) {
    alert("Por favor ingresa un monto válido mayor a 0");
    return;
  }

  // Obtener la fecha seleccionada o usar la fecha actual
  let fechaSeleccionada = fechaVentaInput.value;

  // Si no hay fecha o está en formato latinoamericano, convertirla
  if (!fechaSeleccionada) {
    fechaSeleccionada = new Date().toISOString().split("T")[0];
  } else if (fechaSeleccionada.includes("/")) {
    // Convertir del formato latinoamericano al ISO
    const fechaISO = convertirFechaLatinoamericanaAISO(fechaSeleccionada);
    if (!fechaISO) {
      alert("Por favor ingresa una fecha válida en formato dd/mm/aaaa");
      return;
    }
    fechaSeleccionada = fechaISO;
  }

  // Validar que la fecha sea válida
  if (fechaSeleccionada === "Invalid Date" || !fechaSeleccionada) {
    alert("Por favor ingresa una fecha válida");
    return;
  }

  // Crear objeto de venta
  const venta = {
    id: Date.now(),
    fecha: fechaSeleccionada,
    fechaMostrar: new Date(fechaSeleccionada).toLocaleDateString("es-AR"),
    hora: new Date().toLocaleTimeString("es-AR"),
    monto: montoLimpio,
  };

  // Agregar a la lista de ventas
  ventas.push(venta);

  // Actualizar totales
  totalVentas++;
  montoTotal += montoLimpio;

  // Actualizar interfaz
  actualizarResumen();
  mostrarHistorial();
  guardarDatos();

  // Limpiar formulario
  ventaForm.reset();
  montoFormateadoElement.textContent = "$0,00";

  // Restaurar fecha actual en el campo de fecha de venta
  const hoy = new Date();
  fechaVentaInput.value = formatearFechaLatinoamericanaParaInput(hoy);

  // Mostrar confirmación
  mostrarNotificacion("Venta registrada exitosamente");
}

// Función para actualizar el resumen
function actualizarResumen() {
  totalVentasElement.textContent = totalVentas;
  montoTotalElement.textContent = formatearMoneda(montoTotal);

  // Calcular promedio
  promedioVenta = totalVentas > 0 ? montoTotal / totalVentas : 0;
  promedioVentaElement.textContent = formatearMoneda(promedioVenta);
}

// Función para mostrar el historial de ventas
function mostrarHistorial() {
  ventasTableBody.innerHTML = "";

  const ventasAMostrar = ventasFiltradas.length > 0 ? ventasFiltradas : ventas;

  if (ventasAMostrar.length === 0) {
    ventasTableBody.innerHTML =
      '<tr><td colspan="3" style="text-align: center; color: #666;">No hay ventas registradas</td></tr>';
    return;
  }

  // Mostrar las ventas más recientes primero
  const ventasRecientes = [...ventasAMostrar].reverse();

  ventasRecientes.forEach((venta) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${formatearFechaLatinoamericana(venta.fecha)}</td>
            <td>${venta.hora}</td>
            <td>${formatearMoneda(venta.monto)}</td>
        `;
    ventasTableBody.appendChild(row);
  });
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
    (sum, venta) => sum + venta.monto,
    0
  );
  const promedioFiltrado = montoTotalFiltrado / totalVentasFiltradas;

  totalVentasElement.textContent = totalVentasFiltradas;
  montoTotalElement.textContent = formatearMoneda(montoTotalFiltrado);
  promedioVentaElement.textContent = formatearMoneda(promedioFiltrado);
}

// Función para limpiar el historial
function limpiarHistorial() {
  ventas = [];
  ventasFiltradas = [];
  totalVentas = 0;
  montoTotal = 0;

  actualizarResumen();
  mostrarHistorial();
  guardarDatos();

  mostrarNotificacion("Historial limpiado");
}

// Función para guardar datos en localStorage
function guardarDatos() {
  const datos = {
    ventas: ventas,
    totalVentas: totalVentas,
    montoTotal: montoTotal,
    ultimaActualizacion: new Date().toISOString(),
    version: "1.0",
  };

  localStorage.setItem("ventasData", JSON.stringify(datos));
}

// Función para cargar datos guardados
function cargarDatosGuardados() {
  const datosGuardados = localStorage.getItem("ventasData");

  if (datosGuardados) {
    try {
      const datos = JSON.parse(datosGuardados);
      ventas = datos.ventas || [];
      totalVentas = datos.totalVentas || 0;
      montoTotal = datos.montoTotal || 0;
    } catch (error) {
      console.error("Error al cargar datos:", error);
      // Si hay error, usar valores por defecto
      ventas = [];
      totalVentas = 0;
      montoTotal = 0;
    }
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
      document.body.removeChild(notificacion);
    }, 300);
  }, 3000);
}

// ===== FUNCIONES DEL CALENDARIO =====

// Variables globales del calendario
let calendarioFechaActual = new Date();
let calendarioCampoActivo = null;

// Función para mostrar el calendario
function mostrarCalendario(campoId) {
  calendarioCampoActivo = campoId;
  calendarioFechaActual = new Date();

  // Si el campo ya tiene una fecha, usarla como punto de partida
  const campo = document.getElementById(campoId);
  if (campo.value && campo.value.includes("/")) {
    const fechaISO = convertirFechaLatinoamericanaAISO(campo.value);
    if (fechaISO) {
      calendarioFechaActual = new Date(fechaISO);
    }
  }

  renderizarCalendario();
  document.getElementById("calendarModal").style.display = "block";
}

// Función para cerrar el calendario
function cerrarCalendario() {
  document.getElementById("calendarModal").style.display = "none";
}

// Función para cambiar mes en el calendario
function cambiarMes(delta) {
  calendarioFechaActual.setMonth(calendarioFechaActual.getMonth() + delta);
  renderizarCalendario();
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
  if (!calendarioCampoActivo) return;

  const fecha = new Date(año, mes - 1, dia);
  const fechaFormateada = formatearFechaLatinoamericanaParaInput(fecha);

  document.getElementById(calendarioCampoActivo).value = fechaFormateada;
  cerrarCalendario();

  // Si es un campo de filtro, aplicar el filtro automáticamente
  if (
    calendarioCampoActivo === "fechaInicio" ||
    calendarioCampoActivo === "fechaFin"
  ) {
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
  cargarDatosGuardados();
  actualizarResumen();
  mostrarHistorial();

  // Establecer fecha actual en los filtros y en el campo de fecha de venta
  const hoy = new Date();
  fechaInicioInput.value = formatearFechaLatinoamericanaParaInput(hoy);
  fechaFinInput.value = formatearFechaLatinoamericanaParaInput(hoy);
  fechaVentaInput.value = formatearFechaLatinoamericanaParaInput(hoy);
});

// Event listener para el formulario de venta
ventaForm.addEventListener("submit", function (e) {
  e.preventDefault();
  registrarVenta();
});

// Event listener para limpiar historial
limpiarHistorialBtn.addEventListener("click", function () {
  if (confirm("¿Estás seguro de que quieres limpiar todo el historial?")) {
    limpiarHistorial();
  }
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

  if (event.target === modal) {
    cerrarCalendario();
  }
});
