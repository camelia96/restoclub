<?php
    include('../connection/Connection.php');
    include('../connection/Crud.php');
    include('funciones.php');
    include('../connection/initialization.php');


    session_start();


    //Creamos un array para recoger datos
    $session = [];

    //Si existe una sesion, se recoge un true y el nombre del usuario de la sesión activa
    if(check_session()) {

        //Hacemos una consulta a la base de datos para recoger el id, nombre y tipo de usuario
        $sqlConnection = new Connection();
        $sql = $sqlConnection->getConnection();
        $usuarioDatos = $sql -> query("SELECT id, nombreCompleto, nombreUsuario, email, tipo FROM usuarios WHERE nombreUsuario = '" . $_SESSION['user'] ."'");
        
        //'Traducimos' los datos
        $user = array();
    
        while($row = $usuarioDatos->fetch_assoc()) {
            $user[] = $row;
        };

        if(count($user) > 0) {
            //Rellenamos el array con true y con un array con los datos del usuario
            $session = [
                true,
                $user
            ];
        } else {

            $session = false;
            unset_session();
        }
        

    } else {
        $session = false;
    }


    echo json_encode($session);

?>