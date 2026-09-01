
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
    <script src="https://code.highcharts.com/highcharts-3d.js"></script>
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
						<h3><img src="images/bar-chartv1.png"> &emsp;  Consommation par année <!-- <img src="images/bar-chartv1.png">--></h3> 
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
												<td><h2 style="padding-left: 5px;">Années: </h2><td>
                              					<!-- <td> <input id="birthday"  name ="date1" class="date-picker form-control" style=" width:200px;"  type="text" placeholder="jj-mm-aaaa" required="required" type="date" onfocus="this.type='date'" onmouseover="this.type='date'" onclick="this.type='date'" onblur="this.type='text'" onmouseout="timeFunctionLong(this)">
												</td>
							  					<td> <input id="birthday"  name ="date2" class="date-picker form-control" style=" width:200px;"  type="text" placeholder="jj-mm-aaaa" required="required" type="date" onfocus="this.type='date'" onmouseover="this.type='date'" onclick="this.type='date'" onblur="this.type='text'" onmouseout="timeFunctionLong(this)">
												</td> -->
                                                <td>
                                              
												<select class="form-control" name="annee" required="required">
                                                                                    
                                                            <option value="" ></option>
                                                            <!-- <option value="ALL">ALL BU</option> -->
                                                            
                                                            <?php  
															
																					$annee = date("Y"); // tu recupere l'nnee en cours

																					$an_premier = $annee - 5;

																					$an_dernier = $annee +17;

																					for($i=$an_dernier;$i>=$an_premier;$i--)
																					{

																					echo '<option value="'.$i.'">'.$i.'</option>';

																					}
															
															?>

                                    
                                               </select>
												</td>

												<td> <h2 style="padding-left: 5px;">Types de compte: </h2>
												</td>

												<td>
                                              
												<select class="form-control" name="tcompte" required="required">
                                                                                    
                                                            <option value=""></option>
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
									</div>

				
				   			<div class="dashboard_graph"></div>


				   <!-- Graphe Principal-->

				   		<div id="main1"></div>



			   			<div class="clearfix"></div>
			   </div>
			

			 </br>
									


									<?php
