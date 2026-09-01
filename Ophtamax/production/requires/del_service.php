
<?php

    $code = $_GET['code'];
    // echo $code;
    require_once ("cnx.php");
    $DELETE_SERVICE= $pdo ->prepare("DELETE FROM services WHERE id = ?");
    $PARAM = array($code);
    $DELETE_SERVICE ->execute($PARAM);

    header("location:../service.php");
?>