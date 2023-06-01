<?php
    include('../connection/Connection.php');
    include('../connection/Crud.php');
    include('funciones.php');
    include('../connection/initialization.php');


    session_start();

    $sqlConnection = new Connection();
    $sqlData = new Crud();
    $sql = $sqlConnection->getConnection();

    //Recogemos las variables que vienen de login.js (por parte del usuario)
    $usuario = $_POST['usuario'];
    $pass = $_POST['pass'];

    //Recogemos de la base de datos los usuarios disponibles
    $result = $sqlData->getUsuarios();
    
    //Preparamos un array para sacar los datos del objeto json
    $usuariosJson = array();
    
    while($row = $result->fetch_assoc()) {
        $usuariosJson[] = $row;
    }

    //Preparamos un array vacío que rellenaremos con los resultados en función del usuario que quiere logearse
    $resultados = [];

    /*Recorremos los usuarios de la base de datos y recogemos en un array con 
    los datos necesarios aquel que coincida con la info recogida por parte del usuario*/
    foreach ($usuariosJson as $value) {

        //El password se verifica con password_verify, ya que es una contraseña hash
        if($value['nombreUsuario'] == $usuario && password_verify($pass, $value['contrasenya']) ) {
            
            //Recogemos el tipo de usuario
            $tipoUsuarioLogeado = $value['tipo'];
        }
    }

    //Array para recoger resultados y mandarlos a js
    $resultados = [];

    /*En caso de que el usuario se haya encontrado en la búsqueda anterior, 
    y de que se haya seteado la session, 
    se recoge un true y el tipo de usuario en un array*/
    if(isset($tipoUsuarioLogeado) && set_session($usuario)) {
        $resultados = [
            true,
            $tipoUsuarioLogeado
        ];
    
    } else {
        $resultados = [
            false
        ];
    }

    
    //Se manda la información a js
    echo json_encode($resultados);

    $sql -> close();

?>