<?php
require_once __DIR__ . '/../_bootstrap.php';
require_once __DIR__ . '/../_docs.php';
api_require_user($pdo);
api_docs_handle($pdo, 'file', [
    'mode' => 'day',
    'defaults' => [
        'rdv_id' => '',
        'patient_id' => '',
        'patient_name' => '',
        'motif' => '',
        'heure_arrivee' => '',
        'statut' => 'en_attente',
        'priorite' => 0,
        'medecin' => '',
    ],
]);
