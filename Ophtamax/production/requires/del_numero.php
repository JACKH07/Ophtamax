
<?php

    $code = $_GET['code'];
    // echo $code;
    require_once ("cnx.php");
    $DELETE_NUMERO= $pdo ->prepare("DELETE FROM numero WHERE id = ?");
    $PARAM = array($code);
    $DELETE_NUMERO ->execute($PARAM);

    header("location:../numero.php");
?>