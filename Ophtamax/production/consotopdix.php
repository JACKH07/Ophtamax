
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

  <body class="nav-md">
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
						<h3><img src="images/growthv1.png"> &emsp;  Top Consommation - Comptes <!-- <img src="images/bar-chartv1.png">--></h3> 
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
								// 	$REQ_LISTE_SCE = $pdo -> prepare("SELECT * FROM services ORDER BY id ASC");
								// /* $PARAM = array($login);*/
								// 	$REQ_LISTE_SCE  -> execute();

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


<!-- CODE POUR AFFICHAGE DES CONSO PAR BU -->



				
				   <div class="dashboard_graph"></div>


				   <!-- Graphe Principal-->

				   <div id="consotop"></div>



			   <div class="clearfix"></div>
			   </div>

			 </br>
							

<!-- DEBUT RECUPERATION DES DONNEES -->
<?php

	//VIDER LA TABLE TEMP DE TRIE
	$REQ_RESETTABLETEMP = $pdo->prepare("TRUNCATE TABLE temp_dashb");
	$REQ_RESETTABLETEMP -> execute();

require_once("requires/cnx.php");


if(isset($_POST['consulter'])){

	//$i=0;
	$cp0 = 1;
	$sce0 = "C0";
	
	$cp1 = 1;
	$sce1 = "C1";
	
	$cp2 = 0;
	$sce2 = "";
	
	$cp3 = 0;
	$sce3 = "";
	
	$cp4 = 0;
	$sce4 = "";
	
	$cp5 = 0;
	$sce5 = "";
	
	$cp6 = 0;
	$sce6 = "";
	
	$cp7 = 0;
	$sce7 = "";
	
	$cp8 = 0;
	$sce8 = "";
	
	$cp9 = 0;
	$sce9 = "";
	
	$cp10 = 0;
	$sce10 = "";
	
	$cp11 = 0;
	$sce11 = "";
	
	$cp12 = 0;
	$sce12 = "";
	
	$cp13 = 0;
	$sce13 = "";
	
	$cp14 = 0;
	$sce14 = "";
	
	$date1 = "";
	$date2 = "";
	
	$type ="";
	$compteclient="";
	



$date1 = $_POST['date1'];
$date2 = $_POST['date2'];
$type = $_POST['services'];
	
//TRI DES TYPES COMPTES
    
    $SELECT_COMPTE= $pdo -> prepare("SELECT * FROM compte WHERE tcompte=?");
    $PARAM = array($type);
    $SELECT_COMPTE -> execute($PARAM);

        //VIDER LA TABLE TEMP DE TRIE

             
              while ($COMP= $SELECT_COMPTE->fetch()){

                  $compteclient=$COMP['comptec'];

                  $SELECT_MONTANT_COMPTE= $pdo -> prepare("SELECT comptec,montantHT,sum(montantHT) as sum FROM facture WHERE comptec=:sce AND  datef BETWEEN :debut AND :fin  GROUP BY comptec ");
                  //$PARAM = array($COMP['comptec']);
                  $SELECT_MONTANT_COMPTE -> execute(array('sce'=> $compteclient,':debut'=> $date1, ':fin' => $date2));
                        

                      while ($MTHT= $SELECT_MONTANT_COMPTE->fetch()){

						$compte = $MTHT['comptec'];
                        $montant = $MTHT['sum'];
                         
                        $SELECT_COMPTEC= $pdo -> prepare("SELECT * FROM compte WHERE comptec=?");
                        $PARAM = array($compte);
                        $SELECT_COMPTEC -> execute($PARAM);
                       
                        //Recherche du service en focntion de la BU)

                            while ( $CC = $SELECT_COMPTEC->fetch()){

                                $code_bu = $CC['bu'];
                              
                                $SELECT_SCE= $pdo -> prepare("SELECT * FROM bu WHERE code=?");
                                $PARAM = array($code_bu);
                                $SELECT_SCE -> execute($PARAM);
                                $SCE = $SELECT_SCE->fetch();
                            }

                        $INSERT_TEMP_DASH = $pdo->prepare("INSERT INTO  temp_dashb (comptec,montantht,bu,sce) VALUE (?,?,?,?)");	
                        $PARAM = array($compte,$montant,$code_bu,$SCE['code_sce']);
                        $INSERT_TEMP_DASH -> execute($PARAM);
   
                      }
                     
                    }
               
         }

        //  else  {


        //           $type = 'GSM';
        //                     //TRI DES TYPES COMPTES
                  
        //           $SELECT_COMPTE= $pdo -> prepare("SELECT * FROM compte WHERE tcompte=?");
        //           $PARAM = array('GSM');
        //           $SELECT_COMPTE -> execute($PARAM);

        //           //VIDER LA TABLE TEMP DE TRIE

              
        //           while ($COMP= $SELECT_COMPTE->fetch()){

        //           $SELECT_MONTANT_COMPTE= $pdo -> prepare("SELECT comptec,montantHT,sum(montantHT) as sum FROM facture WHERE comptec=? GROUP BY comptec ");
        //           $PARAM = array($COMP['comptec']);
        //           $SELECT_MONTANT_COMPTE -> execute($PARAM);


        //               while ($MTHT= $SELECT_MONTANT_COMPTE->fetch()){

        //                           $compte = $MTHT['comptec'];

        //                           $SELECT_COMPTEC= $pdo -> prepare("SELECT * FROM compte WHERE comptec=?");
        //                           $PARAM = array($compte);
        //                           $SELECT_COMPTEC -> execute($PARAM);
        //                           $CC = $SELECT_COMPTEC->fetch();

        //                           $INSERT_TEMP_DASH = $pdo->prepare("INSERT INTO  temp_dashb (comptec,montantht,bu) VALUE (?,?,?)");	
        //                           $PARAM = array($compte,$MTHT['sum'],$CC['bu']);
        //                           $INSERT_TEMP_DASH -> execute($PARAM);

                                                               
        //               }
        //           }

        //         }

          
                    $SELECT_DETAIL_DASH1= $pdo -> prepare("SELECT * FROM temp_dashb ORDER BY montantht DESC");
                    $SELECT_DETAIL_DASH1 -> execute();
					$i=0;
               while ($MTHT = $SELECT_DETAIL_DASH1->fetch()) { 
                  
                    if ($i == 0) {
                      $cp0 = $MTHT['montantht'];
                      $sce0 = $MTHT['comptec'];
                    
                    }
                    else if ($i == 1) {
                      $cp1 = $MTHT['montantht'];
                      $sce1 = $MTHT['comptec'];
                    }	
                    else if ($i == 2) {
                      $cp2 = $MTHT['montantht'];
                      $sce2 = $MTHT['comptec'];
                    }	
                    else if  ($i == 3) {
                      $cp3 = $MTHT['montantht'];
                      $sce3 = $MTHT['comptec'];
                    }	
                    else if ($i == 4) {
                      $cp4 = $MTHT['montantht'];
                      $sce4 = $MTHT['comptec'];
                    }	
                    else if  ($i == 5) {
                      $cp5 = $MTHT['montantht'];
                      $sce5 = $MTHT['comptec'];
                    }	
                    else if ($i == 6) {
                      $cp6 = $MTHT['montantht'];
                      $sce6 = $MTHT['comptec'];
                    }	
                    else if ($i == 7) {
                      $cp7 = $MTHT['montantht'];
                      $sce7 = $MTHT['comptec'];
                    }			
                    else if  ($i == 8) {
                      $cp8 = $MTHT['montantht'];
                      $sce8 = $MTHT['comptec'];
                    }	
                    else if  ($i == 9) {
                      $cp9 = $MTHT['montantht'];
                      $sce9 = $MTHT['comptec'];
                    }	
                    else if ($i == 10) {
                      $cp10 = $MTHT['montantht'];
                      $sce10 = $MTHT['comptec'];
                    }	
                    else if  ($i == 11) {
                      $cp11 = $MTHT['montantht'];
                      $sce11 = $MTHT['comptec'];
                    }	
                    else if ($i == 12) {
                      $cp12 = $MTHT['montantht'];
                      $sce12 = $MTHT['comptec'];
                    }	
                    else if ($i == 13) {
                      $cp13 = $MTHT['montantht'];
                      $sce13 = $MTHT['comptec'];
                    }			
                    else if  ($i == 14) {
                      $cp14 = $MTHT['montantht'];
                      $sce14 = $MTHT['comptec'];
                    }	
                  
                
                  $i++;
             }

      ?>


