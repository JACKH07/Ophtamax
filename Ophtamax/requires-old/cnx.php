<?php

try{
    $strConnection = 'mysql:host=localhost;dbname=opticmax_db';
    $pdo = new PDO ($strConnection, 'root', 'G@v****2024@M@rd2024');
}

catch (PDOException $e)  {
    $msg = 'ERREUR PDO dans' .$e->getMessage();
    die ($msg);
}
?>