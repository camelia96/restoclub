
<?php
    include('connection/Connection.php');
    include('connection/Crud.php');
    include('connection/initialization.php');

    $sqlConnection = new Connection();
    $sqlData = new Crud();
    $sql = $sqlConnection->getConnection();

    //Variable id usuario
    $idUsuario = $_GET['idDuenyo'];

    //Variable id local
    $idLocal = $_GET['idLocal'];

    

    if(isset($_GET['anyadir'])) {

        $evento = $_GET['anyadirEventoEdit'];
        $fechaEvento = $_GET['anyadirFechaEventoEdit'];

        $dataEvento = [ $fechaEvento, $evento,$idLocal];


        $sqlData->insertEventoEdit($dataEvento);

    } else if(isset($_GET['eliminar'])) {
        $idEvento = $_GET['idEvento'];

        $sqlData->deleteEvento($idEvento);

    }


    //Para getEventos
    $data = [$idUsuario, $idLocal];

    $result = $sqlData->getEventosLocalUsuario($data);
    
    $jsonData = array();
    
    while($row = $result->fetch_assoc()) {
        $jsonData[] = $row;
    }

    echo json_encode($jsonData);

    $sql -> close();

?>