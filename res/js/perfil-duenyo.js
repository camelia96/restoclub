
$(document).ready(function(){
  //Tooltips para formularios
  $( document ).tooltip();


  //Comprobamos la SESSION
  $.ajax({
    url: "res/php/sessions/check_session.php",
    cache: false,
    success: function(datos) {
        let check_session = $.parseJSON(datos);

        //Si hay sesión y el tipo de usuario es 'Cliente' (3)
        if(check_session[0] &&  check_session[1][0]['tipo'] == 2){
        //Guardamos en variables la información del usuario en caso de que exista
        let idDuenyo = check_session[1][0]['id'];

        let nombreCompleto =  check_session[1][0]['nombreCompleto'];

        let nombreUsuario =  check_session[1][0]['nombreUsuario'];

        let email =  check_session[1][0]['email'];


        console.log(check_session);

        //Rellenamos el perfil con los datos
        $('.nombreCompleto > span').empty().append('<span>'+nombreCompleto+'</span>');
        
        $('.nombreUsuario > span').empty().append('<span>'+nombreUsuario+'</span>');
        
        $('.email > span').empty().append('<span>'+email+'</span>');

        $('#perfil button').attr('id', idDuenyo);
        
        
        //Mostrar locales del dueño
        $.ajax({
          url: "res/php/locales.php?duenyo&idDuenyo=" + idDuenyo,
          cache: false,
          type: 'GET',
          success: function(datos) {
            
            let localesDuenyo = jQuery.parseJSON(datos);
                  
            //Si el array localesDuenyo está vacío
            if(localesDuenyo.length == 0) {

              $('#restaurantes').html('<div class="sin-datos">Añade tu primer local</div>');
            } else {

              //Pasamos los objetos de locales a un array
              let localesDuenyoArray = Object.keys(localesDuenyo).map(function (key) { return localesDuenyo[key]; });

              //Pagination
              $('#pagination-container').pagination({
                dataSource: localesDuenyoArray, // Conjunto de datos a paginar
                
                pageSize: 10, // Número de elementos por página
                callback: function(data, pagination) {
                  // Función de devolución de llamada para mostrar los elementos de la página actual
                  var html = '';

                  //'data' contiene un array con el total de elementos que queremos mostrar por página, en función de los datos, que vienen de dataSource
                  $.each(data, function(index, item) {
                    html += pintarLocalDuenyo(item);
                  });

                  $('#restaurantes').html(html);
                }
              });

            }
          },
          error: function(xhr) {
            console.log(xhr.statusText + xhr.responseText);
          }

        });


        ////////////////////////////////////////////////////////////////////////////////////////////////// VER MÁS - LOCALES

        //Dialog - mostrar datos restaurante (Ver más)
        let dialogoMostrar = $( "#dialog-datos" ).dialog({
          autoOpen: false,
          height: "auto",
          width: 1200,
          modal: true,
          buttons: {
            Editar: function(){
              ////////////////////////////////////////////////////////////////////////////////////////////////// EDITAR INPUTS - LOCALES

              //Rellenamos el dialog plantilla para poder editar el formulario
              let dialogEditarInputsLocal = $('#dialog-edit').dialog({
                autoOpen: false,
                height: "auto",
                width: 1200,
                modal: true,
              })

              //Recogemos el id del local
              let idLocal = $(this).data('idLocal');


              //Preparamos los botones
              let botonesEditar = {
                Añadir:function(){

                  
                  //Validamos los datos igual que hemos hecho a la hora de añadir un local
                  let validado = true;

                  //Validamos menu y web sólo si han sido rellenados por el usuario
                  if( $('#dialog-edit #webFormEdit').val() != '' && $('#dialog-edit #webFormEdit').val().length > 0) {
                    let webValidacion = checkIsURL($('#webFormEdit'));
                    console.log(webValidacion);

                    if(!webValidacion) {

                      dialogMensaje("El formato de la web no es correcto");
                      $('#webFormEdit').addClass( "ui-state-error" );
                    } else {

                      $('#webFormEdit').removeClass( "ui-state-error" );
                    }

                    validado = validado && webValidacion;
                  }

                  

                  if( $('#dialog-edit #menuFormEdit').val() != '' && $('#dialog-edit #menuFormEdit').val().length > 0) {

                    let menuValidacion = checkIsURL($('#menuFormEdit'));

                    if(!menuValidacion) {
                      dialogMensaje("El formato del menú no es correcto");
                      $('#menuFormEdit').addClass( "ui-state-error" );
                    } else {

                      $('#menuFormEdit').removeClass( "ui-state-error" );
                    }

                    validado = validado && menuValidacion;
                  }

                  //Validamos la longitu/ latitud
                  let longEdit = $('#dialog-edit #longFormEdit');
                  let latEdit = $('#dialog-edit #latFormEdit');


                  validado = validado && checkLongLat(longEdit);
                  validado = validado && checkLongLat(latEdit);

                  
                  //En caso de que todo esté validado
                  if(validado) {

                    //Si la longitud/latitud contiene una coma, la reemplazamos por un punto
                    if(longEdit.val().includes(',')) {
                      longEdit.val(longEdit.val().replace(',', '.'));
                    }
  
                    if(latEdit.val().includes(',')) {
                      latEdit.val(latEdit.val().replace(',', '.'));
                    }

                    /* Recogemos los inputs y los convertimos en array */
                    let inputsNoEmpty = ($('#dialog-edit input').toArray());

                    //Filtramos en un nuevo array todos aquellos que estén vacíos y que no sean ni menu, ni red social, ni web, ya que estos tres serán opcionales
                    let empty = $.grep(inputsNoEmpty, function(e, index) {
                      return  e.value == '' && (e.id != 'webFormEdit' && e.id != 'red_socialFormEdit' && e.id != 'menuFormEdit' );
                    });

                    console.log(empty);
                    //Si en el array existen vacíos, se avisa al usuario, en caso contrario se inserta local
                    if (empty.length > 0) {
                      dialogMensaje('Los campos obligatorios no pueden estar vacíos');
                    } else {

                      //Preparamos la cadena con los datos a pasar a php
                      let dataEdit = $('#dialog-edit form').serialize() + "&idLocal=" + idLocal + "&idDuenyo=" + idDuenyo;


                      
                      //Si la categoria es 1, añadimos también el tipo de restaurante a los valores a editar, que en un principio no nos interesaba recoger en el serialize
                      /*if(dataEdit.includes('categoriaFormEdit=1')) {
                        dataEdit = dataEdit + "&tipoFormEdit=" + $('#tipoFormEdit').val();
                      }*/


                      //Si no hay inputs vacíos, se edita en php el local
                      $.ajax({
                        url: "res/php/editarLocal.php",
                        type: 'POST',
                        data: dataEdit,
                        cache: false,
                        success: function(datos) {
                          let localesDuenyo = jQuery.parseJSON(datos);
                          $('#restaurantes').empty();

                          
                          //Pasamos los objetos de locales a un array
                          let localesDuenyoArray = Object.keys(localesDuenyo).map(function (key) { return localesDuenyo[key]; });

                          //Pagination
                          $('#pagination-container').pagination({
                            dataSource: localesDuenyoArray, // Conjunto de datos a paginar
                            
                            pageSize: 10, // Número de elementos por página
                            callback: function(data, pagination) {
                              // Función de devolución de llamada para mostrar los elementos de la página actual
                              var html = '';

                              //'data' contiene un array con el total de elementos que queremos mostrar por página, en función de los datos, que vienen de dataSource
                              $.each(data, function(index, item) {
                                html += pintarLocalDuenyo(item);
                              });

                              $('#restaurantes').html(html);
                            }
                          });          
                        },
                        error: function(xhr) {
                          console.log(xhr.statusText + xhr.responseText);
                        }
                    
                      });
                      $(this).dialog('close');
                      
                    }
                  }
                  

                  

                  
                },
                Cancelar: function(){
                  $(this).dialog('close');
                }
              }

              dialogEditarInputsLocal.dialog('option', 'buttons', botonesEditar);

              dialogEditarInputsLocal.dialog("open");

              //Volvemos a pintar el contenido, esta vez sustituyendo las etiquetas p por inputs
              $.ajax({
                url: "res/php/locales.php?local&idLocal=" + idLocal + "&idDuenyo=" + idDuenyo,
                type: 'GET',
                cache: false,
                success: function(datos) {
                  let local = jQuery.parseJSON(datos);
                  pintarLocalDuenyoVerMasEdit(local[0]);
                  
                },
                error: function(xhr) {
                    console.log(xhr.statusText + xhr.responseText);
                }
            
              });
          
              dialogoMostrar.dialog( "close" );
            },
            Cancelar: function() {
                dialogoMostrar.dialog( "close" );
            }
          }
        });



        //Cuando apretamos ver más
        $(document).on('click', 'button[id^="editar"]', function(){
          //Abrimos dialog
          dialogoMostrar.dialog( "open" );
          
          //Recogemos el id del local 
          let idLocal = $(this).attr('id').split('-').pop();

          //Lo preparamos para poder pasarlo entre dialogs
          dialogoMostrar.data('idLocal', idLocal);

          //Volcamos la info
          $.ajax({
            url: "res/php/locales.php?local&idLocal=" + idLocal + "&idDuenyo=" + idDuenyo,
            type: 'GET',
            cache: false,
            success: function(datos) {
              $('#dialog-datos').empty();
              let local = jQuery.parseJSON(datos);
              pintarLocalDuenyoVerMas(local[0]);
              
            },
            error: function(xhr) {
                $("#restaurantes").append(xhr.statusText + xhr.responseText);
            }
        
          });
        })


        ////////////////////////////////////////////////////////////////////////////////////////////////// INSERTAR LOCALES
        //Relleno de selects del formulario para insertar
        //Gamas
        rellenoSelect('gama');

        //Provincias
        rellenoSelect('provincia');

        //Tipos restaurante
        rellenoSelect('tipo');

        //Categorias
        rellenoSelect('categoria');

        //Dialog - añadir eventos 
        let dialogEvento = $( "#dialog-evento" ).dialog({
          autoOpen: false,
          height: "auto",
          width: 800,
          modal: true,
          buttons: {
            Añadir: function(){
              //Si el usuario quiere añadir los eventos, éstos se serializan y se pasan con la funcion data() al dialog de añadir local
              let eventos = $('#dialog-evento form').serializeArray();
              
              if(notEmpty(eventos)){
                $(this).data('eventos', eventos);
              
                dialogEvento.dialog( "close" );
              }


              
            },
            Reset:function() {
              $('#dialog-confirm p').html('¿Seguro que quieres resetear los eventos del formulario? No se añadirán al insertar un local en la Base de Datos');
              $('#dialog-confirm').dialog({
                resizable: false,
                height: "auto",
                width: 600,
                modal: true,
                buttons: {
                  Confirmar: function() {
                    //Si el usuario confirma el borrado, se resetea el formulario, se borran los inputs adicionales y la variable 'eventos' se pasa sin datos
                    $('#dialog-evento form')[0].reset();
                    $('#dialog-evento form p').html('');

                    dialogEvento.data('eventos', '');
                    $( this ).dialog( "close" );
                  },
                  Cancelar: function() {
                    $( this ).dialog( "close" );
                  }
                }
              })
              dialogEvento.dialog( "close" );
            },
            Cancelar: function(){
              $(this).dialog("close");
            }
          }
          });


        //Dialog - añadir promociones 
        let dialogPromo = $( "#dialog-promo" ).dialog({
          autoOpen: false,
          height: "auto",
          width: 800,
          modal: true,
          buttons: {
            Añadir: function(){
              //Si el usuario quiere añadir los eventos, éstos se serializan y se pasan con la funcion data() al dialog de añadir local
              let promociones = $('#dialog-promo form').serializeArray();

              if(notEmpty(promociones)){

                $(this).data('promociones', promociones);
                dialogPromo.dialog( "close" );
            
              }
            },
            Reset:function() {
              $('#dialog-confirm p').html('¿Seguro que quieres resetear las promociones del formulario? No se añadirán al insertar un local en la Base de Datos');
              $('#dialog-confirm').dialog({
                resizable: false,
                height: "auto",
                width: 600,
                modal: true,
                buttons: {
                  Confirmar: function() {
                    //Si el usuario confirma el borrado, se resetea el formulario, se borran los inputs adicionales y la variable 'promociones' se pasa sin datos
                    $('#dialog-promo form')[0].reset();
                    $('#dialog-promo form p').html('');
                    dialogPromo.data('promociones', '');
                    $( this ).dialog( "close" );
                  },
                  Cancelar: function() {
                    $( this ).dialog( "close" );
                  }
                }
              })
              dialogPromo.dialog( "close" );
            },
            Cancelar: function(){
              $(this).dialog("close");
            }
          }
          });


        //Dialog - insertar local - 
        let dialogForm = $( "#dialog-form").dialog({
            autoOpen: false,
            height: "auto",
            width:"80%",
            modal: true,
            buttons: {
                Añadir: function(){
                  

                  //Recogemos los datos para dialog insert
                  let form = $('#dialog-form .datos > form'), datosInsertar = form.serialize();
                  //Si se recogen inputs sin val(), es para validar los datos
                  let menu = $('#menuForm'), web = $('#webForm'), long = $('#longForm'), lat = $('#latForm'), cp = $('#cpForm');

                  //Recogemos también eventos y promociones, que nos llegan serializados desde sus respectivos dialogs
                  let eventos = JSON.stringify(dialogEvento.data('eventos'));


                  let promociones = JSON.stringify(dialogPromo.data('promociones'));
    
                  
                  let validado = true;
                  

                  
                  //Validamos cp sólo si han sido rellenados por el usuario
                  if( cp.val() != '' && cp.val().length > 0) {
                    validado = validado && checkInt(cp);

                  }

                    
                  //Validamos menu y web sólo si han sido rellenados por el usuario
                  if( web.val() != '' && web.val().length > 0) {
                    validado = validado && checkIsURL(web);

                  }

                  if( menu.val() != '' && menu.val().length > 0) {
                    validado = validado && checkIsURL(menu);

                  }


                  //Validamos longitud y latitud
                  validado = validado && checkLongLat(long);
                  validado = validado && checkLongLat(lat);

                  //Si la longitud/latitud contiene una coma, la reemplazamos por un punto
                  if(long.val().includes(',')) {
                    long.val(long.val().replace(',', '.'));
                  }

                  if(lat.val().includes(',')) {
                    lat.val(lat.val().replace(',', '.'));
                  }

                  //Los añadimos a la variable de datos a Insertar
                  datosInsertar = datosInsertar + "&longForm=" + long.val() + "&latForm=" + lat.val();
                  
                  //Añadimos las opciones escogidas de los select del formulario al serialize() que hemos recogido antes
                  //Añadimos los checkboxes -> Tipos de pagos/ Dietas
                  let opcionesChecked = JSON.stringify($('input[type="checkbox"]:checked').serialize());

                  if(!opcionesChecked) {
                    datosInsertar = datosInsertar + opcionesChecked;
                  }

                  //Si la categoria es restaurante, añadimos el tipoForm a datosInsertar
                  /*if($('#categoriaForm').val() == 1) {
                    datosInsertar = datosInsertar + "&tipoForm=" + $('#dialog-form form #tipoForm').val();
                  }*/

                  
                  //Si hay eventos, los datos a insertar tendrán dicha variable
                  if(typeof eventos !== 'undefined') {
                    datosInsertar = datosInsertar  + "&eventos=" + eventos;
                  }

                  
                  
                  //Si hay promociones, los datos a insertar tendrán dicha variable
                  if( typeof promociones !== 'undefined' ) {
                    datosInsertar = datosInsertar  + "&promociones=" + promociones;
                  }

                  //Preparamos un formData para enviar imagenes a php
                  let imgData = new FormData();

                  //Añadimos al formData las variables extra necesarias
                  imgData.append("insertar", "insertar");
                  imgData.append("idDuenyo", idDuenyo);


                  //Recogemos las imágenes y las añadimos al formData
                  let imagenes = dialogAddImg.data('imagenesArrayFile');

                  console.log(imagenes);

                  if(typeof imagenes === 'undefined' || imagenes.length < 1) {
                    dialogMensaje("Has de insertar al menos una imagen.");
                    validado = validado && false;
                  } else {
                    validado = validado && true;
                    $.each(imagenes, function(i, file) {
                      imgData.append('files[]', file);
                    });
                  }
                  
                  

                  /* Recogemos los inputs que nos interesan que no estén vacíos (los 11 primeros) y los convertimos en array */
                  let inputsNoEmpty = ($('#dialog-form input:not(input[id^="fecha"], input[id^="evento"],input[id^="promo"])').toArray().slice(0, 11));

                  //Filtramos en un nuevo array todos aquellos que estén vacíos y que no sean ni menu, ni red social, ni web, ya que estos tres serán opcionales
                  let empty = $.grep(inputsNoEmpty, function(e, index) {
                    return  e.value == '' && (e.id != 'webForm' && e.id != 'red_socialForm' && e.id != 'menuForm' );
                  });


                  //Si en el array existen vacíos, se avisa al usuario, en caso contrario se inserta local
                  if (empty.length > 0) {
                    console.log(empty);
                    dialogMensaje('Los campos obligatorios no pueden estar vacíos');
                  } else {
                    //Volvemos a checar que esté validado y si es así realizamos el ajax con la inserción de datos
                    if(validado){
                      
                      $.ajax({
                        url: "res/php/insertarLocal.php",
                        type: 'POST',
                        data: datosInsertar + "&idDuenyo=" + idDuenyo,
                        cache: false,
                        success: function(datos) {

                          //Una vez insertados los datos del local, hacemos un nuevo ajax para insertar las imágenes
                          $.ajax({
                            url: "res/php/insertarImagenes.php",
                            type: 'POST',
                            data: imgData,
                            enctype: 'multipart/form-data', 
                            processData: false, 
                            contentType: false,
                            cache: false,
                            success: function(datos) {
                              $('#restaurantes').empty();
                              
                              let localesDuenyo = jQuery.parseJSON(datos);
                  
                              //Si el array localesDuenyo está vacío
                              if(localesDuenyo.length == 0) {

                                $('.sin-datos').html('Añade tu primer local');
                              } else {

                                
                              //Pasamos los objetos de locales a un array
                              let localesDuenyoArray = Object.keys(localesDuenyo).map(function (key) { return localesDuenyo[key]; });

                              //Pagination
                              $('#pagination-container').pagination({
                                dataSource: localesDuenyoArray, // Conjunto de datos a paginar
                                
                                pageSize: 10, // Número de elementos por página
                                callback: function(data, pagination) {
                                  // Función de devolución de llamada para mostrar los elementos de la página actual
                                  var html = '';

                                  //'data' contiene un array con el total de elementos que queremos mostrar por página, en función de los datos, que vienen de dataSource
                                  $.each(data, function(index, item) {
                                    html += pintarLocalDuenyo(item);
                                  });

                                  $('#restaurantes').html(html);
                                }
                              });

                              }

                              //Reseteamos el form e inputs necesarios
                              let forms = $('form').toArray();
                              for(let form of forms) {
                                form.reset();
                              }

                              
                              $('input[name="files[]"]').val('');

                              $('output').empty();

                            },
                            error: function(xhr) {
                                $("#validado").append(xhr.statusText + xhr.responseText);
                            }
                        
                          });
                          
                        },
                        error: function(xhr) {
                            $("#validado").append(xhr.statusText + xhr.responseText);
                        }
                    
                      });

                      $(this).dialog('close');

                    }  
                    
                  }
                  
                },
                Cancelar: function() {

                  $('#dialog-confirm p').html('¿Seguro que quieres cancelar? Perderás los datos que estabas preparando');
                  $('#dialog-confirm').dialog({
                    resizable: false,
                    height: "auto",
                    width: 600,
                    modal: true,
                    buttons: {
                      Confirmar: function() {
                        //Si el usuario confirma el borrado, se resetea el formulario y se borran los datos de 'Añadir eventos','Añadir promociones','Añadir imágenes'
                        $('#dialog-form form')[0].reset();

                        console.log($('#dialog-promo form > p'));
                        $('#dialog-promo form')[0].reset();
                        dialogPromo.data('promociones', '');


                        $('#dialog-evento form')[0].reset();
                        dialogEvento.data('eventos', '');

                        
                        $('#dialog-add-img form')[0].reset();


                        $('#dialog-add-img output').empty();

                        dialogAddImg.data('imagenesArrayFile', '');

                        $( this ).dialog( "close" );

                        dialogForm.dialog( "close" );
                        
                        
                      },
                      Cancelar: function() {
                        $( this ).dialog( "close" );

                      }
                    }
                  })

                }
            }
          });



        //Dialog añadir imágenes
        let dialogAddImg = $( "#dialog-add-img" ).dialog({
          autoOpen: false,
          height: "auto",
          width: 1000,
          modal: true,
          buttons: {
            Añadir: function(){
              
              dialogAddImg.dialog( "close" );
            },
            Cancelar:function() {
              $('#dialog-confirm p').html('¿Seguro que salir? Perderás la galería de imágenes seleccionadas para insertar a la base de datos');
              $('#dialog-confirm').dialog({
                resizable: false,
                height: "auto",
                width: 600,
                modal: true,
                buttons: {
                  Confirmar: function() {
                    //Si el usuario confirma el borrado, se resetea el formulario, se borran los inputs adicionales y la variable 'promociones' se pasa sin datos
                    $('#dialog-add-img form')[0].reset();

                    $('#dialog-add-img form p').html('');

                    $('#dialog-add-img output').empty();

                    dialogAddImg.data('imagenesArrayFile', '');

                    $( this ).dialog( "close" );
                    dialogAddImg.dialog( "close" );

                  },
                  Cancelar: function() {
                    $( this ).dialog( "close" );
                  }
                }
              })
            }
          }
          });



        ////////////////////////////////////////////////////////////////////////////////////////////////// BOTONES
        //Al pulsar el nombre de un restaurante, nos lleva al html del local
        $(document).on('click', 'a[id^="local-"]', function(){
          let idLocalResultado = $(this).attr('id').split('-').pop();
          localStorage.setItem('idLocal', idLocalResultado);

          window.location.href = "local.html";
          
        })


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
                        $('nav a[href="perfil-d.html"]').empty().html('<i class="fi fi-rr-user"></i>'+usuario[1]['nombreCompleto']);
                        //Cambiamos los datos en el html
                        $('#perfil .nombreCompleto > span').empty().html(usuario[1]['nombreCompleto']);
                        
                        $('#perfil .nombreUsuario > span').empty().html(usuario[1]['nombreUsuario']);
  
                        $('#perfil .email > span').empty().html(usuario[1]['email']);

                        //Una vez ha salido todo correcto, reseteamos el formulario
                        $('#dialog-edit-perfil form')[0].reset();

                        
                      } else {

                        dialogMensaje("El nombre de usuario/email ya existe. Por favor, escoge otro.");

                        
                        $('#dialog-edit-perfil form')[0].reset();
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

        //Cuando eliminamos local (No se elimina, sino que la columna 'cancelado' se cambia a true. Los datos no se borran de la BBDD)
        $(document).on('click', 'button[id^="eliminar-"]', function(){

          //Recogemos el id del local que se encuentra en el botón
          let idLocal = $(this).attr('id').split('-').pop();
          
          //Dialog confirmación
          $('#dialog-confirm p').html('¿Estás seguro de que quieres eliminar el local? Esta acción no se puede deshacer.');
                  
          $('#dialog-confirm').dialog({
            resizable: false,
            height: "auto",
            width: 600,
            modal: true,
            buttons: {
              Eliminar: function(){

                //Conexión a la base de datos
                $.ajax({
                  url: "res/php/deleteLocal.php",
                  type: 'POST',
                  data: "idLocal="+idLocal + "&idDuenyo=" + idDuenyo,
                  cache: false,
                  success: function(datos) {
                    $('#restaurantes').empty();

                    let localesDuenyo = jQuery.parseJSON(datos);
        
                    //Si el array localesDuenyo está vacío
                    if(localesDuenyo.length == 0) {

                      $('.sin-datos').html('Añade tu primer local');
                    } else {

                      //Pasamos los objetos de locales a un array
                      let localesDuenyoArray = Object.keys(localesDuenyo).map(function (key) { return localesDuenyo[key]; });

                      //Pagination
                      $('#pagination-container').pagination({
                        dataSource: localesDuenyoArray, // Conjunto de datos a paginar
                        
                        pageSize: 10, // Número de elementos por página
                        callback: function(data, pagination) {
                          // Función de devolución de llamada para mostrar los elementos de la página actual
                          var html = '';

                          //'data' contiene un array con el total de elementos que queremos mostrar por página, en función de los datos, que vienen de dataSource
                          $.each(data, function(index, item) {
                            html += pintarLocalDuenyo(item);
                          });

                          $('#restaurantes').html(html);
                        }
                      });

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

              }}
            }
          )
        });

        //Cuando apretamos el botón insertar
        $('.anyadir').on('click', function(){
          dialogForm.dialog( "open" );

          dialogForm.dialog('option', 'title', 'Insertar local');
        })


        //Creamos un input change para el select de categoria. Si seleccionamos Restaurante, saldrá también el tipo. Sino, lo esconderemos -- FORMULARIO INSERTAR 
        $(document).on('change', '#categoriaForm', function() {
          if($('#categoriaForm').val() == 1) {
            $('#tipoForm, label[for="tipoForm"]').show();
          } else {
            $('#tipoForm, label[for="tipoForm"]').hide();

          }
        })


        //Creamos un input change para el select de categoria. Si seleccionamos Restaurante, saldrá también el tipo. Sino, lo esconderemos -- FORMULARIO EDITAR 
        $(document).on('change', '#categoriaFormEdit', function() {
          
          if($('#categoriaFormEdit').val() == 1) {
            
            $('#tipoFormEdit, label[for="tipoFormEdit"]').show();
          } else {
            $('#tipoFormEdit, label[for="tipoFormEdit"]').hide();

          }
        })

        //Cuando apretamos el botón añadir evento
        $('.anyadirEventos').on('click', function(e){
          e.preventDefault();
          dialogEvento.dialog( "open" );
        });


        //Cuando apretamos el botón añadir promociones
        $('.anyadirPromociones').on('click', function(e){
          e.preventDefault();
          dialogPromo.dialog( "open" );

        });

        //Cuando apretamos el botón añadir imágenes
        $('.anyadirImagenes').on('click', function(e){
          //Prevent default para que no se reinicie la página
          e.preventDefault();
          dialogAddImg.dialog( "open" );
          
          /*Al cambiar de estado el input, es decir, al añadir imágenes en el input, 
          se guardan en un array y se crea un div por cada imagen en la etiqueta output*/
          const output = $("#dialog-add-img output");
          const input = $("#dialog-add-img input");
          let imagesArray = [];

          
          input.on('change', function(){
            const files =  this.files;

            //Si alguna de las imágenes supera los 8MB
            let superan8MB = $.grep(files, function(file){
              return file.size >= 8*1024*1024;
            })
            
            
            if(superan8MB.length > 0) {
              dialogMensaje("No puedes subir archivos que pesen más de 2MB");
            } else {


                //Si no supera el peso total, realizamos las acciones necesarias para pasar las imágenes al servidor
                for(let i=0; i<files.length; i++) {
                  imagesArray.push(files[i])
                  
                }

                mostrarImagenes(imagesArray, output);
                dialogAddImg.data('imagenesArrayFile', imagesArray);

                console.log(dialogAddImg.data('imagenesArrayFile'));
              
              
            }
            


          })
          
          
          //Borrar las imágenes de la galería (antes de subirlas) al hacer click en x de cada img
          $(document).on('click', 'span[id^="borrarImgMostrada"]', function(){
            let index = $(this).attr('id').split('-').pop();
            imagesArray.splice(index, 1);
            mostrarImagenes(imagesArray, output);
            dialogAddImg.data('imagenesArrayFile', imagesArray);
          })

        });

        //Añadir input evento/ añadir input promocion --> dialog insertar
        $('.addInputEvento').on('click', function(){
          console.log($('#dialog-evento form').serialize());
          anyadirInput('evento');
        })

        $('.addInputPromo').on('click', function(){
          anyadirInput('promo');
        })

        //Eliminar input promocion/ evento --> dialog Insertar
        $(document).on('click', ' i[id^=eliminarEvento-],i[id^=eliminarPromo-]', function(){
          $(this).parents('p').remove()
        })
            
        //Cuando apretamos el botón editar imagenes
        $(document).on('click','button[id^=imgs-]' ,function(){
            let nombreLocal = ($(this).parents('.restaurante').children().find('a')[0]).innerHTML;

            
            
            let dialogEditImgs = $('#dialog').dialog({
              autoOpen: false,
              height: "auto",
              width: 1200,
              modal: true
            });


            //Añadimos el título del nombre del local al dialog
            dialogEditImgs.dialog('option', 'title', nombreLocal);

            let dialogEditImgsButtons = {
              'Insertar imágenes': function(){
                //Recogemos las imágenes guardadas en el dialog de añadir imágenes
                let imagenesGuardarEdit= dialogAddImg.data('imagenesArrayFile');

    
                if(imagenesGuardarEdit) {
                  
                  //Si existen las imágenes, las metemos en un formdata para pasarlas a php
                  let imgDataEdit = new FormData();

                  //Añadimos al formData las variables extra necesarias
                  
                  imgDataEdit.append("editar", "editar");
                  imgDataEdit.append("idDuenyo", idDuenyo);
                  imgDataEdit.append("idLocal", idLocal);

                  //Volvemos a comprobar las imágenes para estar seguros de que se pasan correctamente
                  if(typeof imagenesGuardarEdit != 'undefined' || imagenesGuardarEdit.length > 0) {
                    $.each(imagenesGuardarEdit, function(i, file) {
                      imgDataEdit.append('files[]', file);
                    });



                    //Accedemos a la bbdd para guardar las imágenes
                    $.ajax({
                      url: "res/php/insertarImagenes.php",
                      type: 'POST',
                      data: imgDataEdit,
                      enctype: 'multipart/form-data', 
                      processData: false, 
                      contentType: false,
                      cache: false,
                      success: function(datos) {
                        
                      },  
                      error: function(xhr) {
                          console.log(xhr.statusText + xhr.responseText);
                      }
                  
                    }); 
                  } 
                }

                //Input file se resetea
                $('input[name="files[]"]').val('');
                $('output').empty();
                dialogMensaje("Cambios guardados con éxito");

                //Galería de imágenes se resetea
                dialogAddImg.data('imagenesArrayFile', '');
                
                //Si el usuario confirma el borrado, se resetea el formulario, se borran los inputs adicionales y la variable 'promociones' se pasa sin datos
                $('#dialog-add-img form')[0].reset();

                $('#dialog-add-img form p').html('');

                $('#dialog-add-img output').empty();

                dialogAddImg.data('imagenesArrayFile', '');

                console.log(dialogAddImg.data('imagenesArrayFile'));
                console.log($('#dialog-add-img output div'));


                $(this).dialog("close");
              },
              Cancelar: function(){
                $( this ).dialog( "close" );

                /*
                $('#dialog-confirm p').html('¿Seguro que quieres cancelar? Perderás las imágenes preparadas para añadir.');
                $('#dialog-confirm').dialog({
                  resizable: false,
                  height: "auto",
                  width: 600,
                  modal: true,
                  buttons: {
                    Confirmar: function() {
                      //Si el usuario confirma el borrado se borra la galería de imágenes
                      $('#dialog-add-img form')[0].reset();

                      $('#dialog-add-img output').empty();

                      $(this).data('imagenesArrayFile', '');

                      $( this ).dialog( "close" );

                      dialogEditImgs.dialog("close");
                    },
                    Cancelar: function() {
                      $( this ).dialog( "close" );
                    }
                  }
                })*/

              }
            }

            dialogEditImgs.empty();

            //Creamos la estructura html que nos interese para mostrar las imágenes existentes del local
            $('#dialog').append(`
            <h6>Imágenes del local</h6>
            <output class="imagenesLocal"> </output>
            
            <div class="div-anyadir-img">
                <button class="anyadirImagenesEdit btn-secundario">Seleccionar imágenes</button>
                <p class="recordatorio">*Recuerda que las imágenes seleccionadas no se guardarán en la base de datos hasta que hagas click en el botón "Insertar imágenes"</p>
            </div>`);


            //Recogemos el id del local
            let idLocal = $(this).attr('id').split('-').pop();

            //Recogemos el output para mostrar posteriormente las imágenes
            $(document).ready(function(){

              //Sacamos de la base de datos las imágenes del local seleccionado
              $.ajax({
                url: "res/php/imagenes.php?id=" + idLocal,
                cache: false,
                type: 'GET',
                success: function(datos) {
                  
                  let imagenes = jQuery.parseJSON(datos);

                  //Por cada imagen creamos un div con un botón para poder eliminarlo
                  for(let imagen of imagenes) {
                    $(`<div class="imgPreparada">
                        <img src="res/img/`+imagen['imagen']+`" alt="image">
                        <span id="borrarEditImgMostrada-`+imagen['id']+`">&times;</span>
                      </div>`).appendTo('.imagenesLocal');
                  }


                },
                error: function(xhr) {
                    $("#restaurantes").append(xhr.statusText + xhr.responseText);
                }

              });

              //Manejamos el borrado de cada imagen que ya existe en la base de datos
              $(document).on('click', 'span[id^="borrarEditImgMostrada-"]', function(){
                //Recogemos el id del regstro de la imagen
                let registroImagen = $(this).attr('id').split('-').pop();

                //Recogemos la cantidad de imágenes que tiene la galería. Si es menor a dos, no dejamos realizar el borrado
                let cantidadImagenesGaleria = $('.imagenesLocal > .imgPreparada').length;

                if(cantidadImagenesGaleria < 2) {
                  dialogMensaje("El local no puede tener menos de 1 imagen. Añade una imagen y repite el borrado.");
                  
                } else {

                  //Dialog confirmación
                  $('#dialog-confirm p').html('¿Estás seguro? La imagen se borrará definitivamente de la base de datos. Esta acción no se puede deshacer.');
                  
                  $('#dialog-confirm').dialog({
                    resizable: false,
                    height: "auto",
                    width: 600,
                    modal: true,
                    buttons: {
                      'Borrar imagen': function() {
                        //Si el usuario confirma el borrado, se realiza un delete del php
                        $.ajax({
                          url: "res/php/deleteImagen.php?idLocal=" + idLocal + "&idImagen=" + registroImagen,
                          cache: false,
                          type: 'GET',
                          success: function(datos) {

                            $(document).ready(function(){
                              $('.imagenesLocal').empty();
                            });
                            let imagenes = jQuery.parseJSON(datos);
              
                            //Por cada imagen creamos un div con un botón para poder eliminarlo
                            for(let imagen of imagenes) {
                              $(`<div class="imgPreparada">
                                  <img src="res/img/`+imagen['imagen']+`" alt="image">
                                  <span id="borrarEditImgMostrada-`+imagen['id']+`">&times;</span>
                                </div>`).appendTo('.imagenesLocal');
                            }
              
              
                          },
                          error: function(xhr) {
                              $("#restaurantes").append(xhr.statusText + xhr.responseText);
                          }
              
                        });
                        $(this).dialog("close");
                      },
                      Cancelar: function(){
                        $(this).dialog("close");

                      }
                    }
                  })
                }
              }) 
            })
            

            //Añadimos al dialog en el que nos encontramos los botones correspondientes y lo abrimos para el usuario
            dialogEditImgs.dialog('option', 'buttons', dialogEditImgsButtons);

            dialogEditImgs.dialog("open");

            //Al abrir el diálogo para añadir imágenes
            $(document).on('click', '.anyadirImagenesEdit',  function(){
              dialogAddImg.dialog("open");

              /*Al cambiar de estado el input, es decir, al añadir imágenes en el input, 
              se guardan en un array y se crea un div por cada imagen en la etiqueta output*/
              const output = $("#dialog-add-img output");
              const input = $("#dialog-add-img input");
              let imagesArray = [];
              let files = '';
              
              console.log($('#dialog-add-img output div'));


              
              input.on('change', function(){
                files =  this.files;
                //Si alguna de las imágenes supera los 8MB
                let superan8MB = $.grep(files, function(file){
                  return file.size >= 8*1024*1024;
                })
                
                
                if(superan8MB.length > 0) {
                  dialogMensaje("No puedes subir archivos que pesen más de 2MB");
                } else {


                    //Si no supera el peso total, realizamos las acciones necesarias para pasar las imágenes al servidor
                    for(let i=0; i<files.length; i++) {
                      imagesArray.push(files[i])
                      
                    }

                    mostrarImagenes(imagesArray, output);
                    dialogAddImg.data('imagenesArrayFile', imagesArray);


                    
                }
                


              })

              //Borrar las imágenes de la galería (antes de subirlas) al hacer click en x de cada img
              $(document).on('click', 'span[id^="borrarImgMostrada"]', function(){
                console.log("borrarImgMostrada");
                let index = $(this).attr('id').split('-').pop();
                imagesArray.splice(index, 1);


                mostrarImagenes(imagesArray, output);
                

                dialogAddImg.data('imagenesArrayFile', imagesArray);
              })
            })

            
          
        })

        //Cuando apretamos los botones dentro del diálogo 'Ver más' (Promociones, Eventos, Dietas, Tipos de pago)
        $(document).on('click', '.datos-botones button', function(){
          //Recogemos el id del botón, que nos da el id del local y el tipo de dato que queremos ver dentro del diálogo
          let datosBotonId = $(this).attr('id').split('-');

          //Separamos los datos
          let tipoDato = datosBotonId[0];
          let idLocal = datosBotonId[1];
          
          //Creamos el dialog
          let dialog = $( "#dialog" ).dialog({
            autoOpen: false,
            height: "auto",
            width: 600,
            modal: true,
            buttons: {
              ////////////////////////////////////////////////////////////////////////////////////////////////// EDITAR - DATOS LOCALES
              Editar: function(){
                let dialogEditarDatosLocal = $('#dialog').dialog({
                  autoOpen: false,
                  height: 'auto',
                  width: function(){

                    //El ancho de la ventana dependerá de su contenido
                    if ($(this).children().html().includes('Editar evento') ) {
                      // Wide.
                      return $(window).width() - 100;
                    }

                    if ($(this).children().html().includes('Editar promociones') ) {
                      // Wide.
                      return 750;
                    }

                    // Not wide.
                    return 600;
                  },
                  modal: true
                })

                //Creamos variables que recojan las combinaciones de botones que nos interesen
                let botonesAnyadir = {
                  Añadir:function(){
                    let checkedInputs = dialog.data('checkedInputs');

                    let updatedCheckedInputs = $('input[type=checkbox]:checked');

                    
                    let formClass =$(this).children('form').attr('class');

                    /*Para actualizar los checkboxes en php, filtraremos la información desde aquí. Crearemos dos arrays auxiliares,
                    uno para delete y otro para insert, y los compararemos con los checkboxes que están ticados para filtrarlos */

                    //Estos serán los inputs que se insertarán en la tabla
                    let arrayAuxInsert = $(updatedCheckedInputs).not(checkedInputs).get();


                    //Estos serán los inputs que se eliminarán de la tabla
                    let arrayAuxDelete = $(checkedInputs).not(updatedCheckedInputs).get();
      
                    //Recogemos los inputs de ambos arrays auxiliares
                    arrayAuxDelete = $.map(arrayAuxDelete, function(x){
                      return $(x).attr('id').split('-').pop();
                    })

      
                    arrayAuxInsert = $.map(arrayAuxInsert, function(x){
                      return $(x).attr('id').split('-').pop();
                    })
                    
                    
                    //Definimos una variable para en el php saber a qué tabla hacer los cambios
                    let variable='';

                    if(formClass == 'formEditarPagos') {
                      variable = 'pagos';
                    } else {
                      variable = 'dietas';
                    }


                    //Preparamos el data para ajax
                    let dataInsert = '';
                    let dataDelete = '';


                    //Si los arrays auxiliares tienen info, los preparamos para añadirlo al string data
                    if(arrayAuxDelete.length > 0) {
                      dataDelete = "&dataDelete=" + JSON.stringify(arrayAuxDelete);
                    }

                    if(arrayAuxInsert.length > 0) {
                      dataInsert = "&dataInsert=" + JSON.stringify(arrayAuxInsert);
                    }

                    //Rellenamos el string data
                    let data = variable + "&idLocal=" + idLocal + dataInsert + dataDelete;

                    
                    //Si ninguno de los arrays auxiliares están rellenados, no se hace ninguna conexión a la bbdd
                    if(!(arrayAuxDelete.length == 0 && arrayAuxInsert ==0)) {
                      //Enviaremos los dos arrays al php
                      $.ajax({
                        url: "res/php/pagosDietasLocal.php",
                        data: data,
                        cache: false,
                        type: 'GET',
                        success: function(datos) {
                          console.log(datos);
                          //Dialog confirmación
                          dialogMensaje("Los cambios se han guardado con éxito");

                        },
                        error: function(xhr) {
                            $("#restaurantes").append(xhr.statusText + xhr.responseText);
                        }

                      });
                    }

                    $(this).dialog("close");
                  },
                  Cancelar: function(){
                    $(this).dialog('close');
                  }
                }

                let botonesAceptar = {
                  "Cerrar ventana":function(){
                    $(this).dialog('close');
                  }
                }
                /** Recogemos en una variable el id del local y duenyo para pasarlos por los distintos ajaxs*/
                let dataIds = "&idLocal="+idLocal + "&idDuenyo=" + idDuenyo;


                /*En función del tipo de dato que estemos visualizando, abriremos un dialog u otro para editar información
                Cada uno de los dialogs se personalizará en función de los datos que queramos editar, con su propio html*/
                switch(tipoDato) {
                  case 'verPago': 
                    //Preparamos la plantilla de dialog para rellenar con nuevos datos
                    dialogEditarDatosLocal.empty();
        
                    //Abrimos dialog
                    dialogEditarDatosLocal.dialog("open");

                    //Título dialog
                    dialogEditarDatosLocal.dialog('option', 'title', 'Editar tipos de pago');
 
                    //Botones dialog
                    dialogEditarDatosLocal.dialog('option', 'buttons', botonesAnyadir);

                    //Accedemos a la base de datos para sacar los tipos de pagos disponibles
                    $.ajax({
                      url: "res/php/pagos.php",
                      cache: false,
                      type: 'GET',
                      success: function(datos) {
                        //Recogemos de otro dialog los tipos de pago que corresponden al local que estamos gestionando
                        let pagosLocal = dialog.data('pagosEdit')

                        //Recogemos todos los tipos de pago existentes en la bbdd para mostrarlos al usuario
                        let pagos = $.parseJSON(datos);
                        console.log(pagos);

                        //Mostramos la información en el dialog
                        dialogEditarDatosLocal.append(`
                          <form class="formEditarPagos"></form>
                        `);

                        for(let pago of pagos) {
                          let checked = '';

                          //Recorremos los pagos del local; todos aquellos inputs que coincidan con los que se muestran pasarán a estar checked
                          for(let pagoLocal of pagosLocal) {
                            if(pagoLocal.id == pago.id) {
                              checked = 'checked';
                            }
                          }
                          $('.formEditarPagos').append(`
                              <div>

                                <input type="checkbox" class="checkbox-custom" name="editForm-`+pago.id+`" id="editForm-`+pago.id+`" `+checked+`>
                                <span>`+pago.pago+`</span>

                              </div>
                          `);


                      //Guardamos en una variable los inputs checkados
                      let checkedInputs = $('input[type=checkbox]:checked');
                      
                      //Los preparamos para poder recogerlos en otros dialogs
                      dialogEditarDatosLocal.data('checkedInputs', checkedInputs);
                        }
                      },
                      error: function(xhr) {
                          $("#restaurantes").append(xhr.statusText + xhr.responseText);
                      }
                  
                    });
                    break;
                  
                  case 'verDieta': 
                  //Preparamos la plantilla de dialog para rellenar con nuevos datos
                  dialogEditarDatosLocal.empty();
      
                  //Abrimos dialog
                  dialogEditarDatosLocal.dialog("open");

                  //Título dialog
                  dialogEditarDatosLocal.dialog('option', 'title', 'Editar dietas');

                  //Botones dialog
                  dialogEditarDatosLocal.dialog('option', 'buttons', botonesAnyadir);

                  //Accedemos a la base de datos para sacar las dietas disponibles
                  $.ajax({
                    url: "res/php/dietas.php",
                    cache: false,
                    type: 'GET',
                    success: function(datos) {
                      //Recogemos de otro dialog los tipos de pago que corresponden al local que estamos gestionando
                      let dietasLocal = dialog.data('dietasEdit')

                      //Recogemos todos los tipos de pago existentes en la bbdd para mostrarlos al usuario
                      let dietas = $.parseJSON(datos);

                      //Mostramos la información en el dialog
                      dialogEditarDatosLocal.append(`
                        <form class="formEditarDietas"></form>
                      `);

                      for(let dieta of dietas) {
                        let checked = '';

                        //Recorremos los pagos del local; todos aquellos inputs que coincidan con los que se muestran pasarán a estar checked
                        for(let dietaLocal of dietasLocal) {
                          if(dietaLocal.id == dieta.id) {
                            checked = 'checked';
                          }
                        }
                        $('.formEditarDietas').append(`
                            <div>

                              <input type="checkbox" class="checkbox-custom" name="editForm-`+dieta.id+`" id="editForm-`+dieta.id+`" `+checked+`>
                              <span>`+dieta.dieta+`</span>

                            </div>
                        `);

                      }

                      //Guardamos en una variable los inputs checkados
                      let checkedInputs = $('input[type=checkbox]:checked');
                      
                      //Los preparamos para poder recogerlos en otros dialogs
                      dialogEditarDatosLocal.data('checkedInputs', checkedInputs);
                      
                    },
                    error: function(xhr) {
                        $("#restaurantes").append(xhr.statusText + xhr.responseText);
                    }
                
                  });
                  
                  ;
                  break;
                
                  case 'verPromo': 
                  //Preparamos la plantilla de dialog para rellenar con nuevos datos
                  dialogEditarDatosLocal.empty();
      
                  //Abrimos dialog
                  dialogEditarDatosLocal.dialog("open");

                  //Título dialog
                  dialogEditarDatosLocal.dialog('option', 'title', 'Editar promociones');

                  //Botones dialog
                  dialogEditarDatosLocal.dialog('option', 'buttons', botonesAceptar);


                  //Recogemos de otro dialog los tipos de pago que corresponden al local que estamos gestionando
                  let promosLocal = dialog.data('promosEdit');


                  //Mostramos la información en el dialog
                  dialogEditarDatosLocal.append(`
                    <form class="formEditarPromos">
                      <label for="anyadirPromoEdit">Añadir promoción</label>
                      <input type="text" name="anyadirPromoEdit" id="anyadirPromoEdit">
                      <i class="fi fi-rr-plus-small addInputEditPromo"></i>
                    </form>

                    <div class="promocionesAnyadidas"></div>
                  `)

                  //Pintamos las promociones
                  for(let promo of promosLocal) {
                    pintarPromoDialogEdit(promo);
                  }

                  /*Si apretamos el botón addInputEditPromo hacemos un insert a la base de datos de la promoción 
                  y al mismo tiempo volvemos a rellenar la lista de inputs del mismo diálogo*/
                  $(document).on('click', '.addInputEditPromo', function(){
                    let inputAnyadirPromoEdit = $('#anyadirPromoEdit');
                    console.log(inputAnyadirPromoEdit.val());
                    //Comprobamos que el input esté lleno
                    if(inputAnyadirPromoEdit.val().length != 0) {
                      //Recogemos los datos del input
                      let editPromos = $('.formEditarPromos').serialize();
                      
                      /*//Dialog confirmación
                      $('#dialog-confirm p').html('Has añadido una promoción a tu local.');
                      $('#dialog-confirm').dialog({
                        resizable: false,
                        height: "auto",
                        width: 600,
                        modal: true,
                        buttons: {
                          Aceptar: function() {
                            //Si el usuario confirma el borrado, se resetea input
                            inputAnyadirPromoEdit.val('');
                            $('#dialog-evento form p').html('');
                            $( this ).dialog( "close" );
                          }
                        }
                      })*/
                    
                      //Lo enviamos a php
                      $.ajax({
                        url: "res/php/promocionesLocal.php?anyadir&"+editPromos + "&idLocal="+idLocal + "&idDuenyo=" + idDuenyo,
                        cache: false,
                        type: 'GET',
                        success: function(datos) {

                          //Volvemos a pintar la lista de promos
                          $('.promocionesAnyadidas').empty();
                          promosLocal = $.parseJSON(datos); 
                          for(let promo of promosLocal) {
                            pintarPromoDialogEdit(promo);
                          }

                          inputAnyadirPromoEdit.val('');
                          $('#dialog-evento form p').html('');
                        },
                        error: function(xhr) {
                            $("#restaurantes").append(xhr.statusText + xhr.responseText);
                        }
                    
                      });
                    } else {
                      //Mensaje de error por input vacío
                      dialogMensaje("Has de poner un nombre a tu promoción");
                    }

                  })

                  /**Si apretamos el botón de basura, eliminaremos la promoción de la base de datos */
                  $(document).on('click', 'i[id^="eliminarPromoEdit-"]', function(){
                    //Recogemos el id de la promo
                    let idPromo = $(this).attr('id').split('-').pop();
                    console.log(idPromo);
                    //Dialog confirmación del eliminado
                    $('#dialog-confirm p').html('¿Estás seguro? Se borrará la promoción seleccionada de la base de datos');
                    $('#dialog-confirm').dialog({
                      resizable: false,
                      height: "auto",
                      width: 600,
                      modal: true,
                      buttons: {
                        'Borrar promoción': function() {
                          //Enviamos la acción a php
                          $.ajax({
                            url: "res/php/promocionesLocal.php?eliminar&idPromo="+idPromo + dataIds,
                            cache: false,
                            type: 'GET',
                            success: function(datos) {

                              //Volvemos a pintar la lista de promos
                              $('.promocionesAnyadidas').empty();
                              promosLocal = $.parseJSON(datos); 
                              for(let promo of promosLocal) {
                                pintarPromoDialogEdit(promo);
                              }
                            },
                            error: function(xhr) {
                                $("#restaurantes").append(xhr.statusText + xhr.responseText);
                            }
                        
                          });
                          
                          $( this ).dialog( "close" );
                        },
                        Cancelar: function(){
                          $(this).dialog('close');
                        }
                      }
                    })
                    
                  })
                  ;
                  break;
                
                  case 'verEvento':
                    //Preparamos la plantilla de dialog para rellenar con nuevos datos
                    dialogEditarDatosLocal.empty();
      
                    //Abrimos dialog
                    dialogEditarDatosLocal.dialog("open");
      
                    //Título dialog
                    dialogEditarDatosLocal.dialog('option', 'title', 'Editar eventos');

                    //Botones dialog
                    dialogEditarDatosLocal.dialog('option', 'buttons', botonesAceptar);
      
      
                    //Recogemos de otro dialog los tipos de pago que corresponden al local que estamos gestionando
                    let eventosLocal = dialog.data('eventosEdit');
      
      
                    //Mostramos la información en el dialog
                    dialogEditarDatosLocal.append(`
                      <form class="formEditarEventos">
                        <label for="anyadirEventoEdit">Añadir evento</label>
                        <input type="datetime-local" name="anyadirFechaEventoEdit" id="anyadirFechaEventoEdit">
                        <input type="text" name="anyadirEventoEdit" id="anyadirEventoEdit">
                        <i class="fi fi-rr-plus-small addInputEditEvento"></i>
                      </form>

                      <div class="eventosAnyadidos"></div>

                    `)

                    //Pintamos los eventos existentes del local
                    for(let evento of eventosLocal) {
                      pintarEventoDialogEdit(evento);
      
                    }
      
                    /*Si apretamos el botón addInputEditEvento hacemos un insert a la base de datos del evento 
                    y al mismo tiempo volvemos a rellenar la lista de inputs del mismo diálogo*/
                    $(document).on('click', '.addInputEditEvento', function(){
                      let inputAnyadirFechaEventoEdit = $('#anyadirFechaEventoEdit');
                      let inputAnyadirEventoEdit = $('#anyadirEventoEdit');
                      
                      let contador = 0;
                      contador++;

                      if(contador == 1) {
                        console.log("addInputEditEvento");
                      

                        //Comprobamos que los inputs estén llenos
                        if(inputAnyadirFechaEventoEdit.val().length != 0 && inputAnyadirEventoEdit.val().length != 0) {
                          //Recogemos los datos del input
                          let editEventos = $('.formEditarEventos').serialize();
  
                          //Lo enviamos a php
                          $.ajax({
                            url: "res/php/eventosLocal.php?anyadir&"+editEventos +dataIds,
                            cache: false,
                            type: 'GET',
                            success: function(datos) {
  
                              //Volvemos a pintar la lista de eventos
                              $('.eventosAnyadidos').empty();
                              eventosLocal = $.parseJSON(datos); 
                              for(let evt of eventosLocal) {
                                pintarEventoDialogEdit(evt);
                              }
  
                              inputAnyadirFechaEventoEdit.val('');
                              inputAnyadirEventoEdit.val('');
                              $('#dialog-evento form p').html('');
                              /*//Dialog confirmación
                              $('#dialog-confirm p').html('Has añadido un evento a tu local.');
                              $('#dialog-confirm').dialog({
                                resizable: false,
                                height: "auto",
                                width: 600,
                                modal: true,
                                buttons: {
                                  Aceptar: function() {
                                    //Si el usuario confirma el borrado, se resetea input
                                    inputAnyadirFechaEventoEdit.val('');
                                    inputAnyadirEventoEdit.val('');
                                    $('#dialog-evento form p').html('');
                                    $( this ).dialog( "close" );
  
                                  }
                                }
                              })*/
                            },
                            error: function(xhr) {
                                $("#restaurantes").append(xhr.statusText + xhr.responseText);
                            }
                        
                          });
  
                        } else {
                          //Mensaje de error por input vacío
                          dialogMensaje("El evento ha de tener fecha y nombre");
                        }
                      }
                         
                        
                      
                        
      
                    })
      
                    /**Si apretamos el botón de basura, eliminaremos la promoción de la base de datos */
                    $(document).on('click', 'i[id^="eliminarEventoEdit-"]', function(){
                      //Recogemos el id de la promo
                      let idEvento = $(this).attr('id').split('-').pop();

                      //Dialog confirmación del eliminado
                      $('#dialog-confirm p').html('¿Estás seguro? Se borrará el evento seleccionado de la base de datos');
                      $('#dialog-confirm').dialog({
                        resizable: false,
                        height: "auto",
                        width: 600,
                        modal: true,
                        buttons: {
                          'Borrar evento': function() {
                            //Enviamos la acción a php
                            $.ajax({
                              url: "res/php/eventosLocal.php?eliminar&idEvento="+idEvento + dataIds,
                              cache: false,
                              type: 'GET',
                              success: function(datos) {
                                //Volvemos a pintar la lista de promos
                                $('.eventosAnyadidos').empty();
                                eventosLocal = $.parseJSON(datos); 
                                for(let evt of eventosLocal) {
                                  pintarEventoDialogEdit(evt);
                                }
                              },
                              error: function(xhr) {
                                  $("#restaurantes").append(xhr.statusText + xhr.responseText);
                              }
                          
                            });
                            
                            $( this ).dialog( "close" );
                          },
                          Cancelar: function(){
                            $(this).dialog('close');
                          }
                        }
                      })
                      
                    });
                  break;
                
                };
              },
              Cancelar: function(){
                $(this).dialog("close")
              }
            }
          });

          //Abrimos el dialog
          dialog.dialog("open");

          //Le añadimos el título
          dialog.dialog('option', 'title', 'Información del local');


          ////////////////////////////////////////////////////////////////////////////////////////////////// VER - DATOS LOCALES
          //En función del botón clicado, pasamos los datos a una función que rellenará el contenido del diálogo plantilla
          switch(tipoDato) {
            case 'verPago': ajaxDato(dialog, 'pago', idLocal,idDuenyo );
              break;
            
            case 'verDieta': ajaxDato(dialog,'dieta', idLocal,idDuenyo );
            break;
          
            case 'verPromo': ajaxDato(dialog,'promo', idLocal,idDuenyo );
            break;
          
            case 'verEvento': ajaxDato(dialog,'evento', idLocal,idDuenyo );
            break;
          
          }
        })
      } else {
        $(document).ready(function(){
          $('#perfil').empty().html("No has iniciado sesión");
          $('#container-duenyo').empty();
        })
      }
    },
    error: function(xhr) {
        console.log(xhr.statusText + xhr.responseText);
    }

  });

  
})


////////////////////////////////////////////////////////////////////////////////////////////////// FUNCIONES

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

//Pintamos el div correspondiente a un local con toda la información necesaria del mismo
function pintarLocalDuenyo(local) {
  let localDiv = `
  <div class="restaurante">
    <div>#`+local.id+`</div>
    <div><a id="local-`+local.id+`">`+local.nombre+`</a></div>
    <div>`+local.categoria+`</div>
    <div class="editar">
      <button class="btn-secundario" id="editar-`+local.id+`">Ver más</button>
    </div>
    <div class="eliminar">
      <button class="btn-secundario" id="eliminar-`+local.id+`"><i class="fi fi-rr-trash"></i></button>
    </div>
    <button class="imagenes btn-secundario"  id="imgs-`+local.id+`"><i class="fi fi-rr-copy-image"></i></button>
  </div>`;

  return localDiv;
}


//Pintamos el div correspondiente a un local específico con toda la información necesaria del mismo 
function pintarLocalDuenyoVerMas(local) {
  let tipoRestaurante = '';

  if((local.categoria).match('Restaurante')){

    tipoRestaurante = `<div class="fila-datos">
      <p><span class="tipo-dato">Tipo </span>`+local.tipo+`</p>
    </div>`;
  }
  $(`<div class="datos">
  <div class="fila-datos">
      <p><span class="tipo-dato">ID</span>`+local.id+`</p>
  </div>
  <div class="fila-datos">
      <p><span class="tipo-dato">Nombre</span> `+ifNull(local.nombre)+`</p>
  </div>
  <div class="fila-datos">
      <p><span class="tipo-dato">Categoria</span> `+local.categoria+`</p>
  </div>
  `
  + tipoRestaurante+
  `
  <div class="fila-datos">
      <p><span class="tipo-dato">RRSS</span> `+ link(ifNull(local.red_social), 'instagram')+`</p>
  </div>


  <div class="fila-datos">
      <p><span class="tipo-dato">Precio medio</span>`+ifNull(local.precio_medio)+`</p>
  </div>
</div>  


<div class="datos">

  <div class="fila-datos">
    <p><span class="tipo-dato">Gama</span> `+ifNull(local.gama)+`</p>
  </div>
  <div class="fila-datos">
      <p><span class="tipo-dato">Web</span> `+ link(ifNull(local.web))+`</p>
  </div>
  <div class="fila-datos">
      <p><span class="tipo-dato">Menú</span>  `+ link(ifNull(local.menu))+`</p>
  </div>
  <div class="fila-datos">
      <p><span class="tipo-dato">Teléfono</span>`+ifNull(local.telefono)+`</p>
  </div>
  <div class="fila-datos">
      <p><span class="tipo-dato">Calle</span> `+ifNull(local.calle)+`</p>
  </div>
  <div class="fila-datos">
      <p><span class="tipo-dato">Ciudad</span> `+ifNull(local.ciudad)+`, `+ifNull(local.cp)+`, `+ifNull(local.provincia)+`</p>
  </div>
</div>


  <div class="datos-botones">
      <div>
          <button class="verTiposPago btn-secundario" id="verPago-`+local.id+`">Tipos de pago</button>
      </div>
      <div>
          <button class="verDietas btn-secundario" id="verDieta-`+local.id+`">Dietas</button>
      </div>
      <div>
          <button class="verPromociones btn-secundario" id="verPromo-`+local.id+`">Promociones</button>
      </div>
      <div>
          <button class="verEventos btn-secundario" id="verEvento-`+local.id+`">Eventos</button>
      </div>
</div>`).appendTo('#dialog-datos');
}


//Pintamos el div correspondiente a un local con inputs para que el usuario lo pueda editar
function pintarLocalDuenyoVerMasEdit(local) {
  $('#dialog-edit').empty();

    
    $(`
    <form action="">
        <div class="columna">
            <div>
                <label for="nombreFormEdit">Nombre</label>
                <input type="text"  name="nombreFormEdit" id="nombreFormEdit" value="`+ local.nombre+`">
            </div>

            <div>
                <label for="categoriaFormEdit">Categoría</label>
                <select name="categoriaFormEdit"   id="categoriaFormEdit"></select>
            </div>

            <div>
              <label for="tipoFormEdit">Tipo Restaurante</label>
              <select  id="tipoFormEdit"   name="tipoFormEdit" ></select>
            </div>

            <div>
                <label for="webFormEdit">Web<span class="opcional"> (Opcional)</span></label>
                <input type="text" name="webFormEdit"   class=""  id="webFormEdit" title="Introduce la URL" value="`+ ifNullEmpty(local.web) +`">
            </div>
            
            <div>
                <label for="red_socialFormEdit">Instagram<span class="opcional"> (Opcional)</span></label>
                <input type="text" name="red_socialFormEdit"   id="red_socialFormEdit" value="`+ ifNullEmpty(local.red_social)+`">
            </div>

            <div>
                <label for="precio_medioFormEdit">Precio medio</label>
                <input type="text" name="precio_medioFormEdit"  value="`+ local.precio_medio+`" id="precio_medioFormEdit" title="Introduce un número o un rango aproximado (Ej: 20-25)">
            </div>
            
        </div>
        <div class="columna">
            
            <div>
                <label for="gamaFormEdit">Gama</label>
                <select name="gamaFormEdit" id="gamaFormEdit"></select>
            </div>
            <div>
                <label for="menuFormEdit">Menú<span class="opcional"> (Opcional)</span></label>
                <input type="text" name="menuFormEdit" class=""  value="`+ifNullEmpty(local.menu)+`" id="menuFormEdit" title="Introduce la URL que llevará a la carta de la web">
            </div>
            <div>
                <label for="telefonoFormEdit">Teléfono</label>
                <input type="text" name="telefonoFormEdit"  value="`+local.telefono+`" id="telefonoFormEdit">
            </div>
            <div>
                <label for="calleFormEdit">Calle</label>
                <input type="text" name="calleFormEdit" id="calleFormEdit" value="`+local.calle+`">
            </div>
            <div>
                <label for="ciudadFormEdit">Ciudad</label>
                <input type="text" name="ciudadFormEdit" id="ciudadFormEdit" value="`+local.ciudad+`">
            </div>
            

        </div>
        <div class="columna">
          <div>
              <label for="provinciaFormEdit">Provincia</label>
              <select name="provinciaFormEdit" id="provinciaFormEdit"></select>
          </div>
          <div>
              <label for="cpFormEdit">CP</label>
              <input type="text" name="cpFormEdit" id="cpFormEdit" value="`+local.cp+`">
          </div>
          <div class="coordenadas">
              <div>
                  <label for="longFormEdit">Longitud</label>
                  <input type="text" name="longFormEdit" id="longFormEdit" title="Es necesario añadir 3 decimales" value="`+local.longitud +`">
              </div>
              <div>
                  <label for="latFormEdit">Latitud</label>
                  <input type="text" name="latFormEdit" id="latFormEdit" title="Es necesario añadir 3 decimales" value="`+ local.latitud +`">
              </div>
          </div>
        </div>
        
    </form>`).appendTo($('#dialog-edit'));

    //Rellenamos los selects con la opcion del local
  rellenoSelect('provincia', 'Edit', local.provincia_id);
  rellenoSelect('gama', 'Edit', local.gama_id);
  rellenoSelect('categoria', 'Edit', local.categoria_id);

  //Si el tipo de restaurante es null, simplemente lo rellenamos. De lo contrario, seleccionamos la opcion que tenga el local
  if(local.tipo_id != null) {
    rellenoSelect('tipo', 'Edit', local.tipo_id);

  } else {
    rellenoSelect('tipo', 'Edit');

  }

  
  //Mostramos o escondemos el tipo de restaurante en función de si el usuario ha escogido como categoria un restaurante o no
  if((local.categoria).match('Restaurante')){
            
    $('#tipoFormEdit, label[for="tipoFormEdit"]').show();
  } else {
    $('#tipoFormEdit, label[for="tipoFormEdit"]').hide();

  }

}

//Checar si el valor es null --> para mostrar Sin datos
function ifNull(valor) {
  if(valor == null) {
    return 'Sin datos';
  }else {
    return valor;
  }
}
//Checar si el valor es null --> para no mostrar nada
function ifNullEmpty(valor) {
  if(valor == null) {
    return '';
  }else {
    return valor;
  }
}

//Añadir link a valor del local siempre que sea distinto a 'Sin datos'
function link(valor, tipo = '') {
  if(valor != 'Sin datos') {
    
    let link = ``;

    switch(tipo) {
      case 'instagram': link = `<a href="https://instagram.com/`+valor+`">@`+valor+`</a>`;
      break;
      default: link = `<a href="`+valor+`">`+valor+`</a>`;
      break;
    }
    return link;
  }
  return valor;
}

//Pintamos una option de un select determinado rellenando con su id y nombre
function pintarOption(id, nombre, select) {
  $(`<option value="`+id+`">`+nombre+`</option>`).appendTo(select);
}

//Función para pintar las opciones de los selects -> Gamas, Provincias, Tipos, Categorias

//Con la variable edit le decimos si estamos en el dialogo de edición. Con la variable localValue le pasamos el valor del local para seleccionarlo en el select (esto es para el dialog de editar local también)
function rellenoSelect(x, edit = '', localValue = '') {
  $.ajax({
    //Ajustamos la url en función de qué tabla queremos volcar
    url: "res/php/"+x+"s.php",
    type: 'GET',
    cache: false,
    success: function(datos) {
      let valores = jQuery.parseJSON(datos);

      //Volcamos los datos con la funcion pintarOption
      for(let valor of valores) {
        pintarOption(valor.id, valor[x], '#' + x + 'Form' + edit);
      }

      //Si venimos desde el dialog editar, queremos recorrer las opciones para seleccionar la que coincida con el local
      if(edit != '') {
        let options = $('#'+x+'FormEdit option');
        
        //Recorremos los options y cuando coincida con el valor que pasamos por parte del local, lo definimos a selected
        $.map(options, function(x){
          if( $(x).val() == localValue) {
            $(x).attr('selected', true);
          }
        })

      }
    },
    error: function(xhr) {
      console.log(xhr.statusText + xhr.responseText);
    }

  });
}


//Función para crear un diálogo una vez dentro del diálogo ver más para poder ver datos más específicos (ver tipos de pago, promos, eventos, dietas)
function ajaxDato(dialog, tipoDato, idLocal, idDuenyo) {  
    //Recogemos los datos de la bbdd en función del tipo de dato, del local y del dueño
    $.ajax({
      url: "res/php/datosLocal.php?datoLocal=" + tipoDato + "&idLocal=" + idLocal + "&idDuenyo=" + idDuenyo,
      cache: false,
      type: 'GET',
      success: function(datos) {
        $('#dialog').empty();
        switch(tipoDato) {

          ///////PROMOCIONES
          case 'promo': 
            //Creamos el html
            $('#dialog').append(`
            <ul class="info-local">
                <h5>Promociones</h5>
            </ul>
            `);
            let promociones = jQuery.parseJSON(datos);

            //Tenemos en cuenta tanto si hay promociones como si no hay
            if(promociones.length == 0) {
              $('#dialog .info-local').append(`
                  <p class="dato">No hay promociones</p>
                `);
            } else {
              for(let promo of promociones) {
                $('#dialog .info-local').append(`
                  <li class="dato">`+promo.promocion+`</li>
                `);
              }; 
            }


            //Pasamos los datos para otro dialog
            dialog.data('promosEdit', promociones);

          break;

          ///////DIETAS
          case 'dieta': 
            //Creamos el html
            $('#dialog').append(`
            <ul class="info-local">
                <h5>Dietas</h5>
            </ul>
            `);

            let dietas = jQuery.parseJSON(datos);

            //Tenemos en cuenta tanto si hay dietas como si no 
            if(dietas.length == 0) {
              $('#dialog .info-local').append(`
                  <p class="dato">No hay dietas seleccionadas</p>
                `);
            } else {
              for(let dieta of dietas) {
                $('#dialog .info-local').append(`
                  <li class="dato">`+dieta.dieta+`</li>
                `);
              }; 
            }

            //Pasamos los datos para otro dialog
            dialog.data('dietasEdit', dietas);
          break;

          ///////TIPOS DE PAGO
          case 'pago':
            //Creamos el html
            $('#dialog').append(`
            <ul class="info-local">
                <h5>Tipos de pago</h5>
            </ul>
            `);

            let pagos = jQuery.parseJSON(datos);

            //Tenemos en cuenta tanto si hay tipos de pago como si no los hay
            if(pagos.length == 0) {
              $('#dialog .info-local').append(`
                  <p class="dato">No hay tipos de pagos seleccionados</p>
                `);
            } else {
              for(let pago of pagos) {
                $('#dialog .info-local').append(`
                  <li class="dato">`+pago.tipo_pago+`</li>
                `);
              }; ;
            }
            //Pasamos los datos para otro dialog
            dialog.data('pagosEdit', pagos);
          break;


          ///////EVENTOS
          case 'evento': 
            //Creamos el html
            $('#dialog').append(`
            <ul class="info-local">
                <h5>Eventos</h5>
            </ul>
            `);
            let eventos = jQuery.parseJSON(datos);
            
            //Tenemos en cuenta tanto si hay eventos como si no los hay
            if(eventos.length == 0) {
              $('#dialog .info-local').append(`
                  <p class="dato">No hay eventos</p>
                `);
            } else {
              for(let evento of eventos) {
                $('#dialog .info-local').append(`
                  <li class="dato"><span class="fechaEvento">`+formatearFecha(evento.fecha)+`</span> `+evento.evento+`</li>
                `);
              }; 
            }

            //Pasamos los datos para otro dialog
            dialog.data('eventosEdit', eventos);
          
          break;
        }
      },
      error: function(xhr) {
          console.log(xhr.statusText + xhr.responseText);
      }
  
    });

      
    
  
   
}

//Función para pintar la lista de promociones en el dialog editar promociones
function pintarPromoDialogEdit(promo) {
  $('.promocionesAnyadidas').append(`
                <div>
                    <p id="promoFormEdit-`+promo.id+`" >`+promo.promocion+`<i class="fi fi-rr-trash" id="eliminarPromoEdit-`+promo.id+`"></i></p>
                </div>
                `);
}

//Función para pintar la lista de eventos en el dialog editar eventos
function pintarEventoDialogEdit(e) {
  $('.eventosAnyadidos').append(`
    <div>
        <p id="eventoFormEdit-`+e.id+`" ><span class="fechaEvento" id="fechaEventoFormEdit-`+e.id+`"> `+formatearFecha(e.fecha)+`</span> `+e.evento+`<i class="fi fi-rr-trash" id="eliminarEventoEdit-`+e.id+`"></i></p>
    </div>
    `);
}

//Función para mostrar las imágenes al usuario en mini-galería antes de subirlas
function mostrarImagenes(array, output){
  let images = "";
  array.forEach((image, index) => {
    images += `<div class="imgPreparada">
                <img src="${URL.createObjectURL(image)}" alt="image">
                <span id="borrarImgMostrada-${index}">&times;</span>
              </div>`
  });
  output.html(images);


}

//Mensaje error
function dialogMensaje(texto) {
  $('#validado').empty().append('<p>'+texto+'</p>');

  $( "#validado" ).dialog({
    modal: true,
    height:"auto",
    width: 400,
    buttons: {
      Ok: function() {
        $( this ).dialog( "close" );
      }
    }
  });
}

//Validar formato URL
function checkIsURL(inputURL){
  let url;
    try {

      url = new URL(inputURL.val());

    } catch (_) {

      inputURL.addClass( "ui-state-error" );
      dialogMensaje("Formato de URL incorrecto");
      return false;
    }
    inputURL.removeClass( "ui-state-error" );

    return url.protocol === "http:" || url.protocol === "https:";

}

//Función dedicada a añadir un input para el formulario de insertar local - Promociones
function anyadirInput(tipo) {
  if(tipo == 'evento') {
    
    //Recogemos el id del último input para poder añadir un número más y que sean diferentes
    let lastId = parseInt($('input[id^=eventoForm-]').last().attr('id').split('-').pop());

    $('.inputsEventos').append(`<p>
    <input type="datetime-local" name="fechaEventoForm-`+(lastId+1)+`" id="fechaEventoForm-`+(lastId+1)+`"><input type="text" name="eventoForm-`+(lastId+1)+`" id="eventoForm-`+(lastId+1)+`"><i class="fi fi-rr-trash" id="eliminarEvento-`+(lastId+1)+`"></i></p>`);
 
  } else {
    //Recogemos el id del último input para poder añadir un número más y que sean diferentes
    let lastId = parseInt($('input[id^=promoForm-]').last().attr('id').split('-').pop());
    $('.inputsPromociones').append(`<p><input type="text" name="promoForm" id="promoForm-`+(lastId+1)+`"><i class="fi fi-rr-trash" id="eliminarPromo-`+(lastId+1)+`"></i></p>`);
  }

}

//Validar longitud/latitud
function checkLongLat(inputValor) {
  let valor = inputValor.val();

  //Regex --> Puede tener un positivo o negativo delante / Acepta punto o coma para el decimal / Mínimo 3 decimales
  let validador = /[+-]?\d+(?:[\.,]\d{3,})/;

  if(valor.match(validador)) {
    inputValor.removeClass( "ui-state-error" );
    $('#validado').empty()
    return true;
  } else {
    inputValor.addClass( "ui-state-error" );
    dialogMensaje("El formato de longitud/ latitud no es válido");
    return false;
  }
}

//Validar si es número
function checkInt(inputValor) {
  let valor = inputValor.val();

  if($.isNumeric(valor)) { 
    inputValor.removeClass( "ui-state-error" );
    $('#validado').empty()
    return true;
  } else {
    dialogMensaje("Has de introducir un número");
    inputValor.addClass( "ui-state-error" );
    return false;
  }
}

//Validar si inputs están vacíos
function notEmpty(inputs) {
  let empty = $.grep(inputs, function(e, index) {
    return  e.value === '';
  });

  if(empty.length > 0) {
    dialogMensaje("Los campos no pueden estar vacíos");
    return false;
  } else {
    return true;
  }
}


//Compresión imágenes
/*async function compressImages(fileInput, output) {
  return new Promise(async function (resolve) {
    let numProcessedImages = 0;
    let numImagesToProcess = fileInput.files.length;
    

    for (let i = 0; i < numImagesToProcess; i++) {
      const file = fileInput.files[i];
      console.log(fileInput.files[i]);
      await new Promise((resolve) => {
        new Compressor(file, {
          quality: 0.5,
          success(result) {
            output.push(result);
            console.log(result);
            resolve();
          }
        });
      });
      numProcessedImages += 1;
    }
    if (numProcessedImages === numImagesToProcess) {
      resolve();
    }
  });
}*/