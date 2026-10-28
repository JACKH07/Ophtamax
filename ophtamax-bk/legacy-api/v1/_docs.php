<?php

/**
 * Documents métier stockés dans les tables Laravel dédiées.
 * kind → table : ordonnance, prescription_examen, prescription_lunettes, rdv|file → t_agendas
 */

function api_docs_table(string $kind): string
{
    return match ($kind) {
        'ordonnance' => 't_ordonnances',
        'prescription_examen' => 't_pr_examens',
        'prescription_lunettes' => 't_pr_lunettes',
        'rdv', 'file' => 't_agendas',
        default => '',
    };
}

function api_docs_has_column(PDO $pdo, string $table, string $column): bool
{
    $stmt = $pdo->query("SHOW COLUMNS FROM {$table} LIKE " . $pdo->quote($column));

    return (bool) $stmt->fetch();
}

function api_docs_add_column(PDO $pdo, string $table, string $column, string $definition): void
{
    if (!api_docs_has_column($pdo, $table, $column)) {
        $pdo->exec("ALTER TABLE {$table} ADD COLUMN {$column} {$definition}");
    }
}

function api_docs_ensure_table(PDO $pdo, string $table): void
{
    api_docs_add_column($pdo, $table, 'uid', 'VARCHAR(64) NULL');
    api_docs_add_column($pdo, $table, 'event_at', 'DATETIME NULL');
    api_docs_add_column($pdo, $table, 'payload', 'LONGTEXT NULL');
    api_docs_add_column($pdo, $table, 'patient_name', 'VARCHAR(255) NOT NULL DEFAULT ""');

    if ($table === 't_agendas') {
        api_docs_add_column($pdo, $table, 'kind', 'VARCHAR(32) NOT NULL DEFAULT "rdv"');
        api_docs_add_column($pdo, $table, 'duree_min', 'INT NOT NULL DEFAULT 30');
        api_docs_add_column($pdo, $table, 'notes', 'TEXT NULL');
        api_docs_add_column($pdo, $table, 'medecin_id', 'VARCHAR(255) NOT NULL DEFAULT ""');
        if (api_docs_has_column($pdo, $table, 'date_heure')) {
            $pdo->exec('ALTER TABLE t_agendas MODIFY date_heure DATETIME NULL');
        }
        if (api_docs_has_column($pdo, $table, 'motif')) {
            $pdo->exec('ALTER TABLE t_agendas MODIFY motif TEXT NULL');
        }
        if (api_docs_has_column($pdo, $table, 'statut')) {
            $pdo->exec('ALTER TABLE t_agendas MODIFY statut VARCHAR(64) NOT NULL DEFAULT "planifie"');
        }
        if (api_docs_has_column($pdo, $table, 'idpatients')) {
            $pdo->exec('ALTER TABLE t_agendas MODIFY idpatients VARCHAR(255) NOT NULL DEFAULT ""');
        }
        if (api_docs_has_column($pdo, $table, 'medecin')) {
            $pdo->exec('ALTER TABLE t_agendas MODIFY medecin VARCHAR(255) NOT NULL DEFAULT ""');
        }
    }

    if ($table === 't_ordonnances') {
        if (api_docs_has_column($pdo, $table, 'medicaments')) {
            $pdo->exec('ALTER TABLE t_ordonnances MODIFY medicaments TEXT NULL');
        }
        if (api_docs_has_column($pdo, $table, 'indications')) {
            $pdo->exec('ALTER TABLE t_ordonnances MODIFY indications TEXT NULL');
        }
        if (api_docs_has_column($pdo, $table, 'idpatients')) {
            $pdo->exec('ALTER TABLE t_ordonnances MODIFY idpatients VARCHAR(255) NOT NULL DEFAULT ""');
        }
        if (api_docs_has_column($pdo, $table, 'medecin')) {
            $pdo->exec('ALTER TABLE t_ordonnances MODIFY medecin VARCHAR(255) NOT NULL DEFAULT ""');
        }
        api_docs_add_column($pdo, $table, 'diagnostic', 'TEXT NULL');
        api_docs_add_column($pdo, $table, 'notes', 'TEXT NULL');
    }

    if ($table === 't_pr_examens') {
        api_docs_add_column($pdo, $table, 'idpatients', 'VARCHAR(255) NOT NULL DEFAULT ""');
        api_docs_add_column($pdo, $table, 'medecin', 'VARCHAR(255) NOT NULL DEFAULT ""');
        api_docs_add_column($pdo, $table, 'examens', 'TEXT NULL');
        api_docs_add_column($pdo, $table, 'indication', 'TEXT NULL');
        api_docs_add_column($pdo, $table, 'bulletin_de', 'VARCHAR(255) NOT NULL DEFAULT ""');
        api_docs_add_column($pdo, $table, 'service', 'VARCHAR(255) NOT NULL DEFAULT ""');
        api_docs_add_column($pdo, $table, 'notes', 'TEXT NULL');
    }

    if ($table === 't_pr_lunettes') {
        if (api_docs_has_column($pdo, $table, 'idpatients')) {
            $pdo->exec('ALTER TABLE t_pr_lunettes MODIFY idpatients VARCHAR(255) NOT NULL DEFAULT ""');
        }
        if (api_docs_has_column($pdo, $table, 'medecin')) {
            $pdo->exec('ALTER TABLE t_pr_lunettes MODIFY medecin VARCHAR(255) NOT NULL DEFAULT ""');
        }
        if (api_docs_has_column($pdo, $table, 'note')) {
            $pdo->exec('ALTER TABLE t_pr_lunettes MODIFY note TEXT NULL');
        }
        foreach (['type_verre', 'od_sphere', 'od_cylindre', 'od_axe', 'od_addition', 'og_sphere', 'og_cylindre', 'og_axe', 'og_addition', 'correction'] as $col) {
            if (api_docs_has_column($pdo, $table, $col)) {
                $pdo->exec("ALTER TABLE t_pr_lunettes MODIFY {$col} VARCHAR(255) NOT NULL DEFAULT ''");
            }
        }
    }

    $idx = $pdo->query("SHOW INDEX FROM {$table} WHERE Key_name = 'uid_unique'")->fetch();
    if (!$idx) {
        try {
            $pdo->exec("CREATE UNIQUE INDEX uid_unique ON {$table} (uid)");
        } catch (Throwable $e) {
            // index may already exist under another name
        }
    }
}

