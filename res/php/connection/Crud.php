<?php
    class Crud{
        /** GENERAL */
        public function getCategorias() {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT * FROM categorias";
            $result = $mySQL->query($sql);
            return $result;
        }

        public function getTiposRestaurantes() {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT * FROM tipos_restaurante";
            $result = $mySQL->query($sql);
            return $result;
        }

        public function getTiposPagos() {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT id, tipo_pago as pago FROM tipos_pago";
            $result = $mySQL->query($sql);
            return $result;
        }

        public function getDietas() {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT * FROM dietas";
            $result = $mySQL->query($sql);
            return $result;
        }

        public function getGamas() {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT * FROM gamas";
            $result = $mySQL->query($sql);
            return $result;
        }

        public function getProvincias() {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT * FROM provincias";
            $result = $mySQL->query($sql);
            return $result;
        }

        //Selects LOCALES

        /**Finder */
        public function getLocalesFinder($sql) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            //print_r($sql);
            $result = $mySQL->query($sql);
            return $result;
        }

        /**Perfil duenyo */
        public function getLocalesDuenyo($idUsuario) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT l.id, l.nombre, c.categoria, lu.usuario_id FROM local_duenyo lu INNER JOIN local l ON lu.local_id = l.id INNER JOIN categorias c ON c.id = l.categoria_id WHERE l.cancelado = 0 AND usuario_id = $idUsuario";
            $result = $mySQL->query($sql);

            return $result;
        }

        public function getLocalDuenyo($idUsuario, $idLocal) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT l.id, l.nombre, l.web, l.red_social, l.precio_medio, l.menu, l.telefono,  l.gama_id, l.categoria_id, l.tipo_id, g.gama,  d.calle, d.ciudad, d.cp, d.latitud, d.longitud,d.provincia_id, p.provincia, c.categoria, tp.tipo 
            FROM local l 
            JOIN local_duenyo lu ON l.id = lu.local_id 
            JOIN categorias c ON c.id = l.categoria_id 
            JOIN gamas g ON g.id = l.gama_id 
            JOIN direcciones d ON d.id = l.direccion_id 
            JOIN provincias p ON p.id = d.provincia_id  
            LEFT JOIN tipos_restaurante tp ON tp.id = l.tipo_id  
            WHERE cancelado = 0 AND lu.usuario_id = $idUsuario AND l.id = $idLocal";

            $result = $mySQL->query($sql);
            return $result;
        }
        public function getPromocionesLocalUsuario($data) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT  pl.id, pl.promocion FROM local l 
            JOIN local_duenyo lu ON l.id = lu.local_id 
            JOIN promociones_local pl ON pl.local_id = l.id
            WHERE lu.usuario_id = ".$data[0]." AND l.id =  ".$data[1];
            $result = $mySQL->query($sql);
            return $result;
        }
        public function getDietasLocalUsuario($data) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT d.id,  d.dieta FROM local l 
            JOIN local_duenyo lu ON l.id = lu.local_id 
            JOIN dietas_local dl ON dl.local_id = l.id
            JOIN dietas d ON d.id = dl.dieta_id
            WHERE lu.usuario_id = ".$data[0]." AND l.id =  ".$data[1];
            $result = $mySQL->query($sql);
            return $result;
        }
        public function getPagosLocalUsuario($data) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT tp.id, tp.tipo_pago FROM local l 
            JOIN local_duenyo lu ON l.id = lu.local_id 
            JOIN tipos_pagos_local tpl ON tpl.local_id = l.id
            JOIN tipos_pago tp ON tp.id = tpl.tipos_pago_id
            WHERE lu.usuario_id = ".$data[0]." AND l.id =  ".$data[1];
            $result = $mySQL->query($sql);
            return $result;
        }
        public function getEventosLocalUsuario($data) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT  el.id, el.fecha, el.evento FROM local l 
            JOIN local_duenyo lu ON l.id = lu.local_id 
            JOIN eventos_local el ON el.local_id = l.id
            WHERE lu.usuario_id = ".$data[0]." AND l.id =  ".$data[1];
            $result = $mySQL->query($sql);
            return $result;
        }

        /**Local específico */

        public function getLocal($idLocal) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT l.nombre, c.categoria,  tp.tipo ,l.web, l.red_social, l.precio_medio,  g.gama, l.menu, l.telefono,  d.calle, d.ciudad, d.cp, d.latitud, d.longitud, p.provincia
            FROM local l 

            JOIN categorias c ON c.id = l.categoria_id 
            JOIN gamas g ON g.id = l.gama_id 
            JOIN direcciones d ON d.id = l.direccion_id 
            JOIN provincias p ON p.id = d.provincia_id  
            LEFT JOIN tipos_restaurante tp ON tp.id = l.tipo_id  
            WHERE l.id = $idLocal";


            $result = $mySQL->query($sql);
            return $result;
        }


        public function getImagenes($data) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT * FROM imagenes_local WHERE local_id =  $data";
            $result = $mySQL->query($sql);
            return $result;
        }

        public function getPromocionesLocal($idLocal) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT pl.promocion FROM local l 

            JOIN promociones_local pl ON pl.local_id = l.id
            WHERE l.id =  $idLocal";

            $result = $mySQL->query($sql);
            return $result;
        }
        public function getDietasLocal($idLocal) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT d.dieta FROM local l 
            JOIN dietas_local dl ON dl.local_id = l.id
            JOIN dietas d ON d.id = dl.dieta_id
            WHERE l.id =  $idLocal";

            $result = $mySQL->query($sql);
            return $result;
        }
        public function getPagosLocal($idLocal) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT  tp.tipo_pago FROM local l 
            JOIN tipos_pagos_local tpl ON tpl.local_id = l.id
            JOIN tipos_pago tp ON tp.id = tpl.tipos_pago_id
            WHERE l.id =  $idLocal";

            $result = $mySQL->query($sql);
            return $result;
        }
        public function getEventosLocal($idLocal) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT  el.fecha, el.evento FROM local l 
            JOIN eventos_local el ON el.local_id = l.id
            WHERE l.id =  $idLocal
            AND el.fecha >= CURDATE()";

            $result = $mySQL->query($sql);
            return $result;
        }

        
        //Para visitado/favorito de un único local cuando un usuario está logeado
        public function getLocalCliente($idLocal, $idCliente) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT * FROM local_cliente WHERE local_id = $idLocal AND usuario_id = $idCliente";

            $result = $mySQL->query($sql);
            return $result;
        }
        
        //Para sacar visitados/favoritos de un usuario específico de todos sus locales
        public function getLocalesCliente($data) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT lc.id, l.nombre,  l.id as idLocal, lc.usuario_id as idCliente, 
            (SELECT il.imagen FROM imagenes_local il WHERE l.id = il.local_id LIMIT 1) AS imagen
            FROM local_cliente lc 
            JOIN local l ON l.id = lc.local_id
            JOIN imagenes_local il ON l.id = il.local_id
            WHERE l.cancelado = 0 AND usuario_id = $data[0] $data[1] GROUP BY lc.id";

            $result = $mySQL->query($sql);

            return $result;
        }



        
        
        public function getComentarios($idLocal = '') {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $condicion = '';

            if($idLocal != '') {
                $condicion = "WHERE local_id = ".$idLocal;
            }

            $sql = "SELECT c.id, c.fecha, c.comentario, u.nombreCompleto, u.id as idCliente
            FROM comentarios c 
            JOIN usuarios u ON c.usuario_id = u.id $condicion 
            ORDER BY c.fecha DESC";

            $result = $mySQL->query($sql);
            return $result;
        }
        
        
        public function getComentariosPerfil($idPerfil) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT c.id, c.fecha, c.comentario, u.nombreCompleto, u.id as idCliente, l.nombre as localNombre 
            FROM comentarios c 
            JOIN local l ON l.id = c.local_id
            JOIN usuarios u ON c.usuario_id = u.id 
            WHERE c.usuario_id = $idPerfil
            ORDER BY c.fecha DESC";

            $result = $mySQL->query($sql);
            return $result;
        }

        
        

        //Inserts LOCALES
      public function insertLocal($keys, $values) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();


            $sql = "INSERT INTO local ($keys, cancelado) VALUES ($values, 0)";
            $mySQL -> query($sql);
        }

      public function insertLocalDuenyo($idUsuario, $idLocal) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "INSERT INTO local_duenyo (`usuario_id`, `local_id`) VALUES ($idUsuario, $idLocal)";
            $mySQL -> query($sql);
        }

      public function insertDireccion($data) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "INSERT INTO direcciones (latitud, longitud, calle, ciudad, provincia_id, cp) VALUES ('$data[0]', '$data[1]', '$data[2]', '$data[3]','$data[4]', '$data[5]')";
            
            
            $mySQL -> query($sql);

        }

        
        public function insertEvento($data) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "INSERT INTO eventos_local (`fecha`, `evento`, `local_id`) VALUES $data";
            //print_r($sql);
            $mySQL -> query($sql);
        }

        
      public function insertPromocion($data) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();
            $sql = "INSERT INTO promociones_local (`promocion`, `local_id`) VALUES $data";
