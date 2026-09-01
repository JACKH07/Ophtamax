
<?php
session_start();
if (!(isset($_SESSION['PROFILE']))){

    header("location:login.php");
}

$dataPoints = array( 
	array("y" => 3373.64, "label" => "Germany" ),
	array("y" => 2435.94, "label" => "France" ),
	array("y" => 1842.55, "label" => "China" ),
	array("y" => 1828.55, "label" => "Russia" ),
	array("y" => 1039.99, "label" => "Switzerland" ),
	array("y" => 765.215, "label" => "Japan" ),
	array("y" => 612.453, "label" => "Netherlands" )
);
 
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
<script src="https://code.highcharts.com/modules/data.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js"></script>

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

        <!-- top navigation -->
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
        <!-- /top navigation -->

        <!-- page content -->
        <div class="right_col" role="main" >
          <!-- top tiles -->
     <!-- Les compteurs -->
          <?php
            require_once("requires/cnx.php");
    
              $REQ_NUM_FTTH= $pdo ->prepare("select count(*) as nombre from numero where typenum=?");
              $PARAM = array("FTTH");
              $REQ_NUM_FTTH -> execute($PARAM);
    
          while ($FTTH = $REQ_NUM_FTTH -> fetch()) {
           
           $Total_FTTH= $FTTH['nombre'];
           
               }

               $REQ_COMPT_ABON= $pdo ->prepare("select count(*) as nombre from abonne");
               $REQ_COMPT_ABON -> execute();
       
             while ($ABN = $REQ_COMPT_ABON -> fetch()) {
              
              $Total_Abn= $ABN['nombre'];
              
                  }

              $REQ_COMPTE= $pdo ->prepare("select count(*) as nombre from compte");
              $REQ_COMPTE -> execute();
              while ($CP = $REQ_COMPTE -> fetch()) {
              
                $Total_CP= $CP['nombre'];
                
                    }

              $REQ_NUM_GSM= $pdo ->prepare("select count(*) as nombre from numero where typenum=?");
              $PARAM = array("GSM");
              $REQ_NUM_GSM -> execute($PARAM);

              while ($NUM = $REQ_NUM_GSM -> fetch()) {
              
                $Total_NUM= $NUM['nombre'];
                
                    }

              $REQ_NUM_DATA= $pdo ->prepare("select count(*) as nombre from numero where typenum=?");
              $PARAM = array("DATA");
              $REQ_NUM_DATA -> execute($PARAM);

              while ($NUM1 = $REQ_NUM_DATA -> fetch()) {
              
                $Total_DATA= $NUM1['nombre'];
                
                    }

              $REQ_NUM_FIXE= $pdo ->prepare("select count(*) as nombre from numero where typenum=?");
              $PARAM = array("FIXE");
              $REQ_NUM_FIXE -> execute($PARAM);

              while ($NUM2 = $REQ_NUM_FIXE -> fetch()) {
              
                $Total_FIXE= $NUM2['nombre'];
                
                    }
        
        ?>


            <!-- page content -->
        <div class="center_col" role="main">
          <!-- top tiles -->
          <div class="col-md-12 col-sm-12 " style="display: inline-block;" >
          <div class="tile_count">
            <div class="col-md-2 col-sm-4  tile_stats_count" style="text-align: center;color: black;">
              <span class="count_top"><i class="fa fa-user" ></i> Total Abonnés</span>
              <div class="count cp-abonne" ><?php  echo $Total_Abn; ?></div>
              <span class="count_bottom"><i class="green">------------------------ </i> </span>
            </div>
            <div class="col-md-2 col-sm-4  tile_stats_count" style="text-align: center;color: black;" >
              <span class="count_top"><i class="fa fa-clock-o"></i> Total SIM GSM</span>
              <div class="count cp-gsm" ><?php  echo $Total_NUM; ?></div>
              <span class="count_bottom"><i class="green">------------------------ </i> </span>
            </div>
            <div class="col-md-2 col-sm-4  tile_stats_count"  style="text-align: center;color: black;">
              <span class="count_top"><i class="fa fa-wifi"></i> Ligne FTTH</span>
              <div class="count cp-internet" ><?php  echo $Total_FTTH; ?></div>
              <span class="count_bottom"><i class="green">------------------------ </i> </span>
            </div>
            <div class="col-md-2 col-sm-4  tile_stats_count"  style="text-align: center;color: black;">
              <span class="count_top"><i class="fa fa-fax"></i> Ligne Fixe</span>
              <div class="count cp-fixe"><?php  echo $Total_FIXE; ?></div>
              <span class="count_bottom"><i class="green">------------------------ </i> </span>
            </div>
            <div class="col-md-2 col-sm-4  tile_stats_count"  style="text-align: center;color: black;">
              <span class="count_top"><i class="fa fa-group"></i> Total SIM Data 3G</span>
              <div class="count cp-sce"><?php  echo $Total_DATA; ?></div>
              <span class="count_bottom"><i class="green">------------------------ </i> </span>
            </div>
            <div class="col-md-2 col-sm-4  tile_stats_count"  style="text-align: center;color: black;">
              <span class="count_top"><i class="fa fa-institution"></i> Compte Client</span>
              <div class="count cp-opr"><?php  echo $Total_CP; ?></div>
              <span class="count_bottom"><i class="green">------------------------ </i> </span>
            </div>
          </div>
        </div>
          
          <!-- /top tiles -->
       
        <div class="row">
            <div class="col-md-12 col-sm-12 " >
              <div class="dashboard_graph">

                <div class="row x_title">
                  
                   
                                <form form id="demo-form2" data-parsley-validate class="form-horizontal form-label-left" action="" method="post">
                                  <table class="table table-responsive" >
                                        
                                                <tbody>
                                          
                                <?php
                                
                                require_once("requires/cnx.php");
                                $REQ_LISTE_SCE = $pdo -> prepare("SELECT * FROM bu ORDER BY id ASC");
                              /* $PARAM = array($login);*/
                                $REQ_LISTE_SCE  -> execute();
                                ?>
                                                  <tr>
                                      <td><h2 style="padding-left: 5px;">Sélectionner le mois: </h2><td>
                                      <!-- <td> 
                                      

                                      <select class="form-control" name="annee" required="required">
                                                    <option value="">---</option>
                                                    
                                                   
                                                        <option value="">  <?php

                                                             // $mois = date("M"); // tu recupere l'nnee en cours

                                                             // echo $mois; 

                                                            //  ?>
                                                        </option>
                            
                                                  </select>
                                    </td> -->
                                    <td> <input class="form-control" class='date' type="date" name="date1" required='required'></td>
                                    <td> <input class="form-control" class='date' type="date" name="date2" required='required'></td>
                                       
                                      <td>
                                                            
                                      <select class="form-control" name="services" required="required">
                                                                  
                                        <option value="">---</option>
                                        <option value="ALL">ALL BU</option>
                                        
                                        <?php  while ($SCE = $REQ_LISTE_SCE -> fetch()) { ?>
                                          
                                            <option value="<?php echo($SCE['code']) ?>"><?php echo($SCE['code']), ":", ($SCE['code_sce']) ?></option>
                                          
                                          <?php } ?>

                  
                                      </select>
                                      </td>
                                      <td> <button type="submit" name="consulter" class="btn btn-success" >Consulter</button></td>
                                      

                                                    </tr>
                                
                                          
                                                </tbody>
                                              </table>
                                </form>

                </div>


 <!-- CODE POUR AFFICHAGE DES CONSO PAR BU -->

 

                 
                    <div class="dashboard_graph"></div>


                    <!-- Graphe Principal-->

                    <div id="container"></div>



                <div class="clearfix"></div>
                </div>

              </br>

  <!-- AFFICHAE DU TABLEAU CONTENANT LES DETAILS -->
  <div class="row">
                    <div class="col-md-12 col-sm-12 ">
                      <div class="x_panel">
                        <div class="x_title">
                          <h2>Détails consomations<small></small></h2>
                          
                          <ul class="nav navbar-right panel_toolbox">
                          <button type="submit" style="border:0px; background:#FFFFFF;" id="exportxlxs"><img src="images/excelv2.png"> </button>&emsp;
                          <button style="border:0px; background:#FFFFFF;" type="submit" name="pdf" id="exportpdf"><img src="images/pdf11.png"> </button>&emsp;

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
	
                          <div class="table-responsive" style="height: 120px; overflow: auto;">

                        
                                  <table  id="datatable" class="table" name="table">
                                      <thead>
                                            <tr>
                                                <th></th>
                                                <th>GES</th>
                                                <th>IT</th>
                                                <th>CTC</th>
                                                <th>IVS</th>
                                                <th>SSC</th>
                                                <th>MMT</th>
                                                <th>CER</th>
                                                <th>BVML</th>
                                                <th>MARINE</th>
                                                <th>GIS</th>
                                                <th>AUTRE</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th>09/08/2023</th>
                                                <td>30 386</td>
                                                <td>28 504</td>
                                                <td>30 386</td>
                                                <td>28 504</td>
                                                <td>28 504</td>
                                                <td>30 386</td>
                                                <td>28 504</td>
                                                <td>30 386</td>
                                                <td>28 504</td>
                                                <td>28 504</td>
                                                <td>40000</td>
                                            </tr>
                                          
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

          <!-- FIN TABLEAU -->               
        
    


