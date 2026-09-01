
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
						<h3><img src="images/growthv1.png"> &emsp;  Liste des factures par compte <!-- <img src="images/bar-chartv1.png">--></h3> 
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

                                    $REQ_LISTE_COMPTE = $pdo -> prepare("SELECT * FROM compte ORDER BY id ASC");
                              /* $PARAM = array($login);*/
                                     $REQ_LISTE_COMPTE  -> execute();
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
                                                            
                                                            <?php  while ($COMPTE = $REQ_LISTE_COMPTE -> fetch()) { ?>
                                                            
                                                                <option value="<?php echo($COMPTE['comptec']) ?>"><?php echo($COMPTE['comptec'])?></option>
                                                            
                                                            <?php } ?>

                                    
                                               </select>
												</td>
												<td> <button type="submit" name="consulter" class="btn btn-success" >Consulter</button></td>
												<td> </button></td>&emsp;
												<!-- <td>&emsp;&emsp;&emsp;<button style="border:0px; background:#FFFFFF;" type="submit" name="pdf" id="chartpdf"><img src="images/pdf11.png"> </button></td> -->

                             				 </tr>
                  
                            
                         				 </tbody>
                        				</table>
									</form>


								</div>
								<div class="x_content"> 
									 <!-- <br />  -->

									 <div class="x_title">
									<h2>Liste des factures<small></small></h2>
									
									<!-- <ul class="nav navbar-right panel_toolbox"> -->
									<!-- <button type="submit" style="border:0px; background:#FFFFFF;" id="exportxlxs"><img src="images/excelv2.png"> </button>&emsp; -->
									&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
									<button style="border:0px; background:#FFFFFF;" type="submit" name="pdf" id="exportpdf"><img src="images/pdf11.png"> </button>&emsp;

									 <div class="table-responsive" style="height: 400px; overflow: auto;">

					
											<table  id="tablefacture" class="table" name="table">
											<thead>
												<tr >
												<th>NUM FACT.</th>
												<th>CC</th>
												<th>MONTANT HT</th>
												<th>DATE</th>
												<th>DATE LIMITE P</th>
												
												<!--<th>IMPRIMER</th>-->
												</tr>
											</thead>
											<tbody>
  
												<?php
													if(isset($_POST['consulter'])){

													$compteC = ($_POST['services']);
													$date1 = $_POST['date1'];
													$date2 = $_POST['date2'];

												require_once("requires/cnx.php");
												$REQ_LISTE_FACTURE_COMPTE = $pdo -> prepare("SELECT * FROM facture WHERE comptec=:sce AND  datef BETWEEN :debut AND :fin ORDER BY datef ASC ");
												// $PARAM = array($$compteC);
												$REQ_LISTE_FACTURE_COMPTE -> execute(array('sce'=> $compteC,':debut'=> $date1, ':fin' => $date2));

														while ($FACT = $REQ_LISTE_FACTURE_COMPTE->fetch()) {
												?>
														<tr>
														<th scope="row"><?php echo($FACT['numfacture']) ?></th>
														
														<td><?php echo($FACT['comptec']) ?></td>
														<td><?php echo($FACT['montantHT']) ?></td>
														<td><?php echo($FACT['datef']) ?></td>
														<td><?php echo($FACT['datelimitpaie']) ?></td>
													
														<!--<td><a style="bacbround: red;" onclick="return confirm('Etes-vous sûre ?')>"><span class="btn btn-light" align="center">Imprimer</span></a></td>-->
														</tr>
											<?php }}  ?>
														
													</tbody>
													</table>
												</div>


											<!-- <script>
												document.getElementById('exportxlxs').addEventListener('click',function(){
													var table2excel = new Table2Excel();
													table2excel.export(document.querySelectorAll("#consotable"));
												})
											</script> -->
									</div>

	<script>
			document.getElementById("exportpdf")
					.addEventListener("click", () => {
						const conso= this.document.getElementById("tablefacture");
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
<!-- AFFICHAGE DES GRAPHES CONSO-->

<p>Pour obtenir la facture TTC, il faut appliquer deux Taxes au motant HT</p>
<H2 style=" Color:red;"> Taxe Com: 3% et TVA 18% </H2>


								</div>
							</div>
						</div>
					</div>

					<!-- liste des attributions-->
					<!-- <div class="row">
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
				
									


	


						
							</div>
						</div>
					</div> -->

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
