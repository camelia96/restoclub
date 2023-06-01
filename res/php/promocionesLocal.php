
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

        $promocion = $_GET['anyadirPromoEdit'];

        
        $sqlData->insertPromocionEdit( $promocion,$idLocal);

    } else if(isset($_GET['eliminar'])) {
        $idPromo = $_GET['idPromo'];

        $sqlData->deletePromocion($idPromo);

    }


    //Para getPromocionesLocal
    $data = [$idUsuario, $idLocal];

    $result = $sqlData->getPromocionesLocalUsuario($data);
    
    $jsonData = array();
    
    while($row = $result->fetch_assoc()) {
        $jsonData[] = $row;
    }

    echo json_encode($jsonData);

    $sql -> close();

?>