<script type="text/javascript">
  Highcharts.chart('container', {
    data: {
        table: 'datatable'
    },
    chart: {
        type: 'column'
    },
    title: {
        text: 'Consomation Globale GSM '
    },
    subtitle: {
        text:
            'Source: <a href="https://bureauveritas.sharepoint.com/:x:/r/teams/BUREAUVERITASWAF/Dossier%20IT/2023/1-%20TRAVAIL/7-%20R%C3%A9partition%20Factures%20TLC/GSM-%20Mobile%20data%20-%20Liaison/Reporting%20Mobile%20%20Internet%20OrangeMTN%202023.xlsx?d=w206ece4840a94a0a8cd26f31553155c3&csf=1&web=1&e=u36HBt" target="_blank">Reporting Flotte</a>'
    },
    xAxis: {
        type: 'category'
    },
    yAxis: {
        allowDecimals: false,
        title: {
            text: 'Amount'
        }
    }
});
</script>



<!-- 
<script type="text/javascript">

  google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawVisualization);

      function drawVisualization() {
        // Some raw data (not necessarily accurate mainchart--- chart_plot_01)
        var data = google.visualization.arrayToDataTable([
          ['Mois', 'MGT','BVML','CTC','CER','INY','IVS','SSC','GIS','SPY','AGRI','MARINE','OPT','MMT'],
          ['01/2023',  165,938,522, 998, 450, 345,165, 938,522,998, 450,700,2000],
          ['02/2023',  165,938,522, 998, 450, 345,165, 938,522,998, 1500,700,2000],

        
        ]);

        var options = {
          title : '',
          vAxis: {title: 'Montant'},
          hAxis: {title: 'Mois'},
          seriesType: 'bars',
         
        };

        var chart = new google.visualization.ComboChart(document.getElementById('mainchart'));
        chart.draw(data, options);
      }
      </script> -->


      <!-- <script type="text/javascript">

