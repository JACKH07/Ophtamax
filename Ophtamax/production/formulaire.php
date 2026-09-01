

<?php
require_once ('vendor/autoload.php');
require_once ('db.php');
  
use Phpoffice\phpspreadsheet\src\PhpSpreadsheet\
PhpOfficePhpSpreadsheetReaderCsv;
PhpOfficePhpSpreadsheetReaderXlsx;
  
if (isset($_POST['submit'])) {
 
    $file_mimes = array('text/x-comma-separated-values', 'text/comma-separated-values', 'application/octet-stream', 'application/vnd.ms-excel', 'application/x-csv', 'text/x-csv', 'text/csv', 'application/csv', 'application/excel', 'application/vnd.msexcel', 'text/plain', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
     
    if(isset($_FILES['file']['name']) && in_array($_FILES['file']['type'], $file_mimes)) {
     
        $arr_file = explode('.', $_FILES['file']['name']);
        $extension = end($arr_file);
     
        if('csv' == $extension) {
            $reader = new PhpOfficePhpSpreadsheetReaderCsv();
        } else {
            $reader = new PhpOfficePhpSpreadsheetReaderXlsx();
        }
 
        $spreadsheet = $reader->load($_FILES['file']['tmp_name']);
 
        $sheetData = $spreadsheet->getActiveSheet()->toArray();
 
        if (!empty($sheetData)) {
            for ($i=1; $i<count($sheetData); $i++) {
                $name = $sheetData[$i][1];
                $email = $sheetData[$i][2];
                $db->query("INSERT INTO USERS(name, email) VALUES('$name', '$email')");
            }
        }
    }
}
?>

<html>
	<head>
		<title>Read xlxs</title>
	</head>
	
<body>
<form method="post" enctype="multipart/form-data">
    <div class="form-group">
        <label for="exampleInputFile">File Upload</label>
        <input type="file" name="file" class="form-control" id="exampleInputFile">
    </div>
    <button type="submit" name="submit" class="btn btn-primary">Submit</button>
</form>
</body>
</HTML>