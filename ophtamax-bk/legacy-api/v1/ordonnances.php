<?php
require_once __DIR__ . '/_bootstrap.php';
require_once __DIR__ . '/_docs.php';
api_require_user($pdo);
api_docs_handle($pdo, 'ordonnance', [
    'mode' => 'page',
    'defaults' => [
        'patient_id' => '',
        'patient_name' => '',
        'date' => '',
        'contenu' => '',
        'diagnostic' => '',
        'medecin' => '',
        'notes' => '',
    ],
]);