google.charts.load("current", {packages:["corechart"]});
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
    var data = google.visualization.arrayToDataTable([
    ['Service', 'MT'],
    ['CTC',     11],
    ['CER',      2],
    ['IND',  2],
    ['IVS', 2],
    ['GES',    7],
    ['SSC', 2],
    ['GIS', 2],
    ['SPY',    7],
    ['AGRI', 2],
    ['MARINE', 2],
    ['OPT',    7],
    ['MMT',    7],
    ['BVML',    7]
  ]);

  var options = {
    title: '',
    is3D: true,
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart1'));
  chart.draw(data, options);
}

 </script>

<script type="text/javascript">
  google.charts.load("current", {packages:["corechart"]});
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Service', 'MT'],
    ['CTC',     11],
    ['CER',      2],
    ['IND',  2],
    ['IVS', 2],
    ['GES',    7],
    ['SSC', 2],
    ['GIS', 2],
    ['SPY',    7],
    ['AGRI', 2],
    ['MARINE', 2],
    ['OPT',    7],
    ['MMT',    7],
    ['BVML',    7]
  ]);

  var options = {
    title: '',
    is3D: true,
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart2'));
  chart.draw(data, options);
  }

</script>

<script type="text/javascript">
  google.charts.load("current", {packages:["corechart"]});
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['Service', 'MT'],
      ['BVCI',     11],
      ['MARINE',      2],
      ['BVML',  2]
      
    ]);

    var options = {
      title: '',
      is3D: true,
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart3'));
    chart.draw(data, options);
  }

</script> -->
             

                <div class="clearfix"></div>
              </div>
            </div>

          </div>
          <br />

         
    <div class="row">

          <!-- début grpahe circulaire GSM-->
          <div class="col-md-4 col-sm-4 ">
                    <div class="x_panel tile fixed_height_320 overflow_hidden">
                    <div class="x_panel">
                      <div class="x_title">
                        <h2>Détails conso Annuelle - GSM</h2>
                        <ul class="nav navbar-right panel_toolbox">
                          <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                          </li>
                          <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="fa fa-wrench"></i></a>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a class="dropdown-item" href="#">Settings 1</a>
                                <a class="dropdown-item" href="#">Settings 2</a>
                              </div>
                          </li>
                          <li><a class="close-link"><i class="fa fa-close"></i></a>
                          </li>
                        </ul>
                        <div class="clearfix"></div>
                      </div>
                      <div id="piechart1" class="x_content">
                        
            
                      </div>
                      </div>
                    </div>
      </div>
