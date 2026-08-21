// ======================================
// CREDENCIALES DE PRUEBA
// ======================================

const usuarioCorrecto = "usuario@alkewallet.cl";
const passwordCorrecta = "1234";


// ======================================
// OBTENER EL FORMULARIO
// ======================================

const loginForm = document.getElementById("loginForm");


// ======================================
// EVENTO INICIAR SESIÓN
// ======================================

loginForm.addEventListener("submit", function (event) {

    // Evita que el formulario recargue la página
    event.preventDefault();


    // Obtener datos ingresados por el usuario
    const email = document
        .getElementById("email")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value
        .trim();


    // Contenedor para mostrar mensajes
    const mensaje = document.getElementById("mensaje");


    // ======================================
    // VALIDAR CAMPOS VACÍOS
    // ======================================

    if (email === "" || password === "") {

        mensaje.innerHTML = `
            <div class="alert alert-warning">
                Debes completar todos los campos.
            </div>
        `;

        return;
    }


    // ======================================
    // VALIDAR CREDENCIALES
    // ======================================

    if (
        email === usuarioCorrecto &&
        password === passwordCorrecta
    ) {

        mensaje.innerHTML = `
            <div class="alert alert-success">
                Inicio de sesión exitoso.
            </div>
        `;


        // Guardamos la sesión
        sessionStorage.setItem(
            "usuarioLogueado",
            "true"
        );


        // Redirigir al menú
        setTimeout(function () {

            window.location.href = "menu.html";

        }, 1000);

    } else {

        mensaje.innerHTML = `
            <div class="alert alert-danger">
                Correo o contraseña incorrectos.
            </div>
        `;

    }

});