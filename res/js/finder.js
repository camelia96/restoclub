$(document).ready(function(){

    //Botones superiores
    $('.americano').on('click', function(){
  
        window.location.href = "finder.html?tipo=1";
    })

    $('.discotecas').on('click', function(){

        window.location.href = "finder.html?categoria=3";
    })

    $('.pub').on('click', function(){

        window.location.href = "finder.html?categoria=2";
    })

    $('.gluten').on('click', function(){

        window.location.href = "finder.html?dieta=1";
    })

    $('.italiano').on('click', function(){

        window.location.href = "finder.html?tipo=4";
    })

    $('.recreativo').on('click', function(){

        window.location.href = "finder.html?categoria=9";
    })
    //Recogemos parámetros de la URL
    let urlString = window.location.href;

    // Creamos una instancia de URLSearchParams
    let urlParams = new URL(urlString).searchParams;


    let params = '';
      
    //Con los parámetros de la URL, construimos la serialización de datos para el ajax a php
    for (var pair of urlParams.entries()) {

      //Todos los valores excepto eventos y promociones, son inputs arrays
      if(([pair[0]] != 'eventos' && [pair[0]] != 'promociones')) {
        params +=  [pair[0]] + "[]=" + pair[1] + "&";
      } else {
        params +=  [pair[0]] + "=" + pair[1] + "&";

      }

      
    }


    //Eliminamos el último carácter, que es un '&'
    params = params.substring(0, params.length-1);


    console.log(params);

    //Mostrar locales en funcion de los params (que pueden o no estar vacíos -> si están vacíos, se mostrarán los locales sin filtros)
    mostrarLocalesSinFiltro(params);

    //Relleno del desplegable de provincias para el buscador
    rellenoSelect('provincia');

    //Relleno de los filtros
    /**CATEGORIAS */
    rellenoSelect('categoria');

    /**TIPOS DE RESTAURANTES */
    rellenoSelect('tipo');

    /**PAGOS */
    rellenoSelect('pago');

    /**DIETAS */
    rellenoSelect('dieta');

    /**GAMAS */
    rellenoSelect('gama');

    

    //Recogemos los formularios con filtros
    let formularios = $('.filtros-finder, #buscar form');   
    
    let formulariosArray = formularios.toArray();
    

    //Al pulsar el botón para filtrar
    $('#boton-filtrar, #buscar button').on('click', function(e){

      

      //Serializamos los filtros
      let filtros = formularios.serialize();


      console.log(filtros);
      e.preventDefault();

      $.ajax({
        url: "res/php/finder.php",
        cache: false,
        method: 'POST',
        data: filtros,
        success: function(datos) {

          $('#resultados').empty();

          //Pintamos el html con los locales recuperados
          let locales = jQuery.parseJSON(datos);
          
          //Si el array localesDuenyo está vacío
          if(locales.length == 0) {

            $('#resultados').html('No hay locales con los filtros seleccionados.');
          } else {

            //Pasamos los objetos de locales a un array
            let localesArray = Object.keys(locales).map(function (key) { return locales[key]; });

            
            $('#pagination-container').pagination({
              dataSource: localesArray, // Conjunto de datos a paginar
              
              pageSize: 15, // Número de elementos por página
              callback: function(data, pagination) {
                // Función de devolución de llamada para mostrar los elementos de la página actual
                var html = '';

                //'data' contiene un array con el total de elementos que queremos mostrar por página, en función de los datos, que vienen de dataSource
                $.each(data, function(index, item) {
                  html += pintarLocales(item.id, item.nombre, item.categoria, item.tipo, item.imagen);
                });

                $('#resultados').html(html);
              }
            });

          }

        },
        error: function(xhr) {
            $("#resultados").append(xhr.statusText + xhr.responseText);
        }
      });

      
    });

    //Al pulsar el botón "Borrar filtros"
    $('#borrar-filtrar').on('click', function(){

      //Reseteamos los filtros
      for(let form of formulariosArray) {
        form.reset();
      }

      //Vaciamos los contenidos de todos los selects
      $('select[name]').val("0");


      //Deseleccionamos los lis del multiselect
      $('li[class="active"]').prop( "class", "" );

      //Borramos los parámetros de la url
      let urlObj = new URL(window.location.href);

      // Eliminamos los parámetros de la URL
      urlObj.search = '';

      // Actualizamos la URL en la barra de direcciones sin recargar la página
      history.replaceState(null, '', urlObj.toString());


      //Mostramos todos los locales
      mostrarLocalesSinFiltro();
    })

    //Al pulsar un restaurante
    $(document).on('click', '.resultado, .resultadoRandDentro', function(){
      let idLocalResultado = $(this).children('div[id^="img-res"]').attr('id').split('-').pop();
      console.log(idLocalResultado);
      localStorage.setItem('idLocal', idLocalResultado);

      window.location.href = "local.html";
    })
    
    /**RANDOMIZADOR */
    //Al pulsar sobre el enlace al randomizador
    $('#randomizador').on('click', function(e){
      e.preventDefault();

      //Volcamos las provincias en el select del randomizador
      $.ajax({
        url: "res/php/provincias.php",
        cache: false,
        success: function(datos) {
          let provincias = jQuery.parseJSON(datos);

          for(let provincia of provincias) {
            $(`<option value="`+provincia.id+`">`+provincia.provincia+`</option>`).appendTo('#provinciaRand');
          }
          
          
        },
        error: function(xhr) {
            console.log(xhr.statusText + xhr.responseText);
        }
    
      });

      //Volcamos las categorías en el select del randomizador
      $.ajax({
        url: "res/php/categorias.php",
        cache: false,
        success: function(datos) {
          let categorias = jQuery.parseJSON(datos);
          for(let categoria of categorias) {
            $(`<option value="`+categoria.id+`">`+categoria.categoria+`</option>`).appendTo('#categoriaRand');
          }
          
          
        },
        error: function(xhr) {
            console.log(xhr.statusText + xhr.responseText);
        }
    
      });

      let dialogRandomizador = $('#dialog-randomizador').dialog({
        width: 1100,
        height: 650,
        modal: true,
        buttons: {
          Cerrar: function(){
            $('#dialog-randomizador .resultadoRand').empty().append('<div style="width: 100%; height: 35vh; display: flex; justify-content: center; align-items: center;"><p>Aquí aparecerá tu local randomizado</p></div>');

            $(this).dialog("close");
          }
        }
      })

      dialogRandomizador.dialog("open");

      //Al randomizar
      $('#randomizar').click(function(){
        //Recogemos los datos del formulario
        let dataRand = $('.form-rand').serialize();
        

        //Conectamos a la bbdd
        $.ajax({
          url: "res/php/randomizar.php",
          type: 'POST',
          data: dataRand,
          cache: false,
          success: function(datos) {

            $('#dialog-randomizador .resultadoRand').empty();
            let local = $.parseJSON(datos);

            if(local) {
              local = local[0];



              let nombreRestaurante = '';
      
              //Si el tipo de restaurante no es null se crea una variable para recoger su nombre y sea más fácil su uso
              if(local.tipo) {
                  nombreRestaurante =   ", " +local.tipo;
              }
  
              $('<div class="resultadoRandDentro"><div id="img-resultadoRand-'+local.id+'"></div><div><h4>'+local.nombre+'</h4><p>'+local.categoria +nombreRestaurante+'</p><p>'+local.ciudad +', '+local.provincia+'</p>').appendTo("#dialog-randomizador .resultadoRand");
  
              //Definimos background de img-resultado
              $('#img-resultadoRand-' + local.id).css({"background-image": "url(res/img/"+local.imagen+")", "background-size": "cover", "background-position": "center"});
  

            } else {
              $('#dialog-randomizador .resultadoRand').empty().append('<div style="width: 100%; height: 35vh; display: flex; justify-content: center; align-items: center;"><p>No hay coincidencias con los filtros seleccionados.</p></div>');

            }
            
            
            
          },
          error: function(xhr) {
              console.log(xhr.statusText + xhr.responseText);
          }
      
        });
      })
    })
    

    
})
    



