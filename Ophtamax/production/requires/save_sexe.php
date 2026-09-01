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
   
$INSERT_GENRE = $pdo->prepare("INSERT INTO genre (id,code,libelle) VALUE (?,?,?)");	
$PARAM = array($id,$code,$libelle);
$INSERT_GENRE -> execute($PARAM);

    header("location:../index.php");

?>

