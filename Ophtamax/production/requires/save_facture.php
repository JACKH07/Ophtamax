
<?php

require_once("session.php");

    // $id = SHA1(uniqid());
    $nfacture = $_POST['nfacture'];
    $montant = $_POST['montant'];
    $ccompte = $_POST['ccompte'];
    $datef = $_POST['datefact'];
    $datedebut = $_POST['datedebu'];
    $datefin = $_POST['datefin'];
    $datelimit = $_POST['datelimite'];

/*
echo $id;
echo $nom;
echo $slogan;
echo $contact;
echo $adress;
echo $email;
echo $logo;

*/
require_once("cnx.php");
//RECHERCEH DE LA FACTURE SI ELLE EXISTE
$REQ_RECHERCHE_FACTURE = $pdo -> prepare("SELECT * FROM facture WHERE numfacture=?");
$PARAM = array($nfacture);
$REQ_RECHERCHE_FACTURE  -> execute($PARAM);

//$FACT= FALSE;

$FACT = $REQ_RECHERCHE_FACTURE ->fetch();

   // extract($FACT);// ['numfacture'] == $nfacture if($FACT == FALSE) 

        // if ($FACT['numfacture'] == $nfacture){
        switch ($FACT){

           case TRUE: 
                    $_SESSION['existFACT']= "La facture exite déjà !";
                    header("location:../facture.php");
                    // echo 'conditionn réussie';
                    break;

           case FALSE: 
                    $INSERT_FACTURE = $pdo->prepare("INSERT INTO facture (numfacture,comptec,montantHT,datef,datedebutfact,datefinfact,datelimitpaie) VALUE (?,?,?,?,?,?,?)");	
                    $PARAM = array($nfacture,$ccompte,$montant,$datef,$datedebut,$datefin,$datelimit);
                    $INSERT_FACTURE -> execute($PARAM);

                    $_SESSION['comptecli']= $ccompte;
                    $_SESSION['codeFac']= $nfacture;
                    $_SESSION['datefact']= $datef;
                    header("location:../details_fact.php");
                    break;
        }

        // if (empty($FACT)){
        
        //     $INSERT_FACTURE = $pdo->prepare("INSERT INTO facture (numfacture,comptec,montantHT,datef,datedebutfact,datefinfact,datelimitpaie) VALUE (?,?,?,?,?,?,?)");	
        //     $PARAM = array($nfacture,$ccompte,$montant,$datef,$datedebut,$datefin,$datelimit);
        //     $INSERT_FACTURE -> execute($PARAM);

        //     $_SESSION['comptecli']= $ccompte;
        //     $_SESSION['codeFac']= $nfacture;
        //     $_SESSION['datefact']= $datef;
        //     header("location:../details_fact.php");
        // }

    // }


?>

