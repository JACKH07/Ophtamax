
<?php

require_once("session.php");

    $id = SHA1(uniqid());
    // $sfid = $_POST['sfid'];
    // $matricule = $_POST['matricule'];
    $nom = $_POST['nom'];
    $prenoms = $_POST['prenoms'];
    $sexe = $_POST['genre'];
    $bu = $_POST['bu'];
    $email = $_POST['email'];
   
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
   
$INSERT_ABONNE = $pdo->prepare("INSERT INTO abonne (id,codebu,codegenre,nom,prenoms,email) VALUE (?,?,?,?,?,?)");	
$PARAM = array($id,$bu,$sexe,$nom,$prenoms,$email);
$INSERT_ABONNE -> execute($PARAM);

$_SESSION['maAbn']= "Abonné ajouté !";
header("location:../abonne.php");

?>

