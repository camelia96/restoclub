<?php
    class Connection{
        private $server= 'localhost';
        private $user= 'camelia';
        private $password= 'Quefollon123';
        private $db= 'cs_restoclub';

        public function getConnection(){
            return $conexion = new mysqli(
                $this->server,
                $this->user,
                $this->password,
                $this->db
            );
        }
 
    
    }

    $prueba = new Connection();
    $pruebaConexion = $prueba->getConnection();

   /* if($pruebaConexion->connect_error) {
        echo "No hay conexión";
    } else {
        echo "Hay conexión";
    }*/

?>