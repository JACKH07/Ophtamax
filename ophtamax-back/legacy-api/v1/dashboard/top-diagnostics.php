<?php

require_once __DIR__ . '/../_bootstrap.php';
api_require_user($pdo);

$rows = $pdo->query(
    "SELECT LEFT(diagnostic, 40) AS label, COUNT(*) AS total
     FROM consultation
     WHERE diagnostic IS NOT NULL AND diagnostic != ''
     GROUP BY LEFT(diagnostic, 40)
     ORDER BY total DESC
     LIMIT 5"
)->fetchAll(PDO::FETCH_ASSOC);

$sum = max(1, array_sum(array_column($rows, 'total')));
$items = array_map(static function ($row) use ($sum) {
    return [
        'label' => (string) $row['label'],
        'percent' => (int) round(((int) $row['total'] / $sum) * 100),
    ];
}, $rows);

api_json($items);
