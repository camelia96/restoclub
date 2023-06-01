
<?php
    include('connection/Connection.php');
    include('connection/Crud.php');
    include('connection/initialization.php');
    include('sessions/funciones.php');
    session_start();

    $sqlConnection = new Connection();
    $sqlData = new Crud();
    $sql = $sqlConnection->getConnection();
    

    //Recogemos en un array los datos del usuario
    $dataUsuario = $_POST;

    //Recogemos el idUsuario aparte
    $idUsuario = $_POST['idUsuario'];

    //Creamos un array que será el que mandemos de vuelta al js
    $resultado = [];

    //Antes de hacer un UPDATE queremos comprobar si el nombre de usuario y mail que se quieren cambiar ya existen en la BBDD
    $nombreUsuario = $_POST['nombreUsuarioEdit'];
    $emailUsuario = $_POST['emailEdit'];

    //Necesitamos un booleano para saber si podemos editar o no el usuario
    $editar = true;

    if(!empty($nombreUsuario) || !empty($emailUsuario)) {


        $getNombreUsuario = $sql -> query("SELECT nombreUsuario FROM usuarios WHERE nombreUsuario = '$nombreUsuario'");
        $nombreUsuarioExistente = $getNombreUsuario -> fetch_assoc();


        $getEmail = $sql -> query("SELECT email FROM usuarios WHERE email = '$emailUsuario'");
        $emailExistente = $getEmail -> fetch_assoc();


        
        //Si el nombre de usuario se puede recoger es porque ya existe en la BBDD
        if($nombreUsuarioExistente || $emailExistente) {

            //Se devuelve 'false' al js para anunciar al usuario
            $resultado = [false];

            //No se podrá editar el usuario
            $editar = false;
            
        } else {

            //Si el usuario no existe, podremos editar el usuario
            $editar = true;

        }


    }

    //Si se puede editar el usuario, procedemos a preparar la consulta
    if($editar) {


        //Hacemos el edit del usuario nuevo


        //Nuevo array vacío
        $nuevaDataUsuario = [];

        //Preparamos los valores del array
        foreach ($dataUsuario as $key => $value) {

            //Recogeremos los valores que no estén vacíos
            if(!empty($value)) {

                //Cambiaremos el nombre del $key siempre y cuando no sea usuario (le quitaremos 'Edit')
                if($key != 'idUsuario') {
                    $nuevaDataUsuario[] = substr($key,0, strpos($key, 'Edit'))." = '$value'"; 
                }
            }
        }

        //Creamos una consulta para enviarla al CRUD
        $consultaUsuario = implode(' , ',$nuevaDataUsuario);


        //La enviamos al CRUD
        $sqlData -> editUsuario($consultaUsuario, $idUsuario);


        //Sacamos toda la data del usuario nuevo
        $nuevoUsuario = $sql -> query("SELECT id, nombreCompleto, nombreUsuario, email FROM usuarios WHERE id = $idUsuario");
        $nuevoUsuario = $nuevoUsuario -> fetch_assoc();
        $nombreUsuarioNuevoUsuario = $nuevoUsuario['nombreUsuario'];

        //Hacemos un change session con el nuevo nombre de usuario (independientemente de que hayamos editado el usuario)
        change_session($nombreUsuarioNuevoUsuario);

        //Devolvemos un true y el nuevo usuario
        $resultado = [
            true,
            $nuevoUsuario
        ];
    }

    echo json_encode($resultado);

    $sql -> close();

?>