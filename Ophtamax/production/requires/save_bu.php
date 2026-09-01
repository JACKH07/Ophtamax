<?php

require_once("session.php");

    $id = SHA1(uniqid());
    $code = $_POST['code'];
    $code_sce = $_POST['code_sce'];
   
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
   
$INSERT_SERVICES = $pdo->prepare("INSERT INTO bu (id,code,code_sce) VALUE (?,?,?)");	
$PARAM = array($id,$code,$code_sce);
$INSERT_SERVICES -> execute($PARAM);

    header("location:../bu.php");

?>

