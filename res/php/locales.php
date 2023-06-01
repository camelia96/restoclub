

<?php
    include('connection/Connection.php');
    include('connection/Crud.php');
    include('connection/initialization.php');
    $sqlConnection = new Connection();
    $sqlData = new Crud();
    $sql = $sqlConnection->getConnection();


    //Si la petición es para la lista de locales de un dueño
    if(isset($_GET['duenyo'])){
        $idDuenyo = $_GET['idDuenyo'];
        $result = $sqlData->getLocalesDuenyo($idDuenyo);

    } else if(isset($_GET['local'])) {
        $idLocal = $_GET['idLocal'];
        $idDuenyo = $_GET['idDuenyo'];
        
        $result = $sqlData -> getLocalDuenyo($idDuenyo, $idLocal);
    }
    
    $jsonData = array();
    
    while($row = $result->fetch_assoc()) {
        $jsonData[] = $row;
    }

    echo json_encode($jsonData);

    $sql -> close();

?>