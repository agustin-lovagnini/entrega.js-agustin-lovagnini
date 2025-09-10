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
- HTML5
- CSS3
- JavaScript

## Funcionalidades
1. **pedirDeposito()** → Solicita al usuario un monto válido para invertir.
2. **elegirMoneda()** → Permite seleccionar la moneda de inversión con validación de opciones.
3. **guardarInversion()** → Procesa y guarda la inversión en `sessionStorage`.
4. **mostrarResumenInversion()** → Muestra un resumen de todas las inversiones realizadas.
5. **iniciarSimulador()** → Función principal que organiza el flujo de la aplicación.

## Cómo usarlo
1. Abrir `index.html` en un navegador.
2. Se mostrará un cuadro de diálogo pidiendo el nombre de usuario.
3. Ingresar el monto a invertir y seleccionar la moneda.
4. Repetir si se desea realizar otra inversión.
5. Al finalizar, se mostrará un resumen de todas las inversiones.
