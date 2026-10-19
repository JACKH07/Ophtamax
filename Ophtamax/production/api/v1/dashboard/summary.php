<?php

require_once __DIR__ . '/../_bootstrap.php';
api_require_user($pdo);

$today = date('Y-m-d');
$weekAgo = date('Y-m-d', strtotime('-7 days'));

$consultationsToday = (int) $pdo->query(
    "SELECT COUNT(*) FROM consultation WHERE DATE(datecons) = '{$today}'"
)->fetchColumn();

$newPatientsWeek = (int) $pdo->query(
    "SELECT COUNT(*) FROM patient WHERE 1=1"
)->fetchColumn(); // pas de created_at en v1 — approximate with recent consultations

$newFromConsult = (int) $pdo->query(
    "SELECT COUNT(DISTINCT id_patient) FROM consultation WHERE DATE(datecons) >= '{$weekAgo}'"
)->fetchColumn();

api_json([
    'consultations_today' => $consultationsToday,
    'consultations_planned' => 0,
    'patients_waiting' => 0,
    'average_wait_minutes' => 0,
    'revenue_today' => 0,
    'revenue_status' => 'non suivi en BDD v1',
    'new_patients_week' => $newFromConsult,
    'new_patients_trend_percent' => 0,
]);
