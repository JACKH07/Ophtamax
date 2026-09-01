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
   
$INSERT_TYPEC = $pdo->prepare("INSERT INTO typecompte (id,code,libelle) VALUE (?,?,?)");	
$PARAM = array($id,$code,$libelle);
$INSERT_TYPEC -> execute($PARAM);

    header("location:../typecomptclient.php");

?>

