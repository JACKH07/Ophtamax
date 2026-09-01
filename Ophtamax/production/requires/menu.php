
        <!-- menu profile quick info -->
        <div class="profile clearfix">
          <div class="profile_pic">
            <img src="images/user.png" alt="..." class="img-circle profile_img">
          </div>
          <div class="profile_info">
            <span>Welcome,</span>
            <h2><?php echo ((isset($_SESSION['PROFILE']))?($_SESSION['PROFILE']['login_user']):"") ?></h2>
          </div>
        </div>
        <!-- /menu profile quick info -->

        <br />

          <!-- sidebar menu -->
        <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
              <div class="menu_section">
                <h3>General</h3>
                <ul class="nav side-menu">
                  <li><a><i class="fa fa-home"></i> Accueil <span class="fa fa-chevron-down"></span></a>
                    <ul class="nav child_menu">
                      <li><a href="index.php">Dashboard</a></li>
                     <!-- <li><a href="echarts.php">TB - INTERNET</a></li>
                      <li><a href="index3.php">TB - FIXE</a></li>-->
                    </ul>
                  </li>

                  
                  <li><a><i class="fa fa-stethoscope"></i> Activité <span class="fa fa-chevron-down"></span></a>
                    <ul class="nav child_menu">
                      <li><a href="patients.php">Patient</a></li>
                      <li><a href="bulletin.php">Bulletin</a></li>
                      <li><a href="ordonnance.php">Ordonnance</a></li>
                      <li><a href="prescription.php">Prescription</a></li>
                      <li><a href="consultation.php">Consultation</a></li>
                    </ul>
                  </li>
                  
                  <li><a><i class="fa fa-bar-chart-o"></i> Statistiques <span class="fa fa-chevron-down"></span></a>
                    <ul class="nav child_menu">
                      <!-- <li><a href="">GSM</a></li> -->
                      <!-- <li><a href="#" Style="color:#FFFF00">-----GSM-----</a></li> -->
                      <li><a href="consotopdix.php">Consultations</a></li>
                      <li><a href="consoparannee.php">Conso par année</a></li>
                      <!-- <li><a href="consoparservice.php">Conso par Service</a></li> -->
                      <li><a href="factureparcompte.php">Factures par compte</a></li> 
                      <li><a href="abnparcompte.php">Liste des abonnés par compte</a></li>
                      <li><a href="abnparservice.php">Liste des abonnés par service</a></li>
                      <!-- <li><a href="chartjs2.php">Consommation FIXE</a></li>
                      <li><a href="morisjs.php">Consommation INTERNET</a></li> -->
                      <!-- <li><a href="echarts.php">ECharts</a></li> -->
                     <!--<li><a href="other_charts.php">Other Charts</a></li>-->
                    </ul>
                  </li>

                  <li><a><i class="fa fa-gear"></i> Paramètres <span class="fa fa-chevron-down"></span></a>
                    <ul class="nav child_menu">
                      <!-- <li><a href="bu.php">Bu</a></li> -->
                      <li><a href="roles.php">Rôle</a></li>
                      <li><a href="sexe.php">Sexe</a></li>
                      <li><a href="compte.php">Examen</a></li>
                      <li><a href="assurance.php">Assurance</a></li>
                      <li><a href="profession.php">Profession</a></li>
                      <li><a href="entreprise.php">Info Entreprise</a></li>
                      <li><a href="users.php">Gestion des rôles</a></li>
                      <!-- <li><a href="attributions.php">Attributions</a></li> -->
                      <!-- <li><a href="user.php">Utilisateurs</a></li> -->
                      <!-- <li><a href="typecomptclient.php">Type Compte Client</a></li> -->
                       <!-- <li><a href="import.php">Importations Excel</a></li> -->
                     
                    </ul>
                  </li>

               
                  </li>
                </ul>
              </div>
          

         </div>
    
 

<!-- Menu End -->
	