
<?php
    include('connection/Connection.php');
    include('connection/Crud.php');
    include('connection/initialization.php');

    $sqlConnection = new Connection();
    $sqlData = new Crud();
    $sql = $sqlConnection->getConnection();


    //Creamos dos variables vacías que luego se rellenarán o no
    $idLocal = '';

    $idPerfil = '';

    //Recogemos las variables que nos vienen de JS en caso de que vengan
    if(isset($_POST['idLocal'])) {
        $idLocal = $_POST['idLocal'];
    }


    if(isset($_POST['idCliente'])) {
        $idCliente = $_POST['idCliente'];

    }


    if(isset($_POST['idPerfil'])) {
        $idPerfil = $_POST['idPerfil'];
    }

    //Si la variable insert o delete está seteada, realizamos una acción u otra
    if(isset($_POST['insert'])) {
        $comentario = $_POST['comentario'];

        $data = [
            $idLocal,
            $idCliente,
            $comentario
        ];
        
        $sqlData -> insertComentario($data);
    } else if(isset($_POST['delete'])){
        $idComentario = $_POST['idComentario'];

        $sqlData -> deleteComentario($idComentario);
    }

    //Recogemos los comentarios
    if(isset($_POST['idPerfil'])) {
        $result = $sqlData->getComentariosPerfil($idPerfil);

    } else {
        $result = $sqlData->getComentarios($idLocal);
        
    }
    
    $jsonData = array();
    
    while($row = $result->fetch_assoc()) {
        $jsonData[] = $row;
    }

    echo json_encode($jsonData);

    $sql -> close();

?>