
<?php
session_start();
if (!(isset($_SESSION['PROFILE']))){

    header("location:login.php");

    
}


        
        require_once("requires/cnx.php");
        //VIDER LA TABLE TEMP DE TRIE
        $REQ_RESETTABLETEMP = $pdo->prepare("TRUNCATE TABLE consult_temp");
        $REQ_RESETTABLETEMP -> execute();

        //LISTE DES PCONSULTATIONS
        $REQ_LISTE_CONSULT2 = $pdo -> prepare("SELECT * FROM consultation ORDER BY nom_prenoms_pat ASC");
        $REQ_LISTE_CONSULT2 -> execute();

        while ($CONS = $REQ_LISTE_CONSULT2->fetch()) { 

            
            $id_patient = $CONS['id_patient'];
            $id_cons = $CONS['id'];
            $np_pat = $CONS['nom_prenoms_pat'];
            $diagn = $CONS['diagnostic'];
            $date_consult = $CONS['datecons'];

            $REQ_SELECT_PATIENT1 = $pdo -> prepare("SELECT * FROM patient WHERE id = ?");
            $PARAM = array($id_patient);
            $REQ_SELECT_PATIENT1 ->execute($PARAM);
            $datenais="";
            $contact="";
            // echo  $id_patient;
            // Echo  $np_pat;
                while ($PAT1 = $REQ_SELECT_PATIENT1->fetch()) { 

                    //$id_cons = $PAT1['id'];
                    //$datenais="";
                    
                    // if (!($PAT1['date_nais'])){
                    //   $datenais="";
                    // }
                    // else{
                        $datenais= $PAT1['date_nais'];
                    // }

                    // if (!($PAT1['contact'])){
                    //   $contact="";
                    // }
                    // else{
                        $contact= $PAT1['contact'];
                    // }
 

                }
            
            
            //AJOUT DANS LA TABLE TEMPORAIRE CONSULTATION
            // require_once("requires/cnx.php");
            
            
                $REQ_INSERT_TEMP_CONSULT = $pdo->prepare("INSERT INTO consult_temp (id_consult,id_patient,np_patient,contact_patient,date_nais,diagn,date_cons) VALUE (?,?,?,?,?,?,?)");
                $PARAM = array($id_cons,$id_patient,$np_pat,$contact,$datenais,$diagn,$date_consult);
                $REQ_INSERT_TEMP_CONSULT -> execute($PARAM);
            

        }


