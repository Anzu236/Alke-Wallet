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
// FUNCIÓN PARA FORMATEAR DINERO
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
// MOSTRAR SALDO ACTUAL
// ======================================

function mostrarSaldo() {

    const saldoActual =
        document.getElementById("saldoActual");


    if (saldoActual) {

        saldoActual.textContent =
            formatearDinero(saldo);

    }

}


// Ejecutamos la función al cargar la página
mostrarSaldo();


// ======================================
// OBTENER FORMULARIO
// ======================================

const depositForm =
    document.getElementById("depositForm");


// ======================================
// FORMULARIO DE DEPÓSITO
// ======================================

if (depositForm) {

    depositForm.addEventListener(
        "submit",
        function (event) {

            // Evitar que se recargue la página
            event.preventDefault();


            // ======================================
            // OBTENER MONTO
            // ======================================

            const inputMonto =
                document.getElementById("monto");


            const monto =
                Number(inputMonto.value);


            // ======================================
            // VALIDAR MONTO
            // ======================================

            if (
                isNaN(monto) ||
                monto <= 0
            ) {

                $("#mensajeDeposito")
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
            // ACTUALIZAR SALDO
            // ======================================

            saldo = saldo + monto;


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

                tipo: "deposito",

                monto: monto,

                descripcion: "Depósito de dinero",

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
            // MOSTRAR MENSAJE
            // ======================================

            $("#mensajeDeposito")
                .hide()
                .html(`
                    <div class="alert alert-success">
                        Depósito realizado correctamente.
                        <strong>
                            ${formatearDinero(monto)}
                        </strong>
                        fueron agregados a tu billetera.
                    </div>
                `)
                .fadeIn();


            // ======================================
            // LIMPIAR FORMULARIO
            // ======================================

            depositForm.reset();

        }
    );

}