if(isset($_POST['consulter'])){

	$tannee = $_POST['annee'];
	// $date2 = $_POST['date2'];
	$typecompte = $_POST['tcompte'];

	//if ($services =='ALL'){

	require_once("requires/cnx.php");

	//1- FAIRE RESSORTIR LA LISTE DES COMPTE PAR TYPE SELECTIONNE
	$SELECT_COMPTE= $pdo -> prepare("SELECT * FROM compte WHERE tcompte=?");
    $PARAM = array($typecompte);
    $SELECT_COMPTE -> execute($PARAM);

		

				//VIDER LA TABLE TEMP DE TRIE
				$REQ_RESETTABLETEMP = $pdo->prepare("TRUNCATE TABLE tri_annee");
				$REQ_RESETTABLETEMP -> execute();

			while ($COMP = $SELECT_COMPTE->fetch()){

				
					$cclient = $COMP['comptec'];
					/* Requete transact*/
					$REQ_LISTE_FACTURE_COMPTE= $pdo -> prepare("SELECT comptec,date_format(datef, '%M') as Mois, sum(montantHT) as mt FROM facture WHERE comptec=? AND YEAR(datef)=? GROUP BY MONTH(datef)");
					//$PARAM = array($date1,$date2); 
					$REQ_LISTE_FACTURE_COMPTE -> execute(array($cclient,$tannee));

						//INSERT DANS LA TABLE DE TRI
						while ($FACT = $REQ_LISTE_FACTURE_COMPTE->fetch()){
							
							$mt=$FACT['mt'];
							$mois = $FACT['Mois'];
							$INSERT_TRI_ANNUEL = $pdo->prepare("INSERT INTO tri_annee (typec,mois,annee,montantht) VALUE (?,?,?,?)");	
							$PARAM = array($typecompte,$mois,$tannee,$mt);
							$INSERT_TRI_ANNUEL -> execute($PARAM);

							// //SELECTION GROUPEE DES TRIS 1
							// $REQ_LISTE_FACTURE_COMPTE1= $pdo -> prepare("SELECT id,typec,mois,annee, sum(montantht) as mt FROM tri_annee GROUP BY mois");
							// //$PARAM = array($date1,$date2); 
							// $REQ_LISTE_FACTURE_COMPTE1 -> execute();

							// //VIDER LA TABLE TEMP DE TRIE
							// $REQ_RESETTABLETEMP = $pdo->prepare("TRUNCATE TABLE tri_annee1");
							// $REQ_RESETTABLETEMP -> execute();
									

							// 		while ($FACT1 = $REQ_LISTE_FACTURE_COMPTE1->fetch()) {

							// 			$typecomp =  $FACT1['typec'];
							// 			$mois1    =  htmlspecialchars($FACT1['mois']);
							// 			$annee1   =  $FACT1['annee'];
							// 			$montantht=  $FACT1['mt'];

							// 			$INSERT_TRI_ANNUEL1 = $pdo->prepare("INSERT INTO tri_annee1 (typec,mois,annee,montantht) VALUE (?,?,?,?)");	
							// 			$PARAM = array($typecomp,$mois1,$annee1,$montantht);
							// 			$INSERT_TRI_ANNUEL1 -> execute($PARAM);

										// }


						}
						//DER LA TABLE TEMP DE TRIE
						$REQ_RESETTABLETEMP = $pdo->prepare("TRUNCATE TABLE tri_annee1");
						$REQ_RESETTABLETEMP -> execute();

						// $REQ_LISTE_MOIS= $pdo -> prepare("SELECT * FROM mois ORDER BY id");
						// $REQ_LISTE_MOIS -> execute();

						// while ($MOIS = $REQ_LISTE_MOIS->fetch()){

							$REQ_LISTE_FACTURE_COMPTE1= $pdo -> prepare("SELECT id,typec,mois,annee, sum(montantht) as mt FROM tri_annee  GROUP BY mois");
							// $PARAM = array($MOIS['libelle']); 
							$REQ_LISTE_FACTURE_COMPTE1 -> execute();

							
							 		while ($FACT1 = $REQ_LISTE_FACTURE_COMPTE1->fetch()) {

							 			$typecomp =  $FACT1['typec'];
							 			$mois1    =  $FACT1['mois'];
										$annee1   =  $FACT1['annee'];
							 			$montantht=  $FACT1['mt'];

							 			$INSERT_TRI_ANNUEL1 = $pdo->prepare("INSERT INTO tri_annee1 (typec,mois,annee,montantht) VALUE (?,?,?,?)");	
							 			$PARAM = array($typecomp,$mois1,$annee1,$montantht);
							 			$INSERT_TRI_ANNUEL1 -> execute($PARAM);

									 }
							//VIDER LA TABLE TEMP DE TRIE ANNEE 2
						$REQ_RESETTABLETEMP = $pdo->prepare("TRUNCATE TABLE tri_annee2");
						$REQ_RESETTABLETEMP -> execute();

						$REQ_LISTE_MOIS= $pdo -> prepare("SELECT * FROM mois ORDER BY id");
						$REQ_LISTE_MOIS -> execute();

						 while ($MOIS = $REQ_LISTE_MOIS->fetch()){

							$moistri = $MOIS['libelle'];
							//echo $moistri;

							$REQ_LISTE_FACTURE_COMPTE2= $pdo -> prepare("SELECT * FROM tri_annee1 WHERE mois=?");
							$PARAM = array($moistri); 
							$REQ_LISTE_FACTURE_COMPTE2 -> execute($PARAM);

							
							 		while ($FACT2 = $REQ_LISTE_FACTURE_COMPTE2->fetch()) {

							 			$typecomp2 =  $FACT2['typec'];
							 			$mois2    =  $FACT2['mois'];
										$annee2   =  $FACT2['annee'];
							 			$montantht2=  $FACT2['montantht'];

							 			$INSERT_TRI_ANNUEL2 = $pdo->prepare("INSERT INTO tri_annee2 (typec,mois,annee,montantht) VALUE (?,?,?,?)");	
							 			$PARAM = array($typecomp2,$mois2,$annee2,$montantht2);
							 			$INSERT_TRI_ANNUEL2 -> execute($PARAM);

									 }
							

						 }

				}
	$i=0;
 	$mtht0 = 0;
 	$mois0 = "";

 	$mtht1 = 0;
 	$mois1 = "";

 	$mtht2 = 0;
 	$mois2 = "";

 	$mtht3 = 0;
 	$mois3 = "";
 	$mtht4 = 0;
 	$mois4 = "";
 	$mtht5 = 0;
 	$mois5 = "";

 	$mtht6 = 0;
 	$mois6 = "";

 	$mtht7 = 0;
 	$mois7 = "";

 	$mtht8 = 0;
 	$mois8 = "";

 	$mtht9 = 0;
 	$mois9 = "";

	$mtht10 = 0;
 	$mois10 = "";
	 
	$mtht11 = 0;
 	$mois11 = "";

		//SELECTION GROUPEE DES TRIS 1
		$REQ_LISTE_MONTANT_MOIS= $pdo -> prepare("SELECT * FROM tri_annee2 ORDER BY id");
		//$PARAM = array($date1,$date2); 
		$REQ_LISTE_MONTANT_MOIS -> execute();

	 while ($mtht = $REQ_LISTE_MONTANT_MOIS->fetch()){ 
		 		//echo var_dump($mtht);
		 		if ($i == 0) {
		 			$mtht0 = $mtht['montantht'];
		 			$mois0 = $mtht['mois'];
		 		}
		 		else if ($i == 1) {
		 			$mtht1 = $mtht['montantht'];
		 			$mois1 = $mtht['mois'];
		 		}	
		 		else if ($i == 2) {
					$mtht2 = $mtht['montantht'];
					$mois2 = $mtht['mois'];
				}	
				else if  ($i == 3) {
					$mtht3 = $mtht['montantht'];
		 			$mois3 = $mtht['mois'];
		 		}	
		 		else if ($i == 4) {
					$mtht4 = $mtht['montantht'];
					$mois4 = $mtht['mois'];
		 		}	
		 		else if  ($i == 5) {
		 			$mtht5 = $mtht['montantht'];
		 			$mois5 = $mtht['mois'];
		 		}	
		 		else if ($i == 6) {
		 			$mtht6 = $mtht['montantht'];
		 			$mois6 = $mtht['mois'];
		 		}	
		 		else if ($i == 7) {
		 			$mtht7 = $mtht['montantht'];
		 			$mois7 = $mtht['mois'];
		 		}			
		 		else if  ($i == 8) {
		 			$mtht8 = $mtht['montantht'];
		 			$mois8 = $mtht['mois'];
		 		}	
		 		else if  ($i == 9) {
		 			$mtht9 = $mtht['montantht'];
		 			$mois9 = $mtht['mois'];
		 		}	
				 else if  ($i == 10) {
					$mtht10 = $mtht['montantht'];
					$mois10 = $mtht['mois'];
				}	
				else if  ($i == 11) {
					$mtht11 = $mtht['montantht'];
					$mois11 = $mtht['mois'];
				}	
				
		 	$i++;
				
		}

	}


