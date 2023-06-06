$(document).ready(function(){

  let idLocal = localStorage.getItem('idLocal');

  //Si hay idLocal en la url, mostramos todos los datos del local
  if(idLocal != '') {

    /**PINTAR LOCAL */
    $.ajax({
      url: "res/php/local.php",
      data: {idLocal: idLocal},
      cache: false,
      method: 'POST',
      success: function(datos) {  

        
          //Guardamos en una variable los datos devueltos de php
          let general = $.parseJSON(datos);

          //Guardamos local como un objeto
          let local = general.local;

          //Creamos una variable por cada objeto que exista en la variable y sean datos múltiples usando una función para convertir dicho objeto a array
          let imagenes = objectToArray(general.imagenes);
          let eventos = objectToArray(general.eventos);
          let promociones = objectToArray(general.promociones);
          let dietas = objectToArray(general.dietas);
          let pagos = objectToArray(general.pagos);

          
          
          //Pintamos aquellos datos del LOCAL que no tengan múltiples datos

          /**TITULO */

          //Algunas variables existirán y otras no. Las que sean opcionales nos aseguraremos de que no salga nada en caso de que no exita
          let tipo_restaurante = '';
          let etiquetaWeb = ` `;
          let etiquetaRedSocial = ``;
          let etiquetaTipoRestaurante = ``;
          let etiquetaMenu = ``;

          //Definimos las variables en caso de que existan
          if(local.categoria == 'Restaurante') {
            tipo_restaurante = local.tipo;
          }

          if(local.web != '' && local.web != null) {
            etiquetaWeb = `<div class="btn-primario"><a href="`+local.web+`" target="_blank">Web</a></div>`
          }

          if(local.red_social != '' && local.red_social != null) {
            etiquetaRedSocial = `<p><i class="fi fi-brands-instagram"></i><a href="https://instagram.com/`+local.red_social+`"  target="_blank">@`+local.red_social+`</a></p>`
          }

          if(local.menu != '' && local.menu != null) {
            etiquetaMenu = `<p><i class="fi fi-rr-link-alt"></i><a href="`+local.menu+`"  target="_blank">Menú</a></p>`
          }

          if(tipo_restaurante != '') {
            etiquetaTipoRestaurante = `<p><span class="circle" style="background-color: var(--blue-aux);"></span>`+tipo_restaurante+`</p>`
          }


          /**INFO */

          //Pintamos la primera fila de información
          $(`
            <h1>`+local.nombre+`</h1>
           `+etiquetaWeb+`
          `).prependTo(`#container-local .titulo`);

          //Pintamos la segunda fila de información
          let precio_medio = local.precio_medio;

          if(precio_medio.includes('€') || precio_medio.includes('euro') || precio_medio.includes('euros')) {
            precio_medio += "/ persona";
          } else {
            precio_medio += "€/ persona";
          }

          $(`
            <p><span class="circle" style="background-color: var(--blue-strong);"></span>`+local.categoria+`</p>
            `+etiquetaTipoRestaurante+`
            <p><i class="fi fi-rr-euro"></i>`+precio_medio+`</p>
            `+etiquetaRedSocial+ ` `
            +etiquetaMenu).prependTo(`#container-local .info`);
  
          /**IMÁGENES */
          for(let imagen of imagenes) {
            /*$(`<img src="res/img/`+imagen+`">
            `).appendTo(`#container-local .owl-carousel`);*/
            $(`<div class="imgLocal" style="background-image: url('res/img/`+imagen+`');"></div>
            `).appendTo(`#container-local .owl-carousel`);
          }



          /**MAPA Y CONTACTO */
          $(`
            <p><i class="fi fi-rr-marker"></i>`+local.calle+`</p>
            <p><span class="cp">`+local.cp+`</span> `+local.ciudad+`<span class="ciudad"> `+local.provincia+`</span></p>
            <p><i class="fi fi-rr-phone-call"></i>+34 `+local.telefono+`</p>
          `).appendTo('#container-local #mapa')
        

          /**CARACTERÍSTICAS */

          /**DIETAS */
          //Si existen dietas
          if(dietas.length > 0) {
            for(let dieta of dietas) {
              //Las pintamos en html
              $(`<p>`+dieta+`</p>
              `).appendTo(`#container-local .dietas`);
            }
          //Si no existen dietas, lo definimos en el html
          } else {
            $(`<p>Ningún tipo de dieta especial</p>
            `).appendTo(`#container-local .dietas`);
          }


          /**TIPOS DE PAGOS */
          //Si existen tipos de pagos
          if(pagos.length > 0) {
            for(let pago of pagos) {
              //Las pintamos en html
              $(`<p>`+pago+`</p>
              `).appendTo(`#container-local .pagos`);
            }
          //Si no existen tipos de pagos, lo definimos en el html
          } else {
            $(`<p>Este local no ha definido sus tipos de pagos</p>
            `).appendTo(`#container-local .pagos`);
          }

          /**CATEGORÍA Y TIPO DE RESTAURANTE */
          //Definimos tipo de restaurante, en caso de que sea un restaurante
          if(local.categoria == 'Restaurante') {
            tipo_restaurante = ", " + tipo_restaurante;
          }
          //Definimos categoria
          $(`<p>`+local.categoria+`<span>` +tipo_restaurante+ `</span></p>`).appendTo(`#container-local .categoria`);

          /**GAMA */

          $(`<p>` +local.gama+ `</span></p>`).appendTo(`#container-local .gama`);
          /**OTROS */


          /**PROMOCIONES */
          if(promociones.length > 0) {

            $(`<ul></ul>
            `).appendTo(`#container-local #promociones`);
            for(let promo of promociones) {
              //Las pintamos en html
              $(`<li>`+promo+`</li>
              `).appendTo(`#promociones ul`);
            }
          //Si no existen tipos de pagos, lo definimos en el html
          } else {
            $(`<p>No hay promociones activas</p>
            `).appendTo(`#container-local #promociones`);
          }


          /**EVENTOS */
          if(eventos.length > 0) {
            for(let evento of eventos){
              $(`<p><span class="fecha">`+formatearFecha(evento.fecha)+` </span>`+evento.evento+`</p>
              `).appendTo(`#container-local #calendario`);
            }
          } else {
            $(`<p>No hay eventos disponibles</p>`).appendTo(`#container-local #calendario`);
          }

          
          //Mapa
          let longitudMapa = local.longitud;

          longitudMapa = longitudMapa.substring(0, longitudMapa.indexOf('.')+4);


          let latitudMapa = local.latitud;

          latitudMapa = latitudMapa.substring(0, latitudMapa.indexOf('.')+4);
          

          var map = L.map('map').setView([longitudMapa, latitudMapa], 15);
              L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 55,
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }).addTo(map);
          var marker = L.marker([longitudMapa, latitudMapa]).addTo(map);
          //marker.bindPopup("").openPopup();


          /**CAROUSEL */
          let carousel = $(".owl-carousel").owlCarousel({

            margin:30,
            loop:true,
            items:4

          });

          //Mousewheel
          carousel.on('mousewheel', '.owl-stage', function (e) {
            if (e.deltaY>0) {
              carousel.trigger('next.owl');
            } else {
              carousel.trigger('prev.owl');
            }
            e.preventDefault();
        });
          
          
      },
      error: function(xhr) {
          $("#resultados").append(xhr.statusText + xhr.responseText);
      }
    });


    


  //Si no hay idLocal, el contenido html no se mostrará al usuario
  } else {
    $('#container-local').empty().html("Error 404 - Esta página no existe.");
  }




  //Comprobamos session - Comentarios, favoritos y guardados
  $.ajax({
    url: "res/php/sessions/check_session.php",
    cache: false,
    success: function(datos) {
        let check_session = $.parseJSON(datos);

        let idLocal = localStorage.getItem('idLocal');

        //Preparamos data que nos servirá para ambas conexiones a la bbdd
        let data = "idLocal=" + idLocal;

        let idCliente = '';


        //Si hay session
        if(check_session[0] && check_session[1][0]['tipo'] == '3') {
          //Pintamos los botones favorito y visitado en caso de que haya session

          //Recogemos los datos correspondientes
          idCliente = check_session[1][0]['id'];
          idCliente = "&idCliente=" + idCliente;

          //Conexión BBDD Favoritos y Guardados
          $.ajax({
            url: "res/php/localesClientes.php",
            cache: false,
            method: 'POST',
            data: data + "&get"+idCliente,
            success: function(datos) {

              let localUsuario = $.parseJSON(datos);

              //Si al abrir la página el usuario tiene el local registrado como 'visitado', se cambia su clase
              if(localUsuario['visitado'] == 1) {
                $('.visitado').addClass('visitadoClicado');
              }
              //Si al abrir la página el usuario tiene el local registrado como 'favorito', se cambia su clase y se cambia el icono
              if(localUsuario['favorito'] == 1) {
                $('.fav').addClass('favClicado');
                $('.fav').empty().append('<i class="fi fi-sr-heart"></i>')
              }

            },
            error: function(xhr) {
              console.log(xhr.statusText + xhr.responseText);
            }
        
          });

          //Si el usuario aprieta el botón de eliminar comentario, el cual sólo aparecerá para el usuario logeado, para sus propios comentarios

          //Primero tendrá que confirmar el dialog
          $(document).on('click', 'span[id^=eliminarComentario]', function(){
            let idComentario = $(this).attr('id').split('-').pop();
            $('#validado').empty().append("¿Estás seguro de que quieres borrar el comentario? Esta acción no se puede deshacer");
            $( "#validado" ).dialog({
              modal: true,
              height:280,
              width: 500,
              buttons: {
                Borrar: function() {
                    $.ajax({
                      url: "res/php/comentarios.php",
                      cache: false,
                      method: 'POST',
                      data: data + "&delete&idComentario=" + idComentario,
                      success: function(datos) {
                        $('.fila-comentario').empty();


                        
                        let comentarios = $.parseJSON(datos);
                        
                        if(comentarios.length < 1) {
                          $('.fila-comentario').append("<p>Sé el primero en comentar.</p>")
                        } else {
                          //Pasamos los objetos de locales a un array
                          let comentariosArray = Object.keys(comentarios).map(function (key) { return comentarios[key]; });

                          //Pagination
                          $('#pagination-container').pagination({
                            dataSource: comentariosArray, // Conjunto de datos a paginar
                            
                            pageSize: 6, // Número de elementos por página
                            callback: function(data, pagination) {
                              // Función de devolución de llamada para mostrar los elementos de la página actual
                              var html = '';

                              //'data' contiene un array con el total de elementos que queremos mostrar por página, en función de los datos, que vienen de dataSource
                              $.each(data, function(index, item) {
                                html += pintarComentario(item, idCliente);
                              });

                              $('.fila-comentario').html(html);
                            }
                          });
                          
                        }
                      },
                      error: function(xhr) {
                        console.log(xhr.statusText + xhr.responseText);
                      }
        
                    });

                    //Cerramos el dialog
                    $( this ).dialog( "close" );
                },
                Cancelar: function() {
                  $( this ).dialog( "close" );
                }
              }
            });
          })
          

        } 

        //Conexión BBDD Comentarios
        $.ajax({
          url: "res/php/comentarios.php",
          cache: false,
          method: 'POST',
          data: data,
          success: function(datos) {
            $('.fila-comentario').empty();

            let comentarios = $.parseJSON(datos);
            
            if(comentarios.length < 1) {
              $('.fila-comentario').append("<p>Sé el primero en comentar.</p>")
            } else {
              //Pasamos los objetos de locales a un array
              let comentariosArray = Object.keys(comentarios).map(function (key) { return comentarios[key]; });

              //Pagination
              $('#pagination-container').pagination({
                dataSource: comentariosArray, // Conjunto de datos a paginar
                
                pageSize: 6, // Número de elementos por página
                callback: function(data, pagination) {
                  // Función de devolución de llamada para mostrar los elementos de la página actual
                  var html = '';

                  //'data' contiene un array con el total de elementos que queremos mostrar por página, en función de los datos, que vienen de dataSource
                  $.each(data, function(index, item) {
                    html += pintarComentario(item, idCliente);
                  });

                  $('.fila-comentario').html(html);
                }
              });
            }
            
            
          },
          error: function(xhr) {
            console.log(xhr.statusText + xhr.responseText);
          }

        });

        //Recogemos el clicado en los botones 'Visitado' y 'Favorito' (derecha del botón WEB) y el botón 'Enviar' para comentarios
        $('.visitado, .fav, #enviarComentario').on('click', function(e){
          e.preventDefault();

          //Si existe una session y es de cliente
          if(check_session[0] && check_session[1][0]['tipo'] == '3') {
            //Creamos una variable para recoger la info que mandaremos a php, en función de si se guarda como visitado o favorito
            let visitadoFav = '';

            
            //Creamos un booleano para saber desde qué boton viene el usuario
            let comentario = false;

            /*Una vez se haga clic en alguno de los botones (visitado o favorito), 
            se van cambiando las clases para indicar al usuario el estado del local, 
            así como el contenido de la variable creada anteriormente*/
              
            //Gestión del botón Visitado
            if($(this).hasClass('visitado')) {
              if($(this).hasClass("visitadoClicado")) {
                $(this).removeClass("visitadoClicado");

                visitadoFav = 'visitadoFalse';

              } else {
                $(this).addClass("visitadoClicado");

                visitadoFav = 'visitadoTrue';
              }

              comentario = false;

            //Gestión del botón Favorito
            } else if($(this).hasClass('fav')) {

              //En el caso del boton 'fav', no sólo cambiamos el color, sino también el icono
              if($(this).hasClass("favClicado")) {
                $(this).empty().append('<i class="fi fi-rr-heart"></i>')
                $(this).removeClass("favClicado");

                visitadoFav = 'favFalse';

              } else {
                $(this).addClass("favClicado");
                $(this).empty().append('<i class="fi fi-sr-heart"></i>')

                visitadoFav = 'favTrue';
                

                comentario = false;
              }

              
            //Gestión del botón Enviar Comentario
            } else if ($(this).attr('id') == 'enviarComentario') {

              comentario = true;
            }




            //Nos conectamos a la base de datos a través de un php u otro en función de qué botón haya clicado el usuario
            if(comentario) {
              
              //BBDD Añadir comentario
              
              //Validamos que el campo del mensaje no esté vacío
              if($('#comentario').val() == '') {
                dialogMensaje("Has de escribir un comentario.");
              } else {
                $.ajax({
                  url: "res/php/comentarios.php",
                  cache: false,
                  method: 'POST',
                  data: data+ "&idCliente="+idCliente + "&insert&" + $('#comentarios').serialize(),
                  success: function(datos) {


                    //Borramos el contenido del textarea de comentario
                    $('#comentarios textarea').val('');

                    //Preparamos el div para llenarlo con los comentarios
                    $('.fila-comentario').empty();

                    let comentarios = $.parseJSON(datos);
                    
                    //Si no existen comentarios, poner un mensaje corto al usuario para decirselo
                    if(comentarios.length < 1) {
                      $('.fila-comentario').append("<p>Sé el primero en comentar.</p>")
                    } else {
                      //Pasamos los objetos de locales a un array
                      let comentariosArray = Object.keys(comentarios).map(function (key) { return comentarios[key]; });

                      //Pagination
                      $('#pagination-container').pagination({
                        dataSource: comentariosArray, // Conjunto de datos a paginar
                        
                        pageSize: 6, // Número de elementos por página
                        callback: function(data, pagination) {
                          // Función de devolución de llamada para mostrar los elementos de la página actual
                          var html = '';

                          //'data' contiene un array con el total de elementos que queremos mostrar por página, en función de los datos, que vienen de dataSource
                          $.each(data, function(index, item) {
                            html += pintarComentario(item, idCliente);
                          });

                          $('.fila-comentario').html(html);
                        }
                      });
                    }
                  },
                  error: function(xhr) {
                    console.log(xhr.statusText + xhr.responseText);
                  }
  
                });
              }

            } else {
              console.log(data+"&variable="+visitadoFav);
              //BBDD Locales Clientes (Favorito y Visitado)
              $.ajax({
                url: "res/php/localesClientes.php",
                cache: false,
                method: 'POST',
                data: data+ "&idCliente="+idCliente+"&variable="+visitadoFav,
                success: function(datos) {
                  console.log(datos);
                },
                error: function(xhr) {
                  console.log(xhr.statusText + xhr.responseText);
                }

              });
            }
              


          //Si no existe session o es session de dueño
          } else {
            dialogMensaje("Es necesaria una cuenta de cliente");
          }
        })


    },
    error: function(xhr) {
      console.log(xhr.statusText + xhr.responseText);
    }

  });


  
})

//Mensaje error
function dialogMensaje(texto) {
  $('#validado').empty().append(texto);

  $( "#validado" ).dialog({
    modal: true,
    height:"auto",
    width: 500,
    buttons: {
      Ok: function() {
        $( this ).dialog( "close" );
      }
    }
  });


}

//Función para convertir objetos en arrays
function objectToArray(object) {
  let array = [];
  for(let i=0; i<object.length; i++) {
    array[i] = object[i];
  }
  return array;
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

//Función para pintar comentario
function pintarComentario(comentario, idCliente) {

  let spanEliminarComentario = ``;
  if(comentario.idCliente == idCliente.split('=').pop()) {
    spanEliminarComentario = `<span id="eliminarComentario-`+comentario.id+`"><i class="fi fi-rr-trash"></i></span>`;
  }


  
  let comentarioDiv = `<div class="comentario">
        <div class="datos-comentario">
            <p>`+comentario.nombreCompleto+`</p>
            <p>`+formatearFecha(comentario.fecha)+ spanEliminarComentario+`</p>
        </div>
        <p>`+comentario.comentario+`</p>
    </div>`;

  return comentarioDiv;
}

