<?php

    require_once('requires/session.php');

?>

<!DOCTYPE html>
<html lang="en">
	

<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0"> 
		<meta name="description" content="Everest Admin Panel" />
		<meta name="keywords" content="Admin, Dashboard, Bootstrap3, Sass, transform, CSS3, HTML5, Web design, UI Design, Responsive Dashboard, Responsive Admin, Admin Theme, Best Admin UI, Bootstrap Theme, Wrapbootstrap, Bootstrap" />
		<meta name="author" content="Bootstrap Gallery" />
		<link rel="shortcut icon" href="img/icons/fvicone.png">
		<title>BV | EasyPoint</title>
		
		<!-- Bootstrap CSS -->
		<link href="css/bootstrap.min.css" rel="stylesheet" media="screen">

		<!-- Animate CSS -->
		<link href="css/animate.css" rel="stylesheet" media="screen">

		<!-- Main CSS -->
		<link href="css/main.css" rel="stylesheet" media="screen">

		<!-- Font Awesome -->
		<link href="fonts/font-awesome.min.css" rel="stylesheet">

		<!-- Data Tables -->
		<link href="css/datatables/dataTables.bs.min.css" rel="stylesheet" />
		<link href="css/datatables/autoFill.bs.min.css" rel="stylesheet" />
		<link href="css/datatables/fixedHeader.bs.css" rel="stylesheet" />
		<link href="css/datatables/buttons.bs.css" rel="stylesheet" />		

		<!-- HTML5 shiv and Respond.js IE8 support of HTML5 elements and media queries -->
		<!--[if lt IE 9]>
			<script src="js/html5shiv.js"></script>
			<script src="js/respond.min.js"></script>
		<![endif]-->

	</head>  

	<body>

		<!-- Header Start -->
            
            <?php
            
                require_once("requires/header.php");
            
            ?>
		<!-- Header ends -->

		<!-- Left sidebar starts -->
		<aside id="sidebar">

			<!-- Menu start -->
			
            <?php
            
                require_once("requires/menu.php");
            
            ?>
			<!-- Menu End -->


			<!-- Freebies Starts -->
			
			<!-- Freebies Starts -->

		</aside>
		<!-- Left sidebar ends -->

		<!-- Dashboard Wrapper starts -->
		<div class="dashboard-wrapper">

			<!-- Top Bar starts -->
			<div class="top-bar">
				<div class="page-title">
					FICHE EMPLOYE
				</div>
				
			</div>
			<!-- Top Bar ends -->

			<!-- Main Container starts -->
			<div class="main-container">

				<!-- Container fluid starts -->
				<div class="container-fluid">
					<!-- Spacer starts -->
					<div class="spacer">
						
						<!-- Formulaire starts -->