?>


<script type="text/javascript">
                // Set up the chart
                const chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'main1',
                        type: 'column',
                        options3d: {
                            enabled: true,
                            alpha: 10,
                            beta: 10,
                            depth: 50,
                            viewDistance: 25
                        }
                    },
                    xAxis: {
                        categories: ['<?php echo $mois0 ?>', '<?php echo $mois1 ?>', '<?php echo $mois2 ?>', '<?php echo $mois3 ?>', '<?php echo $mois4 ?>', '<?php echo $mois5 ?>',
                            '<?php echo $mois6 ?>', '<?php echo $mois7 ?>', '<?php echo $mois8 ?>', '<?php echo $mois9 ?>', '<?php echo $mois10 ?>', '<?php echo $mois11 ?>']
                    },
                    yAxis: {
                        title: {
                            enabled: false
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{point.key}</b><br>',
                        pointFormat: 'Nombre: {point.y}'
                    },
                    title: {
                        text: 'Consommation Globale <?php echo $typecompte,'--',$tannee ?>',
                        align: 'left'
                    },
                    subtitle: {
                        text: 'Source: ' +
                            '<a href="https://myfacture.orange.ci/"' +
                            'target="_blank">Orange CI - MTN</a>',
                        align: 'left'
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        column: {
                            depth: 25
                        }
                    },
                    series: [{
                        data: [<?php echo $mtht0 ?>, <?php echo $mtht1 ?>, <?php echo $mtht2 ?>, <?php echo $mtht3 ?>, <?php echo $mtht4 ?>, <?php echo $mtht5 ?>, <?php echo $mtht6 ?>, <?php echo $mtht7 ?>, <?php echo $mtht8 ?>, 
                        <?php echo $mtht9 ?>, <?php echo $mtht10 ?>, <?php echo $mtht11 ?>],
                        colorByPoint: true
                    }]
                });

                function showValues() {
                    document.getElementById('alpha-value').innerHTML = chart.options.chart.options3d.alpha;
                    document.getElementById('beta-value').innerHTML = chart.options.chart.options3d.beta;
                    document.getElementById('depth-value').innerHTML = chart.options.chart.options3d.depth;
                }

                // Activate the sliders
                document.querySelectorAll('#sliders input').forEach(input => input.addEventListener('input', e => {
                    chart.options.chart.options3d[e.target.id] = parseFloat(e.target.value);
                    showValues();
                    chart.redraw(false);
                }));

                showValues();

  </script>

  
