const moneda = ["USDT", "USDS", "BTS", "Ethereum"];
let inversion = [0, 0, 0, 0];
let usuario = '';

const pantallaInicio = document.getElementById("pantalla-inicio");
const panelGeneral = document.getElementById("panel-general");
const saludo = document.getElementById("saludo");
const listaInversiones = document.getElementById("listaInversiones");
const formInversion = document.getElementById("formInversion");
const formRetiro = document.getElementById("formRetiro");

// Guardar el nombre de usuario o recordar
function procesarIngreso() {
  const nombreInput = document.getElementById("nombreUsuario").value.trim();
  const errorNombre = document.getElementById("errorNombre");
  errorNombre.textContent = "";

  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombreInput)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "El nombre es incorrecto, no puede contener números ni caracteres especiales. Prueba nuevamente para ingresar.",
    });
    return
  }

  // Capitalizar nombre: primera letra mayúscula y resto minúscula
  const usuarioNormalizado = nombreInput
    .toLowerCase()
    .split(" ")
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");

  usuario = usuarioNormalizado;
  inversion = JSON.parse(localStorage.getItem(usuario)) || [0, 0, 0, 0];

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
    Toastify({
      text: "Debes iniciar sesión primero",
      duration: 5000,
      gravity: "bottom",
      position: "right",
      backgroundColor: "#ff6b6b",
      stopOnFocus: true,
      style: {                        
        color: "white",
        fontSize: "16px",
        fontWeight: "bold"
      }
    }).showToast();
    return;
  }

  const esVisible = formInversion.classList.contains("visible");
  const btnNuevaInversion = document.getElementById("btnNuevaInversion");

  if (esVisible) {
    formInversion.classList.remove("visible");
    btnNuevaInversion.classList.remove("active");
  } else {
    document.getElementById("moneda").value = "0";
    document.getElementById("monto").value = "";
    formInversion.classList.add("visible");
    btnNuevaInversion.classList.add("active");
    formRetiro.classList.remove("visible");
    document.getElementById("btnRetirar").classList.remove("active");
  }
});

