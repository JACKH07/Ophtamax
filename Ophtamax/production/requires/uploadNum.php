<?php

// require_once("cnx.php");
 
// $codefact = $_POST['codefact'];
// $datef = $_POST['datefact'];


error_reporting(E_ALL | E_STRICT);
require_once ("../Classes/PHPExcel.php");
require_once ("../Classes/PHPExcel/Autoloader.php");


if(isset($_POST['importernum'])){
//echo '<pre>';
	//var_dump($_FILES);
//echo '</pre>';
	
	$fileName= $_FILES['NumFile'] ['name'];
	//echo $fileName;
	$fileExtension = explode('.',$fileName);
	$fileExtension = strtolower(end($fileExtension));


	$newFileName= date("d.m.Y") ." - ". $fileName;
	$targetDirectory = "../uploads/" .$newFileName;
	move_uploaded_file($_FILES["NumFile"]["tmp_name"], $targetDirectory);

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
$col1=1;
$col2=2;



//echo "<table>";
require_once("cnx.php");

		for($row=2;$row<$lastRow;$row++){
			//echo "<tr border='1'>";
				//for($col=1;$col<=$colomncount_number;$col++){
				
					//echo "<td>";
						
                    // $dateExcel= $worksheet->getCell(PHPExcel_Cell::stringFromColumnIndex($col2).$row)->getValue();
                    // $dateExcel = (int)$dateExcel;
                    // $dateComp =  date('Y/m/d', ($dateExcel - 25569)*24*60*60);
					//echo  $dateComp;
                    // $id = SHA1(uniqid());
					$num = "0".$worksheet->getCell(PHPExcel_Cell::stringFromColumnIndex($col0).$row)->getValue();
                    $typenum = $worksheet->getCell(PHPExcel_Cell::stringFromColumnIndex($col1).$row)->getValue();
                    $operateur = $worksheet->getCell(PHPExcel_Cell::stringFromColumnIndex($col2).$row)->getValue();
                    // $prenoms = $worksheet->getCell(PHPExcel_Cell::stringFromColumnIndex($col5).$row)->getValue();
                    // $email = $worksheet->getCell(PHPExcel_Cell::stringFromColumnIndex($col6).$row)->getValue();
				
					// echo $id ."<br>"; 
					// echo $bu ."<br>";
					// echo $sfid ."<br>";
					// echo $nom ."<br>";
					// echo $prenoms ."<br>";
					// echo $email;
                    
   
                    $INSERT_NUMERO= $pdo->prepare("INSERT INTO numero (numero,typenum,operateur ) VALUE (?,?,?)");	
					$PARAM = array($num,$typenum,$operateur);
					$INSERT_NUMERO -> execute($PARAM);
                    
        
          /*echo $worksheet->getCell(PHPExcel_Cell::stringFromColumnIndex($col17).$row)->getValue();
					echo  "&emsp;";
						echo  date("d/m/Y");
					
					echo "</td>";

				
			echo "<tr>";*/
        }
   
        
          
    $_SESSION['myNum']= "Numéros importés avec Succès!";
    
    header("location:../import.php");


    }

?>

