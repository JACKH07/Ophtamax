 <?php

   /*require_once("requires/session.php");*/

    $login =$_POST['login'];
    $psword =SHA1($_POST['password']);

    // echo $login;
    // echo $psword;

  /*  $email = $_POST['email'];
    $nomphoto=$_FILES['photo']['name'];
    $fichiertemp = $_FILES['photo']['tmp_name']; */

    require_once ("cnx.php");

    /*move_uploaded_file($fichiertemp ,'./images/' . $nomphoto);*/
    $VERIF_USER = $pdo-> prepare("SELECT * FROM user WHERE login_user =? AND pswrd =?");
    $PARAM = array($login,$psword);
    $VERIF_USER->execute($PARAM);

    if ($user = $VERIF_USER->fetch()){
        session_start();
        $_SESSION['PROFILE'] = $user ;
        
        header('location:../index.php');
    }
    else{
        header("location:../login.php");
    }

     ?>