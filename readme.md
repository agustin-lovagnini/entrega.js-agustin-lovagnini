# Entregable1 - Simulador de Inversiones - CODERHOUSE

## Autor
Agustín Varela Alberto Lovagnini

## Descripción
Arme un simulador de inversiones donde el usuario puede:
- Ingresar su nombre.
- Elegir la moneda en la que desea invertir.
- Depositar un monto para la inversión.
- Ver un resumen con el total invertido en cada moneda y en todas las monedas.

## Tecnologías
- HTML
- CSS
- JavaScript

## Funcionalidades
1. **pedirDeposito()** → Solicita al usuario un monto válido para invertir.
2. **elegirMoneda()** → Permite seleccionar la moneda de inversión con validación de opciones.
3. **guardarInversion()** → Procesa y guarda la inversión en `sessionStorage`.
4. **mostrarResumenInversion()** → Muestra un resumen de todas las inversiones realizadas.
5. **iniciarSimulador()** → Función principal que organiza el flujo de la aplicación.

## Cómo usarlo
1. Se mostrará un cuadro de diálogo pidiendo el nombre de usuario.
2. Ingresar el monto a invertir y seleccionar la moneda.
3. Repetir si se desea realizar otra inversión.
4. Al finalizar, se mostrará un resumen de todas las inversiones.

## Notas
- Se guarda el historial de inversión por usuario usando `sessionStorage`.
