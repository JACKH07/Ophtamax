<!-- Ouverture de la session-->

<?php
     require_once("requires/session.php");


    $code = $_GET['code'];
    
    require_once ("requires/cnx.php");

    $REQUEST_SELECT_PAT = $pdo ->prepare("SELECT * FROM patient WHERE id = ? ");
    $PARAM = array($code);
    $REQUEST_SELECT_PAT ->execute($PARAM);

    $PAT = $REQUEST_SELECT_PAT->fetch();

?>


<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Ophtamax - NCMK</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="robots" content="all,follow">
    <!-- Bootstrap CSS-->
    <link rel="stylesheet" href="vendor/bootstrap/css/bootstrap.min.css">
    <!-- Font Awesome CSS-->
    <link rel="stylesheet" href="vendor/font-awesome/css/font-awesome.min.css">
    <!-- Fontastic Custom icon font-->
    <link rel="stylesheet" href="css/fontastic.css">
    <!-- Google fonts - Poppins -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,700">
    <!-- theme stylesheet-->
    <link rel="stylesheet" href="css/style.default.css" id="theme-stylesheet">
    <!-- Custom stylesheet - for your changes-->
    <link rel="stylesheet" href="css/custom.css">
    <!-- Favicon-->
    <link rel="shortcut icon" href="img/icons/flavicon.png">
    <!-- Tweaks for older IEs--><!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
        <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script><![endif]-->
  </head>
  <body>
    <div class="page">
      

<!-- Header Start -->
        
  <?php

    require_once("requires/header.php");

  ?>

