$(document).ready(function(){


    //Verificamos si hay una SESSION
    $.ajax({
        url: "res/php/sessions/check_session.php",
        cache: false,
        success: function(datos) {
            let session = $.parseJSON(datos);


            //Si existe SESSION
            let loginOut = ``;
            let perfil = ``;
            
            //Si hay sesión o no determinará los enlaces/botones perfil/login-out
            if(session[0]) {
                let user = session[1][0];

                //Definimos el tipo de usuario para saber a qué pagina se redirige el enlace 'Perfil'
                switch(user.tipo) {
                    case '1' : user = 'perfil-d';
                    break;
                    case '2' : user = 'perfil-d';
                    break;
                    case '3' : user = 'perfil-c';
                    break;
                }
                loginOut = `<p><button id="logout"  class="g_id_signout">Logout</button></p>`;
                perfil = `<p><a href="`+user+`.html"><i class="fi fi-rr-user"></i>`+session[1][0]['nombreCompleto']+`</a></p>`;

            } else {
                loginOut = `<p><button id="login">Login</button></p>`;
                perfil = `<p><a href="login.html">Perfil</a></p>`;
            }

            //Pintamos el menú general, añadiendo más o menos variables en función de si existe o no la SESSION
            //Éste se pintará independientemente de si hay session o no
            $(`<nav>
            <a href="index.html"><img src="res/img/logo-02.png" alt="Logo"></a>
            <div>
                <p><a href="index.html">Home</a></p>
                <p><a href="finder.html">Finder</a></p>
                `+perfil+`
                `+loginOut+`
                <p><button id="registro">Registro</button></p>
            </div>
            </nav>`).prependTo('body');

            

            //Botón login
            $(document).on('click', '#login',(function(){
                window.location.href = "login.html";
            }));




            //Botón logout
            $(document).on('click', '#logout',(function(){
                //Queremos añadir la librería de google para poder hacer un buen signout del One Tap
                var googleScript = document.createElement('script');
                googleScript.src = 'https://accounts.google.com/gsi/client';
                googleScript.async = true;
                googleScript.defer = true;

                
                // Creamos una promesa que se resolverá cuando el script se haya cargado
                var scriptLoadPromise = new Promise(function(resolve, reject) {
                    googleScript.onload = resolve;
                    googleScript.onerror = reject;
                });

                
                document.head.appendChild(googleScript);


                scriptLoadPromise.then(function(){
                    
                    google.accounts.id.disableAutoSelect();

                    

                }).catch(function(error) {
                    console.error('Error al cargar el script de la API de Google Sign-In:', error);
                });

                //Logout de la BBDD
                $.ajax({
                    url: "res/php/sessions/logout.php",
                    cache: false,
                    success: function(datos) {
                        let unsettingSession = $.parseJSON(datos);
                        if(unsettingSession) 
                            window.location.href = "index.html";
                        else 
                            dialogMensaje("Ha surgido un error al intentar cerrar sesión");
                        
                    },
                    error: function(xhr) {
                        $("#restaurantes").append(xhr.statusText + xhr.responseText);
                    }
            
                  });
            }));
        },
        error: function(xhr) {
            $("#restaurantes").append(xhr.statusText + xhr.responseText);
        }

      });

    

    //Botón registro
    $(document).on('click','#registro',(function(){
        window.location.href = "registro.html";
    }));

    

})