function api_docs_ensure(PDO $pdo): void
{
    static $done = false;
    if ($done) {
        return;
    }
    $done = true;

    foreach (['t_ordonnances', 't_pr_examens', 't_pr_lunettes', 't_agendas'] as $table) {
        api_docs_ensure_table($pdo, $table);
    }

    api_docs_migrate_from_ophtamax($pdo);
}

function api_docs_migrate_from_ophtamax(PDO $pdo): void
{
    $exists = $pdo->query("SHOW TABLES LIKE 't_ophtamax_docs'")->fetch();
    if (!$exists) {
        return;
    }

    $rows = $pdo->query('SELECT * FROM t_ophtamax_docs')->fetchAll(PDO::FETCH_ASSOC);
    if (!$rows) {
        return;
    }

    foreach ($rows as $row) {
        $kind = (string) ($row['kind'] ?? '');
        $table = api_docs_table($kind);
        if ($table === '') {
            continue;
        }
        $uid = (string) ($row['id'] ?? '');
        if ($uid === '') {
            continue;
        }
        $check = $pdo->prepare("SELECT id FROM {$table} WHERE uid = ? LIMIT 1");
        $check->execute([$uid]);
        if ($check->fetch()) {
            continue;
        }

        $payload = json_decode((string) ($row['payload'] ?? ''), true);
        if (!is_array($payload)) {
            $payload = [];
        }
        $payload['patient_id'] = (string) ($row['patient_id'] ?? ($payload['patient_id'] ?? ''));
        $eventAt = $row['event_at'] ?? null;
        $now = date('Y-m-d H:i:s');
        api_docs_insert_row($pdo, $table, $kind, $uid, $payload, $eventAt ?: $now, $now);
    }
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
    $patientName = trim((string) ($body['patient_name'] ?? ''));
    if ($patientId !== '') {
        $label = api_patient_label($pdo, $patientId);
        if ($label === '') {
            api_error('Patient introuvable', 422);
        }
        $body['patient_id'] = $patientId;
        $body['patient_name'] = $label;
    } elseif ($patientName !== '') {
        $body['patient_id'] = '';
        $body['patient_name'] = $patientName;
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
    $item['id'] = (string) ($row['uid'] ?? $row['id'] ?? '');

    return $item;
}

function api_docs_find(PDO $pdo, string $kind, string $id): ?array
{
    $table = api_docs_table($kind);
    if ($table === '') {
        return null;
    }
    if ($table === 't_agendas') {
        $stmt = $pdo->prepare("SELECT * FROM {$table} WHERE uid = ? AND kind = ? LIMIT 1");
        $stmt->execute([$id, $kind]);
    } else {
        $stmt = $pdo->prepare("SELECT * FROM {$table} WHERE uid = ? LIMIT 1");
        $stmt->execute([$id]);
    }
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    return $row ?: null;
}

function api_docs_insert_row(
    PDO $pdo,
    string $table,
    string $kind,
    string $uid,
    array $body,
    string $eventAt,
    string $now
): void {
    $patientId = (string) ($body['patient_id'] ?? '');
    $patientName = (string) ($body['patient_name'] ?? '');
    $medecin = (string) ($body['medecin'] ?? '');
    $payload = json_encode($body, JSON_UNESCAPED_UNICODE);

    if ($table === 't_ordonnances') {
        $stmt = $pdo->prepare(
            'INSERT INTO t_ordonnances
                (uid, idpatients, patient_name, medecin, medicaments, indications, diagnostic, notes, event_at, payload, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $uid,
            $patientId,
            $patientName,
            $medecin,
            (string) ($body['contenu'] ?? ''),
            (string) ($body['diagnostic'] ?? ''),
            (string) ($body['diagnostic'] ?? ''),
            (string) ($body['notes'] ?? ''),
            $eventAt,
            $payload,
            $now,
            $now,
        ]);
        return;
    }

    if ($table === 't_pr_examens') {
        $stmt = $pdo->prepare(
            'INSERT INTO t_pr_examens
                (uid, idpatients, patient_name, medecin, examens, indication, bulletin_de, service, notes, event_at, payload, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $uid,
            $patientId,
            $patientName,
            $medecin,
            (string) ($body['examens'] ?? ''),
            (string) ($body['indication'] ?? ''),
            (string) ($body['bulletin_de'] ?? ''),
            (string) ($body['service'] ?? ''),
            (string) ($body['notes'] ?? ''),
            $eventAt,
            $payload,
            $now,
            $now,
        ]);
        return;
    }

    if ($table === 't_pr_lunettes') {
        $stmt = $pdo->prepare(
            'INSERT INTO t_pr_lunettes
                (uid, idpatients, patient_name, medecin, type_verre, od_sphere, od_cylindre, od_axe, od_addition,
                 og_sphere, og_cylindre, og_axe, og_addition, correction, note, event_at, payload, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $uid,
            $patientId,
            $patientName,
            $medecin,
            (string) ($body['type_verre'] ?? $body['type_foyer'] ?? ''),
            (string) ($body['od_sphere'] ?? ''),
            (string) ($body['od_cylindre'] ?? ''),
            (string) ($body['od_axe'] ?? ''),
            (string) ($body['od_addition'] ?? ''),
            (string) ($body['og_sphere'] ?? ''),
            (string) ($body['og_cylindre'] ?? ''),
            (string) ($body['og_axe'] ?? ''),
            (string) ($body['og_addition'] ?? ''),
            (string) ($body['correction'] ?? ''),
            (string) ($body['notes'] ?? ''),
            $eventAt,
            $payload,
            $now,
            $now,
        ]);
        return;
    }

    if ($table === 't_agendas') {
        $stmt = $pdo->prepare(
            'INSERT INTO t_agendas
                (uid, kind, idpatients, patient_name, medecin, medecin_id, date_heure, event_at, motif, statut, duree_min, notes, payload, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $uid,
            $kind,
            $patientId,
            $patientName,
            $medecin,
            (string) ($body['medecin_id'] ?? ''),
            $eventAt,
            $eventAt,
            (string) ($body['motif'] ?? ''),
            (string) ($body['statut'] ?? ($kind === 'file' ? 'en_attente' : 'planifie')),
            (int) ($body['duree_min'] ?? 30),
            (string) ($body['notes'] ?? ''),
            $payload,
            $now,
            $now,
        ]);
    }
}

function api_docs_update_row(PDO $pdo, string $table, string $kind, string $id, array $body, string $eventAt, string $now): void
{
    $patientId = (string) ($body['patient_id'] ?? '');
    $patientName = (string) ($body['patient_name'] ?? '');
    $medecin = (string) ($body['medecin'] ?? '');
    $payload = json_encode($body, JSON_UNESCAPED_UNICODE);

    if ($table === 't_ordonnances') {
        $stmt = $pdo->prepare(
            'UPDATE t_ordonnances SET idpatients=?, patient_name=?, medecin=?, medicaments=?, indications=?, diagnostic=?, notes=?, event_at=?, payload=?, updated_at=?
             WHERE uid=?'
        );
        $stmt->execute([
            $patientId, $patientName, $medecin,
            (string) ($body['contenu'] ?? ''),
            (string) ($body['diagnostic'] ?? ''),
            (string) ($body['diagnostic'] ?? ''),
            (string) ($body['notes'] ?? ''),
            $eventAt, $payload, $now, $id,
        ]);
        return;
    }

    if ($table === 't_pr_examens') {
        $stmt = $pdo->prepare(
            'UPDATE t_pr_examens SET idpatients=?, patient_name=?, medecin=?, examens=?, indication=?, bulletin_de=?, service=?, notes=?, event_at=?, payload=?, updated_at=?
             WHERE uid=?'
        );
        $stmt->execute([
            $patientId, $patientName, $medecin,
            (string) ($body['examens'] ?? ''),
            (string) ($body['indication'] ?? ''),
            (string) ($body['bulletin_de'] ?? ''),
            (string) ($body['service'] ?? ''),
            (string) ($body['notes'] ?? ''),
            $eventAt, $payload, $now, $id,
        ]);
        return;
    }

    if ($table === 't_pr_lunettes') {
        $stmt = $pdo->prepare(
            'UPDATE t_pr_lunettes SET idpatients=?, patient_name=?, medecin=?, type_verre=?, od_sphere=?, od_cylindre=?, od_axe=?, od_addition=?,
             og_sphere=?, og_cylindre=?, og_axe=?, og_addition=?, correction=?, note=?, event_at=?, payload=?, updated_at=?
             WHERE uid=?'
        );
        $stmt->execute([
            $patientId, $patientName, $medecin,
            (string) ($body['type_verre'] ?? $body['type_foyer'] ?? ''),
            (string) ($body['od_sphere'] ?? ''),
            (string) ($body['od_cylindre'] ?? ''),
            (string) ($body['od_axe'] ?? ''),
            (string) ($body['od_addition'] ?? ''),
            (string) ($body['og_sphere'] ?? ''),
            (string) ($body['og_cylindre'] ?? ''),
            (string) ($body['og_axe'] ?? ''),
            (string) ($body['og_addition'] ?? ''),
            (string) ($body['correction'] ?? ''),
            (string) ($body['notes'] ?? ''),
            $eventAt, $payload, $now, $id,
        ]);
        return;
    }

    if ($table === 't_agendas') {
        $stmt = $pdo->prepare(
            'UPDATE t_agendas SET idpatients=?, patient_name=?, medecin=?, medecin_id=?, date_heure=?, event_at=?, motif=?, statut=?, duree_min=?, notes=?, payload=?, updated_at=?
             WHERE uid=? AND kind=?'
        );
        $stmt->execute([
            $patientId, $patientName, $medecin,
            (string) ($body['medecin_id'] ?? ''),
            $eventAt, $eventAt,
            (string) ($body['motif'] ?? ''),
            (string) ($body['statut'] ?? ($kind === 'file' ? 'en_attente' : 'planifie')),
            (int) ($body['duree_min'] ?? 30),
            (string) ($body['notes'] ?? ''),
            $payload, $now, $id, $kind,
        ]);
    }
}

/**
 * @param array{mode?:string,defaults?:array} $options
 *   mode: page | range | day
 */
function api_docs_handle(PDO $pdo, string $kind, array $options = []): void
{
    api_docs_ensure($pdo);
    $table = api_docs_table($kind);
    if ($table === '') {
        api_error('Type de document inconnu', 500);
    }

    $defaults = is_array($options['defaults'] ?? null) ? $options['defaults'] : [];
    $mode = (string) ($options['mode'] ?? 'page');
    $method = $_SERVER['REQUEST_METHOD'];
    $id = api_route_id();
    $kindFilter = $table === 't_agendas' ? ' AND kind = ?' : '';

    if ($method === 'GET' && !$id) {
        if ($mode === 'day') {
            $day = substr((string) ($_GET['date'] ?? date('Y-m-d')), 0, 10);
            $sql = "SELECT * FROM {$table} WHERE DATE(event_at) = ?{$kindFilter} ORDER BY event_at ASC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($table === 't_agendas' ? [$day, $kind] : [$day]);
            api_json(array_map(static fn ($row) => api_docs_map($row, $defaults), $stmt->fetchAll(PDO::FETCH_ASSOC)));
        }

        if ($mode === 'range') {
            $from = substr((string) ($_GET['from'] ?? date('Y-m-d', strtotime('-30 days'))), 0, 10);
            $to = substr((string) ($_GET['to'] ?? date('Y-m-d', strtotime('+90 days'))), 0, 10);
            $sql = "SELECT * FROM {$table}
                    WHERE event_at >= ? AND event_at < DATE_ADD(?, INTERVAL 1 DAY){$kindFilter}
                    ORDER BY event_at ASC LIMIT 500";
            $stmt = $pdo->prepare($sql);
            $params = [$from . ' 00:00:00', $to];
            if ($table === 't_agendas') {
                $params[] = $kind;
            }
            $stmt->execute($params);
            api_json(array_map(static fn ($row) => api_docs_map($row, $defaults), $stmt->fetchAll(PDO::FETCH_ASSOC)));
        }

        $page = max(1, (int) ($_GET['page'] ?? 1));
        $perPage = min(100, max(1, (int) ($_GET['per_page'] ?? 10)));
        $offset = ($page - 1) * $perPage;
        if ($table === 't_agendas') {
            $count = $pdo->prepare("SELECT COUNT(*) FROM {$table} WHERE kind = ?");
            $count->execute([$kind]);
            $total = (int) $count->fetchColumn();
            $stmt = $pdo->prepare(
                "SELECT * FROM {$table} WHERE kind = ? ORDER BY event_at DESC, created_at DESC LIMIT {$perPage} OFFSET {$offset}"
            );
            $stmt->execute([$kind]);
        } else {
            $total = (int) $pdo->query("SELECT COUNT(*) FROM {$table} WHERE uid IS NOT NULL AND uid <> ''")->fetchColumn();
            $stmt = $pdo->query(
                "SELECT * FROM {$table} WHERE uid IS NOT NULL AND uid <> '' ORDER BY event_at DESC, created_at DESC LIMIT {$perPage} OFFSET {$offset}"
            );
        }
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
        $eventAt = api_docs_event_at($body) ?? $now;
        api_docs_insert_row($pdo, $table, $kind, $newId, $body, $eventAt, $now);
        $row = api_docs_find($pdo, $kind, $newId);
        api_json(api_docs_map($row, $defaults), 201, 'Enregistré');
    }

    if (($method === 'PUT' || $method === 'PATCH') && $id) {
        $row = api_docs_find($pdo, $kind, $id);
        if (!$row) {
            api_error('Introuvable', 404);
        }
        $current = json_decode((string) ($row['payload'] ?? ''), true);
        if (!is_array($current)) {
            $current = [];
        }
        $body = api_docs_prepare_body($pdo, array_merge($current, api_body()));
        $now = date('Y-m-d H:i:s');
        $eventAt = api_docs_event_at($body) ?? (string) ($row['event_at'] ?? $now);
        api_docs_update_row($pdo, $table, $kind, $id, $body, $eventAt, $now);
        $fresh = api_docs_find($pdo, $kind, $id);
        api_json(api_docs_map($fresh, $defaults), 200, 'Mis à jour');
    }

    if ($method === 'DELETE' && $id) {
        if ($table === 't_agendas') {
            $stmt = $pdo->prepare("DELETE FROM {$table} WHERE uid = ? AND kind = ?");
            $stmt->execute([$id, $kind]);
        } else {
            $stmt = $pdo->prepare("DELETE FROM {$table} WHERE uid = ?");
            $stmt->execute([$id]);
        }
        api_json(null, 200, 'Supprimé');
    }

    api_error('Méthode non autorisée', 405);
}
