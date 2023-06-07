
<?php
    include('connection/Connection.php');
    include('connection/Crud.php');
    include('connection/initialization.php');

    $sqlConnection = new Connection();
    $sqlData = new Crud();
    $sql = $sqlConnection->getConnection();

    //Recogemos el idDuenyo
    $idDuenyo = $_POST['idDuenyo'];

    //Antes de insertar el local, hemos de insertar la dirección en la tabla 'Direcciones' y recoger su id

    //Limpiamos los datos de calle de posibles comillas
    $calle = $_POST['calleForm'];

    if(str_contains($calle, "'")) {
        $calle = str_replace("'", "", $calle);
    }
    

    //Recogemos los datos de la dirección
    $direccion = array(
        $_POST['latForm'],
        $_POST['longForm'],
        $calle,
        $_POST['ciudadForm'],
        $_POST['provinciaForm'],
        $_POST['cpForm']
    );

    //Insertamos la dirección
    $sqlData->insertDireccion($direccion);

    
    //Recogemos la id de dicha dirección
    $getId = $sql -> query("SELECT id FROM direcciones ORDER BY id DESC LIMIT 1");
    $lastId = $getId -> fetch_assoc();
    $idDireccion = $lastId['id'];


    //Preparamos el array que necesitaremos para la inserción

    //Recogemos el array que hay en post con el resto de información
    $localRecibido = $_POST;

    //Creamos un array vacío
    $localInsertar = array();



    //Dentro del array creado anteriormente, lo rellenamos con los nombres de los índices quitándole 'Form' y añadiéndole '_id' cuando lo necesite
    foreach ($localRecibido as $key => $value) {
        if(str_starts_with($key, 'cat') || str_starts_with($key, 'tipo') || str_starts_with($key, 'gama')) {

            $localInsertar[] = substr($key,0, strpos($key, 'F')) . "_id";
        } else {
            $localInsertar[] = substr($key,0, strpos($key, 'F'));

        }
    }

    
    /**Creamos un array que tenga los índices recogidos en $localInsertar, y los valores de $localRecibido*/
    $localInsertar = array_combine($localInsertar, $localRecibido);

    /*Lo dividimos hasta el índice 9, que es donde está el teléfono. 
    El resto de valores que no queremos pertenecen a la dirección 
    la cual ya hemos hecho su inserción anteriormente*/
    $localInsertar = array_slice($localInsertar, 0, 9);

    

    //Añadimos al final del array 'direccion_id' con un merge
    $direccion = ['direccion_id' => $idDireccion];

    $localInsertar = array_merge($localInsertar, $direccion);

    //Si la categoria_id es 1, tenemos que poner el valor de tipo_id a vacío
    if($localInsertar['categoria_id'] != 1) {
        $localInsertar['tipo_id'] = '';
    }

    //Del array resultado, seleccionamos únicamente aquellos con valor
    $localInsertar = array_filter($localInsertar, "notEmpty");

    function notEmpty($var){
        return !(empty($var));
    }

    //Añadimos comillas a cada uno de los valores
    foreach ($localInsertar as $key => $value) {
        $localInsertar[$key] = "'$value'";
    }

    //Ahora a partir del array que tenemos creamos otros dos que nos ayudarán a crear el INSERT para la base de datos
    $keys = [];

    $keys = array_keys($localInsertar);

    $keys = implode (",", $keys);

    $values = [];

    $values = implode(",", $localInsertar);

    

    
    /*foreach ($localInsertar as $key =>$value) {
        if(str_contains($key, substr($nombre_campo, 0, 3))){
            $localInsertar[$key] = $valor;
        } else {
            echo $key;
            echo substr($nombre_campo, 0, 3);
        }
    }*/
    
