<?php
require_once __DIR__ . '/../_bootstrap.php';
require_once __DIR__ . '/../_docs.php';
api_require_user($pdo);
api_consultation_ensure($pdo);
api_docs_ensure($pdo);

$date = substr((string) ($_GET['date'] ?? date('Y-m-d')), 0, 10);
$tones = ['primary', 'secondary', 'surface', 'muted'];

function api_waiting_status(string $statut): string
{
    if ($statut === 'en_consultation') {
        return 'en_consultation';
    }
    if ($statut === 'en_attente' || $statut === 'planifie') {
        return 'en_attente';
    }

    return 'termine';
}

function api_waiting_from_agenda(array $row, int $i, array $tones): array
{
    $payload = json_decode((string) ($row['payload'] ?? ''), true) ?: [];
    $statut = (string) ($payload['statut'] ?? $row['statut'] ?? 'en_attente');
    $eventAt = (string) ($row['event_at'] ?? $row['date_heure'] ?? '');
    $patientName = (string) ($payload['patient_name'] ?? $row['patient_name'] ?? '');
    $motif = (string) ($payload['motif'] ?? $row['motif'] ?? 'Consultation');
    $medecin = trim((string) ($payload['medecin'] ?? $row['medecin'] ?? ''));
    $patientId = (string) ($payload['patient_id'] ?? $row['idpatients'] ?? '');
    $notes = (string) ($payload['notes'] ?? $row['notes'] ?? '');
    $duree = (int) ($payload['duree_min'] ?? $row['duree_min'] ?? 30);
    $ts = $eventAt !== '' ? strtotime($eventAt) : false;

    return [
        'id' => (string) ($row['uid'] ?? $row['id']),
        'patient_id' => $patientId,
        'patient_name' => $patientName,
        'reason' => $motif,
        'motif' => $motif,
        'time' => $ts ? date('H:i', $ts) : '',
        'date_heure' => $eventAt,
        'status' => api_waiting_status($statut),
        'statut_rdv' => $statut,
        'practitioner' => $medecin !== '' ? $medecin : '—',
        'medecin' => $medecin,
        'notes' => $notes,
        'duree_min' => $duree > 0 ? $duree : 30,
        'avatar_tone' => $tones[$i % 4],
        'source' => (string) ($row['kind'] ?? 'rdv'),
    ];
}

$file = $pdo->prepare(
    "SELECT * FROM t_agendas WHERE kind = 'file' AND DATE(event_at) = ? ORDER BY event_at ASC"
);
$file->execute([$date]);
$fileRows = $file->fetchAll(PDO::FETCH_ASSOC);

$rdv = $pdo->prepare(
    "SELECT * FROM t_agendas WHERE kind = 'rdv' AND DATE(event_at) = ? ORDER BY event_at ASC"
);
$rdv->execute([$date]);
$rdvRows = $rdv->fetchAll(PDO::FETCH_ASSOC);

$rows = $fileRows ?: $rdvRows;
if ($rows) {
    $items = [];
    foreach ($rows as $i => $row) {
        $items[] = api_waiting_from_agenda($row, $i, $tones);
    }
    api_json($items);
}

$stmt = $pdo->prepare(
    "SELECT uid, idpatients, nom_prenoms_pat, diagnostic, datecons
     FROM t_consultations
     WHERE DATE(datecons) = ? AND uid IS NOT NULL AND uid <> ''
     ORDER BY datecons DESC LIMIT 20"
);
$stmt->execute([$date]);
$items = [];
$i = 0;
foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
    $ts = strtotime((string) $row['datecons']);
    $items[] = [
        'id' => (string) $row['uid'],
        'patient_id' => (string) ($row['idpatients'] ?? ''),
        'patient_name' => (string) $row['nom_prenoms_pat'],
        'reason' => (string) ($row['diagnostic'] ?? 'Consultation'),
        'motif' => (string) ($row['diagnostic'] ?? 'Consultation'),
        'time' => $ts ? date('H:i', $ts) : '',
        'date_heure' => (string) $row['datecons'],
        'status' => 'termine',
        'statut_rdv' => 'termine',
        'practitioner' => '—',
        'medecin' => '',
        'notes' => '',
        'duree_min' => 30,
        'avatar_tone' => $tones[$i % 4],
        'source' => 'consultation',
    ];
    $i++;
}
api_json($items);
