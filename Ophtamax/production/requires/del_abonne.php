
<?php

    $code = $_GET['code'];
    // echo $code;
    require_once ("cnx.php");
    $DELETE_ABONNE= $pdo ->prepare("DELETE FROM abonne WHERE id = ?");
    $PARAM = array($code);
    $DELETE_ABONNE ->execute($PARAM);

    header("location:../abonne.php");
?>