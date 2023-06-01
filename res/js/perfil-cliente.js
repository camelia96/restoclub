$(document).ready(function(){
    //Comprobamos la SESSION
    $.ajax({
        url: "res/php/sessions/check_session.php",
        cache: false,
        success: function(datos) {
            let check_session = $.parseJSON(datos);
 
            //Si hay sesión y el tipo de usuario es 'Cliente' (3)
            if(check_session[0] &&  check_session[1][0]['tipo'] == 3){
                //Guardamos en variables la información del usuario en caso de que exista
                let idPerfil = check_session[1][0]['id'];

                //Pintamos los datos del perfil
                pintarPerfil(check_session[1][0]);

                //////////VOLCADOS DE DATOS
                /**FAVORITOS / VISITADOS */
                $('#favoritos, #visitados').on('click', function(){
                    let tipo = $(this).attr('id');

                    $('.titulo').empty().append("Restaurantes " + tipo);
                    $('.contenido').empty();


                    $.ajax({
                        url: "res/php/localesClientes.php",
                        data: "getLocales&"+tipo+"&idCliente=" + idPerfil,
                        cache: false,
                        method: 'POST',
                        success: function(datos) {
                            let locales = $.parseJSON(datos);

                            //Si no hay locales, lo indicamos al usuario
                            if(locales.length<1) {
                                $('.contenido').empty().append('<p>Aún no tienes locales '+tipo+'</p>');
                            } else {
                                for(let local of locales) {
                                    pintarLocal(local, tipo);
                                }
                            }
                            
                        },
                        error: function(xhr) {
                            console.log(xhr.statusText + xhr.responseText);
                        }
                
                    });
                })
                
                /**COMENTARIOS */
                $('#comentarios').on('click', function(){
                    $('.titulo').empty().append("Comentarios");
                    $('.contenido').empty();

                    

                    //Volcamos los comentarios del usuario
                    $.ajax({
                        url: "res/php/comentarios.php",
                        cache: false,
                        data: "idPerfil=" + idPerfil,
                        method: 'POST',
                        success: function(datos) {
                            let comentarios = $.parseJSON(datos);

                            //Si no hay comentarios hechos por el usuario, se lo indicamos
                            if(comentarios.length > 0) {
                                //Pasamos los objetos de locales a un array
                                let comentariosArray = Object.keys(comentarios).map(function (key) { return comentarios[key]; });

                                //Hacemos un append con la estructura de paginacion en el html
                                $('.contenido').append(`
                                <div class="comentarios">
                                    <div class="aux-comentarios"></div> 
                                    <div id="data-container"></div>
                                    <div id="pagination-container"></div>
                                </div>  `);

                                //Pagination
                                $('#pagination-container').pagination({
                                    dataSource: comentariosArray, // Conjunto de datos a paginar
                                    
                                    pageSize: 6, // Número de elementos por página
                                    callback: function(data, pagination) {
                                    // Función de devolución de llamada para mostrar los elementos de la página actual
                                    var html = '';

                                    //'data' contiene un array con el total de elementos que queremos mostrar por página, en función de los datos, que vienen de dataSource
                                    $.each(data, function(index, item) {
                                        html += pintarComentario(item);
                                    });

                                    $('.aux-comentarios').html(html);
                                    }
                                });
                            } else {
                                $('.contenido').append("<p>Aún no has publicado comentarios en ningún local.</p>");
                            }
                            
                        },
                        error: function(xhr) {
                            console.log(xhr.statusText + xhr.responseText);
                        }
                
                    });
                })

                //////////BORRADOS
                /**FAVORITOS / VISITADOS */
                $(document).on('click','button[id^="eliminar-"]', function(){

                    console.log("OK");
                    //Separamos en un array el id del botón apretado
                    let id = $(this).attr('id').split('-');

                    //Recogemos en una variable los elementos del array que nos interesen
                    let idRegistro = id[2];
                    let tipo = id[1];
                    let idLocal = id[3];
                    let idCliente = id[4];

                    let tipoParaPhp = '';

                    switch(tipo) {
                        case 'visitados': tipoParaPhp = 'visitadoFalse';
                        break;

                        case 'favoritos': tipoParaPhp = 'favFalse';
                        break;
                    }

                    //Abrimos dialog para confirmar el borrado
                    $('#dialog-borrar').empty().append('<p>¿Seguro que quieres eliminar el local de '+tipo+'? Esta acción no se podrá deshacer</p>');
                    let dialogBorrarComentario = $('#dialog-borrar').dialog({
                        autoOpen: false,
                        modal: true,
                        buttons:{
                            Aceptar: function(){
                            //Enviamos la info a php para borrar el comentario
                            $.ajax({
                                url: "res/php/localesClientes.php",
                                cache: false,
                                data: 'getLocales&'+tipo+'&idLocal=' + idLocal + "&variable=" + tipoParaPhp + "&idCliente=" + idCliente,
                                method: "POST",
                                success: function(datos) {
                                    console.log(datos);
                                    $('.contenido').empty();
                                    let locales = $.parseJSON(datos);

                                    //Si no hay locales, lo indicamos al usuario
                                    if(locales.length<1) {
                                        $('.contenido').empty().append('<p>Aún no tienes locales '+tipo+'</p>');
                                    } else {
                                        for(let local of locales) {
                                            pintarLocal(local, tipo);
                                        }
                                    }
                                    
                            
                                },
                                error: function(xhr) {
                                    console.log(xhr.statusText + xhr.responseText);
                                }

                            });
                                $(this).dialog("close");
                            },
                            Cancelar: function(){
                                $(this).dialog("close");
                            }
                        }
                    })

                    dialogBorrarComentario.dialog("open");
                    
                })
                
                /**COMENTARIOS */
                $(document).on('click','span[id^="eliminarComentario"]', function(){
                    let idComentario = $(this).attr('id').split('-').pop();

                    //Abrimos dialog para confirmar el borrado
                    $('#dialog-borrar').empty().append('<p>¿Seguro que quieres borrar el comentario? Esta acción no se podrá deshacer</p>');
                    let dialogBorrarComentario = $('#dialog-borrar').dialog({
                        autoOpen: false,
                        modal: true,
                        buttons:{
                            Aceptar: function(){
                            //Enviamos la info a php para borrar el comentario
                            $.ajax({
                                url: "res/php/comentarios.php",
                                cache: false,
                                data: 'delete&idComentario=' + idComentario + "&idPerfil=" + idPerfil,
                                method: "POST",
                                success: function(datos) {
                                    $('.contenido').empty();

                                    let comentarios = $.parseJSON(datos);

                                    //Pasamos los objetos de locales a un array
                                    let comentariosArray = Object.keys(comentarios).map(function (key) { return comentarios[key]; });

                                    //Hacemos un append con la estructura de paginacion en el html
                                    $('.contenido').append(`
                                        <div class="aux-comentarios"></div> 
                                        <div id="data-container"></div>
                                        <div id="pagination-container"></div>`);

                                    //Pagination
                                    $('#pagination-container').pagination({
                                        dataSource: comentariosArray, // Conjunto de datos a paginar
                                        
                                        pageSize: 6, // Número de elementos por página
                                        callback: function(data, pagination) {
                                        // Función de devolución de llamada para mostrar los elementos de la página actual
                                        var html = '';

                                        //'data' contiene un array con el total de elementos que queremos mostrar por página, en función de los datos, que vienen de dataSource
                                        $.each(data, function(index, item) {
                                            html += pintarComentario(item);
                                        });

                                        $('.aux-comentarios').html(html);
                                        }
                                    });
                                },
                                error: function(xhr) {
                                    console.log(xhr.statusText + xhr.responseText);
                                }

                            });
                                $(this).dialog("close");
                            },
                            Cancelar: function(){
                                $(this).dialog("close");
                            }
                        }
                    })

                    dialogBorrarComentario.dialog("open");
                    
                })
                




                //////////OTROS
                /**MINITEST */
                $('.test').on('click', function(){
                    window.location.href = 'test.html';
                })

                ////////Cuando editamos perfil
                //Cuando apretamos el botón de 'Editar Perfil'
                $('#perfil button').on('click', function(){
                    //Recogemos el id del usuario
                    let idUsuario = $(this).attr('id');
        
                    //Creamos un dialog con el html que ya está preparado 
                    let dialogEditPerfil = $('#dialog-edit-perfil').dialog({
                    autoOpen: false,
                    height: "auto",
                    width: 550,
                    modal: true,
                    buttons: {
                        Editar: function(){
                        //Recogemos los datos del formulario
                        let dataPerfilEdit = $(' .editPerfil').serialize();
        
                        let editar = false;
        
                        //Validamos que no estén los tres campos vacíos al mismo tiempo (sí que puede haber alguno vacío)
                        let empty = $.grep($('#dialog-edit-perfil input'), function(e, index) {
                            return  e.value === '';
                        });
        
                        if(empty.length == 3) {
                            dialogMensaje("Si deseas editar el perfil has de cambiar al menos un dato.");
                            editar = false;
                        } else {
                            editar = true;
                        }
        
                        //Validamos el mail en caso de que se haya rellenado
                        if($('#emailEdit').val() != '' && !$('#emailEdit').val().match(/\S{3,}@\S{3,}\.\S{2,}/)) {
                            editar = editar && false;
                            dialogMensaje("El formato de mail no es válido.");
                        } 
        
                        
        
                        //Hacemos una conexión a la base de datos para cambiar los datos editados en caso de que todo esté validado
        
                        if(editar) {
                            $.ajax({
                            url: "res/php/editarUsuario.php",
                            type: 'POST',
                            data: dataPerfilEdit + "&idUsuario=" + idUsuario,
                            cache: false,
                            success: function(datos) {
            
                                let usuario = $.parseJSON(datos);
        
                                //El primer elemento del array resultado será true o false, dependiendo de si el nombre de usuario que se ha escogido existe o no en la bbdd
                                if(usuario[0]) {
                                //Cambiamos el nombre en el header
                                $('nav a[href="perfil-c.html"]').empty().html('<i class="fi fi-rr-user"></i>'+usuario[1]['nombreCompleto']);
                                //Cambiamos los datos en el html
                                $('#perfil .nombreCompleto > span').empty().html(usuario[1]['nombreCompleto']);
                                
                                $('#perfil .nombreUsuario > span').empty().html(usuario[1]['nombreUsuario']);
            
                                $('#perfil .email > span').empty().html(usuario[1]['email']);
        
                                //Una vez ha salido todo correcto, reseteamos el formulario
                                $('#dialog-edit-perfil form')[0].reset();
        
                                
                                } else {
        
                                dialogMensaje("El nombre de usuario ya existe. Por favor, escoge otro.");
                                }
                            },  
                            error: function(xhr) {
                                console.log(xhr.statusText + xhr.responseText);
                            }
                        
                            });
                        }
        
                        //Cerramos el dialog
                        $(this).dialog('close');
                        },
                        Cancelar: function(){
                        //Reseteamos el formulario
                        $('#dialog-edit-perfil form')[0].reset();
                        
                        //Cerramos el dialog
                        $(this).dialog('close');
                        }
                    }
                    });
        
                    //Abrimos el dialog
                    dialogEditPerfil.dialog("open");
                    
                    
                })

                ////////Al pulsar un restaurante
                $(document).on('click', 'div[id^="local-"]', function(){
                    let idLocalResultado = $(this).attr('id').split('-').pop();
                    console.log($(this));

                    console.log(idLocalResultado);
                    localStorage.setItem('idLocal', idLocalResultado);
        
                    window.location.href = "local.html";
                    
                })
                
                
            } else {
                $('#perfil').empty().html("No has iniciado sesión");
                $('#container-cliente').empty();
            }
        },
        error: function(xhr) {
            console.log(xhr.statusText + xhr.responseText);
        }

    });

})

