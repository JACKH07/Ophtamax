
<?php
// $login = ((isset($_SESSION['PROFILE']))?($_SESSION['PROFILE']['login_u']):"");

// $ROLE = ((isset($_SESSION['PROFILE']))?($_SESSION['PROFILE']['coderole']):"");


// if($ROLE =='ADMIN'){

?>

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
                  <li><a><i class="fa fa-gear"></i> Paramètres <span class="fa fa-chevron-down"></span></a>
                    <ul class="nav child_menu">
                      <li><a href="bu.php">Bu</a></li>
                      <li><a href="sexe.php">Sexe</a></li>
                      <li><a href="roles.php">Rôles</a></li>
                      <li><a href="abonne.php">Abonnés</a></li>
                      <li><a href="service.php">Services</a></li>
                      <li><a href="compte.php">Comptes</a></li>
                      <li><a href="numero.php">Numéros</a></li>
                      <li><a href="formule.php">Formules</a></li>
                      <li><a href="facture.php">Factures</a></li>
                      <li><a href="fonction.php">Fonctions</a></li>
                      <li><a href="operateur.php">Opérateurs</a></li>
                      <li><a href="attributions.php">Attributions</a></li>
                      <!-- <li><a href="user.php">Utilisateurs</a></li> -->
                      <li><a href="typecomptclient.php">Type Compte Client</a></li>
                       <!-- <li><a href="import.php">Importations Excel</a></li> -->
                     
                    </ul>
                  </li>
              
                  
                  <li><a><i class="fa fa-bar-chart-o"></i> Statistiques <span class="fa fa-chevron-down"></span></a>
                    <ul class="nav child_menu">
                      <!-- <li><a href="">GSM</a></li> -->
                      <!-- <li><a href="#" Style="color:#FFFF00">-----GSM-----</a></li> -->
                      <li><a href="consotopdix.php">Top Conso</a></li>
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
               
                  </li>
                </ul>
              </div>
          

         </div>
    
         <?php
     
    }
elseif($ROLE=='MGR'){
    
    ?>
  
        
        <!-- menu profile quick info -->
        <div class="profile clearfix">
          <div class="profile_pic">
            <img src="images/user.png" alt="..." class="img-circle profile_img">
          </div>
          <div class="profile_info">
            <span>Welcome,</span>
            <h2><?php echo ((isset($_SESSION['PROFILE']))?($_SESSION['PROFILE']['login_u']):"") ?></h2>
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
                  <!-- <li><a><i class="fa fa-gear"></i> Paramètre <span class="fa fa-chevron-down"></span></a>
                    <ul class="nav child_menu">
                      <li><a href="bu.php">BU</a></li>
                      <li><a href="sexe.php">Sexe</a></li>
                      <li><a href="roles.php">Rôles</a></li>
                      <li><a href="abonne.php">Abonnés</a></li>
                      <li><a href="service.php">Services</a></li>
                      <li><a href="compte.php">Comptes</a></li>
                      <li><a href="numero.php">Numéros</a></li>
                      <li><a href="formule.php">Formules</a></li>
                      <li><a href="facture.php">Factures</a></li>
                      <li><a href="fonction.php">Fonctions</a></li>
                      <li><a href="operateur.php">Opérateurs</a></li>
                      <li><a href="attributions.php">Attributions</a></li>
                      <li><a href="user.php">Utilisateurs</a></li>
                      <li><a href="typecomptclient.php">Type Compte Client</a></li>
                    
                    </ul>
                  </li> -->
              
                  
                  <li><a><i class="fa fa-bar-chart-o"></i> Statistiques <span class="fa fa-chevron-down"></span></a>
                    <ul class="nav child_menu">
                      <li><a href="consotopdix.php">Top Conso</a></li>
                      <li><a href="consoparannee.php">Conso par année</a></li>
                      <!-- <li><a href="consoparservice.php">Conso par Service</a></li> -->
                      <li><a href="factureparcompte.php">Factures par compte</a></li> 
                      <li><a href="abnparcompte.php">Liste des abonnés par compte</a></li>
                      <li><a href="abnparservice.php">Liste des abonnés par service</a></li>
                    </ul>
                  </li>
               
                  </li>
                </ul>
              </div>
          

         </div>

         <?php
}
else{

    ?>

    <!-- menu profile quick info -->
    <div class="profile clearfix">
          <div class="profile_pic">
            <img src="images/user.png" alt="..." class="img-circle profile_img">
          </div>
          <div class="profile_info">
            <span>Welcome,</span>
            <h2><?php echo ((isset($_SESSION['PROFILE']))?($_SESSION['PROFILE']['login_u']):"") ?></h2>
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
                  <!-- <li><a><i class="fa fa-gear"></i> Paramètre <span class="fa fa-chevron-down"></span></a>
                    <ul class="nav child_menu">
                      <li><a href="bu.php">BU</a></li>
                      <li><a href="sexe.php">Sexe</a></li>
                      <li><a href="roles.php">Rôles</a></li>
                      <li><a href="abonne.php">Abonnés</a></li>
                      <li><a href="service.php">Services</a></li>
                      <li><a href="compte.php">Comptes</a></li>
                      <li><a href="numero.php">Numéros</a></li>
                      <li><a href="formule.php">Formules</a></li>
                      <li><a href="facture.php">Factures</a></li>
                      <li><a href="fonction.php">Fonctions</a></li>
                      <li><a href="operateur.php">Opérateurs</a></li>
                      <li><a href="attributions.php">Attributions</a></li>
                      <li><a href="user.php">Utilisateurs</a></li>
                      <li><a href="typecomptclient.php">Type Compte Client</a></li>
                    
                    </ul>
                  </li> -->
              
                  <!-- <li><a><i class="fa fa-table"></i> Tableaux <span class="fa fa-chevron-down"></span></a>
                    <ul class="nav child_menu">
                      <li><a href="tables.php">Tables</a></li>
                      <li><a href="tableaux.php">Ensemble liste</a></li>
                    </ul>
                  </li> -->
                  <li><a><i class="fa fa-bar-chart-o"></i> Statistiques <span class="fa fa-chevron-down"></span></a>
                    <ul class="nav child_menu">
                      <li><a href="consotopdix.php">Top Conso</a></li>
                      <li><a href="consoparannee.php">Conso par année</a></li>
                      <!-- <li><a href="consoparservice.php">Conso par Service</a></li> -->
                      <!-- <li><a href="factureparcompte.php">Factures par compte</a></li>  -->
                      <li><a href="abnparcompte.php">Liste des abonnés par compte</a></li>
                      <!-- <li><a href="abnparservice.php">Liste des abonnés par service</a></li> -->
                    </ul>
                  </li>
               
                  </li>
                </ul>
              </div>
          

         </div>
      
         <?php
}
?>	


<!-- Menu End -->
	