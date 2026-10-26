<?php
require_once __DIR__ . '/_bootstrap.php';
require_once __DIR__ . '/_docs.php';
api_require_user($pdo);
api_docs_handle($pdo, 'prescription_lunettes', [
    'mode' => 'page',
    'defaults' => [
        'patient_id' => '',
        'patient_name' => '',
        'date' => '',
        'correction' => '',
        'od_sphere' => '', 'od_cylindre' => '', 'od_axe' => '', 'od_addition' => '',
        'od_vp_sphere' => '', 'od_vp_cylindre' => '', 'od_vp_axe' => '',
        'og_sphere' => '', 'og_cylindre' => '', 'og_axe' => '', 'og_addition' => '',
        'og_vp_sphere' => '', 'og_vp_cylindre' => '', 'og_vp_axe' => '',
        'distance_interpupillaire' => '',
        'type_foyer' => '',
        'traitements' => [],
        'type_verre' => '',
        'medecin' => '',
        'notes' => '',
    ],
]);
