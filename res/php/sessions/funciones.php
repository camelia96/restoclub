<?php

    //Get session
    function get_session() {
        return $_SESSION['user'];
    }

    //Set session
    function set_session($user) {
        $_SESSION['user'] = $user;
        return true;
    }

    //Check session
    function check_session(){
        if(isset($_SESSION['user']) && $_SESSION['user'] != "") {
            return true;
        } else {
            return false;
        }
    }

    //Cambiar session
    function change_session($nuevoUsuario){
        if($_SESSION['user'] = $nuevoUsuario) {
            return true;
        } else {
            return false;
        }
    }

    //Unset session
    function unset_session() {
        unset($_SESSION['user']);
        session_destroy();
        if(!isset($_SESSION['user']) || is_null($_SESSION['user'])) {
            return true;
        } else {
            return false;
        }
    }

?>