
<?php

    $code = $_GET['code'];
    // echo $code;
    require_once ("cnx.php");
    $DELETE_COMPTE= $pdo ->prepare("DELETE FROM compte WHERE id = ?");
    $PARAM = array($code);
    $DELETE_COMPTE ->execute($PARAM);

    header("location:../compte.php");
?>