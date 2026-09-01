<?php

require_once("requires/session.php");

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
   
$INSERT_FONCTION = $pdo->prepare("INSERT INTO fonction (id,code,libelle) VALUE (?,?,?)");	
$PARAM = array($id,$code,$libelle);
$INSERT_FONCTION -> execute($PARAM);

    header("location:../fonction.php");

?>

