<?php
require_once __DIR__ . '/../_bootstrap.php';
api_require_user($pdo);

api_json([
    ['id' => 'e1', 'code' => 'CV', 'libelle' => 'Champ visuel'],
    ['id' => 'e2', 'code' => 'RET', 'libelle' => 'Rétinographie'],
    ['id' => 'e3', 'code' => 'REF', 'libelle' => 'Réfractométrie'],
    ['id' => 'e4', 'code' => 'OCT', 'libelle' => 'OCT maculaire'],
    ['id' => 'e5', 'code' => 'FO', 'libelle' => "Fond d'œil dilaté"],
]);
