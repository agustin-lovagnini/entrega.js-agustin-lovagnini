const moneda = ["USDT", "USDS", "BTS", "Ethereum"];
let inversion = [0, 0, 0, 0];
let saldoPesos = 0;
let usuario = '';
let transacciones = [];

const pantallaInicio = document.getElementById("pantalla-inicio");
const panelGeneral = document.getElementById("panel-general");
const saludo = document.getElementById("saludo");
const listaInversiones = document.getElementById("listaInversiones");
const formInversion = document.getElementById("formInversion");
const formRetiro = document.getElementById("formRetiro");


// integrando JSON de historial de transacciones
async function cargarTransaccionesJSON() {
  try {
    const response = await fetch('./json/historial-transacciones.json');
    const data = await response.json();
    return data.transacciones || [];
  } catch (error) {
    Toastify({
      text: "No se pudo cargar el historial de transacciones. Ya que el usuario es nuevo.",
      duration: 4000,
      gravity: "top",
      position: "right",
      backgroundColor: "#ff8181ff",
    }).showToast();

    return [];
  }
}

// guardar una transacción en el historial
function guardarTransaccion(tipo, monedaNombre, monto) {
  const fecha = new Date();
  const transaccion = {
    fecha: fecha.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    tipo: tipo,
    moneda: monedaNombre,
    monto: monto
  };

  transacciones.unshift(transaccion);
  localStorage.setItem(usuario + "_transacciones", JSON.stringify(transacciones));
}

function mostrarHistorial() {
  // oculto otros contenedores y mostrar historial
  const contenedorIzquierdo = document.querySelector(".contenedor-izquierdo");
  const contenedorDerecho = document.querySelector(".contenedor-derecho");
  const historialSection = document.getElementById("historialSection");

  contenedorIzquierdo.style.display = "none";
  contenedorDerecho.style.display = "none";
  historialSection.style.display = "block";

  const listaHistorial = document.getElementById("listaHistorial");
  listaHistorial.innerHTML = "";

  // cuando no hay transacciones
  if (transacciones.length === 0) {
    listaHistorial.innerHTML = "<p class='sin-transacciones'>No hay transacciones registradas</p>";
    return;
  }

  // mostrar cada transacción
  transacciones.forEach((transaccion) => {
    const div = document.createElement("div");
    div.className = `transaccion-item ${transaccion.tipo}`;

    let icono = "";
    let descripcion = "";

    if (transaccion.tipo === "deposito") {
      icono = "💰";
      descripcion = "Depósito en cuenta";
    } else if (transaccion.tipo === "inversion") {
      icono = "📈";
      descripcion = `Inversión en ${transaccion.moneda}`;
    } else if (transaccion.tipo === "retiro") {
      icono = "💸";
      descripcion = `Retiro de ${transaccion.moneda}`;
    }
    const montoFormateado = transaccion.monto.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    div.innerHTML = `
      <div class="transaccion-info">
        <span class="transaccion-icono">${icono}</span>
        <div class="transaccion-detalle">
          <p class="transaccion-descripcion">${descripcion}</p>
          <p class="transaccion-fecha">${transaccion.fecha}</p>
        </div>
      </div>
      <p class="transaccion-monto ${transaccion.tipo === 'retiro' ? 'negativo' : 'positivo'}">
        ${transaccion.tipo === 'retiro' ? '-' : '+'} $ ${montoFormateado}
      </p>
    `;

    listaHistorial.appendChild(div);
  });
}

//!     ------ VOLVER AL INICIO DESDE HISTORIAL ------
function volverAlInicio() {
  const contenedorIzquierdo = document.querySelector(".contenedor-izquierdo");
  const contenedorDerecho = document.querySelector(".contenedor-derecho");
  const historialSection = document.getElementById("historialSection");

  historialSection.style.display = "none";
  contenedorIzquierdo.style.display = "block";
  contenedorDerecho.style.display = "block";
}


