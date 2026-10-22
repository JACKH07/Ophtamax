<?php
require_once __DIR__ . '/../_bootstrap.php';
api_require_user($pdo);

$date = $_GET['date'] ?? date('Y-m-d');
$stmt = $pdo->prepare(
    "SELECT id, nom_prenoms_pat, datecons, diagnostic
     FROM consultation WHERE DATE(datecons) >= ? ORDER BY datecons ASC LIMIT 10"
);
$stmt->execute([$date]);

$items = [];
foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
    $items[] = [
        'id' => (string) $row['id'],
        'start_time' => date('c', strtotime((string) $row['datecons'])),
        'end_time' => date('c', strtotime((string) $row['datecons'] . ' +30 minutes')),
        'title' => (string) ($row['diagnostic'] ?: 'Consultation'),
        'patient_name' => (string) $row['nom_prenoms_pat'],
        'variant' => 'primary',
    ];
}
api_json($items);