<form action="save_user.php" method="post">
						<div class="row">
							<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
								<div class="blog">
									<div class="blog-header">
										<h5 class="blog-title">Informations Nominatives</h5>
									</div>
									<div class="blog-body">
										<div class="form-group">
											<input class="form-control input-sm" name="nom" type="text" placeholder="Nom">
										</div>
										<div class="form-group">
											<input class="form-control input-sm" name="prenoms" type="text" placeholder="Prenoms">
										</div>
                                        <div class="form-group">
											<input class="form-control" type="date" name="datenais" placeholder="Date de naissance">
										</div>
              <?php
    
        /*$login = ((isset($_SESSION['PROFILE']))?($_SESSION['PROFILE']['login_employe']):"");*/
        require_once("requires/cnx.php");
        $REQ_LISTE_SEXE = $pdo -> prepare("SELECT * FROM sexe");
       /* $PARAM = array($login);*/
        $REQ_LISTE_SEXE -> execute();
    
           ?>
                                        <div class="form-group">
                                            
											<select class="form-control input-sm" name="sexe">
                                                <option>Sexe</option>
                                                 <?php  while ($SEXE = $REQ_LISTE_SEXE -> fetch()) { ?>
												
												<option value="<?php echo($SEXE['id_sexe']) ?>"><?php echo($SEXE['id_sexe']) ?></option>
                                                <?php } ?>
											</select>
                                            
										</div>
										<div class="form-group">
											<input class="form-control input-sm" name="matricule" type="text" placeholder="Matricule">
										</div>
                                        <!--<div class="form-group">
											<input class="form-control input-sm" name="bu" type="text" placeholder="Business unit">
										</div>-->
                                        <div class="form-group">
											<input class="form-control input-sm" name="telephone" type="text" placeholder="Téléphone">
										</div>
                                     
                                        
                  <?php
    
        /*$login = ((isset($_SESSION['PROFILE']))?($_SESSION['PROFILE']['login_employe']):"");*/
        require_once("requires/cnx.php");
        $REQ_LISTE_TYPE = $pdo -> prepare("SELECT * FROM type_employe");
       /* $PARAM = array($login);*/
        $REQ_LISTE_TYPE -> execute();
    
           ?>                       
										<div class="form-group">
											<select class="form-control input-sm" name="type">
												<option>Type employé</option>
												<?php  while ($TYPE = $REQ_LISTE_TYPE -> fetch()) { ?>
												
												<option value="<?php echo($TYPE['id_type_emp']) ?>"><?php echo($TYPE['id_type_emp']) ?></option>
                                                <?php } ?>
											</select>
										</div>
                                    
                  <?php
    
        /*$login = ((isset($_SESSION['PROFILE']))?($_SESSION['PROFILE']['login_employe']):"");*/
        require_once("requires/cnx.php");
        $REQ_LISTE_COMMUNE = $pdo -> prepare("SELECT * FROM commune");
       /* $PARAM = array($login);*/
        $REQ_LISTE_COMMUNE -> execute();
    
           ?>                                 
                                        
										<div class="form-group">
											<select class="form-control input-sm" name="commune">
												<option>Commune</option>
												<?php  while ($COMMUNE = $REQ_LISTE_COMMUNE -> fetch()) { ?>
												
												<option value="<?php echo($COMMUNE['lib_comm']) ?>"><?php echo($COMMUNE['lib_comm']) ?></option>
                                                <?php } ?>
											</select>
										</div>
				<?php
    
        /*$login = ((isset($_SESSION['PROFILE']))?($_SESSION['PROFILE']['login_employe']):"");*/
        require_once("requires/cnx.php");
        $REQ_LISTE_DIVISION = $pdo -> prepare("SELECT * FROM division");
       /* $PARAM = array($login);*/
        $REQ_LISTE_DIVISION -> execute();
    
           ?>         				
                                        
                                        <div class="form-group no-margin">
											<select class="form-control input-sm" name="division">
												<option>Division</option>
												<?php  while ($DIVISION = $REQ_LISTE_DIVISION -> fetch()) { ?>
												
												<option value="<?php echo($DIVISION['libelle_division']) ?>"><?php echo($DIVISION['libelle_division']) ?></option>
                                                <?php } ?>
											</select>
										</div>
									</div>
								</div>
							</div>
							<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
								<div class="blog">
									<div class="blog-header">
										<h5 class="blog-title">Informations Compte</h5>
									</div>
									<div class="blog-body">
										<div class="form-group has-success has-feedback">
											<label class="control-label" for="inputSuccess2">Nom d'utilisateur</label>
											<input type="text"  onchange="this.value = this.value.charAt(0).toUpperCase() + this.value.substr(1);" name="login" class="form-control" id="inputSuccess2" placeholder="ex: doch">
											<span class="fa fa-check form-control-feedback"></span>
										</div>
										<div class="form-group has-warning has-feedback">
											<label class="control-label" for="inputWarning2">Mot de passe</label>
											<input type="password" name="password" class="form-control" id="inputWarning2">
											<span class="fa fa- fa-warning form-control-feedback"></span>
										</div>
										
										<div class="form-group">
											<label class="control-label" for="inputDefault">Adresse Mail</label>
											<input type="text" name="mail" class="form-control" id="inputDefault">
										</div>

                   <?php
    
        /*$login = ((isset($_SESSION['PROFILE']))?($_SESSION['PROFILE']['login_employe']):"");*/
        require_once("requires/cnx.php");
        $REQ_LISTE_ROLE = $pdo -> prepare("SELECT * FROM role");
       /* $PARAM = array($login);*/
        $REQ_LISTE_ROLE -> execute();
    
           ?>
                                        <div class="form-group no-margin">
											<select class="form-control input-sm" name="role">
												<option>Rôles</option>
											 <?php  while ($ROLE = $REQ_LISTE_ROLE -> fetch()) { ?>
												<option value="<?php echo($ROLE['id_role']) ?>"><?php echo($ROLE['id_role']) ?></option>
                                                <?php } ?>
											</select>
										</div>
                                        
                               <div class="form-group"> 
											
				               </div>
                                         <div class="form-group"> 
											
				               </div>
                                
                                <div class="form-group">
											<input class="form-control input-sm" name="bu" type="text" placeholder="bu">
								</div>
                                        <br>
                                 
                                        <!--
                                        <div class="form-group"> 
											<label class="" for="inputDefault">Photo</label>
											<input type="file" name="photos" class="" id="inputDefault">
										</div>-->
                                            
                                
                                        <br>
                                        
                                    <div class="blog-body">
										<div class="demo-btn-group center-align-text">
											<button type="reset" class="btn btn-danger">Effacer</button>
                                            
                                            <button type="submit" class="btn btn-success" style="float:right;">Valider</button>
										</div>
									</div>
                                        
									</div>
								</div>
							</div>
						</div>
                    
						<!-- Formulaire Ends -->
					
           </form>
                        
        <?php

			require_once("requires/cnx.php");

			$REQ_LISTE_EMPLOYE = $pdo -> prepare("SELECT * FROM employe");

            $REQ_LISTE_EMPLOYE -> execute();
		?>

					</div>
					<!-- Spacer ends -->
				</div>
				<!-- Container fluid ends -->

			</div>
			<!-- Main Container ends -->

			<!-- Footer starts -->
			
            <?php
            
                require_once("requires/footer.php");
            
            ?>
			<!-- Footer ends -->

		</div>
		<!-- Dashboard Wrapper ends -->

		<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
		<script src="js/jquery.js"></script>

		<!-- Include all compiled plugins (below), or include individual files as needed -->
		<script src="js/bootstrap.min.js"></script>

		<!-- Sparkline graphs -->
		<script src="js/sparkline.js"></script>

		<!-- jquery ScrollUp JS -->
		<script src="js/scrollup/jquery.scrollUp.js"></script>

		<!-- Data Tables -->
		<script src="js/datatables/dataTables.min.js"></script>
		<script src="js/datatables/dataTables.bootstrap.min.js"></script>
		<script src="js/datatables/dataTables.tableTools.js"></script>
		<script src="js/datatables/autoFill.min.js"></script>
		<script src="js/datatables/autoFill.bootstrap.min.js"></script>
		<script src="js/datatables/fixedHeader.min.js"></script>
	
		<!-- Download / CSV / Copy / Print -->
		<script src="js/datatables/buttons.min.js"></script>
		<script src="js/datatables/flash.min.js"></script>
		<script src="js/datatables/jszip.min.js"></script>
		<script src="js/datatables/pdfmake.min.js"></script>
		<script src="js/datatables/vfs_fonts.js"></script>
		<script src="js/datatables/html5.min.js"></script>
		<script src="js/datatables/buttons.print.min.js"></script>
		
		<!-- Custom Data tables -->
		<script src="js/datatables/custom-datatables.js"></script>

		<!-- Custom Index -->
		<script src="js/custom.js"></script>
	</body>


</html>