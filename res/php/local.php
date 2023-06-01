
<?php
    include('connection/Connection.php');
    include('connection/Crud.php');
    include('connection/initialization.php');

//Preparamos la conexión a la base de datos
$sqlConnection = new Connection();
$sqlData = new Crud();
$sql = $sqlConnection->getConnection();


//Recuperamos el idLocal

$idLocal = $_POST['idLocal']; 

//Creamos un array que contendrá el resto de arrays con datos para pintar el local en js
$general = [];

//Con la función rellenoArray, rellenamos los datos desde el CRUD por cada tabla
$general = [
    'local' => rellenoArray('local', $idLocal, $sqlData),
    'imagenes' => rellenoArray('imagenes', $idLocal, $sqlData),
    'promociones' => rellenoArray('promociones', $idLocal, $sqlData),
    'eventos' => rellenoArray('eventos', $idLocal, $sqlData),
    'dietas' => rellenoArray('dietas', $idLocal, $sqlData),
    'pagos' => rellenoArray('pagos', $idLocal, $sqlData),
];


//Creamos distintos arrays para limpiar los datos y, al pasarlos a js, que nos sea más fácil de recoger
$local = [];
$promociones = [];
$eventos = [];
$pagos = [];
$dietas = [];
$imagenes = [];

//Limpiamos los datos
foreach ($general as $nombre_tabla => $array_tabla) {
    if($array_tabla){
        if($nombre_tabla == 'local') {
            foreach ($array_tabla as $indice => $array_contenido) {
                foreach ($array_contenido as $columna => $valor) {
                    $local[$columna] = $valor;
                }
            };
        } else if($nombre_tabla == 'promociones') {
            foreach ($array_tabla as $indice => $array_contenido) {
                foreach ($array_contenido as $columna => $valor) {
                    $promociones[$indice] = $valor;
                }
            };

        } else if($nombre_tabla == 'pagos') {
            foreach ($array_tabla as $indice => $array_contenido) {
                foreach ($array_contenido as $columna => $valor) {
                    $pagos[$indice] = $valor;
                }
            };

        } else if($nombre_tabla == 'dietas') {
            foreach ($array_tabla as $indice => $array_contenido) {
                foreach ($array_contenido as $columna => $valor) {
                    $dietas[$indice] = $valor;
                }
            };

        }else if($nombre_tabla == 'eventos') {
            foreach ($array_tabla as $indice => $array_contenido) {
                $eventos[$indice] = $array_contenido;
            };

        } else if($nombre_tabla == 'imagenes') {
            foreach ($array_tabla as $indice => $array_contenido) {
                foreach ($array_contenido as $columna => $valor) {
                    $imagenes[$indice] = $valor;
                }
            };

        } 

    } 
};


$general = [];

$general = [
    'local' =>  $local,
    'promociones' =>  $promociones,
    'eventos' => $eventos,
    'dietas' => $dietas,
    'pagos' => $pagos,
    'imagenes' => $imagenes
];



//Definimos una función para rellenar un array con los resultados desde crud
function rellenoArray($valor, $idLocal, $sqlData) {
    switch($valor) {
        case 'local': $result = $sqlData -> getLocal($idLocal);

        break;
        
        case 'imagenes': $result = $sqlData -> getImagenes($idLocal);;
        break;
    
        case 'promociones': $result = $sqlData -> getPromocionesLocal($idLocal);;
        break;
    
        case 'eventos': $result = $sqlData -> getEventosLocal($idLocal);;
        break;
    
        case 'dietas': $result = $sqlData -> getDietasLocal($idLocal);;
        break;
    
        case 'pagos': $result = $sqlData -> getPagosLocal($idLocal);;
        break;
    
        
    }
    
    
    //Recogemos los datos y devolvemos el array en cuestión 
    $array = array();

    if($result) {
        while($row = $result->fetch_assoc()) {
            $array[] = $row;
        }
    }
    return $array;
}

//Devolvemos el array general a js

echo json_encode($general);

$sql -> close();


?>