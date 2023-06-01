
<?php
    include('connection/Connection.php');
    include('connection/Crud.php');
    include('connection/initialization.php');

    $sqlConnection = new Connection();
    $sqlData = new Crud();
    $sql = $sqlConnection->getConnection();


    //Recogemos los datos recibidos
    $idLocal = $_POST['idLocal'];

    $idDuenyo = $_POST['idDuenyo'];
    
    //'Eliminamos' el local
    $sqlData -> deleteLocal($idLocal);
    
    //Devolvemos los locales del dueño
    $result = $sqlData->getLocalesDuenyo($idDuenyo);


    $jsonData = array();
    
    while($row = $result->fetch_assoc()) {
        $jsonData[] = $row;
    }

    echo json_encode($jsonData);

    $sql -> close();

?>