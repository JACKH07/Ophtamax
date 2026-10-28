<?php
require_once __DIR__ . '/../_bootstrap.php';
require_once __DIR__ . '/../_docs.php';
api_require_user($pdo);
api_docs_ensure($pdo);

$method = $_SERVER['REQUEST_METHOD'];
$id = api_route_id();
$day = substr((string) ($_GET['date'] ?? date('Y-m-d')), 0, 10);

function api_file_statut_from_rdv(string $statut): string
{
    if ($statut === 'en_consultation') {
        return 'en_consultation';
    }
    if ($statut === 'termine') {
        return 'termine';
    }
    if ($statut === 'absent') {
        return 'absent';
    }

    // planifie / en_attente → en attente dans la file
    return 'en_attente';
}

function api_file_map_row(array $row, int $priorite = 0): array
{
    $payload = json_decode((string) ($row['payload'] ?? ''), true);
    if (!is_array($payload)) {
        $payload = [];
    }
    $kind = (string) ($row['kind'] ?? 'file');
    $rawStatut = (string) ($payload['statut'] ?? $row['statut'] ?? ($kind === 'file' ? 'en_attente' : 'planifie'));
    $eventAt = (string) ($row['event_at'] ?? $row['date_heure'] ?? '');
    $heure = (string) ($payload['heure_arrivee'] ?? '');
    if ($heure === '') {
        $heure = $eventAt !== '' ? date('c', strtotime($eventAt) ?: time()) : date('c');
    }

    return [
        'id' => (string) ($row['uid'] ?? $row['id'] ?? ''),
        'rdv_id' => $kind === 'rdv'
            ? (string) ($row['uid'] ?? '')
            : (string) ($payload['rdv_id'] ?? ''),
        'patient_id' => (string) ($payload['patient_id'] ?? $row['idpatients'] ?? ''),
        'patient_name' => (string) ($payload['patient_name'] ?? $row['patient_name'] ?? ''),
        'motif' => (string) ($payload['motif'] ?? $row['motif'] ?? ''),
        'heure_arrivee' => $heure,
        'statut' => api_file_statut_from_rdv($rawStatut),
        'priorite' => (int) ($payload['priorite'] ?? $priorite),
        'medecin' => (string) ($payload['medecin'] ?? $row['medecin'] ?? ''),
        'source' => $kind,
    ];
}

function api_file_find(PDO $pdo, string $uid): ?array
{
    $stmt = $pdo->prepare("SELECT * FROM t_agendas WHERE uid = ? AND kind IN ('file', 'rdv') LIMIT 1");
    $stmt->execute([$uid]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    return $row ?: null;
}

if ($method === 'GET' && !$id) {
    $fileStmt = $pdo->prepare(
        "SELECT * FROM t_agendas WHERE kind = 'file' AND DATE(event_at) = ? ORDER BY event_at ASC"
    );
    $fileStmt->execute([$day]);
    $fileRows = $fileStmt->fetchAll(PDO::FETCH_ASSOC);

    $rdvStmt = $pdo->prepare(
        "SELECT * FROM t_agendas WHERE kind = 'rdv' AND DATE(event_at) = ? ORDER BY event_at ASC"
    );
    $rdvStmt->execute([$day]);
    $rdvRows = $rdvStmt->fetchAll(PDO::FETCH_ASSOC);

    // Entrées file explicites + RDV du jour non déjà présents via rdv_id
    $rdvIdsInFile = [];
    foreach ($fileRows as $row) {
        $payload = json_decode((string) ($row['payload'] ?? ''), true) ?: [];
        $linked = (string) ($payload['rdv_id'] ?? '');
        if ($linked !== '') {
            $rdvIdsInFile[$linked] = true;
        }
    }

    $items = [];
    $i = 1;
    foreach ($fileRows as $row) {
        $items[] = api_file_map_row($row, $i++);
    }
    foreach ($rdvRows as $row) {
        $uid = (string) ($row['uid'] ?? '');
        if ($uid !== '' && isset($rdvIdsInFile[$uid])) {
            continue;
        }
        $items[] = api_file_map_row($row, $i++);
    }

    usort($items, static function ($a, $b) {
        return strcmp((string) $a['heure_arrivee'], (string) $b['heure_arrivee']);
    });

    api_json($items);
}

if ($method === 'GET' && $id) {
    $row = api_file_find($pdo, $id);
    if (!$row) {
        api_error('Introuvable', 404);
    }
    api_json(api_file_map_row($row));
}

if ($method === 'POST' && !$id) {
    $body = api_docs_prepare_body($pdo, api_body());
    if (empty($body['heure_arrivee'])) {
        $body['heure_arrivee'] = date('c');
    }
    if (empty($body['statut'])) {
        $body['statut'] = 'en_attente';
    }
    $newId = api_new_id();
    $now = date('Y-m-d H:i:s');
    $eventAt = api_docs_event_at($body) ?? $now;
    api_docs_insert_row($pdo, 't_agendas', 'file', $newId, $body, $eventAt, $now);
    $row = api_file_find($pdo, $newId);
    api_json(api_file_map_row($row ?: []), 201, 'Enregistré');
}

if (($method === 'PUT' || $method === 'PATCH') && $id) {
    $row = api_file_find($pdo, $id);
    if (!$row) {
        api_error('Introuvable', 404);
    }
    $kind = (string) ($row['kind'] ?? 'file');
    $current = json_decode((string) ($row['payload'] ?? ''), true);
    if (!is_array($current)) {
        $current = [];
    }
    $body = api_docs_prepare_body($pdo, array_merge($current, api_body()));
    $now = date('Y-m-d H:i:s');
    $eventAt = api_docs_event_at($body) ?? (string) ($row['event_at'] ?? $now);
    api_docs_update_row($pdo, 't_agendas', $kind, $id, $body, $eventAt, $now);
    $fresh = api_file_find($pdo, $id);
    api_json(api_file_map_row($fresh ?: []), 200, 'Mis à jour');
}

if ($method === 'DELETE' && $id) {
    $row = api_file_find($pdo, $id);
    if (!$row) {
        api_error('Introuvable', 404);
    }
    $kind = (string) ($row['kind'] ?? 'file');
    $stmt = $pdo->prepare('DELETE FROM t_agendas WHERE uid = ? AND kind = ?');
    $stmt->execute([$id, $kind]);
    api_json(null, 200, 'Supprimé');
}

api_error('Méthode non autorisée', 405);
