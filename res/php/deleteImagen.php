
<?php
    include('connection/Connection.php');
    include('connection/Crud.php');
    include('connection/initialization.php');

    $sqlConnection = new Connection();
    $sqlData = new Crud();
    $sql = $sqlConnection->getConnection();

    //Recogemos la id del registro de imagen y del local
    $idImagen = $_GET['idImagen'];
    $idLocal = $_GET['idLocal'];




    
    //Recogemos el nombre de la imagen con un select
    $nombreImagen = $sql -> query("SELECT imagen FROM imagenes_local WHERE id = $idImagen");

    $nombreImagen = $nombreImagen -> fetch_assoc();

    $nombreImagen = $nombreImagen['imagen'];


    //Borramos la imagen de la base de datos
    $sqlData->deleteImagen($idImagen);

    //Borramos la imagen del servidor
    unlink("../img/$nombreImagen");


    //Recogemos las imágenes del local 
    $result = $sqlData->getImagenes($idLocal);
    
    $jsonData = array();
    
    while($row = $result->fetch_assoc()) {
        $jsonData[] = $row;
    }

    echo json_encode($jsonData);

    $sql -> close();

?>