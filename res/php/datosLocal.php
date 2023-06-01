
<?php
    include('connection/Connection.php');
    include('connection/Crud.php');
    include('connection/initialization.php');

    $sqlConnection = new Connection();
    $sqlData = new Crud();
    $sql = $sqlConnection->getConnection();

    //En función de la variable que recibamos, pasaremos al crud un select u otro
    $variable = $_GET['datoLocal'];

    $idUsuario = $_GET['idDuenyo'];

    $idLocal = $_GET['idLocal'];

    $data = [$idUsuario, $idLocal];

    switch($variable) {
        case 'promo': 
            $result = $sqlData->getPromocionesLocalUsuario($data);
            break;
    
        case 'dieta': 
            $result = $sqlData->getDietasLocalUsuario($data);
        break;
    
        case 'evento': 
            $result = $sqlData->getEventosLocalUsuario($data);
        break;
    
        case 'pago': 
            $result = $sqlData->getPagosLocalUsuario($data);
        break;
    
    }
    
    $jsonData = array();
    
    while($row = $result->fetch_assoc()) {
        $jsonData[] = $row;
    }

    echo json_encode($jsonData);

    $sql -> close();

?>