
<?php
    include('connection/Connection.php');
    include('connection/Crud.php');
    include('connection/initialization.php');

    $sqlConnection = new Connection();
    $sqlData = new Crud();
    $sql = $sqlConnection->getConnection();


    $idLocal = $_GET['idLocal'];



    //Recogemos los arrays de insert y delete, comprobando antes que existan

    /////////INSERTS
    if(isset($_GET['dataInsert'])) {
        $inserts =  json_decode(($_GET['dataInsert']));;

        
        //En función de que provengan de pagos o dietas, hacemos un insert u otro
        if(isset($_GET['pagos'])){
            foreach ($inserts as  $value) {
                $sqlData-> insertPagos($idLocal, $value);
            }
    
            

        } else if(isset($_GET['dietas'])) {
            foreach ($inserts as  $value) {
                $sqlData-> insertDietas($idLocal, $value);
            }    
        }
    }

    /////////DELETES
    if(isset($_GET['dataDelete'])) {
        $deletes =  json_decode(($_GET['dataDelete']));;

        //En función de que provengan de pagos o dietas, hacemos un delete u otro
        if(isset($_GET['pagos'])){
            foreach ($deletes as  $value) {
                $sqlData-> deletePagos($idLocal, $value);
            }
    
            

        } else if(isset($_GET['dietas'])) {
            foreach ($deletes as  $value) {
                $sqlData-> deleteDietas($idLocal, $value);
            }    
        }
    }

    

//////???????????
    $result = $sqlData->getTiposPagos();
    
    $jsonData = array();
    
    while($row = $result->fetch_assoc()) {
        $jsonData[] = $row;
    }

    echo json_encode($jsonData);

    $sql -> close();

?>