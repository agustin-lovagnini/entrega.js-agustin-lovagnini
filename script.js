const moneda = ["Pesos", "USDT", "USDS", "BTS", "Ethereum"];
let inversion = [0, 0, 0, 0, 0];
let usuario = '';

const pantallaInicio = document.getElementById("pantalla-inicio");
const panelGeneral = document.getElementById("panel-general");
const saludo = document.getElementById("saludo");
const listaInversiones = document.getElementById("listaInversiones");
const formInversion = document.getElementById("formInversion");

// Guardar el nombre de usuario o recordar
function procesarIngreso() {
  const nombreInput = document.getElementById("nombreUsuario").value.trim();
  const errorNombre = document.getElementById("errorNombre");
  errorNombre.textContent = "";

  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombreInput)) {
    errorNombre.textContent = "El nombre es incorrecto, no puede contener números, ni caracteres especiales.";
    return;
  }

  // Capitalizar nombre: primera letra mayúscula y resto minúscula
  const usuarioNormalizado = nombreInput
    .toLowerCase()
    .split(" ")
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");

  usuario = usuarioNormalizado;
  inversion = JSON.parse(localStorage.getItem(usuario)) || [0, 0, 0, 0, 0];

  pantallaInicio.style.display = "none";
  panelGeneral.style.display = "flex";
  saludo.textContent = `¡Hola ${usuario}!`;

  document.getElementById("sidebar").style.display = "block";
  mostrarResumenInversion();
}

// Evento clic en el botón
document.getElementById("btnIngresar").addEventListener("click", procesarIngreso);

// Evento Enter en el input
document.getElementById("nombreUsuario").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    procesarIngreso();
  }
});

// Mostrar formulario de inversión
document.getElementById("btnNuevaInversion").addEventListener("click", () => {
  if (!usuario) {
    alert("Debes iniciar sesión primero");
    return;
  }
  
  const formularioActualmentVisible = formInversion.style.display === "block";
  
  if (formularioActualmentVisible) {
    // Si está visible, lo cerramos
    formInversion.style.display = "none";
  } else {
    // Si está oculto, lo abrimos y limpiamos
    document.getElementById("moneda").value = "0";
    document.getElementById("monto").value = "";
    formInversion.style.display = "block";
  }
});

// Formatear el input de monto mientras se escribe
document.getElementById("monto").addEventListener("input", (e) => {
  let soloNumeros = e.target.value.replace(/[^\d]/g, "");
  
  if (soloNumeros) {
    let formateado = parseInt(soloNumeros).toLocaleString('es-ES');
    e.target.value = formateado;
  }
});

// Guardar nueva inversión
document.getElementById("btnGuardarInversion").addEventListener("click", () => {
  const montoInput = document.getElementById("monto").value;
  const monto = parseFloat(montoInput.replace(/[^\d]/g, ""));
  const posicion = document.getElementById("moneda").value;
  const errorMonto = document.getElementById("errorMonto");
  errorMonto.textContent = "";

  // Validar que hay usuario activo
  if (!usuario) {
    errorMonto.textContent = "No hay usuario activo. Por favor, inicia sesión.";
    return;
  }

  // Validar que se seleccionó una moneda válida
  if (posicion === "" || isNaN(posicion)) {
    errorMonto.textContent = "Por favor, selecciona una moneda.";
    return;
  }

  // Validar el monto
  if (isNaN(monto) || monto <= 0) {
    errorMonto.textContent = "Ingresá un monto válido mayor a 0.";
    return;
  }

  // Alerta de confirmación usando SweetAlert2
  Swal.fire({
    title: "¿Guardar inversión?",
    text: `${moneda[parseInt(posicion)]}: ${monto.toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "Guardar",
    denyButtonText: `Cancelar`,
    icon: "question"
  }).then((result) => {
    if (result.isConfirmed) {
      // Si confirma, guardar la inversión
      const posicionNum = parseInt(posicion);
      inversion[posicionNum] += monto;
      localStorage.setItem(usuario, JSON.stringify(inversion));

      formInversion.style.display = "none";
      document.getElementById("monto").value = "";
      document.getElementById("moneda").value = "0";

      mostrarResumenInversion();

      Swal.fire("¡Guardado!", "Tu inversión se guardó correctamente", "success");
    } else if (result.isDenied) {
      // Si cancela, solo cierra el alert y deja el formulario abierto
      Swal.fire("Cancelado", "Puedes modificar tu inversión", "info");
    }
  });
});

function mostrarResumenInversion() {
  listaInversiones.innerHTML = "";
  let total = 0;

  for (let i = 0; i < moneda.length; i++) {
    const li = document.createElement("li");
    const montoFormateado = inversion[i].toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    li.textContent = `${moneda[i]}: ${montoFormateado}`;
    listaInversiones.appendChild(li);
    total += inversion[i];
  }

  const liTotal = document.createElement("li");
  const totalFormateado = total.toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  liTotal.textContent = `TOTAL: ${totalFormateado}`;
  liTotal.classList.add("total-negrita");
  liTotal.style.color = "#000";
  listaInversiones.appendChild(liTotal);
}

// Botón cerrar sesión
document.getElementById("btnCerrarSesion").addEventListener("click", () => {
  panelGeneral.style.display = "none";
  document.getElementById("sidebar").style.display = "none";
  usuario = '';
  inversion = [0, 0, 0, 0, 0];
  pantallaInicio.style.display = "flex";
  document.getElementById("nombreUsuario").value = '';
});

// Sidebar expandible/colapsable
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleSidebar");
const closeBtn = document.getElementById("closeSidebar");

if (toggleBtn && closeBtn) {
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.add("expanded");
    toggleBtn.style.display = "none";
    closeBtn.style.display = "inline";
  });

  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("expanded");
    toggleBtn.style.display = "inline";
    closeBtn.style.display = "none";
  });
}