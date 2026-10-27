<?php
require_once __DIR__ . '/_bootstrap.php';
api_require_user($pdo);

$method = $_SERVER['REQUEST_METHOD'];
$id = api_route_id();

if ($method === 'GET' && !$id) {
    $rows = $pdo->query('SELECT * FROM users ORDER BY nom, prenoms')->fetchAll(PDO::FETCH_ASSOC);
    $data = array_map(static function ($row) {
        $payload = api_user_payload($row);
        $payload['actif'] = true;
        return $payload;
    }, $rows);
    api_json($data);
}

if ($method === 'GET' && $id) {
    $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        api_error('Utilisateur introuvable', 404);
    }
    $payload = api_user_payload($row);
    $payload['actif'] = true;
    api_json($payload);
}

if ($method === 'DELETE' && $id) {
    $stmt = $pdo->prepare('DELETE FROM users WHERE id = ?');
    $stmt->execute([$id]);
    api_json(null, 200, 'Utilisateur supprimé');
}

api_error('Méthode non autorisée', 405);
