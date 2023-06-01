
<?php
    include('connection/Connection.php');
    include('connection/Crud.php');
    include('connection/initialization.php');
    $sqlConnection = new Connection();
    $sqlData = new Crud();
    $sql = $sqlConnection->getConnection();

    //Recogemos el id del dueño
    $idDuenyo = $_POST['idDuenyo'];


    /**Dependiendo de si estamos insertando o editando, preparamos el nombre de la futura imagen */

    //Si estamos insertando
    if(isset($_POST['insertar'])){
        //Recogemos el id y nombre del último local añadido
        $getId = $sql -> query("SELECT id, nombre FROM local ORDER BY id DESC LIMIT 1");
        $lastId = $getId -> fetch_assoc();
        $idLocal = $lastId['id'];
        $nombreLocal = $lastId['nombre'];

        //Preparamos el nombre del local con guiones por cada espacio, todo en minúsculas, quitando acentos y puntuaciones en los caracteres
        $nombreLocal = explode(' ', $nombreLocal);

        $nombreLocal = implode('-', $nombreLocal);

        $nombreLocal = strtolower($nombreLocal);

        $nombreLocal = preg_replace("/[^a-zA-Z0-9]+/", "-",$nombreLocal);


        $id=0;


    //Si estamos editando
    } else if(isset($_POST['editar'])){
        //Recogemos el id del local y su nombre con una query
        $idLocal = $_POST['idLocal'];

        $getNombre = $sql -> query("SELECT nombre FROM local WHERE id = $idLocal");
        $nombreRecogido = $getNombre -> fetch_assoc();
        $nombreLocal = $nombreRecogido['nombre'];

        //Recogemos el nombre de la ultima imagen añadida de dicho local
        $getLastId = $sql -> query("SELECT imagen FROM imagenes_local WHERE local_id = $idLocal ORDER BY imagen DESC LIMIT 1");
        $lastId = $getLastId -> fetch_assoc();

        if(!empty($lastId)) {
          if(count($lastId)>0) {
            $ultimaImagen = $lastId['imagen'];
          }

          //Preparamos el nombre del local con guiones por cada espacio, todo en minúsculas, quitando acentos y puntuaciones en los caracteres
          $nombreLocal = explode(' ', $nombreLocal);

          $nombreLocal = implode('-', $nombreLocal);

          $nombreLocal = strtolower($nombreLocal);

          $nombreLocal = preg_replace("/[^a-zA-Z0-9]+/", "-",$nombreLocal);

      
          //Separamos el nombre de la imagen en nombre y extension
          $ultimaImagen = explode('.', $ultimaImagen);

          $nombreImagen = $ultimaImagen[0];
          $extension = $ultimaImagen[count($ultimaImagen)-1];


          //Recogemos el número de la imagen
          $nombreImagen = explode('-', $nombreImagen);
          $idUltimaImagen = end($nombreImagen);

          
        } else {

          /*En caso de que $idUltimaImagen no esté seteado, eso quiere decir que por alguna razón
          el local no tiene imágenes. Lo que haremos será setearle nosotros el id 1, ya que nos
          interesa que su primera imagen sea 1*/
          $idUltimaImagen = 1;
        }
                

    }
    


    /**IMÁGENES */
    if(isset($_FILES['files'])) {
        $numArchivos = count($_FILES['files']['name']);
        
        
        for($i = 0; $i < $numArchivos; $i++) {
          $nombreArchivo = $_FILES['files']['name'][$i];
          $tipoArchivo = $_FILES['files']['type'][$i];
          $tamanoArchivo = $_FILES['files']['size'][$i];
          $rutaTemporal = $_FILES['files']['tmp_name'][$i];
          

          //Preparamos la extension segun el tipo de archivo

          switch($tipoArchivo) {
            case 'image/jpeg': $extension = "jpeg";
            break;
            
            case 'image/jpg': $extension = "jpg";
            break;
            
            case 'image/png': $extension = "png";
            break;

            case 'image/webp': $extension = "webp";
            break;
            
            
          } 


          $extension = strtolower($extension);

          //Creamos el nuevo nombre
          if(isset($_POST['insertar'])){
            $id = $i+1;
          } else if(isset($_POST['editar'])){
            $id = $idUltimaImagen + $i + 1;
          }

          $nuevoNombre =  $nombreLocal . "-$id.$extension";

          
          //Movemos la imagen en la carpeta que nos interese
          move_uploaded_file($rutaTemporal, '../img/' . $nuevoNombre);
          
          //Insertamos los registros en la tabla correspondiente
          $sqlData->insertImagenes($idLocal, $nuevoNombre);
        }

    }



    

    //Devolvemos los locales del dueño
    $result = $sqlData->getLocalesDuenyo($idDuenyo);

    $jsonData = array();
    
    while($row = $result->fetch_assoc()) {
        $jsonData[] = $row;
    }

    echo json_encode($jsonData);

    $sql -> close();


?>