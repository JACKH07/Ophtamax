
<?php 
	
	if($_SESSION['idrole']==1 || $_SESSION['idrole']==2){

		?>


		<!-- Left sidebar starts -->
		<aside id="sidebar">

			<!-- Menu start -->
			<div id='menu'>
				<ul>
					<li class="highlight">
						<a href='dashboard.php'>
							<i class="fa fa-desktop"></i>
							<span>Dashboard</span>
							<span class="current-page"></span>
						</a>
					</li>
					<!-- debut Menu Demande -->
					<li class='has-sub'>
						<a href='#'>
							<i class="fa fa-folder"></i>
							<span>Demandes</span>
						</a>
						<ul>
							<li>
								<a href='addDemande.php'>
									<span>Nouvelle demande</span>
								</a>
							</li>
							<li>
								<a href='listdemandev.php'>
									<span>Demandes validées</span>
								</a>
							</li>
						</ul>
					</li>
					<!-- fin Menu Demande -->
					
					<!-- debut Menu Article -->
					<li class='has-sub'>
						<a href='#'>
							<i class="fa fa-folder"></i>
							<span>Articles</span>
						</a>
						<ul>
							<li>
								<a href='addArticle.php'>
									<span>Ajouter un article</span>
								</a>
							</li>
							<li>
								<a href='stockarticle.php'>
									<span>Ajouter stock</span>
								</a>
							</li>
							<li>
								<a href='listArticle.php'>
									<span>Liste</span>
								</a>
							</li>
						</ul>
					</li>
					<!-- fin Menu Article -->
					
					<!-- debut Menu Fournisseur -->
					<li class='has-sub'>
						<a href='#'>
							<i class="fa fa-folder"></i>
							<span>Fournisseurs</span>
						</a>
						<ul>
							<li>
								<a href='addFournisseur.php'>
									<span>Ajouter un fournisseur</span>
								</a>
							</li>
							<li>
								<a href='listFournisseur.php'>
									<span>Liste</span>
								</a>
							</li>
						</ul>
					</li>
					<!-- fin Menu Fournisseur -->

					<!-- debut Menu Utilisateur -->
					<li class='has-sub'>
						<a href='#'>
							<i class="fa fa-folder"></i>
							<span>Utilisateurs</span>
						</a>
						<ul>
							<li>
								<a href='comptes.php'>
									<span>Ajouter un Utilisateur</span>
								</a>
							</li>
							<li>
								<a href='listUser.php'>
									<span>Liste</span>
								</a>
							</li>
						</ul>
					</li>
					<!-- fin Menu Utilisateur -->

					<!-- debut Menu Mouvement -->
					<li class='has-sub'>
						<a href='#'>
							<i class="fa fa-folder"></i>
							<span>Mouvement du stock</span>
						</a>
						<ul>
							<li>
								<a href='entrees.php'>
									<i class="fa fa-folder-open"></i>
									<span>Entrées de stock</span>
								</a>
							</li>
							<li>
								<a href='sorties.php'>
									<i class="fa fa-folder-open"></i>
									<span>Sorties de stock</span>
								</a>
							</li>
						</ul>
					</li>
					<!-- fin Menu Mouvement -->

					<!-- debut Menu Entrepôt -->
					<li class='has-sub'>
						<a href='#'>
							<i class="fa fa-folder"></i>
							<span>Entrepôts</span>
						</a>
						<ul>
							<li>
								<a href='addEntrepot.php'>
									<i class="fa fa-folder-open"></i>
									<span>Nouvel entrepôt</span>
								</a>
							</li>
							<li>
								<a href='listEntrepot.php'>
									<i class="fa fa-folder-open"></i>
									<span>Liste des entrepôts</span>
								</a>
							</li>
						</ul>
					</li>
					<!-- fin Menu Entrepôt -->

					<!-- debut Menu Magasin -->
					<li class='has-sub'>
						<a href='#'>
							<i class="fa fa-folder"></i>
							<span>Magasins</span>
						</a>
						<ul>
							<li>
								<a href='addMagasin.php'>
									<i class="fa fa-folder-open"></i>
									<span>Ajouter Magasin</span>
								</a>
							</li>
							<li>
								<a href='listMagasin.php'>
									<i class="fa fa-folder-open"></i>
									<span>Liste des Magasins</span>
								</a>
							</li>
						</ul>
					</li>
					<!-- fin Menu Magasin -->

					<!-- debut Menu Emplacement -->
					<li class='has-sub'>
						<a href='#'>
							<i class="fa fa-folder"></i>
							<span>Emplacements</span>
						</a>
						<ul>
							<li>
								<a href='addEmplacement.php'>
									<i class="fa fa-folder-open"></i>
									<span>Ajouter Emplacement</span>
								</a>
							</li>
							<li>
								<a href='listEmplacement.php'>
									<i class="fa fa-folder-open"></i>
									<span>Liste des Emplacements</span>
								</a>
							</li>
						</ul>
					</li>
					<!-- fin Menu Emplacement -->
					
					<!-- debut Menu Service -->
					<li class='has-sub'>
						<a href='#'>
							<i class="fa fa-folder"></i>
							<span>Service</span>
						</a>
						<ul>
							<li>
								<a href='addService.php'>
									<i class="fa fa-folder-open"></i>
									<span>Ajouter Service</span>
								</a>
							</li>
							<li>
								<a href='listService.php'>
									<i class="fa fa-folder-open"></i>
									<span>Liste des Service</span>
								</a>
							</li>
						</ul>
					</li>
					<!-- fin Menu Service -->
					
					<!-- debut Menu Facture -->
					<li class='has-sub'>
						<a href='#'>
							<i class="fa fa-folder"></i>
							<span>Factures</span>
						</a>
						<ul>
							<li>
								<a href='addFacture.php'>
									<i class="fa fa-folder-open"></i>
									<span>Ajouter Facture</span>
								</a>
							</li>
							<li>
								<a href='listFacture.php'>
									<i class="fa fa-folder-open"></i>
									<span>Liste des Factures</span>
								</a>
							</li>
						</ul>
					</li>
					<!-- fin Menu Emplacement -->
					
					
					

		</aside>
		<!-- Left sidebar ends -->

		<?php 
	}
	else{

		?>


		<!-- Left sidebar starts -->
		<aside id="sidebar">

			<!-- Menu start -->
			<div id='menu'>
				<ul>
					
					<!-- debut Menu Demande -->
					<li class='has-sub'>
						<a href='#'>
							<i class="fa fa-folder"></i>
							<span>Demandes</span>
						</a>
						<ul>
							<li>
								<a href='addDemande.php'>
									<span>Nouvelle demande</span>
								</a>
							</li>
							<li>
								<a href='listdemandev.php'>
									<span>Demandes validées</span>
								</a>
							</li>

							<li>
								<a href='listdemanden.php'>
									<span>Demandes non validées</span>
								</a>
							</li>
						</ul>
					</li>
					<!-- fin Menu Demande -->
					
					
					

		</aside>
		<!-- Left sidebar ends -->

		<?php 
	}

?>