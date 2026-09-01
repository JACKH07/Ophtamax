
<?php

require_once("session.php");

    $id = SHA1(uniqid());
    $abrv = $_POST['abrv'];
    $nom = $_POST['nom'];
    $slogan = $_POST['slogan'];
    $adresse = $_POST['adresse'];
    $contact = $_POST['contact'];
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
   
$INSERT_OPERATEUR = $pdo->prepare("INSERT INTO operateur (id,adresse,contact,abreviation,nom,slogan,email) VALUE (?,?,?,?,?,?,?)");	
$PARAM = array($id,$adresse,$contact,$abrv,$nom,$slogan,$email);
$INSERT_OPERATEUR -> execute($PARAM);

$_SESSION['maOp']= "Opérateur ajouté !";
header("location:../operateur.php");

?>

