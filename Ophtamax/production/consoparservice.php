
<?php

   require_once("requires/session.php");
?>

<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
	<link rel="icon" href="images/clogov1.png" type="image/ico" />

    <title>Matrix TLC | </title>

    <!-- Bootstrap -->
    <link href="../vendors/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Css main google chart -->
    <link href="css/googlechart.css" rel="stylesheet">
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
    <script src="https://cdn.canvasjs.com/canvasjs.min.js"></script>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    

    <!-- Custom Theme Style -->
    <link href="../build/css/custom.min.css" rel="stylesheet">


    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/variable-pie.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <!-- <script src="https://code.highcharts.com/highcharts-3d.js"></script> -->
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    <script src="https://code.highcharts.com/modules/cylinder.js"></script>

    <script src="table2excel.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script src="//cdn.rawgit.com/rainabba/jquery-table2excel/1.1.0/dist/jquery.table2excel.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.js"></script>
  </head>

  <body class="nav-md" onload="pdf()">
  <div class="container body">
      <div class="main_container">
        <div class="col-md-3 left_col">
          <div class="left_col scroll-view">
            <div class="navbar nav_title" style="border: 0;">
              <a href="index.php" class="site_title"><img src="images/wlogov1.png"></i> <span>Matrix - TLC</span></a>
            </div>

            <div class="clearfix"></div>

        <!-- Menu -->

        <?php

              require_once("requires/menu.php");

        ?>

					<!-- /menu footer buttons -->
					<div class="sidebar-footer hidden-small">
						<a data-toggle="tooltip" data-placement="top" title="Settings">
							<span class="glyphicon glyphicon-cog" aria-hidden="true"></span>
						</a>
						<a data-toggle="tooltip" data-placement="top" title="FullScreen">
							<span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></span>
						</a>
						<a data-toggle="tooltip" data-placement="top" title="Lock">
							<span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span>
						</a>
						<a data-toggle="tooltip" data-placement="top" title="Logout" href="requires/logout.php">
							<span class="glyphicon glyphicon-off" aria-hidden="true"></span>
						</a>
					</div>
					<!-- /menu footer buttons -->
				</div>
			</div>

			<div class="top_nav">
				<div class="nav_menu">
					<div class="nav toggle">
						<a id="menu_toggle"><i class="fa fa-bars"></i></a>
					</div>
					<nav class="nav navbar-nav">
						<ul class=" navbar-right">
							<li class="nav-item dropdown open" style="padding-left: 15px;">
								<a href="javascript:;" class="user-profile dropdown-toggle" aria-haspopup="true" id="navbarDropdown" data-toggle="dropdown" aria-expanded="false">
									<img src="images/user.png" alt=""><?php echo ((isset($_SESSION['PROFILE']))?($_SESSION['PROFILE']['login_u']):"") ?>
								</a>
								<div class="dropdown-menu dropdown-usermenu pull-right" aria-labelledby="navbarDropdown">
									
									<a class="dropdown-item" href="requires/logout.php"><i class="fa fa-sign-out pull-right"></i> Log Out</a>
								</div>
							</li>

							
						</ul>
					</nav>
				</div>
			</div>


			<!-- page content -->
			<div class="right_col" role="main">
				<div class="">
					<div class="page-title">
						<div class="title_left">
						<h3><img src="images/growthv1.png"> &emsp;  Consommation par seevice <!-- <img src="images/bar-chartv1.png">--></h3> 
						</div>

						<div class="title_right">
							<div class="col-md-5 col-sm-5  form-group pull-right top_search">
								
							</div>
						</div>
					</div>
					<div class="clearfix"></div>
					<div class="row">
						<div class="col-md-12 col-sm-12 ">
							<div class="x_panel">
								<div class="x_title">
									
									<form form id="demo-form2" data-parsley-validate class="form-horizontal form-label-left" action="" method="post">
										<table class="table table-responsive" >
                          
                          				<tbody>
														
									<?php
									
									require_once("requires/cnx.php");
                                    $REQ_LISTE_SCE = $pdo -> prepare("SELECT * FROM services ORDER BY id ASC");
                                    // /* $PARAM = array($login);*/
                                    $REQ_LISTE_SCE  -> execute();

                                    $REQ_LISTE_TYPE = $pdo -> prepare("SELECT * FROM typecompte ORDER BY id ASC");
                              /* $PARAM = array($login);*/
                                     $REQ_LISTE_TYPE  -> execute();
									?>
                            				<tr>
												<td><h2 style="padding-left: 5px;">Période: </h2><td>
                              					<td> <input id="birthday"  name ="date1" class="date-picker form-control" style=" width:200px;"  type="text" placeholder="jj-mm-aaaa" required="required" type="date" onfocus="this.type='date'" onmouseover="this.type='date'" onclick="this.type='date'" onblur="this.type='text'" onmouseout="timeFunctionLong(this)">
												</td>
							  					<td> <input id="birthday"  name ="date2" class="date-picker form-control" style=" width:200px;"  type="text" placeholder="jj-mm-aaaa" required="required" type="date" onfocus="this.type='date'" onmouseover="this.type='date'" onclick="this.type='date'" onblur="this.type='text'" onmouseout="timeFunctionLong(this)">
												</td>
                                                <td>
                                              
												<select class="form-control" name="services" required="required">
                                                                                    
                                                            <option value="">---</option>
                                                            <!-- <option value="ALL">ALL BU</option> -->
                                                            
                                                            <?php  while ($SCE = $REQ_LISTE_SCE -> fetch()) { ?>
                                                            
                                                                <option value="<?php echo($SCE['code']) ?>"><?php echo($SCE['code'])?></option>
                                                            
                                                            <?php } ?>

                                    
                                               </select>
												</td>
												<td>
                                              
												<select class="form-control" name="services" required="required">
                                                                                    
                                                            <option value="">---</option>
                                                            <!-- <option value="ALL">ALL BU</option> -->
                                                            
                                                            <?php  while ($TYPE = $REQ_LISTE_TYPE -> fetch()) { ?>
                                                            
                                                                <option value="<?php echo($TYPE['code']) ?>"><?php echo($TYPE['libelle'])?></option>
                                                            
                                                            <?php } ?>

                                    
                                               </select>
												</td>
												<td> <button type="submit" name="consulter" class="btn btn-success" >Consulter</button></td>
												<!-- <td>&emsp;&emsp;&emsp;<button style="border:0px; background:#FFFFFF;" type="submit" name="pdf" id="chartpdf"><img src="images/pdf11.png"> </button></td> -->

                             				 </tr>
                  
                            
                         				 </tbody>
                        				</table>
									</form>

									


									<?php
