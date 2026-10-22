<?php

require_once __DIR__ . '/../_bootstrap.php';
require_once __DIR__ . '/../_factures.php';
api_require_user($pdo);
api_facture_ensure($pdo);

$date = substr((string) ($_GET['date'] ?? date('Y-m-d')), 0, 10);
$stmt = $pdo->prepare(api_facture_select_sql() . ' WHERE f.date_fact = ? ORDER BY f.id DESC');
$stmt->execute([$date]);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
$factures = array_map(static fn ($row) => api_map_facture($pdo, $row), $rows);

$total = 0.0;
foreach ($factures as $facture) {
    if ($facture['statut'] === 'payee') {
        $total += (float) $facture['montant_ttc'];
    }
}

api_json([
    'date' => $date,
    'total' => $total,
    'count' => count($factures),
    'factures' => $factures,
]);
