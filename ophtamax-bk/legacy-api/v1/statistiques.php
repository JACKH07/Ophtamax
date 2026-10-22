<?php
require_once __DIR__ . '/_bootstrap.php';
api_require_user($pdo);

$monthStart = date('Y-m-01');
$consultationsMois = (int) $pdo->query(
    "SELECT COUNT(*) FROM consultation WHERE DATE(datecons) >= '{$monthStart}'"
)->fetchColumn();
$nouveaux = (int) $pdo->query(
    "SELECT COUNT(DISTINCT id_patient) FROM consultation WHERE DATE(datecons) >= '{$monthStart}'"
)->fetchColumn();

$diagRows = $pdo->query(
    "SELECT LEFT(diagnostic, 40) AS label, COUNT(*) AS total
     FROM consultation
     WHERE diagnostic IS NOT NULL AND diagnostic != '' AND DATE(datecons) >= '{$monthStart}'
     GROUP BY LEFT(diagnostic, 40)
     ORDER BY total DESC LIMIT 5"
)->fetchAll(PDO::FETCH_ASSOC);
$sum = max(1, array_sum(array_column($diagRows, 'total')));

$parMois = [];
for ($i = 5; $i >= 0; $i--) {
    $start = date('Y-m-01', strtotime("-{$i} months"));
    $end = date('Y-m-t', strtotime("-{$i} months"));
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM consultation WHERE DATE(datecons) BETWEEN ? AND ?');
    $stmt->execute([$start, $end]);
    $parMois[] = ['mois' => date('M', strtotime($start)), 'value' => (int) $stmt->fetchColumn()];
}

api_json([
    'consultations_mois' => $consultationsMois,
    'consultations_evolution' => 0,
    'ca_mois' => 0,
    'ca_evolution' => 0,
    'nouveaux_patients' => $nouveaux,
    'taux_occupation' => 0,
    'top_diagnostics' => array_map(static fn ($r) => [
        'label' => (string) $r['label'],
        'percent' => (int) round(((int) $r['total'] / $sum) * 100),
    ], $diagRows),
    'consultations_par_mois' => $parMois,
]);
