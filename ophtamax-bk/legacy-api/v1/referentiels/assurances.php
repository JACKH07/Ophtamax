<?php
require_once __DIR__ . '/../_bootstrap.php';
require_once __DIR__ . '/_store.php';
api_require_user($pdo);
api_referentiel_ensure($pdo, 't_assurances');

$rows = $pdo->query(
    "SELECT DISTINCT assurance AS libelle FROM t_patients
     WHERE assurance IS NOT NULL AND assurance <> ''"
)->fetchAll(PDO::FETCH_ASSOC);
api_referentiel_seed($pdo, 't_assurances', $rows);

api_referentiel_handle($pdo, 't_assurances');
