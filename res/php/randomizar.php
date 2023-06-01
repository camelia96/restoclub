
<?php
    include('connection/Connection.php');
    include('connection/Crud.php');
    include('connection/initialization.php');

    $sqlConnection = new Connection();
    $sqlData = new Crud();
    $sql = $sqlConnection->getConnection();

    //Recogemos los datos por post
    $dataRand = $_POST;
    

    //Preparamos las variables para cada filtro
    $provincia = '';

    //Si existen, se crea el trozo de consulta respectivo
    if($dataRand['provinciaRand'] != 0) {
        $provincia = " AND p.id = {$dataRand['provinciaRand']}";
    }

    $categoria = '';

    if($dataRand['categoriaRand'] != 0) {
        $categoria = " AND categoria_id = {$dataRand['categoriaRand']}";
    }

    //Se rellena el array $filtros con cada una de las consultas añadidas. En caso de que no existan, la consulta final tendrá una variable vacía que no afectará al Select
    $filtros = [
        $provincia,
        $categoria
    ];


    //Recogemos el resultado del select randomizador
    $randId = $sqlData -> getRandomId($filtros);

    $randId = $randId -> fetch_assoc();

    

    if(!empty($randId['id'])) {

        //Recogemos del array resultado únicamente el id (valor)
        $randId = $randId['id'];

        
        //Buscamos el local con el id resultante
        $result = $sqlData->getRandomLocal($randId);
            
        $jsonData = array();

        while($row = $result->fetch_assoc()) {
            $jsonData[] = $row;
        }

        echo json_encode($jsonData);
    } else {
        echo json_encode(false);
    }


    $sql -> close();

?>