// ====================================
// COMPROBAR SI EL USUARIO INICIÓ SESIÓN
// ====================================

const usuarioLogueado =
    sessionStorage.getItem("usuarioLogueado");


// Si no inició sesión, vuelve al login
if (usuarioLogueado !== "true") {

    window.location.href = "login.html";

}


// ====================================
// INICIALIZAR SALDO
// ====================================

// Buscamos si ya existe un saldo guardado
let saldo = localStorage.getItem("saldo");


// Si todavía no existe, comenzamos en 0
if (saldo === null) {

    saldo = 0;

    localStorage.setItem("saldo", saldo);

}


// Convertimos el saldo a número
saldo = Number(saldo);


// ====================================
// MOSTRAR SALDO
// ====================================

const saldoDisponible =
    document.getElementById("saldoDisponible");


if (saldoDisponible) {

    saldoDisponible.textContent =
        saldo.toLocaleString(
            "es-CL",
            {
                style: "currency",
                currency: "CLP"
            }
        );

}


// ====================================
// CERRAR SESIÓN
// ====================================

const botonCerrarSesion =
    document.getElementById("cerrarSesion");


if (botonCerrarSesion) {

    botonCerrarSesion.addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                "usuarioLogueado"
            );

            window.location.href =
                "login.html";

        }
    );

}


// ====================================
// EFECTO CON JQUERY
// ====================================

$(document).ready(function () {

    $(".action-card")
        .hide()
        .fadeIn(800);

});