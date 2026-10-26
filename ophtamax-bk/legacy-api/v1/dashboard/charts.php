<?php
require_once __DIR__ . '/../_bootstrap.php';
api_require_user($pdo);

$hasFactures = (bool) $pdo->query("SHOW TABLES LIKE 't_factures'")->fetch();
$activity = [];
for ($i = 6; $i >= 0; $i--) {
    $day = date('Y-m-d', strtotime("-{$i} days"));
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM consultation WHERE DATE(datecons) = ?');
    $stmt->execute([$day]);
    $recettes = 0.0;
    if ($hasFactures) {
        $sum = $pdo->prepare("SELECT COALESCE(SUM(montantfact), 0) FROM t_factures WHERE statut = 'payee' AND date_fact = ?");
        $sum->execute([$day]);
        $recettes = (float) $sum->fetchColumn();
    }
    $activity[] = [
        'date' => $day,
        'label' => date('D', strtotime($day)),
        'consultations' => (int) $stmt->fetchColumn(),
        'recettes' => $recettes,
    ];
}

$diagRows = $pdo->query(
    "SELECT LEFT(diagnostic, 40) AS label, COUNT(*) AS total
     FROM consultation
     WHERE diagnostic IS NOT NULL AND diagnostic != ''
     GROUP BY LEFT(diagnostic, 40)
     ORDER BY total DESC
     LIMIT 5"
)->fetchAll(PDO::FETCH_ASSOC);
$sum = max(1, array_sum(array_column($diagRows, 'total')));

api_json([
    'activity_7d' => $activity,
    'diagnostics' => array_map(static fn ($r) => [
        'label' => (string) $r['label'],
        'percent' => (int) round(((int) $r['total'] / $sum) * 100),
    ], $diagRows),
]);