if(isset($_POST['consulter'])){

	$date1 = $_POST['date1'];
	$date2 = $_POST['date2'];
	$services = $_POST['services'];

	if ($services =='ALL'){

		require_once("requires/cnx.php");
   
 	

  
   /* Requete transact*/
   $REQ_LISTE_COMPILETR_TEMP = $pdo -> prepare("SELECT immatriculation_veh,km_avant,services,agent,km_nouveau,dist_parcourue,quantite,num_carte,consoLT_100,sum(quantite) as quantite, count(immatriculation_veh) as cpt, sum(consoLT_100) as c100 FROM compiletransact_log WHERE services!=:sce AND  dateT BETWEEN :debut AND :fin GROUP BY immatriculation_veh ");
   //$PARAM = array($date1,$date2); 
   $REQ_LISTE_COMPILETR_TEMP -> execute(array('sce'=> 'MAR',':debut'=> $date1, ':fin' => $date2));

   
   //VIDER LA TABLE TEMP DE TRIE (CONSO GRAPHE)
   //$REQ_RESETTABLETEMP = $pdo->prepare("TRUNCATE TABLE transact_temp");
   //$REQ_RESETTABLETEMP -> execute();

	//VIDER LA TABLE TEMP DE TRIE (REPORT EXCEL)
	$REQ_RESETTABLETEMP = $pdo->prepare("TRUNCATE TABLE detailconso_temp");
	$REQ_RESETTABLETEMP -> execute();
	
   while ($TEMP = $REQ_LISTE_COMPILETR_TEMP->fetch()){
		
	$immatVehilcul = $TEMP['immatriculation_veh'];
	$npagent = $TEMP['agent'];
	$sce = $TEMP['services'];
	$conso100 = number_format(($TEMP['c100']/$TEMP['cpt']),2);
	$kmavt = $TEMP['km_avant'];
	$kmnew = $TEMP['km_nouveau'];
	$dist = $TEMP['dist_parcourue'];
	$quantite = $TEMP['quantite'];
	$numcarte = $TEMP['num_carte'];

	//INSERT DANS LA TABLE DETAIL AFIN DE FAIRE LE TRI
	$INSERT_DETAILCONSO_TEMP = $pdo->prepare("INSERT INTO detailconso_temp (services,agent,vehicule,conso,kmavant,kmnew,kmparcouru,quantite,numcarte) VALUE (?,?,?,?,?,?,?,?,?)");	
	$PARAM = array($sce,$npagent,$immatVehilcul,$conso100 ,$kmavt,$kmnew,$dist,$quantite,$numcarte);
	$INSERT_DETAILCONSO_TEMP -> execute($PARAM);

   }
}
	else {
		
		/* Requete transact*/
	$REQ_LISTE_COMPILETR_TEMP = $pdo -> prepare("SELECT immatriculation_veh,km_avant,services,agent,km_nouveau,dist_parcourue,quantite,num_carte,consoLT_100,sum(quantite) as quantite, count(immatriculation_veh) as cpt, sum(consoLT_100) as c100 FROM compiletransact_log WHERE services=:sce AND  dateT BETWEEN :debut AND :fin GROUP BY immatriculation_veh ");
	//$PARAM = array($date1,$date2); 
	$REQ_LISTE_COMPILETR_TEMP -> execute(array('sce'=> $services,':debut'=> $date1, ':fin' => $date2));
 
	
	//VIDER LA TABLE TEMP DE TRIE (CONSO GRAPHE)
	//$REQ_RESETTABLETEMP = $pdo->prepare("TRUNCATE TABLE transact_temp");
	//$REQ_RESETTABLETEMP -> execute();
 
	 //VIDER LA TABLE TEMP DE TRIE (REPORT EXCEL)
	 $REQ_RESETTABLETEMP = $pdo->prepare("TRUNCATE TABLE detailconso_temp");
	 $REQ_RESETTABLETEMP -> execute();
	 
	while ($TEMP = $REQ_LISTE_COMPILETR_TEMP->fetch()){
		 
	 $immatVehilcul = $TEMP['immatriculation_veh'];
	 $npagent = $TEMP['agent'];
	 $sce = $TEMP['services'];
	 $conso100 = number_format(($TEMP['c100']/$TEMP['cpt']),2);
	 $kmavt = $TEMP['km_avant'];
	 $kmnew = $TEMP['km_nouveau'];
	 $dist = $TEMP['dist_parcourue'];
	 $quantite = $TEMP['quantite'];
	 $numcarte = $TEMP['num_carte'];

	 //INSERT DANS LA TABLE DETAIL AFIN DE FAIRE LE TRI
	$INSERT_DETAILCONSO_TEMP = $pdo->prepare("INSERT INTO detailconso_temp (services,agent,vehicule,conso,kmavant,kmnew,kmparcouru,quantite,numcarte) VALUE (?,?,?,?,?,?,?,?,?)");	
	$PARAM = array($services,$npagent,$immatVehilcul,$conso100 ,$kmavt,$kmnew,$dist,$quantite,$numcarte);
	$INSERT_DETAILCONSO_TEMP -> execute($PARAM);
	}
}
	


  

   //ORDER BY DES TOP 10

   $REQ_LISTE_COMPILETR_TOP10 = $pdo -> prepare("SELECT * FROM detailconso_temp ORDER BY conso DESC limit 10");
   $REQ_LISTE_COMPILETR_TOP10 -> execute();
 //echo COUNT($CONSO);
/**/
   
   $i=0;

	$conso0 = 0;
	$imma0 = "";

	$conso1 = 0;
	$imma1 = "";

	$conso2 = 0;
	$imma2 = "";

	$conso3 = 0;
	$imma3 = "";
	$conso4 = 0;
	$imma4 = "";
	$conso5 = 0;
	$imma5 = "";

	$conso6 = 0;
	$imma6 = "";

	$conso7 = 0;
	$imma7 = "";

	$conso8 = 0;
	$imma8 = "";

	$conso9 = 0;
	$imma9 = "";

   
	while ($CONSO = $REQ_LISTE_COMPILETR_TOP10->fetch()){ 
		//echo var_dump($CONSO);
		if ($i == 0) {
			$conso0 = $CONSO['conso'];
			$imma0 = $CONSO['vehicule'];
		}
		else if ($i == 1) {
			$conso1 = $CONSO['conso'];
			$imma1 = $CONSO['vehicule'];
		}	
		else if ($i == 2) {
			$conso2 = $CONSO['conso'];
			$imma2 = $CONSO['vehicule'];
		}	
		else if  ($i == 3) {
			$conso3 = $CONSO['conso'];
			$imma3 = $CONSO['vehicule'];
		}	
		else if ($i == 4) {
			$conso4 = $CONSO['conso'];
			$imma4 = $CONSO['vehicule'];
		}	
		else if  ($i == 5) {
			$conso5 = $CONSO['conso'];
			$imma5 = $CONSO['vehicule'];
		}	
		else if ($i == 6) {
			$conso6 = $CONSO['conso'];
			$imma6 = $CONSO['vehicule'];
		}	
		else if ($i == 7) {
			$conso7 = $CONSO['conso'];
			$imma7 = $CONSO['vehicule'];
		}			
		else if  ($i == 8) {
			$conso8 = $CONSO['conso'];
			$imma8 = $CONSO['vehicule'];
		}	
		else if  ($i == 9) {
			$conso9 = $CONSO['conso'];
			$imma9 = $CONSO['vehicule'];
		}	
		
	$i++;
		
	}

	
	$dataPoints = array( 
	 array("y" => $conso9,"label" => $imma9 ),
	 array("y" => $conso8,"label" => $imma8 ),
	 array("y" => $conso7,"label" => $imma7 ),
	 array("y" => $conso6,"label" => $imma6),
	 array("y" => $conso5,"label" => $imma5 ),
	 array("y" => $conso4,"label" => $imma4),
	 array("y" => $conso3,"label" => $imma3),
	 array("y" => $conso2,"label" => $imma2 ),
	 array("y" => $conso1,"label" => $imma1),
	 array("y" => $conso0,"label" => $imma0)
	);
 
 	}


