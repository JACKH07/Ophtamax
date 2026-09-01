
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="icon" href="images/icons/fvicone.png" type="image/ico" />

    <title>Matrix TLC | </title>

    <!-- Bootstrap -->
    <link href="../vendors/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="../vendors/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <!-- NProgress -->
    <link href="../vendors/nprogress/nprogress.css" rel="stylesheet">
    <!-- iCheck -->
    <link href="../vendors/iCheck/skins/flat/green.css" rel="stylesheet">
	
    <!-- bootstrap-progressbar -->
    <link href="../vendors/bootstrap-progressbar/css/bootstrap-progressbar-3.3.4.min.css" rel="stylesheet">
    <!-- JQVMap -->
    <link href="../vendors/jqvmap/dist/jqvmap.min.css" rel="stylesheet"/>
    <!-- bootstrap-daterangepicker -->
    <link href="../vendors/bootstrap-daterangepicker/daterangepicker.css" rel="stylesheet">

    <!-- Custom Theme Style -->
    <link href="../build/css/custom.min.css" rel="stylesheet">
  </head>

  <body class="nav-md">
    <div class="container body">
	<br />
	<br />
<form action=" " method ="POST" enctype="multipart/form-data">
	<div class="item form-group">
	<div class="clearfix"></div>
											<label class="col-form-label col-md-3 col-sm-3 label-align" for="last-name">Sélection le fichier <span class="required">*</span>
											</label>
											<div class="col-md-6 col-sm-6 ">
												<input type="file" id="last-name" name="myFile" required="required" class="form-control">
											</div>
										</div>
									
										<div class="ln_solid"></div>

										
										<div class="item form-group">
											<div class="col-md-6 col-sm-6 offset-md-3">
												<!--<button class="btn btn-primary" type="button">Cancel</button>
												<button class="btn btn-primary" type="reset">Reset</button>-->
												<button type="submit" class="btn btn-success" name="import">Charger les détails</button>
											</div>
										</div>
</form>
	</div>


</body></html>


<center style="font-size:25px; color:#FFFFFF;">
<h2> Read Excel File</h2>


<?php
error_reporting(E_ALL | E_STRICT);
require_once ("Classes/PHPExcel.php");
require_once ("Classes/PHPExcel/Autoloader.php");


if(isset($_POST['import'])){
//echo '<pre>';
	var_dump($_FILES);
//echo '</pre>';
	
	$fileName= $_FILES['myFile'] ['name'];
	echo $fileName;
	$fileExtension = explode('.',$fileName);
	$fileExtension = strtolower(end($fileExtension));


	$newFileName= date("d.m.Y") ." - ". $fileName;
	$targetDirectory = "uploads/" .$newFileName;
	move_uploaded_file($_FILES["myFile"]["tmp_name"], $targetDirectory);

//$path="uploads/newFileName";

//$path="excel/test1.xlsx";

$reader=PHPExcel_IOFactory::createReaderForFile($targetDirectory);
$excel_Obj =  $reader->load($targetDirectory);

$worksheet=$excel_Obj->getSheet('1');

//$val1 = $worksheet->getCell('B4')->getValue();
//echo ('0'.$val1);


$lastRow = $worksheet->getHighestRow();
$colomncount = $worksheet->getHighestDataColumn();
$colomncount_number=PHPExcel_Cell::columnIndexFromString($colomncount);


//echo $lastRow.'    ';
//echo $colomncount;
$col1=1;
$col3=3;

echo "<table>";

		for($row=3;$row<$lastRow;$row++){
			echo "<tr border='1'>";
				//for($col=1;$col<=$colomncount_number;$col++){
				
					echo "<td>";
						
						echo '0'.$worksheet->getCell(PHPExcel_Cell::stringFromColumnIndex($col1).$row)->getValue();
					echo  "&emsp;";
						echo $worksheet->getCell(PHPExcel_Cell::stringFromColumnIndex($col3).$row)->getValue();
					echo  "&emsp;";
						echo  date("d.m.Y");
					
					echo "</td>";

				
			echo "<tr>";
		}


echo "</table>";

}

?>


</center>



</body>
</html>