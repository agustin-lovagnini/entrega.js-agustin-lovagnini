# Entregable Final - Simulador de Inversiones (SA) - Coderhouse

## Autor
Agustín Varela Alberto Lovagnini

## 🚀 Descripción del Proyecto

Simulador interactivo de inversiones que gestiona el ciclo completo de movimientos financieros para un usuario: **Depósito**, **Inversión**, **Retiro** y **Visualización de Historial**. La aplicación utiliza persistencia de datos y consume información estática de forma asíncrona.

## 🛠 Tecnologías Utilizadas

- **HTML5:** Estructura de la aplicación.
- **CSS3:** Estilos y diseño responsivo.
- **JavaScript (ES6+):** Lógica de negocio, manipulación del DOM y persistencia de datos.
- **Librerías externas (CDN):**
    - **SweetAlert2:** Para diálogos de confirmación y mensajes de alerta (`Swal.fire`).
    - **Toastify:** Para notificaciones informativas no bloqueantes (`Toastify`).

## ✨ Funcionalidades Clave

### A. Persistencia y Validación

1.  **Inicio de Sesión:** Valida y capitaliza el nombre del usuario, cargando automáticamente su saldo, inversiones y historial guardados en `localStorage`.
2.  **Validaciones robustas:** Comprueba que los montos sean positivos y que el saldo disponible sea suficiente antes de confirmar una inversión o retiro.
3.  **Persistencia de Datos:** El estado completo del usuario (saldo, inversiones y transacciones) se guarda en `localStorage` y se recupera al volver a iniciar sesión.

### B. Movimientos Financieros

4.  **Depósito de Saldo:** Permite al usuario ingresar dinero ("Pesos ARS") en su cuenta, actualizando el saldo y registrando la transacción.
5.  **Inversión:** Permite transferir dinero del saldo en Pesos ARS a una de las cuatro criptomonedas predefinidas (`USDT`, `USDS`, `BTS`, `Ethereum`).
6.  **Retiro:** Permite transferir fondos de vuelta de una inversión específica al saldo en Pesos ARS.

### C. Manejo de la Interfaz y Datos

7.  **Resumen Dinámico:** Muestra en tiempo real el saldo en Pesos ARS y el detalle de las inversiones por moneda (monto y total general).
8.  **Historial de Transacciones:**
    - Carga datos iniciales desde un archivo **JSON externo** (`./json/historial-transacciones.json`) utilizando `fetch` de forma **asíncrona**.
    - Registra y muestra todas las transacciones (depósitos, inversiones y retiros) con fecha, monto y tipo de operación.
9.  **Navegación:** Implementación de un **Sidebar expandible** que permite acceder a las funciones principales (Inicio, Inversión, Historial y Cerrar Sesión).

## 💡 Cómo Usarlo

1.  **Ingreso:** En la pantalla de inicio, ingresa tu nombre y presiona **"Ingresar"**.
2.  **Depositar:** Haz clic en **"Ingresar dinero"** y deposita un monto inicial para comenzar a operar.
3.  **Invertir:** Haz clic en **"Hacer nueva inversión"**, selecciona una moneda y el monto a invertir.
4.  **Retirar:** Haz clic en **"Retirar dinero"** para liquidar parte o la totalidad de una inversión de vuelta a tu saldo.
5.  **Ver Historial:** Usa el botón **"Ver Historial"** en el Sidebar para revisar todas tus transacciones registradas.
6.  **Cerrar Sesión:** Usa **"Cerrar Sesión"** en el Sidebar para limpiar los datos en memoria y permitir el ingreso de un nuevo usuario.