?>

<script>
window.onload = function() {
 
var chart = new CanvasJS.Chart("chartContainer", {
	animationEnabled: true,
	exportEnabled: true,
	title:{
		text: "Top 10 conso plus - <?php echo $date1?> / <?php echo $date2?>"
	},
	axisY: {
		title: "ConsoLT/100",
		includeZero: true,
		prefix: "",
		suffix:  ""
	},
	data: [{
		type: "bar",
		yValueFormatString: "#.#0",
		indexLabel: "{y}",
		indexLabelPlacement: "inside",
		indexLabelFontWeight: "bolder",
		indexLabelFontColor: "white",
		dataPoints: <?php echo json_encode($dataPoints, JSON_NUMERIC_CHECK); ?>
	}]
});
chart.render();

document.getElementById("exportpdf")
        .addEventListener("click", () => {
            const conso= this.document.getElementById("consotable");
            console.log(conso);
            console.log(window);
            var opt = {
                margin: 1,
                filename: 'myfile.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'A4', orientation: 'landscape' }
            };
            html2pdf().from(conso).set(opt).save();
        })
 
	document.getElementById("chartpdf")
        .addEventListener("click", () => {
            const chartpdf= this.document.getElementById("chartContainer");
            console.log(chartpdf);
            console.log(window);
            var opt = {
                margin: 1,
                filename: 'mychart.pdf',
                image: { type: 'png', quality: 1},
                html2canvas: { scale: 1 },
                jsPDF: { unit: 'in', format: 'A3', orientation: 'landscape' }
            };
            html2pdf().from(chartpdf).set(opt).save();
        })
 

}
</script>


								</div>
								<div class="x_content"> 
									 <br /> 


