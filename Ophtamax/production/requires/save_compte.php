
<?php

require_once("session.php");

    $id = SHA1(uniqid());
    $ncompte = $_POST['ncompte'];
    $operateur = $_POST['operateur'];
    $tcompte = $_POST['tcompte'];
    $bu = $_POST['bu'];

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
   
$INSERT_COMPTE = $pdo->prepare("INSERT INTO compte (id,comptec,operateur,tcompte,bu) VALUE (?,?,?,?,?)");	
$PARAM = array($id,$ncompte,$operateur,$tcompte,$bu);
$INSERT_COMPTE -> execute($PARAM);

//$_SESSION['maOp']= "Opérateur ajouté !";
header("location:../compte.php");

?>

