<?php
require_once __DIR__ . '/../_bootstrap.php';
require_once __DIR__ . '/../_docs.php';
api_require_user($pdo);
api_docs_ensure($pdo);

$today = date('Y-m-d');
$weekAgo = date('Y-m-d', strtotime('-7 days'));

$consultationsToday = (int) $pdo->query(
    "SELECT COUNT(*) FROM consultation WHERE DATE(datecons) = '{$today}'"
)->fetchColumn();

$patientsTotal = (int) $pdo->query('SELECT COUNT(*) FROM patient')->fetchColumn();

$newFromConsult = (int) $pdo->query(
    "SELECT COUNT(DISTINCT id_patient) FROM consultation WHERE DATE(datecons) >= '{$weekAgo}'"
)->fetchColumn();

$planned = $pdo->prepare(
    "SELECT COUNT(*) FROM t_ophtamax_docs
     WHERE kind = 'rdv' AND DATE(event_at) = ?
       AND JSON_UNQUOTE(JSON_EXTRACT(payload, '$.statut')) IN ('planifie', 'en_attente')"
);
$planned->execute([$today]);

$waiting = $pdo->prepare(
    "SELECT COUNT(*) FROM t_ophtamax_docs
     WHERE kind = 'file' AND DATE(event_at) = ?
       AND JSON_UNQUOTE(JSON_EXTRACT(payload, '$.statut')) = 'en_attente'"
);
$waiting->execute([$today]);

$revenue = 0.0;
$factureTable = $pdo->query("SHOW TABLES LIKE 't_factures'")->fetch();
if ($factureTable) {
    $sum = $pdo->prepare("SELECT COALESCE(SUM(montantfact), 0) FROM t_factures WHERE statut = 'payee' AND date_fact = ?");
    $sum->execute([$today]);
    $revenue = (float) $sum->fetchColumn();
}

api_json([
    'consultations_today' => $consultationsToday,
    'consultations_planned' => (int) $planned->fetchColumn(),
    'patients_waiting' => (int) $waiting->fetchColumn(),
    'average_wait_minutes' => 0,
    'revenue_today' => $revenue,
    'revenue_status' => $revenue > 0 ? 'encaissé' : 'aucune recette',
    'new_patients_week' => $newFromConsult,
    'new_patients_trend_percent' => 0,
    'patients_total' => $patientsTotal,
]);
