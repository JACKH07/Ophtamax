<?php
require_once __DIR__ . '/../_bootstrap.php';
require_once __DIR__ . '/_store.php';
api_require_user($pdo);
api_referentiel_ensure($pdo, 't_professions');

$rows = $pdo->query(
    "SELECT DISTINCT profession AS libelle FROM patient
     WHERE profession IS NOT NULL AND profession <> ''"
)->fetchAll(PDO::FETCH_ASSOC);
api_referentiel_seed($pdo, 't_professions', $rows);

api_referentiel_handle($pdo, 't_professions');
