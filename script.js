const moneda = ["Pesos", "USDT", "USDS", "BTS", "Ethereum"];

let inversion = [0, 0, 0, 0, 0];

function pedirDeposito() {
    let deposito = parseFloat(prompt("Ingrese el monto a depositar:"));

    while (isNaN(deposito) || deposito <= 0) {
        let mensaje;
        if (isNaN(deposito)) {
            mensaje = "No es un numero, ingresa un numero valido, podes sumar decimales";
        } else {
            mensaje = "El numero debe ser mayor a 0";
        }
        deposito = parseFloat(prompt(mensaje));
    }
    return deposito;
}

function elegirMoneda() {
    let mensaje = "Elija la moneda para su inversion:\n";
    for (let i = 0; i < moneda.length; i++) {
        mensaje += `${i + 1}) ${moneda[i]}\n`;
    }

    let eleccion = parseInt(prompt(mensaje));
    
}