// $dataPoints = array( 
// 	array("y" => 3373.64, "label" => "Germany" ),
// 	array("y" => 2435.94, "label" => "France" ),
// 	array("y" => 1842.55, "label" => "China" ),
// 	array("y" => 1828.55, "label" => "Russia" ),
// 	array("y" => 1039.99, "label" => "Switzerland" ),
// 	array("y" => 765.215, "label" => "Japan" ),
// 	array("y" => 612.453, "label" => "Netherlands" )
// );
 
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
	<link rel="icon" href="images/logicone2.png" type="image/ico" />

  <title>Ophtamax | INC</title>

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

  <body class="nav-md" >
    <div class="container body">
      <div class="main_container">
        <div class="col-md-3 left_col">
          <div class="left_col scroll-view">
            <div class="navbar nav_title" style="border: 0;">
              <a href="index.php" class="site_title"><img src="images/logoB1.png"></i> <span>Ophtamax - INC</span></a>
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
      <ul class="navbar-right">
        <li class="nav-item dropdown" style="padding-left: 15px;">
          <a href="#" class="nav-link dropdown-toggle user-profile" id="navbarDropdown" 
             role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="images/user.png" alt="">
            <?php echo ((isset($_SESSION['PROFILE'])) ? ($_SESSION['PROFILE']['login_user']) : "") ?>
          </a>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
            <li>
              <a class="dropdown-item" href="requires/logout.php">
                <i class="fa fa-sign-out pull-right"></i> Log Out
              </a>
            </li>
          </ul>
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
    
          //     $REQ_NUM_FTTH= $pdo ->prepare("select count(*) as nombre from numero where typenum=?");
          //     $PARAM = array("FTTH");
          //     $REQ_NUM_FTTH -> execute($PARAM);
    
          // while ($FTTH = $REQ_NUM_FTTH -> fetch()) {
           
          //  $Total_FTTH= $FTTH['nombre'];
           
          //      }

               $REQ_COMPT_PATIENT= $pdo ->prepare("select count(*) as nombre from patient");
               $REQ_COMPT_PATIENT -> execute();
       
             while ($PAT = $REQ_COMPT_PATIENT -> fetch()) {
              
              $Total_Pat= $PAT['nombre'];
              
                  }

              // $REQ_COMPTE= $pdo ->prepare("select count(*) as nombre from compte");
              // $REQ_COMPTE -> execute();
              // while ($CP = $REQ_COMPTE -> fetch()) {
              
              //   $Total_CP= $CP['nombre'];
                
              //       }

              $REQ_COMPTE_CONSULT= $pdo ->prepare("select count(*) as nombre from consultation");
              $REQ_COMPTE_CONSULT -> execute();

              while ($CONSULT = $REQ_COMPTE_CONSULT -> fetch()) {
              
                $Total_Consult= $CONSULT['nombre'];
                
                    }

              $REQ_NUM_EXAM= $pdo ->prepare("select count(*) as nombre from examen");
              $REQ_NUM_EXAM -> execute();

               while ($NUM1 = $REQ_NUM_EXAM -> fetch()) {
              
                 $Total_exam= $NUM1['nombre'];
                
                     }

              // $REQ_NUM_FIXE= $pdo ->prepare("select count(*) as nombre from numero where typenum=?");
              // $PARAM = array("FIXE");
              // $REQ_NUM_FIXE -> execute($PARAM);

              // while ($NUM2 = $REQ_NUM_FIXE -> fetch()) {
              
              //   $Total_FIXE= $NUM2['nombre'];
                
              //       }
        
        ?>


            <!-- page content -->
        <div class="center_col" role="main">
          <!-- top tiles -->
          <div class="col-md-12 col-sm-12 " style="display: inline-block;" >
          <div class="tile_count">
            <div class="col-md-2 col-sm-4  tile_stats_count" style="text-align: center;color: black;">
              <span class="count_top"><i class="fa fa-users" ></i> Nombre Patients</span>
              <div class="count cp-abonne" ><?php  echo $Total_Pat; ?></div>
              <span class="count_bottom"><i class="green">------------------------ </i> </span>
            </div>
            <div class="col-md-2 col-sm-4  tile_stats_count" style="text-align: center;color: black;" >
              <span class="count_top"><i class="fa fa-stethoscope"></i> Nombre Consult.</span>
              <div class="count cp-gsm" ><?php  echo $Total_Consult; ?></div>
              <span class="count_bottom"><i class="green">------------------------ </i> </span>
            </div>
            <div class="col-md-2 col-sm-4  tile_stats_count"  style="text-align: center;color: black;">
              <span class="count_top"><i class="fa fa-medkit"></i> Nombre Ordonn.</span>
              <div class="count cp-internet" ><?php  echo 1000; ?></div>
              <span class="count_bottom"><i class="green">------------------------ </i> </span>
            </div>
            <div class="col-md-2 col-sm-4  tile_stats_count"  style="text-align: center;color: black;">
              <span class="count_top"><i class="fa fa-list-alt"></i> Nombre Prescrip.</span>
              <div class="count cp-fixe"><?php  echo 250; ?></div>
              <span class="count_bottom"><i class="green">------------------------ </i> </span>
            </div>
            <div class="col-md-2 col-sm-4  tile_stats_count"  style="text-align: center;color: black;">
              <span class="count_top"><i class="fa fa-binoculars"></i> Nombre Examen</span>
              <div class="count cp-sce"><?php  echo $Total_exam; ?></div>
              <span class="count_bottom"><i class="green">------------------------ </i> </span>
            </div>
            <!-- <div class="col-md-2 col-sm-4  tile_stats_count"  style="text-align: center;color: black;">
              <span class="count_top"><i class="fa fa-institution"></i> Compte Client</span>
              <div class="count cp-opr"></div>
              <span class="count_bottom"><i class="green">------------------------ </i> </span>
            </div> -->
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
                               /*$REQ_LISTE_TYPE = $pdo -> prepare("SELECT * FROM typecompte ORDER BY id ASC");
                               $PARAM = array($login);
                                $REQ_LISTE_TYPE  -> execute();*/
                                ?>
                                                  <tr>
                                      <td><h2 style="padding-left: 5px;">Sélectionner l'année: </h2><td>
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
                                    <!-- <td> <input class="form-control" class='date' type="date" name="date1" required='required'></td>
                                    <td> <input class="form-control" class='date' type="date" name="date2" required='required'></td>
                                        -->
                                      <td>
                                                            
                                      <select class="form-control" name="annee" required="required">
                                                                                    
                                                                                    <option value="" ></option>
                                                                                    <!-- <option value="ALL">ALL BU</option> -->
                                                                                    
                                                                                    <?php  
                                                      
                                                                  $annee = date("Y"); // tu recupere l'nnee en cours
                        
                                                                  $an_premier = $annee - 10;
                        
                                                                  $an_dernier = $annee +10;
                        
                                                                  for($i=$an_dernier;$i>=$an_premier;$i--)
                                                                  {
                        
                                                                  echo '<option value="'.$i.'">'.$i.'</option>';
                        
                                                                  }
                                                      
                                                      ?>
                        
                                                            
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

                    <div id="main"></div>



                <div class="clearfix"></div>
                </div>

              </br>

