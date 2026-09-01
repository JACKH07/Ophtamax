<?php

require_once("cnx.php");
 
$codefact = $_POST['codefact'];
$datef = $_POST['datefact'];


error_reporting(E_ALL | E_STRICT);
require_once ("../Classes/PHPExcel.php");
require_once ("../Classes/PHPExcel/Autoloader.php");


if(isset($_POST['importer'])){
//echo '<pre>';
	//var_dump($_FILES);
//echo '</pre>';
	
	$fileName= $_FILES['ExcelFile'] ['name'];
	//echo $fileName;
	$fileExtension = explode('.',$fileName);
	$fileExtension = strtolower(end($fileExtension));


	$newFileName= date("d.m.Y") ." - ". $fileName;
	$targetDirectory = "../uploads/" .$newFileName;
	move_uploaded_file($_FILES["ExcelFile"]["tmp_name"], $targetDirectory);

//$path="uploads/newFileName";

//$path="excel/test1.xlsx";

$reader=PHPExcel_IOFactory::createReaderForFile($targetDirectory);
$excel_Obj =  $reader->load($targetDirectory);

$worksheet=$excel_Obj->getSheet('0');

//$val1 = $worksheet->getCell('B4')->getValue();
//echo ('0'.$val1);


$lastRow = $worksheet->getHighestRow();
$colomncount = $worksheet->getHighestDataColumn();
$colomncount_number=PHPExcel_Cell::columnIndexFromString($colomncount);


//echo $lastRow.'    ';
//echo $colomncount;
$col0=0;
$col3=3;
$numfacture = $codefact;
$datefact = $datef;


//echo "<table>";

		for($row=2;$row<=$lastRow;$row++){
			//echo "<tr border='1'>";
				//for($col=1;$col<=$colomncount_number;$col++){
				
					//echo "<td>";
						
                    // $dateExcel= $worksheet->getCell(PHPExcel_Cell::stringFromColumnIndex($col2).$row)->getValue();
                    // $dateExcel = (int)$dateExcel;
                    // $dateComp =  date('Y/m/d', ($dateExcel - 25569)*24*60*60);
					//echo  $dateComp;
					          $numero = '0'.$worksheet->getCell(PHPExcel_Cell::stringFromColumnIndex($col0).$row)->getValue();
                    $Montant = $worksheet->getCell(PHPExcel_Cell::stringFromColumnIndex($col3).$row)->getValue();
					// //echo  "&emsp;";
          //           $montant = $worksheet->getCell(PHPExcel_Cell::stringFromColumnIndex($col3).$row)->getValue();
					// //echo  "&emsp;";
          //           $kmAv = $worksheet->getCell(PHPExcel_Cell::stringFromColumnIndex($col10).$row)->getValue();
					// //echo  "&emsp;";
          //           $kmNew = $worksheet->getCell(PHPExcel_Cell::stringFromColumnIndex($col11).$row)->getValue();
					// //echo  "&emsp;";
          //           $distPar = $kmNew-$kmAv;
          //           $quantite = $worksheet->getCell(PHPExcel_Cell::stringFromColumnIndex($col16).$row)->getValue();
          //           if ($distPar <=0 ){
          //               $conso100 = 0;
          //           }
          //           else{
          //           $conso100 = ($quantite/$distPar)*100;
          //           $conso100 = number_format($conso100,2);
          //         }
					// //echo  "&emsp;";
                    

         require_once("cnx.php");
   
        $INSERT_DETAIL_FACTURES = $pdo->prepare("INSERT INTO detail_facture (codefacture,numero,montantht,datefact) VALUE (?,?,?,?)");	
        $PARAM = array($numfacture,$numero,$Montant,$datefact);
        $INSERT_DETAIL_FACTURES -> execute($PARAM);
                    
        
          /*echo $worksheet->getCell(PHPExcel_Cell::stringFromColumnIndex($col17).$row)->getValue();
					echo  "&emsp;";
						echo  date("d/m/Y");
					
					echo "</td>";

				
			echo "<tr>";*/
        }
    /*
                        require_once("cnx.php");
                        /* TRANSFERT DE TRANSACT DANS TRANSACT_LOG AVEC LES INFO USER ET SERVICE
                        $REQ_LISTE_COMPILETR_TEMP = $pdo -> prepare("SELECT * FROM complietransaction ");
                        //$PARAM = array($date1,$date2); 
                        $REQ_LISTE_COMPILETR_TEMP -> execute();

                        
                        //VIDER LA TABLE TEMP DE TRIE (CONSO GRAPHE)
                        $REQ_RESETTABLETEMP = $pdo->prepare("TRUNCATE TABLE compiletransact_log");
                        $REQ_RESETTABLETEMP -> execute();


                        while ($TEMP = $REQ_LISTE_COMPILETR_TEMP->fetch()){
        
                          $immatVehilcul = $TEMP['immatriculation_veh'];
                          $conso100 = $TEMP['consoLT_100'];
                          
                        
                          $REQ_ATTR = $pdo -> prepare("SELECT * FROM attribution WHERE immatriculation=?");
                          $PARAM = array($immatVehilcul);
                          $REQ_ATTR  -> execute($PARAM);
                        
                          $ATT = $REQ_ATTR->fetch();
                        
                          if (!$ATT){
                            $sertvice = "";
                            $npagent = "";
                          }
                          else{
                        
                            $sertvice = $ATT['services'];
                            $npagent = $ATT['npagent'];
                            $capacite = $ATT['capacite'];
                        
                          }
                        
                        
                          //$conso100 = ($CPTR['c100']/$CPTR['cpt']);
                          //$conso = number_format($conso100,2);
                          $dateT=$TEMP['dateT'];
                          $montant = $TEMP['montant'];
                          $kmavt = $TEMP['km_avant'];
                          $kmnew = $TEMP['km_nouveau'];
                          $dist = $TEMP['dist_parcourue'];
                          $quantite=$TEMP['quantite'];
                          $numcarte = $TEMP['num_carte'];
                        
                        
                          //INSERT DANS LA TABLE DETAIL AFIN DE FAIRE LE TRI
                          $INSERT_DETAILCONSO_TEMP = $pdo->prepare("INSERT INTO compiletransact_log (services,agent,immatriculation_veh,capacite,num_carte,dateT,quantite,km_avant,km_nouveau,dist_parcourue,consoLT_100,montant) VALUE (?,?,?,?,?,?,?,?,?,?,?,?)");	
                          $PARAM = array($sertvice,$npagent,$immatVehilcul,$capacite,$numcarte,$dateT,$quantite,$kmavt,$kmnew,$dist, $conso100,$montant);
                          $INSERT_DETAILCONSO_TEMP -> execute($PARAM);
                        
                        
                          }*/
        
      //       swal({
      //           title: "Fichier chargé",
      //           text: "",
      //           icon: "success",
      //           button: "Ok",
      //         });
        
      //   //$_SESSION['maCompile']= "Compile ajouté avec Succès!";
                
      // </script>


   
   


    }

    $_SESSION['saveFACT']= "Facture ajoutée avec Succès!";
    header("location:../facture.php");

?>

