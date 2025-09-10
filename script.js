const moneda = ["Pesos", "USDT", "USDS", "BTS", "Ethereum"];

let inversion = [0, 0, 0, 0, 0];

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
