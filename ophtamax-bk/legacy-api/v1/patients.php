<?php
require_once __DIR__ . '/_bootstrap.php';
api_require_user($pdo);

$method = $_SERVER['REQUEST_METHOD'];
$id = api_route_id();
$action = api_route_action();

if ($id && $action === 'consultations' && $method === 'GET') {
    $stmt = $pdo->prepare('SELECT * FROM consultation WHERE id_patient = ? ORDER BY datecons DESC');
    $stmt->execute([$id]);
    api_json(array_map('api_map_consultation', $stmt->fetchAll(PDO::FETCH_ASSOC)));
}

if ($method === 'GET' && !$id) {
    $search = trim((string) ($_GET['search'] ?? ''));
    $assurance = trim((string) ($_GET['assurance'] ?? ''));
    $page = max(1, (int) ($_GET['page'] ?? 1));
    $perPage = min(200, max(1, (int) ($_GET['per_page'] ?? 50)));
    $offset = ($page - 1) * $perPage;

    $where = ['1=1'];
    $params = [];
    if ($search !== '') {
        $where[] = '(nom LIKE ? OR prenom LIKE ? OR contact LIKE ?)';
        $like = '%' . $search . '%';
        $params[] = $like;
        $params[] = $like;
        $params[] = $like;
    }
    if ($assurance !== '') {
        $where[] = 'assurance = ?';
        $params[] = $assurance;
    }
    $sqlWhere = implode(' AND ', $where);

    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM patient WHERE {$sqlWhere}");
    $countStmt->execute($params);
    $total = (int) $countStmt->fetchColumn();

    $sql = "SELECT p.*, (
        SELECT MAX(c.datecons) FROM consultation c WHERE c.id_patient = p.id
      ) AS derniere_visite
      FROM patient p
      WHERE {$sqlWhere}
      ORDER BY p.nom ASC, p.prenom ASC
      LIMIT {$perPage} OFFSET {$offset}";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    api_json(array_map('api_map_patient', $stmt->fetchAll(PDO::FETCH_ASSOC)), 200, 'ok');
}

if ($method === 'GET' && $id) {
    $stmt = $pdo->prepare('SELECT * FROM patient WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        api_error('Patient introuvable', 404);
    }
    api_json(api_map_patient($row));
}

if ($method === 'POST' && !$id) {
    $body = api_body();
    foreach (['nom', 'prenom', 'sexe', 'date_nais', 'contact'] as $field) {
        if (!isset($body[$field]) || trim((string) $body[$field]) === '') {
            api_error("Champ requis: {$field}", 422);
        }
    }
    $newId = api_new_id();
    $stmt = $pdo->prepare(
        'INSERT INTO patient (id, nom, prenom, sexe, date_nais, profession, contact, assurance, antecedents)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $newId,
        trim((string) $body['nom']),
        trim((string) $body['prenom']),
        strtoupper(substr((string) $body['sexe'], 0, 1)),
        (string) $body['date_nais'],
        (string) ($body['profession'] ?? ''),
        (string) $body['contact'],
        (string) ($body['assurance'] ?? ''),
        (string) ($body['antecedents'] ?? ''),
    ]);
    $stmt = $pdo->prepare('SELECT * FROM patient WHERE id = ?');
    $stmt->execute([$newId]);
    api_json(api_map_patient($stmt->fetch(PDO::FETCH_ASSOC)), 201, 'Patient créé');
}

if ($method === 'PUT' && $id) {
    $body = api_body();
    $stmt = $pdo->prepare('SELECT id FROM patient WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    if (!$stmt->fetch()) {
        api_error('Patient introuvable', 404);
    }
    $upd = $pdo->prepare(
        'UPDATE patient SET nom=?, prenom=?, sexe=?, date_nais=?, profession=?, contact=?, assurance=?, antecedents=? WHERE id=?'
    );
    $upd->execute([
        trim((string) ($body['nom'] ?? '')),
        trim((string) ($body['prenom'] ?? '')),
        strtoupper(substr((string) ($body['sexe'] ?? 'M'), 0, 1)),
        (string) ($body['date_nais'] ?? ''),
        (string) ($body['profession'] ?? ''),
        (string) ($body['contact'] ?? ''),
        (string) ($body['assurance'] ?? ''),
        (string) ($body['antecedents'] ?? ''),
        $id,
    ]);
    $stmt = $pdo->prepare('SELECT * FROM patient WHERE id = ?');
    $stmt->execute([$id]);
    api_json(api_map_patient($stmt->fetch(PDO::FETCH_ASSOC)), 200, 'Patient mis à jour');
}

if ($method === 'DELETE' && $id) {
    $stmt = $pdo->prepare('DELETE FROM patient WHERE id = ?');
    $stmt->execute([$id]);
    api_json(null, 200, 'Patient supprimé');
}

api_error('Méthode non autorisée', 405);