<script type="text/javascript">
                // Set up the chart
                const chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'consotop',
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
                        categories: ['<?php echo $sce0 ?>', '<?php echo $sce1 ?>', '<?php echo $sce2 ?>', '<?php echo $sce3 ?>', '<?php echo $sce4 ?>', '<?php echo $sce5 ?>',
                            '<?php echo $sce6 ?>', '<?php echo $sce7 ?>', '<?php echo $sce8 ?>', '<?php echo $sce9 ?>', '<?php echo $sce10 ?>', '<?php echo $sce11 ?>', 
                            '<?php echo $sce12 ?>', '<?php echo $sce13 ?>', '<?php echo $sce14 ?>']
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
                        text: 'Top Consommation <?php echo $type ?>',
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
                        data: [<?php echo $cp0 ?>, <?php echo $cp1 ?>, <?php echo $cp2 ?>, <?php echo $cp3 ?>, <?php echo $cp4 ?>, <?php echo $cp5 ?>, <?php echo $cp6 ?>, <?php echo $cp7 ?>, <?php echo $cp8 ?>, 
                        <?php echo $cp9 ?>, <?php echo $cp10 ?>, <?php echo $cp11 ?>, <?php echo $cp12 ?>, <?php echo $cp13 ?>, <?php echo $cp14 ?>],
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


					

								<!-- </div>
								<div class="x_content"> 
									 <br /> 


