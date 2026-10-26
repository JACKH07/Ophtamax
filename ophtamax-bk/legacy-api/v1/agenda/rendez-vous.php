<?php
require_once __DIR__ . '/../_bootstrap.php';
require_once __DIR__ . '/../_docs.php';
api_require_user($pdo);
api_docs_handle($pdo, 'rdv', [
    'mode' => 'range',
    'defaults' => [
        'patient_id' => '',
        'patient_name' => '',
        'date_heure' => '',
        'duree_min' => 30,
        'medecin_id' => '',
        'medecin' => '',
        'motif' => '',
        'notes' => '',
        'statut' => 'planifie',
    ],
]);
