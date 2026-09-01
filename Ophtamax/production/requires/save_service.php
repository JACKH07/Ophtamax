<?php

require_once("session.php");

    $id = SHA1(uniqid());
    $code = $_POST['code'];
    $libelle = $_POST['libelle'];
   
/*
echo $id;
echo $nom;
echo $slogan;
echo $contact;
echo $adress;
echo $email;
echo $logo;

*/

require_once("cnx.php");
   
$INSERT_SERVICES = $pdo->prepare("INSERT INTO services (id,code,libelle) VALUE (?,?,?)");	
$PARAM = array($id,$code,$libelle);
$INSERT_SERVICES -> execute($PARAM);

    $_SESSION['maSce']= "Service ajouté !";

    header("location:../service.php");

?>