<div id="chartContainer" style="height: 370px; width: 100%;"></div>


<!-- AFFICHAGE DES GRAPHES CONSO-->




								</div>
							</div>
						</div>
					</div>

					<!-- liste des attributions-->
					<div class="row">
						<div class="col-md-12 col-sm-12 ">
							<div class="x_panel">
								<div class="x_title">
									<h2>Détails liste<small></small></h2>
									
									<ul class="nav navbar-right panel_toolbox">
									<button type="submit" style="border:0px; background:#FFFFFF;" id="exportxlxs"><img src="images/excelv2.png"> </button>&emsp;
									<button style="border:0px; background:#FFFFFF;" type="submit" name="pdf" id="exportpdf"><img src="images/pdf11.png"> </button>&emsp;


									<form form id="demo-form2" data-parsley-validate class="form-horizontal form-label-left" action="requires/consoxlxs.php" method="POST">
									
									&emsp;&emsp;
									</form>
										<li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
										</li>
										<li class="dropdown">
											<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i class="fa fa-wrench"></i></a>
											<ul class="dropdown-menu" role="menu">
											    
												<li><a class="dropdown-item" href="#">Settings 1</a>
												</li>
												<li><a class="dropdown-item" href="#">Settings 2</a>
												</li>
											</ul>
										</li>
										<li><a class="close-link"><i class="fa fa-close"></i></a>
										</li>
									</ul>
									<div class="clearfix"></div>
								</div>
								<div class="x_content">
									<br />
				
									


	


						<div class="table-responsive" style="height: 300px; overflow: auto;">

					
                        <table  id="consotable" class="table" name="table">
                          <thead>
                            <tr >
							  <th>ID</th>
                              <th>ABONNE</th>
							  <th>NUMERO</th>
							  <th>FORMULE</th>
                              <th>BU</th>
                              <th>COMPTE C.</th>
                             
                              <!--<th>IMPRIMER</th>-->
                            </tr>
                          </thead>
                          <tbody>
                          
											<?php
												if(isset($_POST['consulter'])){
											require_once("requires/cnx.php");
											$REQ_LISTE_COMPILETR_TOP = $pdo -> prepare("SELECT * FROM detailconso_temp ORDER BY conso DESC ");
											$REQ_LISTE_COMPILETR_TOP -> execute();
													while ($DET = $REQ_LISTE_COMPILETR_TOP->fetch()) {
											?>
													<tr>
													<th scope="row"><?php echo($DET['id']) ?></th>
													
													<td><?php echo($DET['services']) ?></td>
													<td><?php echo($DET['agent']) ?></td>
													<td><?php echo($DET['vehicule']) ?></td>
													<td><?php echo($DET['conso']) ?></td>
													<td><?php echo number_format(($DET['quantite']),2) ?></td>
													
													<td><?php echo (int)($DET['kmparcouru']) ?></td>
													<td><?php echo($DET['numcarte']) ?></td>
													<!--<td><a style="bacbround: red;" onclick="return confirm('Etes-vous sûre ?')>"><span class="btn btn-light" align="center">Imprimer</span></a></td>-->
													</tr>
										<?php }}  ?>
													
												</tbody>
												</table>
											</div>


										<script>
											document.getElementById('exportxlxs').addEventListener('click',function(){
												var table2excel = new Table2Excel();
												table2excel.export(document.querySelectorAll("#consotable"));
											})
										</script>
								</div>
							</div>
						</div>
					</div>

			<!-- fin liste des attributions-->


			

					
				</div>
			</div>
			<!-- /page content -->

			<!-- footer content -->
			
			<?php

              require_once("requires/footer.php");

        	?>
			<!-- /footer content -->
		</div>
	</div>

	<!-- jQuery -->
	<script src="../vendors/jquery/dist/jquery.min.js"></script>
	<!-- Bootstrap -->
	<script src="../vendors/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
	<!-- FastClick -->
	<script src="../vendors/fastclick/lib/fastclick.js"></script>
	<!-- NProgress -->
	<script src="../vendors/nprogress/nprogress.js"></script>
	<!-- bootstrap-progressbar -->
	<script src="../vendors/bootstrap-progressbar/bootstrap-progressbar.min.js"></script>
	<!-- iCheck -->
	<script src="../vendors/iCheck/icheck.min.js"></script>
	<!-- bootstrap-daterangepicker -->
	<script src="../vendors/moment/min/moment.min.js"></script>
	<script src="../vendors/bootstrap-daterangepicker/daterangepicker.js"></script>
	<!-- bootstrap-wysiwyg -->
	<script src="../vendors/bootstrap-wysiwyg/js/bootstrap-wysiwyg.min.js"></script>
	<script src="../vendors/jquery.hotkeys/jquery.hotkeys.js"></script>
	<script src="../vendors/google-code-prettify/src/prettify.js"></script>
	<!-- jQuery Tags Input -->
	<script src="../vendors/jquery.tagsinput/src/jquery.tagsinput.js"></script>
	<!-- Switchery -->
	<script src="../vendors/switchery/dist/switchery.min.js"></script>
	<!-- Select2 -->
	<script src="../vendors/select2/dist/js/select2.full.min.js"></script>
	<!-- Parsley -->
	<script src="../vendors/parsleyjs/dist/parsley.min.js"></script>
	<!-- Autosize -->
	<script src="../vendors/autosize/dist/autosize.min.js"></script>
	<!-- jQuery autocomplete -->
	<script src="../vendors/devbridge-autocomplete/dist/jquery.autocomplete.min.js"></script>
	<!-- starrr -->
	<script src="../vendors/starrr/dist/starrr.js"></script>
	<!-- Custom Theme Scripts -->
	<script src="../build/js/custom.min.js"></script>

</body></html>