//!     ------ INICIO DE SECION Y VALIDACION ------      
async function procesarIngreso() {
  const nombreInput = document.getElementById("nombreUsuario").value.trim();
  const errorNombre = document.getElementById("errorNombre");
  errorNombre.textContent = "";

  // validación para aclara que es solo para poner letras y espacios
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombreInput)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "El nombre es incorrecto, no puede contener números ni caracteres especiales. Prueba nuevamente para ingresar.",
    });
    return
  }

  // chequeo el dato para ver que la primera letra mayúscula y resto minúscula
  const usuarioNormalizado = nombreInput
    .toLowerCase()
    .split(" ")
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");


  //! ACA EMPIEZA TODO LO QUE PASA DESPUES DE VALIDAR EL NOMBRE // SESION INICIADA

  // cargar datos del usuario desde localStorage
  usuario = usuarioNormalizado;
  inversion = JSON.parse(localStorage.getItem(usuario)) || [0, 0, 0, 0]; // Cargar inversiones desde localStorage o inicializar a cero
  saldoPesos = JSON.parse(localStorage.getItem(usuario + "_saldo")) || 0; // Cargar saldo en pesos desde localStorage o inicializar a cero

  // ver si hay historial de transacciones guardado o cargar desde JSON desde 0
  const transaccionesGuardadas = localStorage.getItem(usuario + "_transacciones");
  if (transaccionesGuardadas) {
    transacciones = JSON.parse(transaccionesGuardadas);
  } else {
    transacciones = await cargarTransaccionesJSON();
  }

  // mostrar panel principal y ocultar pantalla de inicio
  pantallaInicio.style.display = "none";
  panelGeneral.style.display = "flex";
  saludo.textContent = `¡Hola ${usuario}!`;

  document.getElementById("sidebar").style.display = "block";
  actualizarSaldo();
  mostrarResumenInversion();
}

document.getElementById("btnIngresar").addEventListener("click", procesarIngreso);

document.getElementById("nombreUsuario").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    procesarIngreso();
  }
});

//! INICIO DE SESION FINALIZADO ------
//! INICIO DE LA APLICACION DESPUES DE INICIAR SESION ------

//!     ------ DEPOSITO DE SALDO EN PESOS ------
document.getElementById("btnCargarSaldo").addEventListener("click", () => {
  if (!usuario) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Debes iniciar sesión primero"
    });
    return;
  }

  Swal.fire({
    title: `¡Hola ${usuario}!`,
    html: `
      <p style="font-size: 1.1rem; margin: 15px 0;">¿Cuánto quieres ingresar hoy?</p>
      <input type="text" id="montoDeposito" class="swal2-input" placeholder="Ingresa un monto" inputmode="numeric">
    `,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#4A9EE0",
    cancelButtonColor: "#d33",
    didOpen: () => {
      // modificando el input para que solo acepte numeros y los formatee
      const inputMonto = document.getElementById("montoDeposito");
      inputMonto.focus();
      inputMonto.addEventListener("input", (e) => {
        let soloNumeros = e.target.value.replace(/[^\d]/g, "");
        if (soloNumeros) {
          let formateado = parseInt(soloNumeros).toLocaleString('es-ES');
          e.target.value = "$ " + formateado;
        } else {
          e.target.value = "";
        }
      });
      inputMonto.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          Swal.clickConfirm();
        }
      });
    },
    preConfirm: () => {
      const montoInput = document.getElementById("montoDeposito").value;
      const monto = parseFloat(montoInput.replace(/[^\d]/g, ""));

      if (isNaN(monto) || monto <= 0) {
        Swal.showValidationMessage("Ingresa un monto válido mayor a 0");
        return false;
      }

      return monto;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const monto = result.value;

      saldoPesos += monto;
      localStorage.setItem(usuario + "_saldo", JSON.stringify(saldoPesos));
      guardarTransaccion("deposito", "Pesos ARS", monto);

      actualizarSaldo();

      Swal.fire({
        icon: "success",
        title: "¡Depósito exitoso!",
        text: `Se han depositado $${monto.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} en tu cuenta.`,
        confirmButtonColor: "#4A9EE0"
      });
    }
  });
});

