$(document).ready(function(){
    
    
    //Al apretar el botón de login, devolvemos una serie de informaciones
    $('#loginButton').on('click', function(e){
        
        //No se puede iniciar sesión si dejamos campos vacíos en el login
        let empty = $.grep($('#container-login form input'), function(e, index) {
            if(  e.value === '') {
                return e
            } else {

            //Quitar clases warning
            e.classList.remove('warning');
            };
        });

        console.log(empty);

        if(empty.length > 0) {
            error("No pueden haber campos vacíos", true , empty);
        } else {
            error(false);

            let datos = $('#container-login form').serialize();

            handleCredentialResponse(datos);
        }

        

    })

    //Al pulsar el botón de registro, nos llevará a dicha página
    $('#registrarse').on('click', function(){
        window.location.href = "registro.html";
    })

  
})


function handleCredentialResponse(datos = null) {
    $.ajax({
        url: "res/php/sessions/login.php",
        cache: false,
        type: 'POST',
        data: datos,
        success: function(datos) {
         let usuario = $.parseJSON(datos);

         //Si el usuario existe
         if(usuario[0]) {
            
            //Guardamos la info del usuario en una variable
            let tipoUsuario = usuario[1];

            //En función del tipo de usuario, window.location.href nos llevará a un sitio u otro
            switch(tipoUsuario) {
                case '1': tipoUsuario = 'perfil-d';
                break;
                case '2': tipoUsuario = 'perfil-d';
                break;
                case '3': tipoUsuario = 'perfil-c';
                break;
            }
            
            //Añadimos el id del usuario para poder recoger su información en la ventana destino
            window.location.href = tipoUsuario + ".html";

        //Si el usuario no existe
         } else {
            
            $('#aviso').empty().append("El usuario o la contraseña son incorrectos.");
        }
        },
        error: function(xhr) {
            console.log(xhr.statusText + xhr.responseText);
        }

    });

}



//Función para mensaje de error
function error(msj = '', mostrar, inputs = '') {
    //Mostrar o quitar aviso del html
    if(mostrar) {
        $('#aviso').empty().append('<p>'+msj+'</p>');
    } else {
        $('#aviso').empty();
    }

    //Añadir clase warning a input o quitarla
    if(inputs != '') {
        for(let input of inputs) {
            console.log(input);

            input.classList.add("warning");

            
        }
    }
    
    
}