<!-- fin grpahe circulaire-->

<!-- début grpahe circulaire-->
            <div class="col-md-4 col-sm-4 ">
              <div class="x_panel tile fixed_height_320 overflow_hidden">
              <div class="x_panel">
                <div class="x_title">
                  <h2>Détails conso Annuelle - NET</h2>
                  <ul class="nav navbar-right panel_toolbox">
                    <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                    </li>
                    <li class="dropdown">
                      <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="fa fa-wrench"></i></a>
                      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                          <a class="dropdown-item" href="#">Settings 1</a>
                          <a class="dropdown-item" href="#">Settings 2</a>
                        </div>
                    </li>
                    <li><a class="close-link"><i class="fa fa-close"></i></a>
                    </li>
                  </ul>
                  <div class="clearfix"></div>
                  </div>
                <div id = "piechart2" class="x_content" >


               
                </div>
                </div>
              </div>
            </div>
<!-- fin grpahe circulaire-->
            <div class="col-md-4 col-sm-4  ">
             <div class="x_panel tile fixed_height_320 overflow_hidden">
                <div class="x_panel">
                  <div class="x_title">
                    <h2>Détails conso Annuelle - FIXE </h2>
                    <ul class="nav navbar-right panel_toolbox">
                      <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                      </li>
                      <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="fa fa-wrench"></i></a>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a class="dropdown-item" href="#">Settings 1</a>
                            <a class="dropdown-item" href="#">Settings 2</a>
                          </div>
                      </li>
                      <li><a class="close-link"><i class="fa fa-close"></i></a>
                      </li>
                    </ul>
                    <div class="clearfix"></div>
                  </div>
                  <div id="piechart3" class="x_content">
                 

                  </div>
                </div>
                </div>
              </div>
 
                <!-- end of weather widget -->
              </div>
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
    <!-- Chart.js -->
    <script src="../vendors/Chart.js/dist/Chart.min.js"></script>
    <!-- gauge.js -->
    <script src="../vendors/gauge.js/dist/gauge.min.js"></script>
    <!-- bootstrap-progressbar -->
    <script src="../vendors/bootstrap-progressbar/bootstrap-progressbar.min.js"></script>
    <!-- iCheck -->
    <script src="../vendors/iCheck/icheck.min.js"></script>
    <!-- Skycons -->
    <script src="../vendors/skycons/skycons.js"></script>
    <!-- Flot -->
    <script src="../vendors/Flot/jquery.flot.js"></script>
    <script src="../vendors/Flot/jquery.flot.pie.js"></script>
    <script src="../vendors/Flot/jquery.flot.time.js"></script>
    <script src="../vendors/Flot/jquery.flot.stack.js"></script>
    <script src="../vendors/Flot/jquery.flot.resize.js"></script>
    <!-- Flot plugins -->
    <script src="../vendors/flot.orderbars/js/jquery.flot.orderBars.js"></script>
    <script src="../vendors/flot-spline/js/jquery.flot.spline.min.js"></script>
    <script src="../vendors/flot.curvedlines/curvedLines.js"></script>
    <!-- DateJS -->
    <script src="../vendors/DateJS/build/date.js"></script> <!-- Pour le diagramme en barre et le graphe en ligne -->
    <!-- JQVMap -->
    <script src="../vendors/jqvmap/dist/jquery.vmap.js"></script>
    <script src="../vendors/jqvmap/dist/maps/jquery.vmap.world.js"></script>
    <script src="../vendors/jqvmap/examples/js/jquery.vmap.sampledata.js"></script>
    <!-- bootstrap-daterangepicker -->
    <script src="../vendors/moment/min/moment.min.js"></script> <!-- Pour le diagramme en barre-->
    <script src="../vendors/bootstrap-daterangepicker/daterangepicker.js"></script>

    <!-- Custom Theme Scripts -->
    <script src="../build/js/custom.min.js"></script>

    <!-- morris.js -->
    <script src="../vendors/raphael/raphael.min.js"></script>
    <script src="../vendors/morris.js/morris.min.js"></script>
	
  </body>
</html>