//!     ------ ACTIALIZO COMO SE VE EL SALDO ------
function actualizarSaldo() {
  const saldoFormateado = saldoPesos.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  document.getElementById("saldoPesos").textContent = `$ ${saldoFormateado}`;
}

//!     ------ ACA INDICO CUANDO SE MUESTRA O NO EL FORMULARIO DE INVERSION CON EL BOTON ------
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

  // formulario de inversión tiene la clase "visible"? es visible? con esto lo verifico
  const esVisible = formInversion.classList.contains("visible");

  const btnNuevaInversion = document.getElementById("btnNuevaInversion");

  if (esVisible) {
    // ocultar formulario
    formInversion.classList.remove("visible");
    btnNuevaInversion.classList.remove("active"); // boton "btnNuevaInversion" resaltado cuando el formulario está clickeado, visible y se quita el resaltado al ocultarlo
  } else {
    document.getElementById("moneda").value = "0";
    document.getElementById("monto").value = "";
    formInversion.classList.add("visible");
    btnNuevaInversion.classList.add("active");
    formRetiro.classList.remove("visible");
    document.getElementById("btnRetirar").classList.remove("active");
  }
});

//!     ------ FORMATEO EL INPUT DE MONTO EN INVERSIONES ------
document.getElementById("monto").addEventListener("input", (e) => {
  let soloNumeros = e.target.value.replace(/[^\d]/g, "");

  if (soloNumeros) {
    let formateado = parseInt(soloNumeros).toLocaleString('es-ES');
    e.target.value = "$ " + formateado;
  }
});

//!     ------ GUARDAR INVERSION ------
document.getElementById("btnGuardarInversion").addEventListener("click", () => {
  const montoInput = document.getElementById("monto").value;
  const monto = parseFloat(montoInput.replace(/[^\d]/g, ""));
  const posicion = document.getElementById("moneda").value;
  const errorMonto = document.getElementById("errorMonto");
  errorMonto.textContent = "";

  // validaciones para guardar inversión
  if (!usuario) {
    errorMonto.textContent = "No hay usuario activo. Por favor, inicia sesión.";
    return;
  }

  if (posicion === "") {
    errorMonto.textContent = "Por favor, selecciona una moneda.";
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

  // verificar saldo disponible
  if (saldoPesos < monto) {
    Swal.fire({
      icon: "error",
      title: "Saldo insuficiente",
      text: `Solo tienes $ ${saldoPesos.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} disponibles en tu cuenta.`
    });
    return;
  }

  // confirmación de la inversión
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
      // restar del saldo y sumar a la inversión
      const posicionNum = parseInt(posicion);
      saldoPesos -= monto;
      localStorage.setItem(usuario + "_saldo", JSON.stringify(saldoPesos));

      inversion[posicionNum] += monto;
      localStorage.setItem(usuario, JSON.stringify(inversion));
      guardarTransaccion("inversion", moneda[posicionNum], monto);

      actualizarSaldo();
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

//!     ------ ACA INDICO CUANDO SE MUESTRA O NO EL FORMULARIO DE RETIRO CON EL BOTON ------
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
    // ocultar formulario
    formRetiro.classList.remove("visible");
    btnRetirar.classList.remove("active");
  } else {
    // mostrar formulario y resetear valores
    document.getElementById("monedaRetiro").value = "0";
    document.getElementById("montoRetiro").value = "";
    formRetiro.classList.add("visible");
    btnRetirar.classList.add("active");
    formInversion.classList.remove("visible");
    document.getElementById("btnNuevaInversion").classList.remove("active");
  }
});

//!     ------ FORMATEO EL INPUT DE MONTO EN RETIRO DE INVERSIONES ------
document.getElementById("montoRetiro").addEventListener("input", (e) => {
  let soloNumeros = e.target.value.replace(/[^\d]/g, "");

  if (soloNumeros) {
    let formateado = parseInt(soloNumeros).toLocaleString('es-ES');
    e.target.value = "$ " + formateado;
  }
});

