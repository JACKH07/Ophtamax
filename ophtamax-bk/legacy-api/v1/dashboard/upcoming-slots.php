<?php
require_once __DIR__ . '/../_bootstrap.php';
require_once __DIR__ . '/../_docs.php';
api_require_user($pdo);
api_docs_ensure($pdo);

$date = $_GET['date'] ?? date('Y-m-d');
$rdv = $pdo->prepare(
    "SELECT * FROM t_ophtamax_docs
     WHERE kind = 'rdv' AND event_at >= ? ORDER BY event_at ASC LIMIT 10"
);
$rdv->execute([substr((string) $date, 0, 10) . ' 00:00:00']);
$rdvRows = $rdv->fetchAll(PDO::FETCH_ASSOC);
if ($rdvRows) {
    $items = [];
    foreach ($rdvRows as $row) {
        $payload = json_decode((string) $row['payload'], true) ?: [];
        $start = strtotime((string) ($row['event_at'] ?? ''));
        $minutes = max(5, (int) ($payload['duree_min'] ?? 30));
        $items[] = [
            'id' => (string) $row['id'],
            'start_time' => date('c', $start ?: time()),
            'end_time' => date('c', ($start ?: time()) + ($minutes * 60)),
            'title' => (string) ($payload['motif'] ?: 'Rendez-vous'),
            'patient_name' => (string) ($payload['patient_name'] ?? ''),
            'variant' => 'primary',
        ];
    }
    api_json($items);
}

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