function pintarPerfil(perfil) {
    $(`<div>
            <div>
                <div class="nombreCompleto">Nombre Completo<span>`+perfil['nombreCompleto']+`</span> </div>
                <div class="nombreUsuario">Usuario<span>`+perfil['nombreUsuario']+`</span></div>
                <div class="email">E-mail<span>`+perfil['email']+`</span></div>  
                <button class="btn-primario" id="`+perfil['id']+`">Editar perfil</button> 
            </div>
        </div>`).appendTo('#perfil');
}

function pintarLocal(local, tipo) {
    $(`<div class="restaurante" >
            <div id="local-`+ local.idLocal+`"><span id="img-`+ local.id+`"></span></div>
            <div class="eliminarLocal"><button id="eliminar-`+tipo+`-`+local.id+`-`+local.idLocal+`-`+local.idCliente+`"><i class="fi fi-rr-cross-small" ></i></button></div>
            <div id="local-`+ local.idLocal+`"><a href="">`+local.nombre+`</div></a>
            
        </div>`).appendTo('.contenido');
    
    //Definimos background de img-resultado
    $('#img-' + local.id).css({"background-image": "url(res/img/"+local.imagen+")", "background-size": "cover", "background-position": "center"});
}

//Función para formatear fecha
function formatearFecha(fecha) {
    let fechaFormateada = new Date(fecha);
    let d = fechaFormateada.getDate();
    let m =  fechaFormateada.getMonth();
    m += 1;  
    let y = fechaFormateada.getFullYear();

    let h = fechaFormateada.getHours();
    let min = fechaFormateada.getMinutes().toString().padStart(2, '0');
  
    fechaFormateada = d + "/" + m + "/" + y + " - " + h + ":" + min;

    return fechaFormateada;
}

function pintarComentario(comentario) {
    let comentarioDiv = `<div class="comentario">
        <div class="datos-comentario">
            <p>`+comentario.nombreCompleto+`<span id="eliminarComentario-`+comentario.id+`"><i class="fi fi-rr-cross-small"></i></span></p>
            <p>`+formatearFecha(comentario.fecha)+`</p>
        </div>
        <p>`+comentario.comentario+`</p>
    </div>`;

    return comentarioDiv;
}
//Mensaje error
function dialogMensaje(texto) {
    $('#validado').empty().append(texto);
    $( "#validado" ).dialog({
      modal: true,
      height:200,
      width: 350,
      buttons: {
        Ok: function() {
          $( this ).dialog( "close" );
        }
      }
    });
  }