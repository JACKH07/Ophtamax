<?php
require_once __DIR__ . '/../_bootstrap.php';
api_require_user($pdo);

$date = $_GET['date'] ?? date('Y-m-d');
$stmt = $pdo->prepare(
    "SELECT id, nom_prenoms_pat, diagnostic, datecons
     FROM consultation WHERE DATE(datecons) = ? ORDER BY datecons DESC LIMIT 20"
);
$stmt->execute([$date]);
$tones = ['primary', 'secondary', 'surface', 'muted'];
$items = [];
$i = 0;
foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
    $items[] = [
        'id' => (string) $row['id'],
        'patient_name' => (string) $row['nom_prenoms_pat'],
        'reason' => (string) ($row['diagnostic'] ?? 'Consultation'),
        'time' => date('H:i', strtotime((string) $row['datecons'])),
        'status' => 'termine',
        'practitioner' => 'Ophtalmologiste',
        'avatar_tone' => $tones[$i % 4],
    ];
    $i++;
}
api_json($items);