<!-- Header ends -->

      <div class="page-content d-flex align-items-stretch"> 
        <!-- Menu -->

  <?php

    require_once("requires/menu1.php");

  ?>     
  
  <div class="content-inner">
          <!-- Page Header-->
          <header class="page-header">
            <div class="container-fluid">
              <h2 class="no-margin-bottom">Modification Patient</h2>
            </div>
          </header>
          <!-- Breadcrumb-->
          <div class="breadcrumb-holder container-fluid">
            <ul class="breadcrumb">
              <li class="breadcrumb-item"><a href="index.php">Accueil</a></li>
              <li class="breadcrumb-item active">Patient</li>
            </ul>
          </div>
          <!-- Forms Section-->
          <section class="forms"> 

          <form action="save_patient_edit.php?code=" method="post">

             <div class="container-fluid">
              <div class="row">
                <!-- Basic Form-->
                <div class="col-lg-6">
                  <div class="card">
                    <div class="card-close">
                      <div class="dropdown">
                        <button type="button" id="closeCard1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="dropdown-toggle"><i class="fa fa-ellipsis-v"></i></button>
                        <div aria-labelledby="closeCard1" class="dropdown-menu dropdown-menu-right has-shadow"><a href="#" class="dropdown-item remove"> <i class="fa fa-times"></i>Close</a><a href="#" class="dropdown-item edit"> <i class="fa fa-gear"></i>Edit</a></div>
                      </div>
                    </div>
                    <div class="card-header bg-green d-flex align-items-center">
                      <h3 class="h4">Informations nominatives</h3>
                    </div>
                    <div class="card-body">

                           
                          
                          <input type="hidden" placeholder="id" class="form-control"  value="<?php echo($PAT['id']) ?>" name="id">
                       
                        <div class="form-group">       
                          <label class="form-control-label">Nom</label>
                          <input type="text" placeholder="Nom" class="form-control" value="<?php echo ($PAT['nom']); ?>" name="nom">
                        </div>
                        <div class="form-group">       
                          <label class="form-control-label">Prénoms</label>
                          <input type="text" placeholder="Prénoms" class="form-control" value="<?php echo ($PAT['prenom']); ?>" name="prenoms">
                        </div>
                        <div class="form-group">       
                          <label class="form-control-label">Date de naissance</label>
                          <input type="date" placeholder="Date de naissance" class="form-control" value="<?php echo ($PAT['date_nais']); ?>" name="datenais">
                        </div>
                        <div class="form-group">
                        <label class="form-control-label" >Sexe</label>
                             <select name="sexe" class="form-control mb-3">
                             <option value="<?php echo ($PAT['sexe']); ?>"><?php echo ($PAT['sexe']); ?></option>  
                            </select>
                        </div>
                        
                      <!--  <div class="form-group">       
                          <input type="submit" value="Signin" class="btn btn-primary">
                        </div>-->
                      
                    </div>
                  </div>
                </div>
                <!-- Horizontal Form-->
                <div class="col-lg-6">
                  <div class="card">
                    <div class="card-close">
                      <div class="dropdown">
                        <button type="button" id="closeCard2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="dropdown-toggle"><i class="fa fa-ellipsis-v"></i></button>
                        <div aria-labelledby="closeCard2" class="dropdown-menu dropdown-menu-right has-shadow"><a href="#" class="dropdown-item remove"> <i class="fa fa-times"></i>Close</a><a href="#" class="dropdown-item edit"> <i class="fa fa-gear"></i>Edit</a></div>
                      </div>
                    </div>
                   <div class="card-header bg-green d-flex align-items-center">
                      <h3 class="h4">Autres informations</h3>
                    </div>
                    <div class="card-body">
                    <?php
    
    /*$login = ((isset($_SESSION['PROFILE']))?($_SESSION['PROFILE']['login_employe']):"");*/
    require_once("requires/cnx.php");
    $REQ_LISTE_PROFESSION = $pdo -> prepare("SELECT * FROM profession ORDER BY code ASC");
   /* $PARAM = array($login);*/
    $REQ_LISTE_PROFESSION  -> execute();

       ?>
                      <div class="form-horizontal">

                      <div class="form-group">       
                          <label class="form-control-label">Contact</label>
                          <input type="text" placeholder="Contact" class="form-control" value="<?php echo ($PAT['contact']); ?>" name="contact">
                        </div>
                        <div class="form-group">       
                          <label class="form-control-label">Assurance</label>
                          <input type="text" placeholder="Assurance" class="form-control" value="<?php echo ($PAT['assurance']); ?>" name="assurance">
                        </div>

                        <div class="form-group">
                        <label class="form-control-label">Profession</label>
                        <select name="profession" class="form-control mb-3">
                          <option > Sélectionner une profession</option>
                          
                          <?php  while ($PROF = $REQ_LISTE_PROFESSION -> fetch()) { ?>
                           
												<option value="<?php echo($PROF['code']) ?>"><?php echo($PROF['libelle']) ?></option>
                                                <?php } ?>

                          </select>
                        </div>
                        <div class="form-group">       
                          <label class="form-control-label">Antécédents</label>
                          <input type="text" placeholder="Antécédent1; Antécédent2; ..." class="form-control" value="<?php echo ($PAT['antecedents']); ?>" name="antecedents">
                        </div>

                     
                        </div>
                    </div>
                  </div>
                </div>
      
                
                <!-- Form Elements -->
                <div class="col-lg-12">
                  <div class="card">
                    
                    <div class="card-body">
     
                        <div>
                          <div class="col-sm-4 offset-sm-5">
                           <!-- <button type="submit" class="btn btn-secondary">Cancel</button>-->
                            <button type="submit" class="btn btn-primary">Enregistrer</button>
                          </div>
                        </div>
     
                  </div>
                </div>
              </div>
            </div>
         </form>
          </section>
          <!-- Page Footer-->
          <?php

              require_once("requires/footer.php");

          ?>

        </div>
      </div>
    </div>
    <!-- JavaScript files-->
    <script src="vendor/jquery/jquery.min.js"></script>
    <script src="vendor/popper.js/umd/popper.min.js"> </script>
    <script src="vendor/bootstrap/js/bootstrap.min.js"></script>
    <script src="vendor/jquery.cookie/jquery.cookie.js"> </script>
    <script src="vendor/chart.js/Chart.min.js"></script>
    <script src="vendor/jquery-validation/jquery.validate.min.js"></script>
    <!-- Main File-->
    <script src="js/front.js"></script>
  </body>
</html>