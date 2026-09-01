
<?php

    $code = $_GET['code'];
    // echo $code;
    require_once ("cnx.php");
    $DELETE_FORMULE= $pdo ->prepare("DELETE FROM formule_abmt WHERE id = ?");
    $PARAM = array($code);
    $DELETE_FORMULE ->execute($PARAM);

    header("location:../formule.php");
?>