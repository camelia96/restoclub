
<?php
    include('connection/Connection.php');
    include('connection/Crud.php');
    include('connection/initialization.php');

    $sqlConnection = new Connection();
    $sqlData = new Crud();
    $sql = $sqlConnection->getConnection();

    //Recogemos los datos que nos llegan de js

    //Si la variable idCliente está seteada
    if(isset($_POST['idCliente'])) {
        $idCliente = $_POST['idCliente'];
    }

    //Si la variable idLocal está seteada
    if(isset($_POST['idLocal'])) {
        $idLocal = $_POST['idLocal'];
        
        //Realizamos un primer select para comprobar que la combinación de usuario/local no se encuentre ya en la tabla local_cliente
        $local_cliente = $sqlData -> getLocalCliente($idLocal, $idCliente);

        //Traducimos el resultado en un array
        $localesExistentes = array();

        while($row = $local_cliente->fetch_assoc()) {
            $localesExistentes = $row;
        }

    }


    //Si lo que queremos es modificar datos, checkamos que la variable 'variable' esté seteada 
    if(isset($_POST['variable'])) {
 
        $visitadoFav = $_POST['variable'];

        //Si existen resultados de la query
        if(count($localesExistentes)> 0) {
            
            //Dependiendo de lo que nos diga la variable $visitadoFav prepararemos el array $data[] para después hacer un update
            //$data[0] = visitado, $data[1] = favorito. Sólo cambiaremos un dato a la vez, junto con su pareja anterior, ya que el usuario sólo clica un botón, favorito o visitado
            //NOTA: no realizaremos deletes porque es probable que en el futuro el usuario vuelva a guardar el local y/o no nos interesa eliminar este tipo de información.
            switch($visitadoFav) {
                case 'visitadoTrue': 
                    
                    $data = [
                        1,
                        $localesExistentes['favorito']
                    ];
                    
                break;

                case 'visitadoFalse': 
                    
                    $data = [
                        0,
                        $localesExistentes['favorito']
                    ];
                    
                break;

                case 'favTrue': 
                    
                    $data = [
                        $localesExistentes['visitado'],
                        1
                    ];
                    
                break;

                case 'favFalse': 
                    
                    $data = [
                        $localesExistentes['visitado'],
                        0
                    ];
                    
                break;
                
            }
            

            //Añadimos al array $data los ids necesarios
            array_push($data, $idLocal);
            array_push($data, $idCliente);


            $sqlData -> updateLocalCliente($data);


            
        } else {
        //Si no existen resultados de la query, es decir, no hay registros de esta combinación en la base de datos
            $data = array();


            //Sólo se hará un insert, dependiendo del botón que se haya clicado
            switch($visitadoFav) {
                case 'visitadoTrue': 
                    
                    $data = [
                        $idLocal,
                        $idCliente,
                        1,
                        0
                    ];
                    
                    $sqlData -> insertLocalVisitado($data);
                break;
                
                case 'favTrue': 
                    
                    $data = [
                        $idLocal,
                        $idCliente,
                        0,
                        1
                    ];
                    $sqlData -> insertLocalFavorito($data);
                break;
                
            }
        }

    } 

    //Por otro lado, si la variable 'get' está seteada, lo único que buscaremos será recoger los resultados de fav/visitados de un local para un cliente  (para local.js)
    if(isset($_POST['get'])) {
        $result = $sqlData->getLocalCliente($idLocal, $idCliente);

        $jsonData = array();
            
        while($row = $result->fetch_assoc()) {
            $jsonData = $row;
        }

        echo json_encode($jsonData);
    } 
    
    //Por otra parte, si 'getLocales' está seteada, lo que queremos son todos los locales visitados/favoritos de un usuario (para perfil-cliente.js)
    if(isset($_POST['getLocales'])){
        //Recogemos la variable 'favorito' o 'visitado'
        if(isset($_POST['favoritos'])){
            $condicion = " AND favorito = 1 ";

        } else if(isset($_POST['visitados'])){
            $condicion = " AND visitado = 1 ";

        }        


        //Preparamos los datos
        $data = [
            $idCliente,
            $condicion
        ];


        
        //Realizamos la consulta
        $result = $sqlData->getLocalesClientes($data);


        //Enviamos los datos traducidos a js
        $jsonData = array();
        
        while($row = $result->fetch_assoc()) {
            $jsonData[] = $row;
        }


        echo json_encode($jsonData);

        

    }

    
    
    


    

    $sql -> close();

?>