<p>Pour obtenir les montants TTC, il faut appliquer deux Taxes au motant HT</p>
<H2 style=" Color:red;"> Taxe Com: 3% et TVA 18% </H2>





					<!-- liste des attributions-->
					<div class="row">
						<div class="col-md-12 col-sm-12 ">
							<div class="x_panel">
								<div class="x_title">
									<h2>Détails liste<small></small></h2>
									
									<ul class="nav navbar-right panel_toolbox">
									<!-- <button type="submit" style="border:0px; background:#FFFFFF;" id="exportxlxs"><img src="images/excelv2.png"> </button>&emsp; -->
									<button style="border:0px; background:#FFFFFF;" type="submit" name="pdf" id="exportpdf"><img src="images/pdf11.png"> </button>&emsp;


									<form form id="demo-form2" data-parsley-validate class="form-horizontal form-label-left" action="requires/mthtxlxs.php" method="POST">
									
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
                              <th>TYPE COMPTE</th>
							  <th>MOIS</th>
							  <th>ANNEE</th>
                              <th>MONTANT HT</th>
                              <!-- <th>COMPTE C.</th> -->
                             
                              <!--<th>IMPRIMER</th>-->
                            </tr>
                          </thead>
                          <tbody>
                          
											<?php
											 	if(isset($_POST['consulter'])){
													require_once("requires/cnx.php");
													$REQ_LISTE_CONSO_MOIS = $pdo -> prepare("SELECT * FROM tri_annee2 ORDER BY id ASC ");
													$REQ_LISTE_CONSO_MOIS -> execute();
													while ($MOIS = $REQ_LISTE_CONSO_MOIS->fetch()) {
											?>
													<tr>
													<th scope="row"><?php echo($MOIS['id']) ?></th>
													
													<td><?php echo($MOIS['typec']) ?></td>
													<td><?php echo($MOIS['mois']) ?></td>
													<td><?php echo($MOIS['annee']) ?></td>
													<td><?php echo($MOIS['montantht']) ?></td>
													
													<!--<td><a style="bacbround: red;" onclick="return confirm('Etes-vous sûre ?')>"><span class="btn btn-light" align="center">Imprimer</span></a></td>-->
													</tr>
										<?php  }} ?>
													
												</tbody>
												</table>
											</div>


										<script>
											document.getElementById('exportxlxs').addEventListener('click',function(){
												var table2excel = new Table2Excel();
												table2excel.export(document.querySelectorAll("#consotable"));
											})
										</script>
										<script>

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
										</script>
								</div>
							</div>
						</div>
					</div>

			<!-- fin liste des attributions-->


			

			</div>	
			</div>	
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
