<?php
require_once __DIR__ . '/_bootstrap.php';
api_require_user($pdo);

$monthStart = date('Y-m-01');
$caMois = 0.0;
if ($pdo->query("SHOW TABLES LIKE 't_factures'")->fetch()) {
    $ca = $pdo->prepare("SELECT COALESCE(SUM(montantfact), 0) FROM t_factures WHERE statut = 'payee' AND date_fact >= ?");
    $ca->execute([$monthStart]);
    $caMois = (float) $ca->fetchColumn();
}
api_consultation_ensure($pdo);

$consultationsMois = (int) $pdo->query(
    "SELECT COUNT(*) FROM t_consultations WHERE DATE(datecons) >= '{$monthStart}' AND uid IS NOT NULL AND uid <> ''"
)->fetchColumn();
$nouveaux = (int) $pdo->query(
    "SELECT COUNT(DISTINCT idpatients) FROM t_consultations WHERE DATE(datecons) >= '{$monthStart}' AND uid IS NOT NULL AND uid <> ''"
)->fetchColumn();

$diagRows = $pdo->query(
    "SELECT LEFT(diagnostic, 40) AS label, COUNT(*) AS total
     FROM t_consultations
     WHERE diagnostic IS NOT NULL AND diagnostic != '' AND DATE(datecons) >= '{$monthStart}' AND uid IS NOT NULL AND uid <> ''
     GROUP BY LEFT(diagnostic, 40)
     ORDER BY total DESC LIMIT 5"
)->fetchAll(PDO::FETCH_ASSOC);
$sum = max(1, array_sum(array_column($diagRows, 'total')));

$parMois = [];
for ($i = 5; $i >= 0; $i--) {
    $start = date('Y-m-01', strtotime("-{$i} months"));
    $end = date('Y-m-t', strtotime("-{$i} months"));
    $stmt = $pdo->prepare(
        "SELECT COUNT(*) FROM t_consultations WHERE DATE(datecons) BETWEEN ? AND ? AND uid IS NOT NULL AND uid <> ''"
    );
    $stmt->execute([$start, $end]);
    $parMois[] = ['mois' => date('M', strtotime($start)), 'value' => (int) $stmt->fetchColumn()];
}

api_json([
    'consultations_mois' => $consultationsMois,
    'consultations_evolution' => 0,
    'ca_mois' => $caMois,
    'ca_evolution' => 0,
    'nouveaux_patients' => $nouveaux,
    'taux_occupation' => 0,
    'top_diagnostics' => array_map(static fn ($r) => [
        'label' => (string) $r['label'],
        'percent' => (int) round(((int) $r['total'] / $sum) * 100),
    ], $diagRows),
    'consultations_par_mois' => $parMois,
]);
