<?php

require_once("session.php");

    // $id = SHA1(uniqid());
    $numero = $_POST['numero'];
    $typenum = $_POST['tcompte'];
    $operateur = $_POST['operateur'];
   
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
   
$INSERT_NUMERO= $pdo->prepare("INSERT INTO numero (numero,typenum,operateur ) VALUE (?,?,?)");	
$PARAM = array($numero,$typenum,$operateur);
$INSERT_NUMERO -> execute($PARAM);

    $_SESSION['maNum']= "Numéro ajouté !";

    header("location:../numero.php");

?>

