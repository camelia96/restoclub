<?php
    include('../connection/Connection.php');
    include('../connection/Crud.php');
    include('funciones.php');
    include('../connection/initialization.php');

    require_once (dirname(dirname(dirname(__DIR__))) . '/vendor/autoload.php');


    session_start();

    $sqlConnection = new Connection();
    $sqlData = new Crud();
    $sql = $sqlConnection->getConnection();


    //Recogemos de la base de datos los usuarios disponibles
    $result = $sqlData->getUsuarios();

    //Preparamos un array para sacar los datos del objeto json
    $usuariosJson = array();

    while($row = $result->fetch_assoc()) {
        $usuariosJson[] = $row;
    }

    //Preparamos un array vacío que rellenaremos con los resultados en función del usuario que quiere logearse
    $resultados = [];
    

    /**OAUTH */
    $googleClientId = '229602517751-9ebjeug2k5dg9uonqfdivc2qmvmoneoc.apps.googleusercontent.com';
    $userData = [];

    if (isset($_POST['credential'])) {

        //==========================
        // Validate the CSRF token.
        //==========================


        /*if (!isset($_COOKIE['g_csrf_token']) || $_COOKIE['g_csrf_token'] != $_POST['g_csrf_token']) {
            throw new \Exception('Google CSRF token validation failed.');
        }*/

        
        //===============
        // Login process
        //===============
        $googleClient = new \Google_Client(['client_id' => $googleClientId]);
        $payload = $googleClient->verifyIdToken($_POST['credential']);


        // Validate the payload
        if (!is_array($payload) ||
            'https://accounts.google.com' != $payload['iss'] ||
            time() < $payload['nbf'] ||
            time() > $payload['exp'] ||
            $googleClientId != $payload['aud']) {
            throw new \Exception('Invalid Google ID token.');
        }

        
        // Recogemos los datos GOOGLE del usuario
        $userData = [
            'UserID' => $payload['sub'],
            'Email' => $payload['email'],
            'EmailIsVerified' => $payload['email_verified'] ? 'Yes' : 'No',
            'Name' => $payload['name'],
            'Picture' => $payload['picture']
        ];




        $usersBBDD = [];



        /*Comprobamos si el email coincide con algun registro de la bbdd */
        foreach ($usuariosJson as $value) {

            //Cada vez que haya un mail que coincida, se guarda en $usersBBDD un array del mail junto con su tipo
            if($value['email'] == $userData['Email']  ) {
                
                
                $usersBBDD[$value['tipo']] = $value['email'];


            } 
        }


        
        $login = true;
        
        //Si el array $userBBDD ha recogido un mismo mail con ambos tipos, o con el tipo 2, haremos login
        if(array_key_exists('2', $usersBBDD) && array_key_exists('3', $usersBBDD) || array_key_exists('3', $usersBBDD)) {
            $login = true;

        //En caso contrario, realizaremos un registro
        } else{
            $login = false;
        }


        //Seteamos el tipo de usuario - cliente (aunque sea login o registro, trabajamos con el mismo tipo de cuenta)
        $tipoUsuarioLogeado = '3';

        
        if($login) {
            //Para hacer login necesitaremos el nombre de usuario del mail verificado por google. Lo buscamos en nuestro array de usuarios
            foreach ($usuariosJson as $value) {
                if($value['email'] == $usersBBDD['3']) {
                    $usuario = $value['nombreUsuario'];
                }
            }



        } else {
            //Necesitaremos un nombre de usuario, ya que de Google sólo recogemos el mail y el nombre completo

            //El nombre de usuario lo definimos nosotros --> será la primera parte del email que recojamos de google (hasta la @)
            $usuario = substr($userData['Email'], 0, strpos($userData['Email'], '@'));
            


            $data = array(
                "'{$userData['Name']}'", "'{$usuario}'", "'{$userData['Email']}'", $tipoUsuarioLogeado
            );

            $sqlData -> insertarUsuario($data);
        }






    } else if(isset($_POST['usuario']) && isset($_POST['pass'])){
        //Recogemos las variables que vienen de login.js (por parte del usuario)
        $usuario = $_POST['usuario'];
        $pass = $_POST['pass'];
        
        
        /*Recorremos los usuarios de la base de datos y recogemos en un array con 
        los datos necesarios aquel que coincida con la info recogida por parte del usuario*/
        foreach ($usuariosJson as $value) {

            //El password se verifica con password_verify, ya que es una contraseña hash
            if($value['nombreUsuario'] == $usuario && password_verify($pass, $value['contrasenya']) ) {
                
                //Recogemos el tipo de usuario
                $tipoUsuarioLogeado = $value['tipo'];
            }
        }
        
    }

    
    //Array para recoger resultados y mandarlos a js
    $resultados = [];

    /*En caso de que el usuario se haya encontrado en la búsqueda anterior, 
    y de que se haya seteado la session, 
    se recoge un true y el tipo de usuario en un array*/
    if(isset($tipoUsuarioLogeado)) {
        
        if(set_session($usuario)) {
            $resultados = [
                true,
                $tipoUsuarioLogeado
            ];
        }
    
    } else {
        $resultados = [
            false
        ];
    }

    
    //Se manda la información a js
    echo json_encode($resultados);

    $sql -> close();

?>