const moneda = ["Pesos", "USDT", "USDS", "BTS", "Ethereum"];
let inversion = [0, 0, 0, 0, 0];
let usuario = '';

const pantallaInicio = document.getElementById("pantalla-inicio");
const panelGeneral = document.getElementById("panel-general");
const saludo = document.getElementById("saludo");
const listaInversiones = document.getElementById("listaInversiones");
const formInversion = document.getElementById("formInversion");

// ! Grardar el nombre de usuiario o recordar
function procesarIngreso() {
  const nombreInput = document.getElementById("nombreUsuario").value.trim();
  const errorNombre = document.getElementById("errorNombre");
  errorNombre.textContent = "";

  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombreInput)) {
    errorNombre.textContent = "El nombre es incorrecto, no puede contener números.";
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

// !como ir guardando las inversiones en conjunto con los nombres
document.getElementById("btnNuevaInversion").addEventListener("click", () => {
  formInversion.style.display = "block";
});

document.getElementById("btnGuardarInversion").addEventListener("click", () => {
  const monto = parseFloat(document.getElementById("monto").value);
  const posicion = parseInt(document.getElementById("moneda").value);
  const errorMonto = document.getElementById("errorMonto");
  errorMonto.textContent = "";

  if (isNaN(monto) || monto <= 0) {
    errorMonto.textContent = "Ingresá un monto válido mayor a 0.";
    return;
  }

  inversion[posicion] += monto;
  localStorage.setItem(usuario, JSON.stringify(inversion));

  formInversion.style.display = "none";
  document.getElementById("monto").value = "";

  mostrarResumenInversion();
});

function mostrarResumenInversion() {
  listaInversiones.innerHTML = "";
  let total = 0;

  for (let i = 0; i < moneda.length; i++) {
    const li = document.createElement("li");
    li.textContent = `${moneda[i]}: ${inversion[i]}`;
    listaInversiones.appendChild(li);
    total += inversion[i];
  }

  const liTotal = document.createElement("li");
  liTotal.textContent = `TOTAL: ${total}`;
  liTotal.classList.add("total-negrita");
  listaInversiones.appendChild(liTotal);
}


// *Botón cerrar sesión
document.getElementById("btnCerrarSesion").addEventListener("click", () => {
  panelGeneral.style.display = "none";
  document.getElementById("sidebar").style.display = "none";
  usuario = '';
  inversion = [0, 0, 0, 0, 0];
  pantallaInicio.style.display = "flex";
  document.getElementById("nombreUsuario").value = '';
});


// * Sidebar expandible/colapsable
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





// ! ESTO FUE LA PARTE DE LA ENTREGA 1 CON PROMPT, ALERT Y CONSOLE LOG:
/*
function pedirDeposito() {
  let deposito = parseFloat(prompt("Ingresa el monto a depositar. Si necesitas, podes poner decimales:"));

  while (isNaN(deposito) || deposito <= 0) {
    let mensaje;
    if (isNaN(deposito)) {
      mensaje =
        "No es un numero, ingresa un numero valido. Vuelve a intentarlo:";
    } else {
      mensaje = "El numero tiene que ser mayor a 0";
    }
    deposito = parseFloat(prompt(mensaje));
  }
  return deposito;
}

function elegirMoneda() {
  let mensaje = "Elija la moneda para su inversion:\n";
  for (let i = 0; i < moneda.length; i++) {
    mensaje += `${i}) ${moneda[i]}\n`;
  }

  let eleccion = parseInt(prompt(mensaje));
  while (isNaN(eleccion) || eleccion < 0 || eleccion >= moneda.length) {
    eleccion = parseInt(prompt("Opcion invalida. " + mensaje));
  }
  return eleccion;
}

function guardarInversion(usuario, montoDepositado, posición) {
  inversion[posición] += montoDepositado;
  sessionStorage.setItem(usuario, JSON.stringify(inversion));
  console.log(
    `Inversion guardada: ${montoDepositado} en ${moneda[posición]}. Tu total invertido es de ${inversion[posición]}`
  );
  alert(
    `Inversion registrada con exito: \nMoneda: ${moneda[posición]} \nMonto agregado: ${montoDepositado} \nTotal en ${moneda[posición]}: ${inversion[posición]}`
  );
}

function mostrarResumenInversion() {
  let resumenInversion = "Resumen de tus inversiones:\n";
  let total = 0;
  for (let i = 0; i < moneda.length; i++) {
    resumenInversion += `${moneda[i]}: ${inversion[i]}\n`;
    total += inversion[i];
  }
  resumenInversion += `\nTotal invertido en todas las monedas: ${total}`;
  console.log(resumenInversion);
  alert(resumenInversion);
}


function iniciarSimulador(){
  let usuario = prompt("¡Bienvenido!\n Quiero saber tu nombre, ingresa tu nombre de usuario:");
  
    while (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(usuario)) {
    usuario = prompt("El nombre no puede contener numeros. Vuelve a intentarlo:");
  }

  inversion = JSON.parse(sessionStorage.getItem(usuario)) || [0, 0, 0, 0, 0];
  alert(`Hola ${usuario}!`);

  do {
    let montoDepositado = pedirDeposito();
    let posición = elegirMoneda();
    guardarInversion(usuario, montoDepositado, posición);
  }   while (confirm("¿Deseas realizar otra inversion?"));

  mostrarResumenInversion();
    alert("Gracias por usar el simulador, " + usuario + "!");
}

iniciarSimulador();
*/