<div id="consotop" style="height: 370px; width: 100%;"></div>


 AFFICHAGE DES GRAPHES CONSO




								</div>
							</div>
						</div>
					</div> -->

					<!-- liste des attributions-->
					<div class="row">
						<div class="col-md-12 col-sm-12 ">
							<div class="x_panel">
								<div class="x_title">
									<h2>Détails liste<small></small></h2>
									
									<ul class="nav navbar-right panel_toolbox">
									<!-- <button type="submit" style="border:0px; background:#FFFFFF;" id="exportToExcel"><img src="images/excelv2.png"> </button>&emsp; -->
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
				
									

			<!-- AFFICHAE DU TABLEAU CONTENANT LES DETAILS -->
			<?php
				$SELECT_DETAIL_DASH= $pdo -> prepare("SELECT * FROM temp_dashb ORDER BY montantht DESC");
				$SELECT_DETAIL_DASH -> execute();
			?>
	


						<div class="table-responsive" style="height: 300px; overflow: auto;">

					
                        <table  id="tableanalyse" class="table" name="table">
                          <thead>
						  						<tr>
                                                
												<th>ID</th>
												<th>COMPTES</th>
												<th>MONTANT HT</th>
												<th>BU</th>
												<th>SERVICES</th>
													
												</tr>
                          </thead>
                          <tbody>
                          
								
								            <?php 
				                    while ($DETAILS = $SELECT_DETAIL_DASH->fetch()) { 

                              ?>
					
                                            <tr>
                                                
                                                      <th> <?php echo($DETAILS['id']) ?> </th>
							  
                                                      <td><?php echo($DETAILS['comptec']) ?></td>
                                                      <td><?php echo($DETAILS['montantht']) ?></td>
                                                      <td><?php echo($DETAILS['bu']) ?></td>
													  <td><?php echo($DETAILS['sce']) ?></td>
                                               
                                            </tr>

                                            <?php } ?>
													
												</tbody>
												</table>
											</div>

						<script type="text/javascript">
                        function tableToExcel(){
                        $("#tableanalyse").table2excel({
                            // exclude: ".excludeThisClass",
                            name: "Worksheet",
                            filename: "MyFile.xlsx", // do include extension
                            preserveColors: false // set to true if you want background colors and font colors preserved
                        })
                        }

                      </script>
                          
                      <script>
                        
                            // document.getElementById('exportxlxs').addEventListener('click',function(){
                            //           var table2excel = new Table2Excel();
                            //           table2excel.export(document.querySelectorAll("tableanalyse"));
                            //        })

                            document.getElementById("exportpdf")
                                    .addEventListener("click", () => {
                                        const conso= this.document.getElementById("tableanalyse");
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
