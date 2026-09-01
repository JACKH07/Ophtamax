
<?php

require_once("session.php");

    $idabonne = $_POST['abonne'];
    $numero = $_POST['numero'];
    $formule = $_POST['formule'];
    $comptec = $_POST['compte'];
    $dateatt = date('Y-m-d H:i:s a');

   
/* Recherche des autres infos de l'abonné*/
require_once("cnx.php");
   
/* Requete abonné*/
$REQ_LISTE_ABONNE = $pdo -> prepare("SELECT * FROM abonne WHERE id=?");
$PARAM = array($idabonne);
$REQ_LISTE_ABONNE  -> execute($PARAM);
$ABN = $REQ_LISTE_ABONNE->fetch();
// $VHL = $REQ_LISTE_VHL->fetch();

$npabonne = ($ABN['nom'])." ".($ABN['prenoms']);
// $matriculeabonne = $ABN['id'];
$buabonne= $ABN['codebu'];
//$sceabonne = $ABN['nom'];
//$capacite = $VHL['capacite_reserv'];

/* Requete service*/
$REQ_LISTE_SCE = $pdo -> prepare("SELECT * FROM bu WHERE code=?");
$PARAM = array($buabonne);
$REQ_LISTE_SCE  -> execute($PARAM);
$BU = $REQ_LISTE_SCE->fetch();
if (isset($BU )){
    $sceabonne = $BU['code_sce'];

}else{
    $sceabonne="";
}


   
$INSERT_ATTRIBUTION = $pdo->prepare("INSERT INTO attribution_sim (idabn,npabn,buabn,sceabn,numabn,formuleabn,cclient,dateatt) VALUE (?,?,?,?,?,?,?,?)");	
$PARAM = array($idabonne,$npabonne,$buabonne,$sceabonne,$numero,$formule,$comptec,$dateatt);
$INSERT_ATTRIBUTION -> execute($PARAM);

$_SESSION['maAttri']= "Attribution effectuée !";
header("location:../attributions.php");

?>