<!-- <script type="text/javascript">
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
</script> -->

<!-- DEBUT RECUPERATION DES DONNEES -->

<?php



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
$i=0;

require_once("requires/cnx.php");

//VIDER LA TABLE TEMP DE TRIE
/*$REQ_RESETTABLETEMP = $pdo->prepare("TRUNCATE TABLE temp_dashb");
$REQ_RESETTABLETEMP -> execute();*/

if(isset($_POST['consulter'])){

	// $date1 = $_POST['date1'];
  // $date2 = $_POST['date2'];
	$annee = $_POST['annee'];
	
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

         else  {


                  $type = 'GSM';
                            //TRI DES TYPES COMPTES
                  
                  // $SELECT_COMPTE= $pdo -> prepare("SELECT * FROM compte WHERE tcompte=?");
                  // $PARAM = array('GSM');
                  // $SELECT_COMPTE -> execute($PARAM);

                  //VIDER LA TABLE TEMP DE TRIE

              
                  // while ($COMP= $SELECT_COMPTE->fetch()){

                  // $SELECT_MONTANT_COMPTE= $pdo -> prepare("SELECT comptec,montantHT,sum(montantHT) as sum FROM facture WHERE comptec=? GROUP BY comptec ");
                  // $PARAM = array($COMP['comptec']);
                  // $SELECT_MONTANT_COMPTE -> execute($PARAM);


                  //     while ($MTHT= $SELECT_MONTANT_COMPTE->fetch()){

                  //       $compte = $MTHT['comptec'];
                  //       $montant = $MTHT['sum'];
                         
                  //       $SELECT_COMPTEC= $pdo -> prepare("SELECT * FROM compte WHERE comptec=?");
                  //       $PARAM = array($compte);
                  //       $SELECT_COMPTEC -> execute($PARAM);
                       
                  //       //Recherche du service en focntion de la BU)

                  //           while ( $CC = $SELECT_COMPTEC->fetch()){

                  //               $code_bu = $CC['bu'];
                              
                  //               $SELECT_SCE= $pdo -> prepare("SELECT * FROM bu WHERE code=?");
                  //               $PARAM = array($code_bu);
                  //               $SELECT_SCE -> execute($PARAM);
                  //               $SCE = $SELECT_SCE->fetch();
                  //           }

                  //       $INSERT_TEMP_DASH = $pdo->prepare("INSERT INTO  temp_dashb (comptec,montantht,bu,sce) VALUE (?,?,?,?)");	
                  //       $PARAM = array($compte,$montant,$code_bu,$SCE['code_sce']);
                  //       $INSERT_TEMP_DASH -> execute($PARAM);
   
                  //     }
                  // }

                }

          
              //       $SELECT_DETAIL_DASH1= $pdo -> prepare("SELECT * FROM temp_dashb ORDER BY id");
              //       $SELECT_DETAIL_DASH1 -> execute();

              //  while ($MTHT = $SELECT_DETAIL_DASH1->fetch()) { 
                  
              //       if ($i == 0) {
              //         $cp0 = $MTHT['montantht'];
              //         $sce0 = $MTHT['comptec'];
                    
              //       }
              //       else if ($i == 1) {
              //         $cp1 = $MTHT['montantht'];
              //         $sce1 = $MTHT['comptec'];
              //       }	
              //       else if ($i == 2) {
              //         $cp2 = $MTHT['montantht'];
              //         $sce2 = $MTHT['comptec'];
              //       }	
              //       else if  ($i == 3) {
              //         $cp3 = $MTHT['montantht'];
              //         $sce3 = $MTHT['comptec'];
              //       }	
              //       else if ($i == 4) {
              //         $cp4 = $MTHT['montantht'];
              //         $sce4 = $MTHT['comptec'];
              //       }	
              //       else if  ($i == 5) {
              //         $cp5 = $MTHT['montantht'];
              //         $sce5 = $MTHT['comptec'];
              //       }	
              //       else if ($i == 6) {
              //         $cp6 = $MTHT['montantht'];
              //         $sce6 = $MTHT['comptec'];
              //       }	
              //       else if ($i == 7) {
              //         $cp7 = $MTHT['montantht'];
              //         $sce7 = $MTHT['comptec'];
              //       }			
              //       else if  ($i == 8) {
              //         $cp8 = $MTHT['montantht'];
              //         $sce8 = $MTHT['comptec'];
              //       }	
              //       else if  ($i == 9) {
              //         $cp9 = $MTHT['montantht'];
              //         $sce9 = $MTHT['comptec'];
              //       }	
              //       else if ($i == 10) {
              //         $cp10 = $MTHT['montantht'];
              //         $sce10 = $MTHT['comptec'];
              //       }	
              //       else if  ($i == 11) {
              //         $cp11 = $MTHT['montantht'];
              //         $sce11 = $MTHT['comptec'];
              //       }	
              //       else if ($i == 12) {
              //         $cp12 = $MTHT['montantht'];
              //         $sce12 = $MTHT['comptec'];
              //       }	
              //       else if ($i == 13) {
              //         $cp13 = $MTHT['montantht'];
              //         $sce13 = $MTHT['comptec'];
              //       }			
              //       else if  ($i == 14) {
              //         $cp14 = $MTHT['montantht'];
              //         $sce14 = $MTHT['comptec'];
              //       }	
                  
                
              //     $i++;
            // }

      ?>

<!-- FIN SCRIPT DE RECUPERATION -->



<script type="text/javascript">
                // Set up the chart
                const chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'main',
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
                        pointFormat: 'Montant: {point.y} CFA'
                    },
                    title: {
                        text: 'Nombre de Consultations <?php echo $annee ?>',
                        align: 'left'
                    },
                    subtitle: {
                        text: 'Source: ' +
                            '<a href=""' +
                            'target="_blank">New KAHYDARA</a>',
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


<!-- AFFICHAE DU TABLEAU CONTENANT LES DETAILS -->
<?php
      // $SELECT_DETAIL_DASH= $pdo -> prepare("SELECT * FROM temp_dashb ORDER BY id");
      // $SELECT_DETAIL_DASH -> execute();
?>

<div class="row">
                    <div class="col-md-12 col-sm-12 ">
                      <div class="x_panel">
                        <div class="x_title">
                          <h2>Détails consultations<small></small></h2>
                          
                          <ul class="nav navbar-right panel_toolbox">
                          <!-- <button type="submit" style="border:0px; background:#FFFFFF;" onclick="tableToExcel()"><img src="images/excelv2.png"> </button>&emsp; -->
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
                          <!-- <br /> -->
	
                          <div class="table-responsive" style="height: 250px; overflow: auto;">

                        
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
				                    //while ($DETAILS = $SELECT_DETAIL_DASH->fetch()) { 

                              ?>
					
                                            <tr>
                                                
                                                      <th> <?php //echo($DETAILS['id']) ?> </th>
							  
                                                      <td><?php //echo($DETAILS['comptec']) ?></td>
                                                      <td><?php //echo($DETAILS['montantht']) ?></td>
                                                      <td><?php //echo($DETAILS['bu']) ?></td>
                                                      <td><?php //echo($DETAILS['sce']) ?></td>
                                               
                                            </tr>

                                            <?php// } ?>

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

          <!-- FIN TABLEAU -->   


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

         
     <!-- <div class="row">

           début grpahe circulaire GSM-
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
              fin grpahe circulaire-->

              <!-- début grpahe circulaire-->
                          <!-- <div class="col-md-4 col-sm-4 "> 
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
               fin grpahe circulaire-->
                          <!-- <div class="col-md-4 col-sm-4  "> 
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
              </div> -->
 
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