//Función para pintar los locales
function pintarLocales(id, nombre, categoria,restaurante, primeraImagen) {
    let nombreRestaurante = '';
    
    //Si el tipo de restaurante no es null se crea una variable para recoger su nombre y sea más fácil su uso
    if(restaurante) {
        nombreRestaurante =   ", " +restaurante;
    }

    let resultado = 
      `<div class="resultado">
        <div id="img-resultado-`+id+`" style="background-image: url(res/img/`+primeraImagen+`)"></div>
        <div>
          <h4>`+nombre+`</h4>
          <p>`+categoria +nombreRestaurante+`</p>
        </div>
      </div>`;

    return resultado;
}

function pintarOption(id, nombre, select) {
    $(`<option value="`+id+`">`+nombre+`</option>`).appendTo(select);
  }


function rellenoSelect(x) {
  $.ajax({
    url: "res/php/"+x+"s.php",
    cache: false,
    success: function(datos) {
      let valores = jQuery.parseJSON(datos);
      for(let valor of valores) {
        pintarOption(valor.id, valor[x], '#' + x );
      }

      $('#' + x).multiselect({
        selectAll: true,
        deselectAll: true
    });
      
    },
    error: function(xhr) {
        $("#restaurantes").append(xhr.statusText + xhr.responseText);
    }

  });
}

