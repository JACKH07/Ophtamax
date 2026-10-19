<?php

require_once __DIR__ . '/../_bootstrap.php';
api_require_user($pdo);

api_json([
    ['id' => 'ADMIN', 'code' => 'ADMIN', 'libelle' => 'Administrateur'],
    ['id' => 'SEC', 'code' => 'SEC', 'libelle' => 'Secrétaire'],
    ['id' => 'OPHT', 'code' => 'OPHT', 'libelle' => 'Ophtalmologiste'],
    ['id' => 'ASS', 'code' => 'ASS', 'libelle' => 'Assistante'],
    ['id' => 'COMPTA', 'code' => 'COMPTA', 'libelle' => 'Comptable'],
]);
