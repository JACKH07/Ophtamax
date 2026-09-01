
<?php

$code = $_GET['code'];
    
require_once ("cnx.php");

$REQUEST_SELECT_ATT = $pdo ->prepare("SELECT * FROM attribution_sim WHERE id = ? ");
$PARAM = array($code);
$REQUEST_SELECT_ATT ->execute($PARAM);

$ATT = $REQUEST_SELECT_ATT->fetch();

 $id = $ATT['id'];
 $idabn = $ATT['idabn'];
 $npabn = $ATT['npabn'];
 $bu = $ATT['buabn'];
 $sce = $ATT['sceabn'];
 $num = $ATT['numabn'];
 $formule = $ATT['formuleabn'];
 $cclient = $ATT['cclient'];
 $dateatt =  $ATT['dateatt'];
 $dateco = date('Y-m-d H:i:s a');

//INSERT THE OLD LINE IN attribution_log
$INSERT_LOG_ATTRIBUTION = $pdo->prepare("INSERT INTO attribution_log (id,idabn,npabn,buabn,sceabn,numabn,formuleabn,cclient,dateatt,dateco) VALUE (?,?,?,?,?,?,?,?,?,?)");	
$PARAM = array($id,$idabn,$npabn,$bu,$sce,$num,$formule,$cclient,$dateatt,$dateco);
$INSERT_LOG_ATTRIBUTION -> execute($PARAM);

    // $code = $_GET['code'];
    // echo $code;
   
    $DELETE_ATTRIBUTION= $pdo ->prepare("DELETE FROM attribution_sim WHERE id = ?");
    $PARAM = array($code);
    $DELETE_ATTRIBUTION ->execute($PARAM);

    header("location:../attributions.php");
?>