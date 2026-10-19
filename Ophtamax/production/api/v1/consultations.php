<?php
/**
 * CRUD /api/v1/consultations
 */

require_once __DIR__ . '/_bootstrap.php';
api_require_user($pdo);

$method = $_SERVER['REQUEST_METHOD'];
$id = api_route_id();

if ($method === 'GET' && !$id) {
    $patientId = trim((string) ($_GET['patient_id'] ?? ''));
    $from = trim((string) ($_GET['from'] ?? ''));
    $to = trim((string) ($_GET['to'] ?? ''));
    $page = max(1, (int) ($_GET['page'] ?? 1));
    $perPage = min(200, max(1, (int) ($_GET['per_page'] ?? 50)));
    $offset = ($page - 1) * $perPage;

    $where = ['1=1'];
    $params = [];
    if ($patientId !== '') {
        $where[] = 'id_patient = ?';
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

    $stmt = $pdo->prepare(
        "SELECT * FROM consultation WHERE {$sqlWhere} ORDER BY datecons DESC LIMIT {$perPage} OFFSET {$offset}"
    );
    $stmt->execute($params);
    api_json(array_map('api_map_consultation', $stmt->fetchAll(PDO::FETCH_ASSOC)));
}

if ($method === 'GET' && $id) {
    $stmt = $pdo->prepare('SELECT * FROM consultation WHERE id = ? LIMIT 1');
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
        $p = $pdo->prepare('SELECT nom, prenom FROM patient WHERE id = ?');
        $p->execute([$patientId]);
        $row = $p->fetch(PDO::FETCH_ASSOC);
        $patientName = $row ? trim(($row['nom'] ?? '') . ' ' . ($row['prenom'] ?? '')) : '';
    }

    $newId = api_new_id();
    $stmt = $pdo->prepare(
        'INSERT INTO consultation (id, id_patient, nom_prenoms_pat, datecons, diagnostic, examen, ordonnance, prescription)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $newId,
        $patientId,
        $patientName,
        date('Y-m-d H:i:s'),
        (string) ($body['diagnostic'] ?? ''),
        (string) ($body['conduite_a_tenir'] ?? ''),
        (string) ($body['ordonnance'] ?? ''),
        (string) ($body['prescription'] ?? ''),
    ]);

    $stmt = $pdo->prepare('SELECT * FROM consultation WHERE id = ?');
    $stmt->execute([$newId]);
    api_json(api_map_consultation($stmt->fetch(PDO::FETCH_ASSOC)), 201, 'Consultation créée');
}

if ($method === 'PUT' && $id) {
    $body = api_body();
    $stmt = $pdo->prepare('SELECT * FROM consultation WHERE id = ?');
    $stmt->execute([$id]);
    if (!$stmt->fetch()) {
        api_error('Consultation introuvable', 404);
    }

    $upd = $pdo->prepare(
        'UPDATE consultation SET id_patient=?, nom_prenoms_pat=?, diagnostic=?, examen=?, ordonnance=?, prescription=?
         WHERE id=?'
    );
    $upd->execute([
        (string) ($body['id_patient'] ?? ''),
        (string) ($body['patient_name'] ?? ''),
        (string) ($body['diagnostic'] ?? ''),
        (string) ($body['conduite_a_tenir'] ?? ''),
        (string) ($body['ordonnance'] ?? ''),
        (string) ($body['prescription'] ?? ''),
        $id,
    ]);

    $stmt = $pdo->prepare('SELECT * FROM consultation WHERE id = ?');
    $stmt->execute([$id]);
    api_json(api_map_consultation($stmt->fetch(PDO::FETCH_ASSOC)), 200, 'Consultation mise à jour');
}

if ($method === 'DELETE' && $id) {
    $stmt = $pdo->prepare('DELETE FROM consultation WHERE id = ?');
    $stmt->execute([$id]);
    api_json(null, 200, 'Consultation supprimée');
}

api_error('Méthode non autorisée', 405);
