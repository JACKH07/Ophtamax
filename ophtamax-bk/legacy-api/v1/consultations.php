<?php
require_once __DIR__ . '/_bootstrap.php';
api_require_user($pdo);
api_consultation_ensure($pdo);

$method = $_SERVER['REQUEST_METHOD'];
$id = api_route_id();

if ($method === 'GET' && !$id) {
    $patientId = trim((string) ($_GET['patient_id'] ?? ''));
    $from = trim((string) ($_GET['from'] ?? ''));
    $to = trim((string) ($_GET['to'] ?? ''));
    $page = max(1, (int) ($_GET['page'] ?? 1));
    $perPage = min(200, max(1, (int) ($_GET['per_page'] ?? 10)));
    $offset = ($page - 1) * $perPage;

    $where = ["uid IS NOT NULL AND uid <> ''"];
    $params = [];
    if ($patientId !== '') {
        $where[] = 'idpatients = ?';
        $params[] = $patientId;
    }
    if ($from !== '') {
        $where[] = 'DATE(datecons) >= ?';
        $params[] = $from;
    }
    if ($to !== '') {
        $where[] = 'DATE(datecons) <= ?';
        $params[] = $to;
    }
    $sqlWhere = implode(' AND ', $where);
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM t_consultations WHERE {$sqlWhere}");
    $countStmt->execute($params);
    $total = (int) $countStmt->fetchColumn();

    $stmt = $pdo->prepare(
        "SELECT * FROM t_consultations WHERE {$sqlWhere} ORDER BY datecons DESC LIMIT {$perPage} OFFSET {$offset}"
    );
    $stmt->execute($params);
    api_json(array_map('api_map_consultation', $stmt->fetchAll(PDO::FETCH_ASSOC)), 200, null, [
        'page' => $page,
        'per_page' => $perPage,
        'total' => $total,
    ]);
}

if ($method === 'GET' && $id) {
    $stmt = $pdo->prepare('SELECT * FROM t_consultations WHERE uid = ? LIMIT 1');
    $stmt->execute([$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        api_error('Consultation introuvable', 404);
    }
    api_json(api_map_consultation($row));
}

if ($method === 'POST' && !$id) {
    $body = api_body();
    $patientId = trim((string) ($body['id_patient'] ?? ''));
    if ($patientId === '') {
        api_error('id_patient requis', 422);
    }
    $patientName = (string) ($body['patient_name'] ?? '');
    if ($patientName === '') {
        $patientName = api_patient_label($pdo, $patientId);
    }
    $newId = api_new_id();
    $now = date('Y-m-d H:i:s');
    $details = api_consultation_details_json($body);
    $decoded = json_decode($details, true) ?: [];
    $rdvDate = substr((string) ($decoded['prochain_rdv_date'] ?? ''), 0, 10);
    $eye = api_consultation_eye_columns($body);

    $stmt = $pdo->prepare(
        'INSERT INTO t_consultations
            (uid, idpatients, nom_prenoms_pat, datecons, diagnostic, cat, ordonnance, prescription, details_json,
             vl_Sans_corr, vl_avec_corr, vp_Sans_corr, vp_avec_corr, sphere, cylindre, axe0, pio_mmhg, addition,
             segment_anterieur, fond_oeil, prochain_rdv, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $newId,
        $patientId,
        $patientName,
        $now,
        (string) ($body['diagnostic'] ?? ''),
        (string) ($body['conduite_a_tenir'] ?? ''),
        (string) ($body['ordonnance'] ?? ''),
        (string) ($body['prescription'] ?? ''),
        $details,
        $eye[0], $eye[1], $eye[2], $eye[3], $eye[4], $eye[5], $eye[6], $eye[7], $eye[8], $eye[9], $eye[10],
        $rdvDate !== '' ? $rdvDate : null,
        $now,
        $now,
    ]);
    $stmt = $pdo->prepare('SELECT * FROM t_consultations WHERE uid = ?');
    $stmt->execute([$newId]);
    api_json(api_map_consultation($stmt->fetch(PDO::FETCH_ASSOC)), 201, 'Consultation créée');
}

if ($method === 'PUT' && $id) {
    $body = api_body();
    $stmt = $pdo->prepare('SELECT uid FROM t_consultations WHERE uid = ?');
    $stmt->execute([$id]);
    if (!$stmt->fetch()) {
        api_error('Consultation introuvable', 404);
    }
    $details = api_consultation_details_json($body);
    $decoded = json_decode($details, true) ?: [];
    $rdvDate = substr((string) ($decoded['prochain_rdv_date'] ?? ''), 0, 10);
    $eye = api_consultation_eye_columns($body);
    $now = date('Y-m-d H:i:s');

    $upd = $pdo->prepare(
        'UPDATE t_consultations SET
            idpatients=?, nom_prenoms_pat=?, diagnostic=?, cat=?, ordonnance=?, prescription=?, details_json=?,
            vl_Sans_corr=?, vl_avec_corr=?, vp_Sans_corr=?, vp_avec_corr=?, sphere=?, cylindre=?, axe0=?, pio_mmhg=?, addition=?,
            segment_anterieur=?, fond_oeil=?, prochain_rdv=?, updated_at=?
         WHERE uid=?'
    );
    $upd->execute([
        (string) ($body['id_patient'] ?? ''),
        (string) ($body['patient_name'] ?? ''),
        (string) ($body['diagnostic'] ?? ''),
        (string) ($body['conduite_a_tenir'] ?? ''),
        (string) ($body['ordonnance'] ?? ''),
        (string) ($body['prescription'] ?? ''),
        $details,
        $eye[0], $eye[1], $eye[2], $eye[3], $eye[4], $eye[5], $eye[6], $eye[7], $eye[8], $eye[9], $eye[10],
        $rdvDate !== '' ? $rdvDate : null,
        $now,
        $id,
    ]);
    $stmt = $pdo->prepare('SELECT * FROM t_consultations WHERE uid = ?');
    $stmt->execute([$id]);
    api_json(api_map_consultation($stmt->fetch(PDO::FETCH_ASSOC)), 200, 'Consultation mise à jour');
}

if ($method === 'DELETE' && $id) {
    $stmt = $pdo->prepare('DELETE FROM t_consultations WHERE uid = ?');
    $stmt->execute([$id]);
    api_json(null, 200, 'Consultation supprimée');
}

api_error('Méthode non autorisée', 405);
