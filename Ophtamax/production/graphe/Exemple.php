
<?php
session_start();
if (!(isset($_SESSION['PROFILE']))){

   header("location:login.php");

}



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

    <title>FuelAuto | BV</title>

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
     <!-- SweetAlert -->
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <!-- bootstrap-progressbar -->
    <link href="../vendors/bootstrap-progressbar/css/bootstrap-progressbar-3.3.4.min.css" rel="stylesheet">
    <!-- JQVMap -->
    <link href="../vendors/jqvmap/dist/jqvmap.min.css" rel="stylesheet"/>
    <!-- bootstrap-daterangepicker -->
    <link href="../vendors/bootstrap-daterangepicker/daterangepicker.css" rel="stylesheet">

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


   

  </head>

  <body class="nav-md">
    <div class="container body">
      <div class="main_container">
        <div class="col-md-3 left_col">
          <div class="left_col scroll-view">
            <div class="navbar nav_title" style="border: 0;">
              <a href="index.php" class="site_title"><img src="images/wlogov1.png"></i> <span>FuelAuto | BV</span></a>
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
									<img src="images/user.png" alt=""><?php echo ((isset($_SESSION['PROFILE']))?($_SESSION['PROFILE']['login_user']):"") ?>
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
    
            $REQ_COMP_AGENT = $pdo ->prepare("select count(*) as nombre from agent");
            $REQ_COMP_AGENT -> execute();
    
          while ($AGT = $REQ_COMP_AGENT -> fetch()) {
           
           $Total_Agt= $AGT['nombre'];
           
               }

               $REQ_COMPT_VHL= $pdo ->prepare("select count(*) as nombre from vehicule");
               $REQ_COMPT_VHL -> execute();
       
             while ($VHL = $REQ_COMPT_VHL -> fetch()) {
              
              $Total_Vhl= $VHL['nombre'];
              
                  }

              
                  $REQ_COMPT_ATTR= $pdo ->prepare("select count(*) as nombre from attribution");
                  $REQ_COMPT_ATTR -> execute();
          
                while ($ATT = $REQ_COMPT_ATTR -> fetch()) {
                 
                 $Total_att= $ATT['nombre'];
                 
                     }

                $REQ_SELECT_SANS_MARINE = $pdo->prepare("SELECT consoLT_100,quantite,montant,dist_parcourue,immatriculation_veh,sum(dist_parcourue) as km,sum(montant) as mt,sum(quantite) as quantite,sum(consoLT_100) as conso, count(immatriculation_veh) as cpt FROM compiletransact_log WHERE services!=?");
                $PARAM= array('MAR');
                $REQ_SELECT_SANS_MARINE ->execute($PARAM);

                while ($TR= $REQ_SELECT_SANS_MARINE-> fetch()){
                      if ($TR['cpt']==0){
                        $TconsoLT100 = 0;
                        $Total_Qte= 0;
                        $Total_Mt=0;
                        $Total_KM=0;
                      }
                      else{
                      $TconsoLT100 = number_format(($TR['conso']/$TR['cpt']),2);
                      $Total_Qte= number_format($TR['quantite'],2);     
                      $Total_Mt= $TR['mt'];
                      $Total_KM= $TR['km'];
                    }

                }              

        
        ?>


            <!-- page content -->
        <div class="center_col" role="main">
          <!-- top tiles -->
          <div class="col-md-12 col-sm-12 " style="display: inline-block;" >
          <div class="tile_count">
            <div class="col-md-2 col-sm-4  tile_stats_count" style="text-align: center;color: black;">
              <span class="count_top"><i class="fa fa-user" ></i> Véhicules</span>
              <div class="count cp-abonne" ><?php  echo $Total_Vhl; ?></div>
              <span class="count_bottom"><i class="green">------------------------ </i> </span>
            </div>
            <div class="col-md-2 col-sm-4  tile_stats_count" style="text-align: center;color: black;" >
              <span class="count_top"><i class="fa fa-clock-o"></i> Conso LT/100</span>
              <div class="count cp-gsm" ><?php  echo $TconsoLT100; ?></div>
              <span class="count_bottom"><i class="green">------------------------ </i> </span>
            </div>
            <div class="col-md-2 col-sm-4  tile_stats_count"  style="text-align: center;color: black;">
              <span class="count_top"><i class="fa fa-wifi"></i> Qauntité carburant/LT</span>
              <div class="count cp-internet" ><?php  echo $Total_Qte; ?></div>
              <span class="count_bottom"><i class="green">------------------------ </i> </span>
            </div>
            <!-- <div class="col-md-2 col-sm-4  tile_stats_count"  style="text-align: center;color: black;">
              <span class="count_top"><i class="fa fa-money"></i> MT Global Fuel</span>
              <div class="count cp-internet" ><?php  echo $Total_Mt; ?>&emsp;</div>
              <span class="count_bottom"><i class="green">------------------------ </i> </span>
            </div> -->
            <div class="col-md-2 col-sm-4  tile_stats_count"  style="text-align: center;color: black;">
              <span class="count_top"><i class="fa fa-fax"></i> Kilométrage</span>
              <div class="count cp-fixe"><?php  echo $Total_KM; ?></div>
              <span class="count_bottom"><i class="green">------------------------ </i> </span>
            </div>
            <div class="col-md-2 col-sm-4  tile_stats_count"  style="text-align: center;color: black;">
              <span class="count_top"><i class="fa fa-group"></i> Agents</span>
              <div class="count cp-sce"><?php  echo $Total_Agt; ?></div>
              <span class="count_bottom"><i class="green">------------------------ </i> </span>
            </div>
          
            <div class="col-md-2 col-sm-4  tile_stats_count"  style="text-align: center;color: black;">
              <span class="count_top"><i class="fa fa-institution"></i> MT Global Fuel</span>
              <div class="count cp-opr"><?php  echo $Total_Mt; ?></div>
              <span class="count_bottom"><i class="green">------------------------ </i> </span>
            </div>
          </div>
        </div>
          
          <!-- /top tiles -->

          <div class="row">
            <div class="col-md-12 col-sm-12 " >
                  <div class="dashboard_graph">
                

             
                  </div>


                    <!-- Graphe Principal-->

                    <div id="container0"></div>



                <div class="clearfix"></div>
              </div>
            </div>

          

          <br />
          
          <div class="row">
            <div class="col-md-12 col-sm-12 " >
                  <div class="dashboard_graph">
                

             
                  </div>


                    <!-- Graphe Principal-->

                    <div id="container"></div>



                <div class="clearfix"></div>
              </div>
            </div>

         
          
          <br />
          

          <div class="row">
            <div class="col-md-12 col-sm-12 " >
              <div class="dashboard_graph">
             
              


                    <!-- Graphe Principal-->

                    <div id="container1"></div>



                <div class="clearfix"></div>
              </div>
            </div>

          </div>
         
          <br />

          <div class="row">
            <div class="col-md-12 col-sm-12 " >
              <div class="dashboard_graph">
             
              


                    <!-- Graphe Principal-->

                    <div id="container2"></div>



                <div class="clearfix"></div>
              </div>
            </div>

          </div>
         
          <br />

                      <?php

                      require_once("requires/cnx.php");

                      //VIDER LA TABLE TEMP DE TRIE
                      $REQ_RESETTABLETEMP = $pdo->prepare("TRUNCATE TABLE attribution_cpt");
                      $REQ_RESETTABLETEMP -> execute();

                      $i=0;

                        $cp0 = 0;
                        $sce0 = "";

                        $cp1 = 0;
                        $sce1 = "";

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
                      
                        


                            $SELECT_ATTRIBUTION_SCE= $pdo -> prepare("SELECT services,immatriculation,count(immatriculation) as cpt FROM attribution GROUP BY services ");
                            $SELECT_ATTRIBUTION_SCE -> execute();

                                while ($CONSO = $SELECT_ATTRIBUTION_SCE->fetch()){ 

                                      $INSERT_TRIE_ATT = $pdo->prepare("INSERT INTO attribution_cpt (sce,qte) VALUE (?,?)");	
                                      $PARAM = array($CONSO['services'],$CONSO['cpt']);
                                      $INSERT_TRIE_ATT -> execute($PARAM);
                                }

                                $SELECT_ATTRIBUTION_TOP10= $pdo -> prepare("SELECT * FROM attribution_cpt ORDER BY qte DESC limit 10");
                                $SELECT_ATTRIBUTION_TOP10 -> execute();


                                while ($TRIE = $SELECT_ATTRIBUTION_TOP10->fetch()){ 

                                                  if ($i == 0) {
                                                    $cp0 = $TRIE['qte'];
                                                    $sce0 = $TRIE['sce'];
                                                  
                                                  }
                                                  else if ($i == 1) {
                                                    $cp1 = $TRIE['qte'];
                                                    $sce1 = $TRIE['sce'];
                                                  }	
                                                  else if ($i == 2) {
                                                    $cp2 = $TRIE['qte'];
                                                    $sce2 = $TRIE['sce'];
                                                  }	
                                                  else if  ($i == 3) {
                                                    $cp3 = $TRIE['qte'];
                                                    $sce3 = $TRIE['sce'];
                                                  }	
                                                  else if ($i == 4) {
                                                    $cp4 = $TRIE['qte'];
                                                    $sce4 = $TRIE['sce'];
                                                  }	
                                                  else if  ($i == 5) {
                                                    $cp5 = $TRIE['qte'];
                                                    $sce5 = $TRIE['sce'];
                                                  }	
                                                  else if ($i == 6) {
                                                    $cp6 = $TRIE['qte'];
                                                    $sce6 = $TRIE['sce'];
                                                  }	
                                                  else if ($i == 7) {
                                                    $cp7 = $TRIE['qte'];
                                                    $sce7 = $TRIE['sce'];
                                                  }			
                                                  else if  ($i == 8) {
                                                    $cp8 = $TRIE['qte'];
                                                    $sce8 = $TRIE['sce'];
                                                  }	
                                                  else if  ($i == 9) {
                                                    $cp9 = $TRIE['qte'];
                                                    $sce9 = $TRIE['sce'];
                                                  }	
                                                  
                                                $i++;
                                                  
                                                }

                      ?>
         
 

                        <!-- Liste des Graphe JS -->
                        <script type="text/javascript">

                        Highcharts.chart('container0', {
                            chart: {
                                type: 'bar'
                            },
                            title: {
                                text: 'Consomation litre pour 100 Annuelle',
                                align: 'left'
                            },
                            subtitle: {
                                text: 'Source: ' +
                                    '<a href="https://www.mytotalfuelcard.com/Client/app/index.html#!home"' +
                                    'target="_blank">TotalEnergie</a>',
                                align: 'left'
                            },
                            xAxis: {
                                categories: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
                                title: {
                                    text: null
                                },
                                gridLineWidth: 1,
                                lineWidth: 0
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: 'Conso (LT/100)',
                                    align: 'high'
                                },
                                labels: {
                                    overflow: 'justify'
                                },
                                gridLineWidth: 0
                            },
                            tooltip: {
                                valueSuffix: ' millions'
                            },
                            plotOptions: {
                                bar: {
                                    borderRadius: '50%',
                                    dataLabels: {
                                        enabled: true
                                    },
                                    groupPadding: 0.1
                                }
                            },
                            legend: {
                                layout: 'vertical',
                                align: 'right',
                                verticalAlign: 'top',
                                x: -40,
                                y: 80,
                                floating: true,
                                borderWidth: 1,
                                backgroundColor:
                                    Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
                                shadow: true
                            },
                            credits: {
                                enabled: false
                            },
                            series: [{
                                name: 'Année 2023',
                                data: [0, 0, 12, 13, 11, 12.5]
                            }]
                        });

                        </script>
                       
                       
                        <script type="text/javascript">
                        // Set up the chart
                        const chart = new Highcharts.Chart({
                            chart: {
                                renderTo: 'container',
                                type: 'column',
                                options3d: {
                                    enabled: true,
                                    alpha: 10,
                                    beta: 10,
                                    depth: 30,
                                    viewDistance: 25
                                }
                            },
                            xAxis: {
                                categories: ['<?php echo $sce0 ?>', '<?php echo $sce1 ?>', '<?php echo $sce2 ?>', '<?php echo $sce3 ?>', '<?php echo $sce4 ?>', '<?php echo $sce5 ?>',
                                    '<?php echo $sce6 ?>', '<?php echo $sce7 ?>', '<?php echo $sce8 ?>', '<?php echo $sce9 ?>']
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
                                text: 'TOP 10 du nombre de voitures par Service',
                                align: 'left'
                            },
                            subtitle: {
                                text: 'Source: ' +
                                    '<a href="https://www.mytotalfuelcard.com/Client/app/index.html#!home"' +
                                    'target="_blank">TotalEnergie</a>',
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
                                data: [<?php echo $cp0 ?>, <?php echo $cp1 ?>, <?php echo $cp2 ?>, <?php echo $cp3 ?>, <?php echo $cp4 ?>, <?php echo $cp5 ?>, <?php echo $cp6 ?>, <?php echo $cp7 ?>, <?php echo $cp8 ?>, <?php echo $cp9 ?>],
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


                        <script type="text/javascript">

                        Highcharts.chart('container1', {
                            chart: {
                                type: 'cylinder',
                                options3d: {
                                    enabled: true,
                                    alpha: 15,
                                    beta: 10,
                                    depth: 50,
                                    viewDistance: 25
                                }
                            },
                            title: {
                                text: 'TOP 10 conso carburant par Véhicule',
                                align: 'left'
                            },
                            subtitle: {
                                text: 'Source: ' +
                                    '<a href="https://www.mytotalfuelcard.com/Client/app/index.html#!home"' +
                                    'target="_blank">TotalEnergie</a>',
                                align: 'left'
                            },
                            xAxis: {
                                categories: ['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80-89', '90+'],
                                title: {
                                  
                                    text: 'Véhicules'
                                }
                            },
                            yAxis: {
                                title: {
                                    margin: 65,
                                    text: 'Reported cases'
                                }
                            },
                            tooltip: {
                                headerFormat: '<b>Age: {point.x}</b><br>'
                            },
                            plotOptions: {
                                series: {
                                    depth: 45,
                                    colorByPoint: true
                                }
                            },
                            series: [{
                                data: [95321, 169339, 121105, 136046, 106800, 58041, 26766, 14291,
                                    7065, 3283],
                                name: 'MT',
                                showInLegend: false
                            }]
                        });

                        </script>


                        <script type="text/javascript">

                        // Data retrieved from https://netmarketshare.com/
                        // Radialize the colors
                        Highcharts.setOptions({
                            colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
                                return {
                                    radialGradient: {
                                        cx: 0.5,
                                        cy: 0.3,
                                        r: 0.7
                                    },
                                    stops: [
                                        [0, color],
                                        [1, Highcharts.color(color).brighten(-0.3).get('rgb')] // darken
                                    ]
                                };
                            })
                        });

                        // Build the chart
                        Highcharts.chart('container2', {
                            chart: {
                                plotBackgroundColor: null,
                                plotBorderWidth: null,
                                plotShadow: false,
                                type: 'pie'
                            },
                            title: {
                                text: 'TOP 10 conso financière par Service en CFA',
                                align: 'left'
                            },
                            tooltip: {
                                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                            },
                            accessibility: {
                                point: {
                                    valueSuffix: '%'
                                }
                            },
                            plotOptions: {
                                pie: {
                                    allowPointSelect: true,
                                    cursor: 'pointer',
                                    dataLabels: {
                                        enabled: true,
                                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                        connectorColor: 'silver'
                                    }
                                }
                            },
                            series: [{
                                name: 'Share',
                                data: [
                                    { name: 'Chrome', y: 73.24 },
                                    { name: 'Edge', y: 12.93 },
                                    { name: 'Firefox', y: 4.73 },
                                    { name: 'Safari', y: 2.50 },
                                    { name: 'Internet Explorer', y: 1.65 },
                                    { name: 'Other', y: 4.93 }
                                ]
                            }]
                        });

                        </script>         
              <!-- <div class="row">

            début grpahe circulaire GSM
            <div class="col-md-4 col-sm-4 ">
              <div class="x_panel tile fixed_height_320 overflow_hidden">
              <div class="x_panel">
                <div class="x_title">
                  <h2>Nombre Véhicule/Service</h2>
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
                <div id="mainchart" class="x_content">
                  
      
                </div>
                </div>
              </div>
            </div>



            <div class="col-md-4 col-sm-4 ">
              <div class="x_panel tile fixed_height_320 overflow_hidden">
              <div class="x_panel">
                <div class="x_title">
                  <h2>MT Conso/Service</h2>
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
                <div id = "piechart" class="x_content" >


               
                </div>
                </div>
              </div>
            </div>
            fin grpahe circulaire
            <div class="col-md-4 col-sm-4  ">
             <div class="x_panel tile fixed_height_320 overflow_hidden">
                <div class="x_panel">
                  <div class="x_title">
                    <h2>KM Parcouru/ Service</h2>
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
                  <div id="piechart" class="x_content">
                 

                  </div>
                </div>
                </div>
              </div> -->
 
                <!-- end of weather widget -->
                
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
