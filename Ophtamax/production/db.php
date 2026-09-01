<?php

try{
    $strConnection = 'mysql:host=localhost;dbname=db_host';
    $pdo = new PDO ($strConnection, 'root', 'G@v****2023@M@rd2023');
}

catch (PDOException $e)  {
    $msg = 'ERREUR PDO dans' .$e->getMessage();
    die ($msg);
}
?>