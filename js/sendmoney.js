// ======================================
// VERIFICAR INICIO DE SESIÓN
// ======================================

const usuarioLogueado =
    sessionStorage.getItem("usuarioLogueado");

if (usuarioLogueado !== "true") {
    window.location.href = "login.html";
}


// ======================================
// SALDO
// ======================================

let saldo =
    Number(localStorage.getItem("saldo")) || 0;


// ======================================
// CONTACTOS
// ======================================

let contactos =
    JSON.parse(
        localStorage.getItem("contactos")
    ) || [];


// Contacto elegido para transferir
let contactoSeleccionado = null;


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
// AGREGAR CONTACTO
// ======================================

$("#contactForm").on(
    "submit",
    function (event) {

        event.preventDefault();


        const nombre =
            $("#nombreContacto")
                .val()
                .trim();


        const correo =
            $("#correoContacto")
                .val()
                .trim();


        const alias =
            $("#aliasContacto")
                .val()
                .trim();


        // ======================================
        // VALIDAR CAMPOS
        // ======================================

        if (
            nombre === "" ||
            correo === "" ||
            alias === ""
        ) {

            $("#mensajeContacto")
                .hide()
                .html(`
                    <div class="alert alert-danger">
                        Debes completar todos los campos.
                    </div>
                `)
                .fadeIn();

            return;

        }


        // ======================================
        // EVITAR CORREOS DUPLICADOS
        // ======================================

        const correoExiste =
            contactos.some(
                function (contacto) {

                    return (
                        contacto.correo.toLowerCase() ===
                        correo.toLowerCase()
                    );

                }
            );


        if (correoExiste) {

            $("#mensajeContacto")
                .hide()
                .html(`
                    <div class="alert alert-warning">
                        Ya existe un contacto con ese correo electrónico.
                    </div>
                `)
                .fadeIn();

            return;

        }


        // ======================================
        // CREAR CONTACTO
        // ======================================

        const nuevoContacto = {

            id: Date.now(),

            nombre: nombre,

            correo: correo,

            alias: alias

        };


        // Agregar contacto al arreglo
        contactos.push(nuevoContacto);


        // Guardar contactos
        localStorage.setItem(
            "contactos",
            JSON.stringify(contactos)
        );


        // ======================================
        // MENSAJE DE ÉXITO
        // ======================================

        $("#mensajeContacto")
            .hide()
            .html(`
                <div class="alert alert-success">
                    Contacto agregado correctamente.
                </div>
            `)
            .fadeIn();


        // Limpiar formulario
        this.reset();


        // ======================================
        // CERRAR MODAL
        // ======================================

        setTimeout(
            function () {

                const modalElemento =
                    document.getElementById(
                        "modalContacto"
                    );


                if (modalElemento) {

                    const modal =
                        bootstrap.Modal.getOrCreateInstance(
                            modalElemento
                        );

                    modal.hide();

                }


                $("#mensajeContacto").html("");

            },
            800
        );

    }
);


// ======================================
// BUSCAR CONTACTOS CON JQUERY
// ======================================

$("#buscarContacto").on(
    "input",
    function () {

        const texto =
            $(this)
                .val()
                .trim()
                .toLowerCase();


        // Si vuelve a escribir después de elegir
        // un contacto, anulamos la selección anterior.
        contactoSeleccionado = null;


        $("#contactoSeleccionado")
            .addClass("d-none")
            .empty();


        // Limpiar sugerencias
        $("#sugerenciasContactos")
            .empty();


        // Si está vacío, terminamos
        if (texto === "") {
            return;
        }


        // ======================================
        // FILTRAR CONTACTOS
        // ======================================

        const resultados =
            contactos.filter(
                function (contacto) {

                    return (

                        contacto.nombre
                            .toLowerCase()
                            .includes(texto)

                        ||

                        contacto.correo
                            .toLowerCase()
                            .includes(texto)

                        ||

                        contacto.alias
                            .toLowerCase()
                            .includes(texto)

                    );

                }
            );


        // ======================================
        // SIN RESULTADOS
        // ======================================

        if (resultados.length === 0) {

            $("#sugerenciasContactos")
                .append(
                    $("<div>")
                        .addClass(
                            "list-group-item text-muted"
                        )
                        .text(
                            "No se encontraron contactos."
                        )
                );

            return;

        }


        // ======================================
        // MOSTRAR RESULTADOS
        // ======================================

        resultados.forEach(
            function (contacto) {

                const boton =
                    $("<button>")
                        .attr(
                            "type",
                            "button"
                        )
                        .addClass(
                            "list-group-item list-group-item-action contacto-sugerencia"
                        );


                const nombre =
                    $("<strong>")
                        .text(contacto.nombre);


                const detalle =
                    $("<small>")
                        .addClass(
                            "d-block text-muted"
                        )
                        .text(
                            `${contacto.correo} · ${contacto.alias}`
                        );


                boton.append(
                    nombre,
                    detalle
                );


                boton.data(
                    "contactoId",
                    contacto.id
                );


                $("#sugerenciasContactos")
                    .append(boton);

            }
        );

    }
);


