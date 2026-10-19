<?php

require_once __DIR__ . '/../_bootstrap.php';
api_require_user($pdo);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $row = $pdo->query('SELECT * FROM societe LIMIT 1')->fetch(PDO::FETCH_ASSOC);
    api_json([
        'nom' => (string) ($row['nom'] ?? 'Centre d\'Ophtalmologie'),
        'adresse' => (string) ($row['adresse'] ?? ''),
        'contact' => (string) ($row['contact'] ?? ''),
        'slogan' => (string) ($row['slogan'] ?? 'Ophtamax'),
    ]);
}

if ($method === 'PUT') {
    $body = api_body();
    $exists = $pdo->query('SELECT id FROM societe LIMIT 1')->fetchColumn();
    if ($exists) {
        $stmt = $pdo->prepare('UPDATE societe SET nom=?, adresse=?, contact=?, slogan=? WHERE id=?');
        $stmt->execute([
            (string) ($body['nom'] ?? ''),
            (string) ($body['adresse'] ?? ''),
            (string) ($body['contact'] ?? ''),
            (string) ($body['slogan'] ?? ''),
            $exists,
        ]);
    } else {
        $stmt = $pdo->prepare('INSERT INTO societe (id, nom, adresse, contact, slogan) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([
            api_new_id(),
            (string) ($body['nom'] ?? ''),
            (string) ($body['adresse'] ?? ''),
            (string) ($body['contact'] ?? ''),
            (string) ($body['slogan'] ?? ''),
        ]);
    }
    api_json([
        'nom' => (string) ($body['nom'] ?? ''),
        'adresse' => (string) ($body['adresse'] ?? ''),
        'contact' => (string) ($body['contact'] ?? ''),
        'slogan' => (string) ($body['slogan'] ?? ''),
    ], 200, 'Société mise à jour');
}

api_error('Méthode non autorisée', 405);
