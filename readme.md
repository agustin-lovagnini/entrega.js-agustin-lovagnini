# Entregable2 - Simulador de Inversiones - CODERHOUSE

## Autor
Agustín Varela Alberto Lovagnini

## Descripción
Actualización del simulador de inversiones donde el usuario puede:
- Ingresar su nombre desde la pantalla de inicio.
- Elegir la moneda en la que desea invertir desde un formulario en la web.
- Depositar un monto para la inversión.
- Ver un resumen actualizado con el total invertido en cada moneda y el total general.
- Guardar sus inversiones por usuario en `localStorage` para mantener los datos aunque se cierre la página.
- Navegar y abrir el formulario desde un botón central o desde el sidebar.
- Cerrar sesión y limpiar la información para otro usuario.

## Tecnologías
- HTML
- CSS
- JavaScript (DOM, Eventos, LocalStorage)

## Funcionalidades
1. **procesarIngreso()** → Valida y capitaliza el nombre del usuario, recupera inversiones previas de `localStorage`, y muestra la interfaz principal.
2. **mostrarResumenInversion()** → Muestra dinámicamente en el DOM la lista de inversiones y el total general.
3. **Guardar inversión** → Captura el monto y la moneda desde el formulario, valida el ingreso, actualiza `localStorage` y refresca el resumen.
4. **Cerrar sesión** → Limpia los datos actuales y vuelve a la pantalla de inicio.
5. **Sidebar expandible** → Permite abrir/cerrar el menú lateral, con botones que replican la funcionalidad del contenido principal.
6. **Validaciones de entradas** → Monto positivo y nombre sin números, con mensajes de error visibles en la interfaz.

## Cómo usarlo
1. Ingresar el nombre en la pantalla de inicio y presionar "Ingresar" o Enter.
2. Hacer clic en "Hacer nueva inversión" o usar el botón del sidebar para abrir el formulario.
3. Ingresar el monto y seleccionar la moneda.
4. Presionar "Guardar inversión" para actualizar el resumen.
5. Repetir para más inversiones si se desea.
6. Cerrar sesión para limpiar datos y permitir que otro usuario ingrese.

## Notas
- Las inversiones se guardan por usuario usando `localStorage`.
