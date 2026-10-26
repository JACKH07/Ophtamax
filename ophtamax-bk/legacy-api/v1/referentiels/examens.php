<?php
require_once __DIR__ . '/../_bootstrap.php';
require_once __DIR__ . '/_store.php';
api_require_user($pdo);
api_referentiel_ensure($pdo, 't_examens');

api_referentiel_seed($pdo, 't_examens', [
    ['code' => 'CV', 'libelle' => 'Champ visuel'],
    ['code' => 'RET', 'libelle' => 'Rétinographie'],
    ['code' => 'REF', 'libelle' => 'Réfractométrie'],
    ['code' => 'OCT', 'libelle' => 'OCT maculaire'],
    ['code' => 'FO', 'libelle' => "Fond d'œil dilaté"],
]);

api_referentiel_handle($pdo, 't_examens');
