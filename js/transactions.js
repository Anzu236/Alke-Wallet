// ======================================
// VERIFICAR INICIO DE SESIÓN
// ======================================

const usuarioLogueado =
    sessionStorage.getItem("usuarioLogueado");


if (usuarioLogueado !== "true") {

    window.location.href = "login.html";

}


// ======================================
// OBTENER SALDO
// ======================================

const saldo =
    Number(localStorage.getItem("saldo")) || 0;


// ======================================
// OBTENER MOVIMIENTOS
// ======================================

const movimientos =
    JSON.parse(
        localStorage.getItem("movimientos")
    ) || [];


// ======================================
// FORMATEAR DINERO
// ======================================

function formatearDinero(valor) {

    return valor.toLocaleString(
        "es-CL",
        {
            style: "currency",
            currency: "CLP"
        }
    );

}


// ======================================
// FORMATEAR FECHA
// ======================================

function formatearFecha(fecha) {

    const fechaMovimiento =
        new Date(fecha);


    return fechaMovimiento.toLocaleString(
        "es-CL",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// ======================================
// MOSTRAR SALDO
// ======================================

const saldoActual =
    document.getElementById("saldoActual");


if (saldoActual) {

    saldoActual.textContent =
        formatearDinero(saldo);

}


// ======================================
// MOSTRAR MOVIMIENTOS
// ======================================

function mostrarMovimientos(tipoFiltro = "todos") {

    // Limpiar lista anterior
    $("#listaMovimientos").empty();


    // ======================================
    // FILTRAR MOVIMIENTOS
    // ======================================

    let movimientosFiltrados =
        movimientos;


    if (tipoFiltro !== "todos") {

        movimientosFiltrados =
            movimientos.filter(
                function (movimiento) {

                    return movimiento.tipo ===
                        tipoFiltro;

                }
            );

    }


    // ======================================
    // SI NO HAY MOVIMIENTOS
    // ======================================

    if (movimientosFiltrados.length === 0) {

        let mensaje =
            "Aún no tienes movimientos registrados.";


        if (tipoFiltro !== "todos") {

            mensaje =
                "No existen movimientos de este tipo.";

        }


        $("#sinMovimientos")
            .text(mensaje)
            .removeClass("d-none")
            .hide()
            .fadeIn();


        return;

    }


    // Ocultar mensaje si sí existen movimientos
    $("#sinMovimientos")
        .addClass("d-none");


    // ======================================
    // ORDENAR MÁS RECIENTES PRIMERO
    // ======================================

    const movimientosOrdenados =
        [...movimientosFiltrados]
            .sort(
                function (a, b) {

                    return (
                        new Date(b.fecha) -
                        new Date(a.fecha)
                    );

                }
            );


    // ======================================
    // CREAR TARJETAS
    // ======================================

    movimientosOrdenados.forEach(
        function (movimiento) {

            // Tarjeta principal
            const tarjeta =
                $("<div>")
                    .addClass(
                        "card shadow-sm mb-3 transaction-card"
                    );


            // Cuerpo de la tarjeta
            const cuerpo =
                $("<div>")
                    .addClass(
                        "card-body d-flex justify-content-between align-items-center gap-3"
                    );


            // Información del movimiento
            const informacion =
                $("<div>");


            // Descripción
            const descripcion =
                $("<h5>")
                    .addClass("mb-1")
                    .text(
                        movimiento.descripcion
                    );


            // Fecha
            const fecha =
                $("<small>")
                    .addClass("text-muted")
                    .text(
                        formatearFecha(
                            movimiento.fecha
                        )
                    );


            informacion.append(
                descripcion,
                fecha
            );


            // ======================================
            // MONTO
            // ======================================

            const monto =
                $("<strong>")
                    .addClass(
                        "fs-5 text-nowrap"
                    );


            // Depósito = ingreso
            if (
                movimiento.tipo ===
                "deposito"
            ) {

                monto
                    .addClass("text-success")
                    .text(
                        "+ " +
                        formatearDinero(
                            movimiento.monto
                        )
                    );

            } else {

                // Retiro y transferencia = egreso
                monto
                    .addClass("text-danger")
                    .text(
                        "- " +
                        formatearDinero(
                            movimiento.monto
                        )
                    );

            }


            // Unimos contenido
            cuerpo.append(
                informacion,
                monto
            );


            tarjeta.append(
                cuerpo
            );


            // Agregamos tarjeta al HTML
            $("#listaMovimientos")
                .append(tarjeta);

        }
    );

}


// ======================================
// MOSTRAR TODOS AL CARGAR
// ======================================

mostrarMovimientos();


// ======================================
// FILTRAR CON JQUERY
// ======================================

$("#filtroTipo").on(
    "change",
    function () {

        const tipoSeleccionado =
            $(this).val();


        $("#listaMovimientos")
            .hide();


        mostrarMovimientos(
            tipoSeleccionado
        );


        $("#listaMovimientos")
            .fadeIn(400);

    }
);