<?php
    include('../connection/Connection.php');
    include('../connection/Crud.php');
    include('funciones.php');
    include('../connection/initialization.php');

    session_start();

    if(unset_session()) {
        echo json_encode(true);
    } else {
        echo json_encode(false);
    }

?>