// ======================================
// SELECCIONAR CONTACTO
// ======================================

$("#sugerenciasContactos").on(
    "click",
    ".contacto-sugerencia",
    function () {

        const contactoId =
            $(this).data("contactoId");


        contactoSeleccionado =
            contactos.find(
                function (contacto) {

                    return contacto.id === contactoId;

                }
            );


        if (!contactoSeleccionado) {
            return;
        }


        // Mostrar nombre en buscador
        $("#buscarContacto").val(
            contactoSeleccionado.nombre
        );


        // Limpiar sugerencias
        $("#sugerenciasContactos")
            .empty();


        // Mostrar contacto seleccionado
        $("#contactoSeleccionado")
            .removeClass("d-none")
            .empty()
            .append(

                $("<strong>")
                    .text(
                        "Contacto seleccionado: "
                    ),

                document.createTextNode(
                    contactoSeleccionado.nombre
                ),

                $("<br>"),

                $("<small>")
                    .addClass("text-muted")
                    .text(
                        `${contactoSeleccionado.correo} · ${contactoSeleccionado.alias}`
                    )

            );

    }
);


// ======================================
// REALIZAR TRANSFERENCIA
// ======================================

$("#transferForm").on(
    "submit",
    function (event) {

        event.preventDefault();


        const monto =
            Number(
                $("#montoTransferencia")
                    .val()
            );


        // ======================================
        // VALIDAR CONTACTO
        // ======================================

        if (contactoSeleccionado === null) {

            $("#mensajeTransferencia")
                .hide()
                .html(`
                    <div class="alert alert-warning">
                        Debes seleccionar un contacto.
                    </div>
                `)
                .fadeIn();

            return;

        }


        // ======================================
        // VALIDAR MONTO
        // ======================================

        if (
            isNaN(monto) ||
            monto <= 0
        ) {

            $("#mensajeTransferencia")
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
        // VALIDAR SALDO
        // ======================================

        if (monto > saldo) {

            $("#mensajeTransferencia")
                .hide()
                .html(`
                    <div class="alert alert-warning">
                        Saldo insuficiente.
                        Actualmente tienes
                        <strong>
                            ${formatearDinero(saldo)}
                        </strong>.
                    </div>
                `)
                .fadeIn();

            return;

        }


        // ======================================
        // DESCONTAR DINERO
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

            tipo: "transferencia",

            monto: monto,

            descripcion:
                `Transferencia a ${contactoSeleccionado.nombre}`,

            destinatario:
                contactoSeleccionado.correo,

            fecha:
                new Date().toISOString()

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
        // ACTUALIZAR SALDO
        // ======================================

        mostrarSaldo();


        // ======================================
        // MENSAJE DE ÉXITO
        // ======================================

        $("#mensajeTransferencia")
            .hide()
            .html(`
                <div class="alert alert-success">
                    Transferencia realizada correctamente.
                    <br>
                    Enviaste
                    <strong>
                        ${formatearDinero(monto)}
                    </strong>
                    a
                    <strong>
                        ${contactoSeleccionado.nombre}
                    </strong>.
                </div>
            `)
            .fadeIn();


        // ======================================
        // LIMPIAR FORMULARIO
        // ======================================

        $("#montoTransferencia")
            .val("");


        $("#buscarContacto")
            .val("");


        $("#contactoSeleccionado")
            .addClass("d-none")
            .empty();


        $("#sugerenciasContactos")
            .empty();


        contactoSeleccionado = null;

    }
);