
<?php
    include('connection/Connection.php');
    include('connection/Crud.php');
    include('connection/initialization.php');


//Preparamos la conexión a la base de datos
$sqlConnection = new Connection();
$sqlData = new Crud();
$sql = $sqlConnection->getConnection();


//Recogemos los valores que nos vienen de finder.js
$query_values = $_POST;



//Preparamos la query base
$query_base = "SELECT l.id, l.nombre, c.categoria, tr.tipo,     
(SELECT il.imagen FROM imagenes_local il WHERE l.id = il.local_id LIMIT 1) AS imagen

FROM local l 
LEFT JOIN categorias c ON l.categoria_id = c.id 
LEFT JOIN tipos_restaurante tr ON l.tipo_id = tr.id ";

//Preparamos la query inicial
$extra_query = "WHERE cancelado = 0";


//Preparamos la query final por primera vez, que nos servirá en caso de que no tengamos filtros en el $_POST
$query_final = $query_base;

//Recorremos los arrays dentro del array que viene de $_POST
if($query_values) {
    
    $values = [];

    $queriesLocal= [];
    $queriesTablas = [];

    $strings = [];

    $campo_ordenar = [];

    $nombre = [];

    //Recorremos los arrays anidados en $_POST
    foreach ($query_values as $nombre_campo => $valor_campo) {

        //Separamos los arrays de los strings
        if(gettype($valor_campo) == 'array') {

            /*Para los arrays, construimos un nuevo array, donde cada array anidado asociativo es un tipo de filtro,
            y cada filtro tendrá el nombre de la tabla y el valor a consultar*/
            foreach ($valor_campo as $value) {
                $values[$nombre_campo][] = " {$nombre_campo}_id = '{$value}'";
            }
        } else {
            /*Para los strings, volveremos a hacer una separación. Queremos sacar el campo 'ordenar' en una variable distinta.
            Mientras, al filtrar el resto de campos, estaremos excluyendo aquellos con valor 0. Solo queremos valor 1 o 2 (verdadero/falso)*/
            if($valor_campo != 0 ) {
                $strings[$nombre_campo] = $valor_campo;

            }

            if($nombre_campo == 'ordenar') {
                $campo_ordenar[$nombre_campo] = $valor_campo;
            }
            
            if($nombre_campo == 'nombre') {
                $nombre[$nombre_campo] = $valor_campo;
            }
        }
    
    }

    //Si se ha recibido un nombre, añadimos la petición al extra query
    //$nombre_query = "";
    if(isset($nombre['nombre'])) {
        $extra_query .= " AND l.nombre LIKE '%".$nombre['nombre']."%' "  ;
    }

    //Pasamos a crear la query construyendo dentro de un array, por cada tipo de filtro, un OR por cada valor
    foreach ($values as $nombre_campo => $valor_campo) {

        //Diferenciamos en función de si son columnas de la tabla local (categoria, tipo restaurante, gama), o tablas separadas (tipos de pagos/dietas)
        if($nombre_campo == 'tipos_pago' || $nombre_campo == 'dieta') {
            $queriesTablas[$nombre_campo] = "l.id IN (SELECT local_id FROM {$nombre_campo}s_local WHERE " . implode(" OR ", $valor_campo). ")";
        } else {
            $queriesLocal[$nombre_campo] = "(" . implode(" OR ", $valor_campo). ")";
        }
    }


    
    /*En caso de que existan, juntamos los valores de los arrays anteriores con un AND, 
    preparando también un AND previo a cada implode para juntarlas con las demás peticiones*/
    if(count($queriesLocal) > 0) {
        $extra_query .= " AND  ";
        $extra_query .= " ".implode(" AND ", $queriesLocal);


    } 

    if(count($queriesTablas) > 0) {
        $extra_query .= " AND ";
        $extra_query .= " ".implode(" AND ", $queriesTablas);

    }

    
    /**En el caso de los strings, prepararemos la petición en función del valor, que en este caso solo puede ser verdadero (1) o falso (2) */
    if(count($strings) > 0) {
        //Diferenciamos las acciones dependiendo si estamos en el campo provincia o no
        foreach ($strings as $nombre_campo => $value) {
                      
            
            //Si estamos en provincia, preparamos directamente la petición
            if($nombre_campo == 'provincia') {
                $extra_query .= " AND ( direccion_id IN (SELECT id FROM direcciones WHERE provincia_id = $value)) ";
            }

            //Si queremos filtrar por eventos o promociones, preparamos las peticiones con un IN o NOT IN
            if($nombre_campo == 'eventos' || $nombre_campo == 'promociones') {   

                //Diferenciamos entre IN y NOT IN
                if($value == 1) {
                    $extra_query .= " AND l.id IN"; 
                } else {
                    $extra_query .= " AND l.id NOT IN"; 
                }

                //Rellenamos la query con el resto de la petición
                $extra_query .= " (SELECT local_id FROM ".$nombre_campo."_local ";

                //Si estamos gestionando eventos, queremos que salgan sólo aquellos eventos actuales o futuros
                if($nombre_campo == 'eventos') {
                    $extra_query .= " WHERE fecha >= CURDATE() ";
                }

                //Cerramos el paréntesis
                $extra_query .= ")";
            }
            
        }

        
        
    }

    //Preparamos la petición para ordenar los resultados
    if($campo_ordenar) {
        switch($campo_ordenar['ordenar']) {
            case 'asc': $extra_query .= " ORDER BY l.nombre ASC ";
                break;
            case 'desc': $extra_query .= " ORDER BY l.nombre DESC ";
                break;
        }
    }

    
}
    //Preparamos la query final que nos devolverá los resultados que queramos
    $query_final = $query_base . $extra_query;


    

    //Enviamos la query_final al Crud
    $result = $sqlData -> getLocalesFinder($query_final);

    //Preparamos las variables necesarias para recoger los resultados del Crud
    $jsonData = array();
    
    while($row = $result->fetch_assoc()) {
        $jsonData[] = $row;
    }

    echo json_encode($jsonData);

    $sql -> close();
//print_r($query_final);

    /**
     * SELECT * FROM local WHERE categoria_id = 1 AND id IN (SELECT local_id FROM eventos_local)
     * SELECT * FROM local WHERE categoria_id = 1 AND id NOT IN (SELECT local_id FROM eventos_local)
     * 
     * 
     * SELECT * FROM local WHERE categoria_id = 1 AND id IN (SELECT local_id FROM promociones_local)
     * SELECT * FROM local WHERE categoria_id = 1 AND id NOT IN (SELECT local_id FROM promociones_local)
     * 
     * 
     * SELECT * FROM local WHERE categoria_id = 1 AND id IN (SELECT local_id FROM dietas_local WHERE dieta_id = 2)
     * SELECT * FROM local WHERE categoria_id = 1 AND id IN (SELECT local_id FROM tipos_pago_local WHERE  = 2)
     */



?>