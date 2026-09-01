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

$INSERT_ROLE = $pdo->prepare("INSERT INTO roles (id,code,libelle) VALUE (?,?,?)");	
$PARAM = array($id,$code,$libelle);
$INSERT_ROLE -> execute($PARAM);

$_SESSION['maRole']= "Rôle ajouté !";

header("location:../roles.php");


?>