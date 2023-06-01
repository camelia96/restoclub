
<?php
    include('connection/Connection.php');
    include('connection/Crud.php');
    include('connection/initialization.php');

    $sqlConnection = new Connection();
    $sqlData = new Crud();
    $sql = $sqlConnection->getConnection();

//Recogemos id del local
$idLocal = $_POST['idLocal'];

//Recogemos el id del dueño
$idDuenyo = $_POST['idDuenyo'];

//Con el id del local, hacemos un select para recoger el id de su direccion asignada
$getId = $sql -> query("SELECT direccion_id FROM local WHERE id = $idLocal");
$lastId = $getId -> fetch_assoc();
$idDireccion = $lastId['direccion_id'];


    //Recogemos los datos de la dirección
    $direccion = array(
        $_POST['latFormEdit'],
        $_POST['longFormEdit'],
        $_POST['calleFormEdit'],
        $_POST['ciudadFormEdit'],
        $_POST['provinciaFormEdit'],
        $_POST['cpFormEdit'],
        $idDireccion
    );


    //Actualizamos la dirección
    $sqlData->updateDireccion($direccion);

    //Recogemos el array que hay en post con el resto de información
    $localRecibido = $_POST;

    //Creamos un array vacío
    $localEditar = array();


    //Dentro del array creado anteriormente, lo rellenamos con los nombres de los índices quitándole 'Form' y añadiéndole '_id' cuando lo necesite
    foreach ($localRecibido as $key => $value) {
        if(str_starts_with($key, 'cat') || str_starts_with($key, 'tipo') || str_starts_with($key, 'gama')) {

            $localEditar[] = substr($key,0, strpos($key, 'F')) . "_id";
        } else {
            $localEditar[] = substr($key,0, strpos($key, 'F'));

        }
    }

    /**Creamos un array que tenga los índices recogidos en $localEditar, y los valores de $localRecibido*/
    $localEditar = array_combine($localEditar, $localRecibido);

    /*Lo dividimos hasta el índice de calle, 
    puesto que los índices posteriores, calle incluido, pertenecen a la tabla dirección
    e*/
    
    $localEditar = array_slice($localEditar, 0, array_search('calle', array_keys($localEditar)));


    //Si la categoria_id es 1, tenemos que poner el valor de tipo_id a vacío
    if($localEditar['categoria_id'] != 1) {
        $localEditar['tipo_id'] = null;
    }


    //Añadimos comillas a cada uno de los valores
    foreach ($localEditar as $key => $value) {
        if($value != '') {
            $localEditar[$key] = "'$value'";
        } else {
            $localEditar[$key] = 'null';
        }
    }

    //Ahora a partir del array que tenemos creamos la consulta
    $consulta = '';
    foreach ($localEditar as $key => $value) {
        $consulta .=  " $key  = $value, ";
    }


    $consulta = rtrim($consulta, ", ");

    

    //Preparamos todos los datos del local 
    //Creamos un array u otro en función de si tipoForm está o no definido

/*    if(isset($_POST['tipoFormEdit'])){
        $local = array(
        $_POST['nombreFormEdit'],
        $_POST['categoriaFormEdit'],
        $_POST['tipoFormEdit'],
        $_POST['webFormEdit'],
        $_POST['red_socialFormEdit'],
        $_POST['precio_medioFormEdit'],
        $_POST['gamaFormEdit'],
        $_POST['menuFormEdit'],
        $_POST['telefonoFormEdit'],
        $idLocal
    );} else {
        $local = array(
            $_POST['nombreFormEdit'],
            $_POST['categoriaFormEdit'],
            $_POST['webFormEdit'],
            $_POST['redFormEdit'],
            $_POST['precioFormEdit'],
            $_POST['gamaFormEdit'],
            $_POST['menuFormEdit'],
            $_POST['telefonoFormEdit'],
            $idLocal
        );
    }*/

    $sqlData->updateLocal($consulta, $idLocal);



    //Devolvemos los locales del dueño
    $result = $sqlData->getLocalesDuenyo($idDuenyo);

    $jsonData = array();
    
    while($row = $result->fetch_assoc()) {
        $jsonData[] = $row;
    }

    echo json_encode($jsonData);

    $sql -> close();



?>