/*
    //Preparamos e insertamos todos los datos del local en la tabla 'Local'
    //Creamos un array u otro en función de si tipoForm está o no definido
    if(isset($_POST['tipoForm'])){
        $local = array(
        $_POST['nombreForm'],
        $_POST['categoriaForm'],
        $_POST['tipoForm'],
        $_POST['webForm'],
        $_POST['redForm'],
        $_POST['precioForm'],
        $_POST['gamaForm'],
        $_POST['menuForm'],
        $_POST['telefonoForm'],
        $idDireccion,
    );} else {
        $local = array(
            $_POST['nombreForm'],
            $_POST['categoriaForm'],
            $_POST['webForm'],
            $_POST['redForm'],
            $_POST['precioForm'],
            $_POST['gamaForm'],
            $_POST['menuForm'],
            $_POST['telefonoForm'],
            $idDireccion,
        );
    }*/
    
    $sqlData->insertLocal($keys, $values);

    //Recogemos el id del local añadido que usaremos en las acciones posteriores
    $getId = $sql -> query("SELECT id FROM local ORDER BY id DESC LIMIT 1");
    $lastId = $getId -> fetch_assoc();
    $idLocal = $lastId['id'];

    //Habrán locales que hayan seleccionado tipos de pago y/o dietas. Preparamos los datos para poder insertarlos en las tablas correspondientes
    //Nos resulta más fácil hacer un insert directo desde aquí en vez de tenerlo preparado en CRUD.php

    /*TIPOS DE PAGO*/
    $queryTiposPago = '';

    //Si efectivo está checked, el id del tipo pago es 1
    if(isset($_POST['tipoEfectivoForm'])) {
        $queryTiposPago = "($idLocal, 1)";
    }


    //Si tarjeta está checked, el id del tipo pago es 1
    if(isset($_POST['tipoTarjetaForm'])) {
        //Si hay más de dos tipos de pago, la query ha de tener coma
        if($queryTiposPago != '') {
            $queryTiposPago = $queryTiposPago . ", ($idLocal, 2)";
        } else {
            $queryTiposPago = "($idLocal, 2)";
        }
    }


    //Si efectivo está checked, el id del tipo pago es 1
    if(isset($_POST['tipoBizumForm'])) {
        //Si hay más de dos tipos de pago, la query ha de tener coma
        if($queryTiposPago != '') {
            $queryTiposPago = $queryTiposPago . ", ($idLocal, 3)";
        } else {

            $queryTiposPago = "($idLocal, 3)";
        }

        
    }

    if(!empty($queryTiposPago)) {
        $insertarTiposPago ="INSERT INTO tipos_pagos_local (local_id, tipos_pago_id) VALUES $queryTiposPago";

        $sql -> query($insertarTiposPago);
    }

    
    
    /**DIETAS */
    $queryDietas = '';

    //Si singluten está checked, el id del tipo pago es 1
    if(isset($_POST['sinGlutenForm'])) {
        $queryDietas = "($idLocal, 1)";
    }


    //Si vegetariano está checked, el id del tipo pago es 1
    if(isset($_POST['vegetarianoForm'])) {
        //Si hay más de dos tipos de dieta, la query ha de tener coma
        if($queryDietas != '') {
            $queryDietas = $queryDietas . ", ($idLocal, 2)";
        } else {
            $queryDietas = "($idLocal, 2)";
        }
    }


    if(!empty($queryDietas)) {
        $insertarDietas ="INSERT INTO dietas_local (local_id, dieta_id) VALUES $queryDietas";
        $sql -> query($insertarDietas);

    }

    /**EVENTOS */
    //Habrán locales con eventos. Primero hacemos un isset
    if(isset($_POST['eventos'])) {

        //Si hay eventos los convertiremos en un array para trabajar con ellos
        $eventos =  json_decode($_POST['eventos'], true);

        //Creamos un array vacío
        $valores = array();

        //Rellenamos el array con los valores que hay en cada $indice
        foreach ($eventos as $indice => $evento) {
            foreach ($evento as $nombre_campo => $valor_campo) {
                //Sólo queremos los value
                if($nombre_campo == 'value') {
                    $valores[$indice] = "$valor_campo";
                }
            }
        }

        
        //Dividimos el array en trozos de dos en dos
        $eventosLimpio = array_chunk($valores, 2);
        
        //Entramos dentro del array
        //$eventosLimpio = $eventosLimpio[0];

        //Añadimos al array el idLocal
        //array_push($eventosLimpio, $idLocal);


        $consultaEventos='';

        //print_r($eventosLimpio);
        //Preparamos una consulta con los valores del array
        foreach ($eventosLimpio as $key => $evento) {
            
            $consultaEventos .= "( ";

            foreach ($evento as $indice => $valor) {
                $consultaEventos.= "'$valor',";

            }
            
            $consultaEventos.= " $idLocal), ";
            
        }

        
        //Quitamos la coma final de la consulta
        $consultaEventos = rtrim($consultaEventos, ", ");

        //Enviamos los datos al Crud
        $sqlData -> insertEvento($consultaEventos);

    }

    /*PROMOCIONES */
    //Habrán locales con promociones. Hacemos un isset
    if(isset($_POST['promociones'])) {
        //Si hay promociones las convertiremos en un array para trabajar con ellas
        $promociones =  json_decode($_POST['promociones'], true);


        
        //Creamos un array vacío
        $valores = array();

        foreach ($promociones as $promocion => $valor) {
            foreach ($valor as $key => $value) {
                //Recorremos el array de arrays que recogemos desde js y metemos en nuestro array vacío $valores únicamente los valores
                if($key == 'value') {
                    array_push($valores, $value);

                }
            }
        }


        $consultaPromo = '';

        //Recorremos el array para preparar la consulta
        foreach ($valores as $key => $value) {
            $consultaPromo .= "('$value', $idLocal),";
        }

        //Quitamos la última coma para que funcione en la BBDD
        $consultaPromo = rtrim($consultaPromo, ",");



        //Insertamos datos con la consulta preparada
        $sqlData -> insertPromocion($consultaPromo);

    }


    
    //Como la inserción ha sido realizada por un dueño, tenemos que añadir el registro correspondiente en la tabla 'local_usuario'

    
    //Hacemos la inserción
    $sqlData->insertLocalDuenyo($idDuenyo, $idLocal);



    //Devolvemos los locales del dueño
    $result = $sqlData->getLocalesDuenyo($idDuenyo);


    $jsonData = array();
    
    while($row = $result->fetch_assoc()) {
        $jsonData[] = $row;
    }

    echo json_encode($jsonData);

    $sql -> close();



?>
