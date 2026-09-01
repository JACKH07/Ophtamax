<?php

/*require_once("requires/session.php");*/

/*require_once ("role.php");*/
require_once("requires/cnx.php");

    $id = $_POST['iddivision'];
    $libelle =  $_POST['libelledivision'];
   


    $INSERT_DIVISION = $pdo->prepare("INSERT INTO division(id_division,libelle_division) VALUE (?,?)");
	
    $PARAM1 = array($id,$libelle);
    $INSERT_DIVISION->execute($PARAM1);

    header("location:create_division.php");

?>