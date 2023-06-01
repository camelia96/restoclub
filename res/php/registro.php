
<?php
    include('connection/Connection.php');
    include('connection/Crud.php');
    include('connection/initialization.php');

    $sqlConnection = new Connection();
    $sqlData = new Crud();
    $sql = $sqlConnection->getConnection();

    //Si la variable insertar está seteada
    if(isset($_POST['insertar'])) {

        //Recogemos las variables del formulario
        $nombreCompleto = $_POST['nombre'];
        $nombreUsuario = $_POST['usuario'];
        $email = $_POST['email'];
        $password = $_POST['pass'];
        switch($_POST['tipo']) {
            case 'cliente': $tipo = 3;
            break;
            case 'duenyo': $tipo = 2;
            break;
        }

        //Preparamos los datos
        $data = [
            "'{$nombreCompleto}'",
            "'{$nombreUsuario}' ",
            "'{$email}' ",
            "'" . password_hash($password, PASSWORD_DEFAULT) . "' ",
            $tipo
        ];


        //Insertamos el usuario en la bbdd
        $sqlData -> insertarUsuario($data);
    }

    $result = $sqlData->getUsuarios();
    
    $jsonData = array();
    
    while($row = $result->fetch_assoc()) {
        $jsonData[] = $row;
    }

    echo json_encode($jsonData);

    $sql -> close();

?>