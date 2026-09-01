<?php

  require_once('requires/cnx.php');
$login = ((isset($_SESSION['PROFILE']))?($_SESSION['PROFILE']['login_employe']):"");

$ROLE = ((isset($_SESSION['PROFILE']))?($_SESSION['PROFILE']['id_role']):"");
     


                               
    
if($ROLE =='ADMIN'){

		?>
			<!-- Menu start -->
			<div id='menu'>
				<ul>
					<li class="highlight">
						<a href='index.php'>
							<i class="fa fa-desktop"></i>
							<span>Tableau de Bord</span>
							<span class="current-page"></span>
						</a>
					</li>
				
<li class='has-sub'>
	<a href='#'>
		<i class="fa fa-cog"></i>
		<span>Paramétrage</span>
	</a>
	<ul>
        <li>
			<a href='create_role.php'>
                 <i class="fa fa-tags"></i>
				<span>Créer un Rôle</span>
			</a>
		</li>
         <li>
			<a href='create_genre.php'>
                 <i class="fa fa-tags"></i>
				<span>Créer un Genre</span>
			</a>
		</li>
        <li>
			<a href='create_division.php'>
                 <i class="fa fa-hand-o-right"></i>
				<span>Créer une Division</span>
			</a>
		</li>
		<li>
			<a href='create_commune.php'>
                 <i class="fa fa-hand-o-right"></i>
				<span>Créer une Commune</span>
			</a>
		</li>
        <li>
			<a href='create_type.php'>
                 <i class="fa fa-hand-o-right"></i>
				<span>Créer un Type employé</span>
			</a>
		</li>
        <li>
			<a href='liste_user.php'>
                <i class="fa fa-user"></i>
				<span>Liste des Employé</span>
			</a>
		</li>
		
	</ul>
</li>
					<li>
						<a href='vue_admin_ptg'>
							<i class="fa fa-sliders"></i> 
							<span>Pointage</span>
						</a>
					</li>
					<li>
						<a href='vue_admin_abs.php'>
							<i class="fa fa-calendar"></i> 
							<span>Absence</span>
						</a>
					</li>
                	<!--<li>
						<a href='statistiques.php'>
							<i class="fa fa-bar-chart-o"></i>
							<span>Statistiques</span>
						</a>
					</li>-->

					
				</ul>
			</div>
<?php
     
    }
elseif($ROLE=='MAN'){
    
    ?>
   
    <!-- Menu start -->
			<div id='menu'>
				<ul>
					<li class="highlight">
						<a href='index.php'>
							<i class="fa fa-desktop"></i>
							<span>Tableau de Bord</span>
							<span class="current-page"></span>
						</a>
					</li>
				

					<li>
						<a href='liste_pointage.php'>
							<i class="fa fa-sliders"></i> 
							<span>Pointage</span>
						</a>
					<!--
					<li>
						<a href='liste_absence.php'>
							<i class="fa fa-calendar"></i> 
							<span>Absence</span>
						</a>
					</li></li>-->
                    <li>
						<a href='vue_manager_abs.php'>
							<i class="fa fa-calendar"></i> 
							<span>Vue absence</span>
						</a>
					</li>
                	<!--<li>
						<a href='statistiques.php'>
							<i class="fa fa-bar-chart-o"></i>
							<span>Statistiques</span>
						</a>
					</li>-->

					
				</ul>
			</div>
    
    
    <?php
}
else{
    ?>
<div id='menu'>
    
				<ul>
                    <li class="highlight">
						<a href='index.php'>
							<i class="fa fa-desktop"></i>
							<span>Tableau de Bord</span>
							<span class="current-page"></span>
						</a>
					</li>

					<li>
						<a href='liste_pointage.php'>
							<i class="fa fa-sliders"></i> 
							<span>Pointage</span>
						</a>
					</li>
					<li>
						<a href='liste_absence.php'>
							<i class="fa fa-calendar"></i> 
							<span>Absence</span>
						</a>
					</li>
                	
					
				</ul>
</div>
<?php
}
?>	

<!-- Menu End -->
	