// Formatear el input de monto mientras se escribe
document.getElementById("monto").addEventListener("input", (e) => {
  let soloNumeros = e.target.value.replace(/[^\d]/g, "");

  if (soloNumeros) {
    let formateado = parseInt(soloNumeros).toLocaleString('es-ES');
    e.target.value = "$ " + formateado;
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
  if (posicion === "") {
    errorMonto.textContent = "Por favor, selecciona una moneda.";
    return;
  }

  // Validar el monto
  if (isNaN(monto) || monto <= 0) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Ingresá un valor numérico y mayor a 0."
    });
    return;
  }

  // Alerta de confirmación usando SweetAlert2
  Swal.fire({
    title: "¿Desea hacer la inversión?",
    text: `${moneda[parseInt(posicion)]}: $ ${monto.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
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

      formInversion.classList.remove("visible");
      document.getElementById("btnNuevaInversion").classList.remove("active");
      document.getElementById("monto").value = "";
      document.getElementById("moneda").value = "0";

      mostrarResumenInversion();

      Swal.fire("¡Guardado!", "Tu inversión se guardó correctamente", "success");
    } else if (result.isDenied) {
      Swal.fire("Cancelado", "Puedes modificar tu inversión", "info");
    }
  });
});






















// Mostrar formulario de retiro
document.getElementById("btnRetirar").addEventListener("click", () => {
  if (!usuario) {
    Toastify({
      text: "Debes iniciar sesión primero",
      duration: 5000,
      gravity: "bottom",
      position: "right",
      backgroundColor: "#ff6b6b",
      stopOnFocus: true,
      style: {                        
        color: "white",
        fontSize: "16px",
        fontWeight: "bold"
      }
    }).showToast();
    return;
  }

  const esVisible = formRetiro.classList.contains("visible");
  const btnRetirar = document.getElementById("btnRetirar");

  if (esVisible) {
    formRetiro.classList.remove("visible");
    btnRetirar.classList.remove("active");
  } else {
    document.getElementById("monedaRetiro").value = "0";
    document.getElementById("montoRetiro").value = "";
    formRetiro.classList.add("visible");
    btnRetirar.classList.add("active");
    formInversion.classList.remove("visible");
    document.getElementById("btnNuevaInversion").classList.remove("active");
  }
});

// Formatear el input de monto de retiro
document.getElementById("montoRetiro").addEventListener("input", (e) => {
  let soloNumeros = e.target.value.replace(/[^\d]/g, "");

  if (soloNumeros) {
    let formateado = parseInt(soloNumeros).toLocaleString('es-ES');
    e.target.value = "$ " + formateado;
  }
});

// guardar retiro de inversión
document.getElementById("btnGuardarRetiro").addEventListener("click", () => {
  const montoInput = document.getElementById("montoRetiro").value;
  const monto = parseFloat(montoInput.replace(/[^\d]/g, ""));
  const posicion = document.getElementById("monedaRetiro").value;
  const errorMontoRetiro = document.getElementById("errorMontoRetiro");
  errorMontoRetiro.textContent = "";

  if (!usuario) {
    errorMontoRetiro.textContent = "No hay usuario activo. Por favor, inicia sesión.";
    return;
  }

  if (posicion === "") {
    errorMontoRetiro.textContent = "Por favor, selecciona una moneda.";
    return;
  }

  if (isNaN(monto) || monto <= 0) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Ingresá un valor numérico y mayor a 0."
    });
    return;
  }

  const posicionNum = parseInt(posicion);
  if (inversion[posicionNum] < monto) {
    Swal.fire({
      icon: "error",
      title: "Fondos insuficientes",
      text: `Solo tienes $ ${inversion[posicionNum].toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} en ${moneda[posicionNum]}`
    });
    return;
  }

  Swal.fire({
    title: "¿Confirmar retiro?",
    text: `${moneda[posicionNum]}: $ ${monto.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "Confirmar",
    denyButtonText: `Cancelar`,
    icon: "warning"
  }).then((result) => {
    if (result.isConfirmed) {
      inversion[posicionNum] -= monto;
      localStorage.setItem(usuario, JSON.stringify(inversion));

      formRetiro.classList.remove("visible");
      document.getElementById("btnRetirar").classList.remove("active");
      document.getElementById("montoRetiro").value = "";
      document.getElementById("monedaRetiro").value = "0";

      mostrarResumenInversion();

      Swal.fire("¡Retiro exitoso!", "El dinero se retiró correctamente", "success");
    } else if (result.isDenied) {
      Swal.fire("Cancelado", "Retiro cancelado", "info");
    }
  });

});












function mostrarResumenInversion() {
  listaInversiones.innerHTML = "";
  let total = 0;

  for (let i = 0; i < moneda.length; i++) {
    const li = document.createElement("li");
    const montoFormateado = inversion[i].toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    li.textContent = `${moneda[i]}: $ ${montoFormateado}`
    listaInversiones.appendChild(li);
    total += inversion[i];
  }

  const liTotal = document.createElement("li");
  const totalFormateado = total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  liTotal.textContent = `TOTAL: $ ${totalFormateado}`;
  liTotal.classList.add("total-negrita");
  liTotal.style.color = "#000";
  listaInversiones.appendChild(liTotal);
}

// Botón cerrar sesión
document.getElementById("btnCerrarSesion").addEventListener("click", () => {
  panelGeneral.style.display = "none";
  document.getElementById("sidebar").style.display = "none";
  usuario = '';
  inversion = [0, 0, 0, 0];
  pantallaInicio.style.display = "flex";
  document.getElementById("nombreUsuario").value = '';
  document.getElementById("sidebar").classList.remove("expanded");
  document.getElementById("toggleSidebar").style.display = "inline";
  document.getElementById("closeSidebar").style.display = "none";
  formInversion.classList.remove("visible");
  formRetiro.classList.remove("visible");
  document.getElementById("btnNuevaInversion").classList.remove("active");
  document.getElementById("btnRetirar").classList.remove("active");
});

// Sidebar expandible/colapsable
const sidebar = document.getElementById("sidebar");
const contenido = document.querySelector(".contenido");
const toggleBtn = document.getElementById("toggleSidebar");
const closeBtn = document.getElementById("closeSidebar");

if (toggleBtn && closeBtn) {
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.add("expanded");
    contenido.classList.add("sidebar-expanded");
    toggleBtn.style.display = "none";
    closeBtn.style.display = "inline";
  });

  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("expanded");
    contenido.classList.remove("sidebar-expanded");
    toggleBtn.style.display = "inline";
    closeBtn.style.display = "none";
  });
}