print_r($sql);
            $mySQL -> query($sql);
        }
        
        public function insertEventoEdit($data) {
              $sqlConnection = new Connection();
              $mySQL = $sqlConnection->getConnection();
  
              $sql = "INSERT INTO eventos_local (`fecha`, `evento`, `local_id`) VALUES ('$data[0]', '$data[1]' ,$data[2])";
  
              $mySQL -> query($sql);
          }
  
          
        public function insertPromocionEdit($promocion, $idLocal) {
              $sqlConnection = new Connection();
              $mySQL = $sqlConnection->getConnection();
  
              $sql = "INSERT INTO promociones_local (`promocion`, `local_id`) VALUES ('$promocion', $idLocal)";
  
              $mySQL -> query($sql);
          }


      public function insertImagenes( $local_id, $imagen) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "INSERT INTO `imagenes_local`(`local_id`, `imagen`) VALUES ($local_id, '$imagen')";
            $mySQL -> query($sql);
        }

      public function insertPagos($local_id, $pago) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "INSERT INTO tipos_pagos_local (`local_id`, `tipos_pago_id`) VALUES ($local_id, $pago)";
            $mySQL -> query($sql);
        }

      public function insertDietas($local_id, $dieta) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "INSERT INTO dietas_local (`local_id`, `dieta_id`) VALUES ($local_id, $dieta)";
            $mySQL -> query($sql);
        }


      public function insertLocalVisitado($data) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "INSERT INTO `local_cliente`(`local_id`, `usuario_id`, `visitado`, `favorito`) VALUES ($data[0], $data[1], $data[2], $data[3])";
            $mySQL -> query($sql);
        }

        

      public function insertLocalFavorito($data) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "INSERT INTO `local_cliente`(`local_id`, `usuario_id`, `visitado`, `favorito`) VALUES ($data[0], $data[1], $data[2], $data[3])";
            $mySQL -> query($sql);
        }


      public function insertComentario($data) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "INSERT INTO `comentarios` (`local_id`, `usuario_id`, `fecha`, `comentario`) VALUES ($data[0], $data[1], NOW(), '$data[2]')";
            $mySQL -> query($sql);
        }

        

        //Updates LOCALES
      public function updateLocal( $consulta, $idLocal) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            //Definimos una query u otra con los datos recibidos
            $sql = "UPDATE `local` SET $consulta WHERE id = $idLocal";
            $mySQL -> query($sql);
        }


      public function updateDireccion( $data) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "UPDATE `direcciones` SET `latitud`='$data[0]',`longitud`='$data[1]',`calle`='$data[2]',`ciudad`='$data[3]',`provincia_id`='$data[4]',`cp`='$data[5]' WHERE `id`= '$data[6]'";
            $mySQL -> query($sql);
        }

      public function updateLocalCliente( $data) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "UPDATE `local_cliente` SET `visitado`=$data[0],`favorito`=$data[1] WHERE local_id = $data[2] AND usuario_id = $data[3]";
            $mySQL -> query($sql);
        }


        //Deletes LOCALES
      public function deleteLocal($idLocal) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "UPDATE `local` SET `cancelado`= 1 WHERE id = $idLocal";
            $mySQL -> query($sql);
        }

      public function deletePromocion($idPromo) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "DELETE FROM `promociones_local` WHERE id = $idPromo";
            $mySQL -> query($sql);
        }

      public function deleteEvento($idEvento) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "DELETE FROM `eventos_local` WHERE id = $idEvento";
            $mySQL -> query($sql);
        }

        
      public function deletePagos($idLocal, $idPago) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "DELETE FROM `tipos_pagos_local` WHERE local_id = $idLocal AND tipos_pago_id = $idPago";
            $mySQL -> query($sql);
        }

        
      public function deleteDietas($idLocal, $idDieta) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "DELETE FROM `dietas_local` WHERE local_id = $idLocal AND dieta_id = $idDieta";
            $mySQL -> query($sql);
        }
        
      public function deleteImagen($idImagen) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "DELETE FROM `imagenes_local` WHERE id = $idImagen";
            $mySQL -> query($sql);
        }

      public function deleteComentario($idComentario) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "DELETE FROM `comentarios` WHERE id = $idComentario";
            
            $mySQL -> query($sql);
        }


        /**USUARIOS */
        public function getUsuarios() {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT * FROM usuarios";
            $result = $mySQL->query($sql);
            return $result;
        }
        
        
      public function insertarUsuario($data) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();


            
            $contrasenya = '';
            if(count($data) == 5) {
                $contrasenya = " `contrasenya` ,";
            }
            $data = implode(", ", $data);


            $sql = "INSERT INTO `usuarios`( `nombreCompleto`, `nombreUsuario`, `email`,".$contrasenya." `tipo`) VALUES ($data)";

            echo $sql;
            $mySQL -> query($sql);
        }

      public function editUsuario($consulta, $idUsuario) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "UPDATE `usuarios` SET $consulta WHERE id = $idUsuario";
            //echo $sql;
            $mySQL -> query($sql);

        }


        /**RANDOMIZADOR */
        public function getRandomId($filtros) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT l.id FROM local l 
                JOIN direcciones d ON d.id = l.direccion_id
                JOIN provincias p ON p.id = d.provincia_id
                WHERE l.cancelado = 0 
                $filtros[0] $filtros[1] 
                ORDER BY RAND() 
                LIMIT 1;";

            $result = $mySQL->query($sql);

            return $result;
        }



        public function getRandomLocal($idLocal) {
            $sqlConnection = new Connection();
            $mySQL = $sqlConnection->getConnection();

            $sql = "SELECT l.id, l.nombre, c.categoria,  tp.tipo, d.ciudad, p.provincia, 
                    (SELECT il.imagen FROM imagenes_local il WHERE l.id = il.local_id LIMIT 1) AS imagen
                    FROM local l 
                    JOIN categorias c ON c.id = l.categoria_id 
                    JOIN direcciones d ON d.id = l.direccion_id 
                    JOIN provincias p ON p.id = d.provincia_id  
                    LEFT JOIN tipos_restaurante tp ON tp.id = l.tipo_id  
                    WHERE l.id = $idLocal";

            $result = $mySQL->query($sql);

            return $result;
        }

    }
?>