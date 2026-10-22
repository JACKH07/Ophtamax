<?php
require_once __DIR__ . '/../_bootstrap.php';
api_require_user($pdo);

$activity = [];
for ($i = 6; $i >= 0; $i--) {
    $day = date('Y-m-d', strtotime("-{$i} days"));
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM consultation WHERE DATE(datecons) = ?');
    $stmt->execute([$day]);
    $activity[] = [
        'date' => $day,
        'label' => date('D', strtotime($day)),
        'consultations' => (int) $stmt->fetchColumn(),
        'recettes' => 0,
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
