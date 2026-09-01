
<?php

   require_once("requires/session.php");
   require_once("requires/cnx.php");


?>


<!DOCTYPE html>
<html lang="fr">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-32">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="UTF-8">
   
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="icon" href="images/logicone2.png" type="image/ico" />

  <title>Ophtamax | </title>

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
            <div class="right_col" role="main">
				<div class="">
					<div class="page-title">
						<div class="title_left">
						<h3><img src="images/plusv2.png"> Nouvelle Consultation</h3>
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
									<h2>Add New &emsp; &emsp;&emsp; &emsp;      

                                                            <small style="color:#32CD32; align: center;"> 
    
                                                                <?php if (isset($_SESSION['maAttri']) && !empty($_SESSION['maAttri'])) {
                                                                        echo $_SESSION['maAttri'];
                                                                        unset($_SESSION['maAttri']);  
                                                                 } ?>
                                                            </small>

                                    </h2>
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

    
                                <div class="x_content">
                                    <form class="" action="requires/save_attribution.php" method="post" enctype="multipart/form-data">

<?php 
    $REQ_LISTE_PATIENTS = $pdo ->prepare("SELECT * FROM patient ORDER BY nom ASC ");
    $REQ_LISTE_PATIENTS -> execute();
?>

                                        <!-- <span class="section">Informations Personnelles</span> -->
                                        <div class="field item form-group">
                                            <label class="col-form-label col-md-3 col-sm-3 label-align" for="last-name">Liste Patient <span class="required">*</span></label>
                                                <div class="col-md-6 col-sm-6 ">
                                                    <select class="form-control" name="abonne">
                                                    <option>...</option>
                                                        
                                                        <?php  while ($PAT = $REQ_LISTE_PATIENTS -> fetch()) { ?>
                            
                                                            <option value="<?php echo($PAT['id']) ?>"><?php echo($PAT['nom'])," ",($PAT['prenom']) ?></option>
                        
                                                        <?php } ?>
                                                    </select>
                                                </div>
                                        </div>
                                        <div class="field item form-group">
                                            <label class="col-form-label col-md-3 col-sm-3  label-align">Diagnostic<span class="required">*</span></label>
                                                <div class="col-md-6 col-sm-6 ">
                                                <textarea class="form-control" id="exampleFormControlTextarea1" rows="7" name="diagnostic"></textarea> 
                                                </div>
                                        </div>
                                       

                                        <div class="ln_solid"></div>
                                        
                                            <div class="form-group">
                                                <div class="col-md-6 offset-md-3">
                                                    
                                                    <button type="submit" class="btn btn-success">Enregistrer </button> 
                                                </div>
                                            </div>


                                            <div class="x_content">
									            <br />

									
										<div class="ln_solid"></div>


									</form>
								</div>
                                        
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                            
                    																	
										<!-- liste des Services -->
										<div class="row">
						<div class="col-md-12 col-sm-12 ">
							<div class="x_panel">
								<div class="x_title">
									<h2>Liste des consultations<small></small></h2>
									<ul class="nav navbar-right panel_toolbox">
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
            <?php 
                $REQ_LISTE_CONSULT = $pdo -> prepare("SELECT * FROM consult_temp ORDER BY date_cons DESC Limit 25");
                //$PARAM1 = array($NOM1);
                $REQ_LISTE_CONSULT -> execute();								
            ?>

						<div class="table-responsive" style="height: 300px; overflow: auto;">
                        <table class="table" >
                          <thead>
                            <tr >
                             
							  <th>PATIENT</th>
                              <th>CONTACT</th>
							  <th>DATE NAIS</th>
							  <th>DIAGNOSTIC</th>
                              <th>DATE CONSULT</th>
                              <th>EDITER</th>
                              <th>SUPPR</th>
                             
							                               
                              <!--<th>IMPRIMER</th>-->
                            </tr>
                          </thead>
                          <tbody>
                          
                        <?php 
                            while ($CONS = $REQ_LISTE_CONSULT->fetch()) { 
                                  
                         ?>

                            <tr>
                              <th scope="row"><?php echo($CONS['np_patient']) ?></th>
                              <td><?php echo($CONS['contact_patient']) ?></td>
                              <td><?php echo ($CONS['date_nais']) ?></td>
                              <td><?php echo($CONS['diagn']) ?></td>
                              <td ><?php echo($CONS['date_cons']) ?></td>
                            
                              <td><a style="bacbround: red;" href="edit_consult.php?code=<?php echo($CONS['id_consult']) ?>"><span class="btn btn-success" align="center">Edit</span></a></td>
                              <td><a style="bacbround: red;" onclick="return confirm('Etes-vous sûre ?');" href="delete_consult.php?code=<?php echo($CONS['id_consult']) ?>"><span class="btn btn-danger" align="center">Suppr</span></a></td>
                              <!-- <td><a style="bacbround: red;" onclick="return confirm('Etes-vous sûre ?')>"><span class="btn btn-light" align="center">Imprimer</span></a></td> -->
                            </tr>
                        <?php } ?>
                            
                          </tbody>
                        </table>
                      </div>




									
								</div>
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


    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script src="../vendors/validator/multifield.js"></script>
    <script src="../vendors/validator/validator.js"></script>
    
    <!-- Javascript functions	-->
	<script>
		function hideshow(){
			var password = document.getElementById("password1");
			var slash = document.getElementById("slash");
			var eye = document.getElementById("eye");
			
			if(password.type === 'password'){
				password.type = "text";
				slash.style.display = "block";
				eye.style.display = "none";
			}
			else{
				password.type = "password";
				slash.style.display = "none";
				eye.style.display = "block";
			}

		}
	</script>

    <script>
        // initialize a validator instance from the "FormValidator" constructor.
        // A "<form>" element is optionally passed as an argument, but is not a must
        var validator = new FormValidator({
            "events": ['blur', 'input', 'change']
        }, document.forms[0]);
        // on form "submit" event
        document.forms[0].onsubmit = function(e) {
            var submit = true,
                validatorResult = validator.checkAll(this);
            console.log(validatorResult);
            return !!validatorResult.valid;
        };
        // on form "reset" event
        document.forms[0].onreset = function(e) {
            validator.reset();
        };
        // stuff related ONLY for this demo page:
        $('.toggleValidationTooltips').change(function() {
            validator.settings.alerts = !this.checked;
            if (this.checked)
                $('form .alert').remove();
        }).prop('checked', false);

    </script>

    <!-- jQuery -->
    <script src="../vendors/jquery/dist/jquery.min.js"></script>
    <!-- Bootstrap -->
    <script src="../vendors/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <!-- FastClick -->
    <script src="../vendors/fastclick/lib/fastclick.js"></script>
    <!-- NProgress -->
    <script src="../vendors/nprogress/nprogress.js"></script>
    <!-- validator -->
    <!-- <script src="../vendors/validator/validator.js"></script> -->

    <!-- Custom Theme Scripts -->
    <script src="../build/js/custom.min.js"></script>

</body>

</html>
