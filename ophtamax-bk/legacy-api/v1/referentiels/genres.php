<?php
require_once __DIR__ . '/../_bootstrap.php';
require_once __DIR__ . '/_store.php';
api_require_user($pdo);

api_referentiel_ensure($pdo, 't_sexes');
api_referentiel_seed($pdo, 't_sexes', [
    ['code' => 'M', 'libelle' => 'Masculin'],
    ['code' => 'F', 'libelle' => 'Féminin'],
]);
api_referentiel_handle($pdo, 't_sexes');
