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

let saldo =
    Number(localStorage.getItem("saldo")) || 0;


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
// MOSTRAR SALDO
// ======================================

function mostrarSaldo() {

    const saldoActual =
        document.getElementById("saldoActual");

    if (saldoActual) {

        saldoActual.textContent =
            formatearDinero(saldo);

    }

}


mostrarSaldo();


// ======================================
// OBTENER FORMULARIO
// ======================================

const withdrawForm =
    document.getElementById("withdrawForm");


// ======================================
// FORMULARIO DE RETIRO
// ======================================

if (withdrawForm) {

    withdrawForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // ======================================
            // OBTENER MONTO
            // ======================================

            const inputMonto =
                document.getElementById("montoRetiro");

            const monto =
                Number(inputMonto.value);


            // ======================================
            // VALIDAR MONTO
            // ======================================

            if (
                isNaN(monto) ||
                monto <= 0
            ) {

                $("#mensajeRetiro")
                    .hide()
                    .html(`
                        <div class="alert alert-danger">
                            Debes ingresar un monto válido mayor a $0.
                        </div>
                    `)
                    .fadeIn();

                return;

            }


            // ======================================
            // VALIDAR SALDO DISPONIBLE
            // ======================================

            if (monto > saldo) {

                $("#mensajeRetiro")
                    .hide()
                    .html(`
                        <div class="alert alert-warning">
                            Saldo insuficiente.
                            Tu saldo disponible es
                            <strong>
                                ${formatearDinero(saldo)}
                            </strong>.
                        </div>
                    `)
                    .fadeIn();

                return;

            }


            // ======================================
            // RESTAR RETIRO
            // ======================================

            saldo = saldo - monto;


            localStorage.setItem(
                "saldo",
                saldo
            );


            // ======================================
            // OBTENER MOVIMIENTOS
            // ======================================

            let movimientos =
                JSON.parse(
                    localStorage.getItem("movimientos")
                ) || [];


            // ======================================
            // CREAR MOVIMIENTO
            // ======================================

            const nuevoMovimiento = {

                id: Date.now(),

                tipo: "retiro",

                monto: monto,

                descripcion: "Retiro de dinero",

                fecha: new Date().toISOString()

            };


            // ======================================
            // GUARDAR MOVIMIENTO
            // ======================================

            movimientos.push(
                nuevoMovimiento
            );


            localStorage.setItem(
                "movimientos",
                JSON.stringify(movimientos)
            );


            // ======================================
            // ACTUALIZAR SALDO EN PANTALLA
            // ======================================

            mostrarSaldo();


            // ======================================
            // MENSAJE DE ÉXITO
            // ======================================

            $("#mensajeRetiro")
                .hide()
                .html(`
                    <div class="alert alert-success">
                        Retiro realizado correctamente.
                        Retiraste
                        <strong>
                            ${formatearDinero(monto)}
                        </strong>.
                    </div>
                `)
                .fadeIn();


            // ======================================
            // LIMPIAR FORMULARIO
            // ======================================

            withdrawForm.reset();

        }
    );

}