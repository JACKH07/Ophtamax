<?php

require_once("session.php");

    //$id = SHA1(uniqid());
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
   
$INSERT_FORMULE = $pdo->prepare("INSERT INTO formule_abmt (code,libelle) VALUE (?,?)");	
$PARAM = array($code,$libelle);
$INSERT_FORMULE -> execute($PARAM);

    $_SESSION['mafrmle']= "Formule ajoutée !";

    header("location:../formule.php");

?>

