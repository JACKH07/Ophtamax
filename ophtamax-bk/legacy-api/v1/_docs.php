<?php

function api_docs_ensure(PDO $pdo): void
{
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS t_ophtamax_docs (
            id VARCHAR(64) NOT NULL PRIMARY KEY,
            kind VARCHAR(32) NOT NULL,
            patient_id VARCHAR(255) NOT NULL DEFAULT "",
            event_at DATETIME NULL,
            payload LONGTEXT NOT NULL,
            created_at DATETIME NULL,
            updated_at DATETIME NULL,
            KEY kind_event (kind, event_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
    );
}

function api_docs_event_at(array $body): ?string
{
    $raw = (string) ($body['date_heure'] ?? $body['heure_arrivee'] ?? $body['date'] ?? '');
    $raw = str_replace('T', ' ', trim($raw));
    if ($raw === '') {
        return null;
    }
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $raw)) {
        return $raw . ' 00:00:00';
    }
    if (preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/', $raw)) {
        return substr($raw, 0, 19);
    }

    $ts = strtotime($raw);
    return $ts ? date('Y-m-d H:i:s', $ts) : null;
}

function api_docs_prepare_body(PDO $pdo, array $body): array
{
    unset($body['id']);
    $patientId = trim((string) ($body['patient_id'] ?? ''));
    if ($patientId !== '') {
        $label = api_patient_label($pdo, $patientId);
        if ($label === '') {
            api_error('Patient introuvable', 422);
        }
        $body['patient_id'] = $patientId;
        $body['patient_name'] = $label;
    }
    $medecinId = trim((string) ($body['medecin_id'] ?? ''));
    if ($medecinId !== '') {
        $medecin = api_user_label($pdo, $medecinId);
        if ($medecin !== '') {
            $body['medecin'] = $medecin;
        }
    }

    return $body;
}

function api_docs_map(array $row, array $defaults): array
{
    $payload = json_decode((string) ($row['payload'] ?? ''), true);
    if (!is_array($payload)) {
        $payload = [];
    }
    $item = array_merge($defaults, $payload);
    $item['id'] = (string) $row['id'];

    return $item;
}

function api_docs_find(PDO $pdo, string $kind, string $id): ?array
{
    $stmt = $pdo->prepare('SELECT * FROM t_ophtamax_docs WHERE kind = ? AND id = ? LIMIT 1');
    $stmt->execute([$kind, $id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    return $row ?: null;
}

/**
 * @param array{mode?:string,defaults?:array} $options
 *   mode: page | range | day
 */
function api_docs_handle(PDO $pdo, string $kind, array $options = []): void
{
    api_docs_ensure($pdo);
    $defaults = is_array($options['defaults'] ?? null) ? $options['defaults'] : [];
    $mode = (string) ($options['mode'] ?? 'page');
    $method = $_SERVER['REQUEST_METHOD'];
    $id = api_route_id();

    if ($method === 'GET' && !$id) {
        if ($mode === 'day') {
            $day = substr((string) ($_GET['date'] ?? date('Y-m-d')), 0, 10);
            $stmt = $pdo->prepare(
                'SELECT * FROM t_ophtamax_docs WHERE kind = ? AND DATE(event_at) = ? ORDER BY event_at ASC'
            );
            $stmt->execute([$kind, $day]);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            api_json(array_map(static fn ($row) => api_docs_map($row, $defaults), $rows));
        }

        if ($mode === 'range') {
            $from = substr((string) ($_GET['from'] ?? date('Y-m-d', strtotime('-30 days'))), 0, 10);
            $to = substr((string) ($_GET['to'] ?? date('Y-m-d', strtotime('+90 days'))), 0, 10);
            $stmt = $pdo->prepare(
                'SELECT * FROM t_ophtamax_docs
                 WHERE kind = ? AND event_at >= ? AND event_at < DATE_ADD(?, INTERVAL 1 DAY)
                 ORDER BY event_at ASC LIMIT 500'
            );
            $stmt->execute([$kind, $from . ' 00:00:00', $to]);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            api_json(array_map(static fn ($row) => api_docs_map($row, $defaults), $rows));
        }

        $page = max(1, (int) ($_GET['page'] ?? 1));
        $perPage = min(100, max(1, (int) ($_GET['per_page'] ?? 20)));
        $offset = ($page - 1) * $perPage;
        $count = $pdo->prepare('SELECT COUNT(*) FROM t_ophtamax_docs WHERE kind = ?');
        $count->execute([$kind]);
        $total = (int) $count->fetchColumn();
        $stmt = $pdo->prepare(
            "SELECT * FROM t_ophtamax_docs WHERE kind = ? ORDER BY event_at DESC, created_at DESC LIMIT {$perPage} OFFSET {$offset}"
        );
        $stmt->execute([$kind]);
        api_json(array_map(static fn ($row) => api_docs_map($row, $defaults), $stmt->fetchAll(PDO::FETCH_ASSOC)), 200, null, [
            'page' => $page,
            'per_page' => $perPage,
            'total' => $total,
        ]);
    }

    if ($method === 'GET' && $id) {
        $row = api_docs_find($pdo, $kind, $id);
        if (!$row) {
            api_error('Introuvable', 404);
        }
        api_json(api_docs_map($row, $defaults));
    }

    if ($method === 'POST' && !$id) {
        $body = api_docs_prepare_body($pdo, api_body());
        if ($kind === 'file' && empty($body['heure_arrivee'])) {
            $body['heure_arrivee'] = date('c');
        }
        $newId = api_new_id();
        $now = date('Y-m-d H:i:s');
        $stmt = $pdo->prepare(
            'INSERT INTO t_ophtamax_docs (id, kind, patient_id, event_at, payload, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $newId,
            $kind,
            (string) ($body['patient_id'] ?? ''),
            api_docs_event_at($body) ?? $now,
            json_encode($body, JSON_UNESCAPED_UNICODE),
            $now,
            $now,
        ]);
        $row = api_docs_find($pdo, $kind, $newId);
        api_json(api_docs_map($row, $defaults), 201, 'Enregistré');
    }

    if (($method === 'PUT' || $method === 'PATCH') && $id) {
        $row = api_docs_find($pdo, $kind, $id);
        if (!$row) {
            api_error('Introuvable', 404);
        }
        $current = json_decode((string) $row['payload'], true);
        if (!is_array($current)) {
            $current = [];
        }
        $body = api_docs_prepare_body($pdo, array_merge($current, api_body()));
        $now = date('Y-m-d H:i:s');
        $stmt = $pdo->prepare(
            'UPDATE t_ophtamax_docs SET patient_id=?, event_at=?, payload=?, updated_at=? WHERE kind=? AND id=?'
        );
        $stmt->execute([
            (string) ($body['patient_id'] ?? $row['patient_id']),
            api_docs_event_at($body) ?? $row['event_at'],
            json_encode($body, JSON_UNESCAPED_UNICODE),
            $now,
            $kind,
            $id,
        ]);
        $fresh = api_docs_find($pdo, $kind, $id);
        api_json(api_docs_map($fresh, $defaults), 200, 'Mis à jour');
    }

    if ($method === 'DELETE' && $id) {
        $stmt = $pdo->prepare('DELETE FROM t_ophtamax_docs WHERE kind = ? AND id = ?');
        $stmt->execute([$kind, $id]);
        api_json(null, 200, 'Supprimé');
    }

    api_error('Méthode non autorisée', 405);
}