//!     ------ GUARDAR RETIRO DE INVERSION ------
document.getElementById("btnGuardarRetiro").addEventListener("click", () => {
  const montoInput = document.getElementById("montoRetiro").value;
  const monto = parseFloat(montoInput.replace(/[^\d]/g, ""));
  const posicion = document.getElementById("monedaRetiro").value;
  const errorMontoRetiro = document.getElementById("errorMontoRetiro");
  errorMontoRetiro.textContent = "";

  // validaciones
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

  // verificar fondos disponibles en la moneda seleccionada
  const posicionNum = parseInt(posicion);
  if (inversion[posicionNum] < monto) {
    Swal.fire({
      icon: "error",
      title: "Fondos insuficientes",
      text: `Solo tienes $ ${inversion[posicionNum].toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} en ${moneda[posicionNum]}`
    });
    return;
  }

  // confirmación de retiro
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
      // restar de la inversión y sumar al saldo
      inversion[posicionNum] -= monto;
      localStorage.setItem(usuario, JSON.stringify(inversion));
      saldoPesos += monto;
      localStorage.setItem(usuario + "_saldo", JSON.stringify(saldoPesos));
      guardarTransaccion("retiro", moneda[posicionNum], monto);

      actualizarSaldo();
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

//!     ------ GUARDAR RETIRO DE INVERSION ------
function mostrarResumenInversion() {
  listaInversiones.innerHTML = "";
  let total = 0;

  // crear lista con cada moneda y su monto
  for (let i = 0; i < moneda.length; i++) {
    const li = document.createElement("li");
    const montoFormateado = inversion[i].toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    li.textContent = `${moneda[i]}: $ ${montoFormateado}`
    listaInversiones.appendChild(li);
    total += inversion[i];
  }

  // agregar total al final
  const liTotal = document.createElement("li");
  const totalFormateado = total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  liTotal.textContent = `TOTAL: $ ${totalFormateado}`;
  liTotal.classList.add("total-negrita");
  liTotal.style.color = "#000";
  listaInversiones.appendChild(liTotal);
}

//!     ------ BOTON PARA CERRAR SECION ------
document.getElementById("btnCerrarSesion").addEventListener("click", () => {
  // ocultar panel y resetear variables
  panelGeneral.style.display = "none";
  document.getElementById("sidebar").style.display = "none";
  usuario = '';
  inversion = [0, 0, 0, 0];

  // mostrar pantalla de inicio
  pantallaInicio.style.display = "flex";
  document.getElementById("nombreUsuario").value = '';

  // resetear estado del sidebar y formularios
  document.getElementById("sidebar").classList.remove("expanded");
  document.getElementById("toggleSidebar").style.display = "inline";
  document.getElementById("closeSidebar").style.display = "none";
  formInversion.classList.remove("visible");
  formRetiro.classList.remove("visible");
  document.getElementById("btnNuevaInversion").classList.remove("active");
  document.getElementById("btnRetirar").classList.remove("active");
});

//!     ------ ESTA PARTE ES PARA DARLE LA ANIMACION AL SIDEBAR CUANDO SE EXPANDE O CIERRA ------
const sidebar = document.getElementById("sidebar");
const contenido = document.querySelector(".contenido");
const toggleBtn = document.getElementById("toggleSidebar");
const closeBtn = document.getElementById("closeSidebar");

if (toggleBtn && closeBtn) {
  // expandir sidebar
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.add("expanded");
    contenido.classList.add("sidebar-expanded");
    toggleBtn.style.display = "none";
    closeBtn.style.display = "inline";
  });

  // colapsar sidebar
  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("expanded");
    contenido.classList.remove("sidebar-expanded");
    toggleBtn.style.display = "inline";
    closeBtn.style.display = "none";
  });
}

//!     ------ BOTONES DEL SIDEBAR ------
document.querySelectorAll("#sidebar li").forEach((li, index) => {
  li.addEventListener("click", (e) => {
    e.preventDefault();

    switch (index) {
      case 0:
        volverAlInicio();
        break;
      case 1:
        volverAlInicio();
        document.getElementById("btnNuevaInversion").click();
        break;
      case 2:
        mostrarHistorial();
        break;
      case 3:
        document.getElementById("btnCerrarSesion").click();
        break;
    }
  });
});