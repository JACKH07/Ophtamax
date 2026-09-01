<?php

require_once("session.php");

    $id = SHA1(uniqid());
    $nom = $_POST['nom'];
    $prenoms = $_POST['prenoms'];
    $sexe = $_POST['sexe'];
    $datenais = $_POST['datenais'];
    $mail =$_POST['email'];
    $phone = $_POST['phone'];
    $login = $_POST['login'];
    $password =SHA1($_POST['password']);
    $role =$_POST['role'];

/*
echo $id;
echo $nom;
echo $prenoms;
echo $sexe;
echo $datenais;
echo $mail;
echo $phone;
echo $login;
echo $password;
echo $role;

*/
require_once("cnx.php");
   
$INSERT_USER = $pdo->prepare("INSERT INTO user(id,nom,prenoms,sexe,datenais,email,contact,login_u,password_u,coderole) VALUE (?,?,?,?,?,?,?,?,?,?)");	
$PARAM1 = array($id,$nom,$prenoms,$sexe,$datenais,$mail,$phone,$login,$password,$role);
$INSERT_USER -> execute($PARAM1);

$_SESSION['maUser']= "User ajouté !";

    header("location:../user.php");

?>