function rellenoFiltro(filtro) {
    $.ajax({
      url: "res/php/"+filtro+"s.php",
      cache: false,
      success: function(datos) {
        let valores = jQuery.parseJSON(datos);
        for(let valor of valores) {
          pintarCheckboxes(valor, filtro);
        }
      },
      error: function(xhr) {
          $("#restaurantes").append(xhr.statusText + xhr.responseText);
      }
  
    });
  }

function pintarCheckboxes(x, filtro) {
  $(`<div class="form-check">
        <input type="checkbox" name="" id="`+filtro+`-`+x.id+`" class="form-check-input">
        <label for="" class="form-check-input">`+x[filtro]+`</label>
    </div>`).appendTo(`.`+filtro);
}

function mostrarLocalesSinFiltro(params = '') {
  //El parámetro 'params' está por defecto vacío para permitir búsquedas sin filtro

  $.ajax({
    url: "res/php/finder.php",
    data: params,
    type: "POST",
    cache: false,
    success: function(datos) {

        $('#resultados').empty();

        
        //Pintamos el html con los locales recuperados
        let locales = jQuery.parseJSON(datos);

        //Si el array localesDuenyo está vacío
        if(locales.length == 0) {

          $('#resultados').html('No hay locales con los filtros seleccionados.');
        } else {
          //Pasamos los objetos de locales a un array
          let localesArray = Object.keys(locales).map(function (key) { return locales[key]; });

          //Pagination
          $('#pagination-container').pagination({
            dataSource: localesArray, // Conjunto de datos a paginar
            
            pageSize: 15, // Número de elementos por página
            callback: function(data, pagination) {
              // Función de devolución de llamada para mostrar los elementos de la página actual
              var html = '';

              //'data' contiene un array con el total de elementos que queremos mostrar por página, en función de los datos, que vienen de dataSource
              $.each(data, function(index, item) {
                html += pintarLocales(item.id, item.nombre, item.categoria, item.tipo, item.imagen);
              });

              $('#resultados').html(html);
            }
          });


      }
      
        
    },
    error: function(xhr) {
        $("#resultados").append(xhr.statusText + xhr.responseText);
    }
  });
}

