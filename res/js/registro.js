$(document).ready(function(){
    //Tooltip
    $( document ).tooltip();

    let rellenado = false;

    //En una primera instancia, el botón registro estará deshabilitado. Este se habilitará cuando el formulario esté correctamente rellenado
    $('#registrarse').prop('disabled', true);

    //En primer lugar, revisamos que no exista ningún input vacío
    //Al quitar el focus de cada input, hacemos la revisión
    $('#container-registro input').on('focusout', function(){

        rellenado = false;
        //Si hay inputs vacíos, lo indicamos al usuario
        $('input').each(function() {
            if(!$(this).val()) {
                $(this).addClass("warning");
            } else {
                $(this).removeClass("warning");
            }
        });

        //Si hay inputs vacíos
        if ($("input").filter(function () { return $.trim($(this).val()).length == 0 }).length != 0) {
            error("No pueden haber campos vacíos", true);

        //Si no hay un input radio seleccionado
        } else if(!$('input[type="radio"]').is(':checked')) {
            error('Has de seleccionar si eres cliente o dueño.', true);

        //Si el nombre de usuario no tiene mínimo 5 caracteres
        } else if($.trim($('#usuario').val()).length < 5){
            error("El nombre de usuario ha de tener por lo menos 5 caracteres", true, $('#usuario'));
            console.log("OK");

        //Si el formato de mail no es correcto
        }else if(!$('#email').val().match(/\S{3,}@\S{3,}\.\S{2,}/)){
            error("El formato de mail no es correcto", true, $('#email'));

        //Si las condiciones de la contraseña no son correctas
        } else if(!$('#pass').val().match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d.,*^\-_\/()\[\]{}]{6,}$/)) {
            error("La contraseña ha tener mínimo 6 caracteres, mayúsculas, minúsculas y números.", true, $('#pass'));

        //Si las contraseñas no coinciden
        } else if($('#repeat').val() != $('#pass').val()) {
            error("Las contraseñas han de coincidir", true, $('#repeat'));

        } else {
            error(false);
            rellenado = true;

            //El botón 'registro' se deshabilitará cuando rellenado = true
            $('#registrarse').prop('disabled', false);
        }


    })

    //Al clicar en el botón Registrarse
    $(document).on('click', '#registrarse', function(){

        //Si la variable rellenado está a true
        if(rellenado) {
            //Comprobamos por AJAX si el nombre de usuario ya existe en la bbdd
            $.ajax({
                url: "res/php/registro.php",
                success: function(datos) {
                    //Recogemos los usuarios de la base de datos
                    let usuarios = $.parseJSON(datos);

                    let usuarioForm = $('#usuario').val();

                    let emailForm = $('#email').val();

                    let existe = false;

                    //Comprobamos si el usuarioForm que se ha introducido por formulario coincide con alguno de los de la base de datos
                    for(let usuario of usuarios) {

                        //Aunque haya uno solo que coincida, la variable existe se recoge a true
                        console.log(usuario);
                        if(usuario.nombreUsuario == usuarioForm || usuario.email == emailForm) {
                            existe = true;
                        }
                    }

                    //Si no hay ninguno insertamos el usuario
                    if(!existe) {
                        $.ajax({
                            url: "res/php/registro.php",
                            data: "insertar&" + $('#container-registro form').serialize(),
                            method: 'POST',
                            success: function(datos) {
                                dialog("Usuario creado con éxito. Ya puedes iniciar sesión.");
                                
                                //Reseteamos el formulario
                                let form = $('#container-registro form');
                                form[0].reset();
                            },
                            error: function(xhr) {
                                console.log(xhr.statusText + xhr.responseText);
                                
                            }
                        });
                    } else {
                        //Si el nombre de usuario ya existe se lo indicamos al usuario con un dialog
                        dialog("El nombre de usuario/email ya existe. Inténtalo con uno nuevo.")
                    }
                },
                error: function(xhr) {
                    console.log(xhr.statusText + xhr.responseText);
                }
            })
        }
    })


    

    
})

//Función para mensaje de error
function error(msj = '', mostrar, input = '') {
    //Mostrar o quitar aviso del html
    if(mostrar) {
        $('#aviso').empty().append('<p>'+msj+'</p>');
    } else {
        $('#aviso').empty();
    }

    //Añadir clase warning a input o quitarla
    if (input != '') {
        input.addClass("warning");
    }
}

//Función para abrir dialog con mensaje
function dialog(msj) {
    $('#dialog').empty().append("<p>"+msj+"</p>")
    let dialog = $( "#dialog" ).dialog({
        autoOpen: false,
        height: "auto",
        width: "auto",
        modal: true,
        buttons: {
            Aceptar: function(){
                //Cerramos diálogo
                dialog.dialog("close");
            }
        }});
    dialog.dialog("open");

    //dialog.dialog('option', 'title', 'No se ha creado ninguna cuenta')
}