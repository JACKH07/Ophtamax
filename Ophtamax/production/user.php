
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
	<link rel="icon" href="images/icons/fvicone.png" type="image/ico" />

    <title>Matrix TLC | </title>

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
            <div class="right_col" role="main">
				<div class="">
					<div class="page-title">
						<div class="title_left">
						<h3><img src="images/plusv2.png"> Nouvel Utilisateur</h3>
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
									<h2>Add New User
                                      &emsp; &emsp;&emsp; &emsp;      

                                            <small style="color:#32CD32; align: center;"> 
                                                
                                                <?php if (isset($_SESSION['maUser']) && !empty($_SESSION['maUser'])) {
                                            echo $_SESSION['maUser'];
                                            unset($_SESSION['maUser']);  
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
                                <form  action="requires/save_user.php" method="post">
                            
                                        <div class="field item form-group">
                                            <label class="col-form-label col-md-3 col-sm-3  label-align">Nom<span class="required">*</span></label>
                                            <div class="col-md-6 col-sm-6">
                                                <input class="form-control" data-validate-length-range="3" data-validate-words="1" name="nom"  required="required" />
                                            </div>
                                        </div>
                                        <div class="field item form-group">
                                            <label class="col-form-label col-md-3 col-sm-3  label-align">Prénoms<span class="required">*</span></label>
                                            <div class="col-md-6 col-sm-6">
                                                <input class="form-control" data-validate-length-range="6" data-validate-words="1" name="prenoms" required="required" />
                                            </div>
                                        </div>

                                        
            <?php
    
    /*LISTE DES GENRES*/
    require_once("requires/cnx.php");
    $REQ_LISTE_GENRE = $pdo -> prepare("SELECT * FROM genre ORDER BY code ASC");
   /* $PARAM = array($login);*/
    $REQ_LISTE_GENRE  -> execute();

            ?>

                                        <div class="item form-group">
											<label class="col-form-label col-md-3 col-sm-3 label-align" for="last-name">Sexe <span class="required">*</span></label>
											<div class="col-md-6 col-sm-6 ">
												<select name="sexe" class="form-control">
													<option>---</option>
													
                                                    <?php  while ($SEXE = $REQ_LISTE_GENRE -> fetch()) { ?>
                           
                                                            <option value="<?php echo($SEXE['code']) ?>"><?php echo($SEXE['libelle']) ?></option>
                                                    <?php } ?>

												</select>
											</div>
										</div>
                                        <div class="field item form-group">
                                            <label class="col-form-label col-md-3 col-sm-3  label-align">Date de Nais.<span class="required">*</span></label>
                                            <div class="col-md-6 col-sm-6">
                                                <input class="form-control" class='date' type="date" name="datenais" required='required'></div>
                                        </div>
                                        <div class="field item form-group">
                                            <label class="col-form-label col-md-3 col-sm-3  label-align">email<span class="required">*</span></label>
                                            <div class="col-md-6 col-sm-6">
                                                <input class="form-control" name="email" class='email' required="required" type="email" /></div>
                                        </div>
                                        
                                        <div class="field item form-group">
                                            <label class="col-form-label col-md-3 col-sm-3  label-align">Telephone<span class="required">*</span></label>
                                            <div class="col-md-6 col-sm-6">
                                                <input class="form-control" type="tel" class='tel' name="phone" required='required' data-validate-length-range="8,20" /></div>
                                        </div>
                                        
                                      
                                        <div class="field item form-group">
                                            <label class="col-form-label col-md-3 col-sm-3  label-align">Login<span class="required">*</span></label>
                                            <div class="col-md-6 col-sm-6">
                                                <input class="form-control" data-validate-length-range="3" data-validate-words="1" name="login" placeholder="ex. magovesse" required="required" />
                                            </div>
                                        </div>
                                        <div class="field item form-group">
											<label class="col-form-label col-md-3 col-sm-3  label-align">Mot de passe<span class="required">*</span></label>
											<div class="col-md-6 col-sm-6">
												<input class="form-control" type="password" id="password1" name="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}" title="Minimum 8 Characters Including An Upper And Lower Case Letter, A Number And A Unique Character" required />
												
												<span style="position: absolute;right:15px;top:7px;" onclick="hideshow()" >
													<i id="slash" class="fa fa-eye-slash"></i>
													<i id="eye" class="fa fa-eye"></i>
												</span>
											</div>
										</div>

             <?php
    
    /*LISTE DES ROLES*/
    require_once("requires/cnx.php");
    $REQ_LISTE_ROLES = $pdo -> prepare("SELECT * FROM roles ORDER BY code ASC");
   /* $PARAM = array($login);*/
    $REQ_LISTE_ROLES  -> execute();

            ?>
                                        <div class="item form-group">
											<label class="col-form-label col-md-3 col-sm-3 label-align" for="last-name">Rôles <span class="required">*</span></label>
											<div class="col-md-6 col-sm-6 ">
												<select name="role" class="form-control">
													<option>---</option>
													
                                                    <?php  while ($ROLE = $REQ_LISTE_ROLES -> fetch()) { ?>
                           
                                                            <option value="<?php echo($ROLE['code']) ?>"><?php echo($ROLE['libelle']) ?></option>
                                                    <?php } ?>

												</select>
											</div>
										</div>
                                        
                                        <div class="ln_solid"></div>
                                        
                                            <div class="form-group">
                                                <div class="col-md-6 offset-md-3">
                                                    
                                                    <button type='submit' class="btn btn-success">Enregistrer</button>
                                                </div>
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
									<h2>Liste des utilisateurs<small></small></h2>
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
    
    require_once("requires/cnx.php");
    $REQ_LISTE_USER= $pdo -> prepare("SELECT * FROM user ORDER BY nom ASC");
   /* $PARAM = array($login);*/
    $REQ_LISTE_USER  -> execute();
       ?>

						<div class="table-responsive" style="height: 300px; overflow: auto;">
                        <table class="table" >
                          <thead>
                            <tr >
                              <th>NOM</th>
							  <th>PRENOMS</th>
                              <th>LOGIN</th>
                              <th>CONTACT</th>
                              <th>EMAIL</th>
							  <th>EDIT</th>
                              <th>SUPPR</th>
                             
                              <!--<th>IMPRIMER</th>-->
                            </tr>
                          </thead>
                          <tbody>
                          
              <?php 
				 while ($USER = $REQ_LISTE_USER->fetch()) { 
					
					
					
					?>

                            <tr>
                              <th scope="row"><?php echo($USER['nom']) ?></th>

							  <td><?php echo($USER['prenoms']) ?></td>
                              <td><?php echo($USER['login_u']) ?></td>
                              <td><?php echo($USER['contact']) ?></td>
                              <td><?php echo($USER['email']) ?></td>

                              <td><a style="bacbround: red;" href="####?code=<?php echo($USER['id']) ?>"><span class="btn btn-success" align="center">Editer</span></a></td>
                              <td><a style="bacbround: red;" onclick="return confirm('Etes-vous sûre ?');" href="####?code=<?php echo($USER['id']) ?>"><span class="btn btn-danger" align="center">Supprimer</span></a></td>

							 
                              <!--<td><a style="bacbround: red;" onclick="return confirm('Etes-vous sûre ?')>"><span class="btn btn-light" align="center">Imprimer</span></a></td>-->
                            </tr>
                  <?php } ?>
                            
                          </tbody>
                        </table>
                      </div>




									
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
