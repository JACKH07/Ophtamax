<?php
require_once __DIR__ . '/../_bootstrap.php';
require_once __DIR__ . '/../_docs.php';
api_require_user($pdo);
api_docs_ensure($pdo);

$date = $_GET['date'] ?? date('Y-m-d');
$tones = ['primary', 'secondary', 'surface', 'muted'];

$file = $pdo->prepare(
    "SELECT * FROM t_ophtamax_docs WHERE kind = 'file' AND DATE(event_at) = ? ORDER BY event_at ASC"
);
$file->execute([substr((string) $date, 0, 10)]);
$fileRows = $file->fetchAll(PDO::FETCH_ASSOC);
if ($fileRows) {
    $items = [];
    foreach ($fileRows as $i => $row) {
        $payload = json_decode((string) $row['payload'], true) ?: [];
        $statut = (string) ($payload['statut'] ?? 'en_attente');
        $status = $statut === 'en_consultation' ? 'en_consultation' : ($statut === 'en_attente' ? 'en_attente' : 'termine');
        $items[] = [
            'id' => (string) $row['id'],
            'patient_name' => (string) ($payload['patient_name'] ?? ''),
            'reason' => (string) ($payload['motif'] ?? 'Consultation'),
            'time' => date('H:i', strtotime((string) ($payload['heure_arrivee'] ?? $row['event_at']))),
            'status' => $status,
            'practitioner' => (string) ($payload['medecin'] ?? 'Ophtalmologiste'),
            'avatar_tone' => $tones[$i % 4],
        ];
    }
    api_json($items);
}

$stmt = $pdo->prepare(
    "SELECT id, nom_prenoms_pat, diagnostic, datecons
     FROM consultation WHERE DATE(datecons) = ? ORDER BY datecons DESC LIMIT 20"
);
$stmt->execute([$date]);
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
