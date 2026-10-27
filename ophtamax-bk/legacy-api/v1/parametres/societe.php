<?php
require_once __DIR__ . '/../_bootstrap.php';
api_require_user($pdo);

$method = $_SERVER['REQUEST_METHOD'];

function api_societe_map(?array $row): array
{
    $row = $row ?: [];
    return [
        'nom' => (string) ($row['nom'] ?? $row['raison_sociale'] ?? "Centre d'Ophtalmologie"),
        'adresse' => (string) ($row['adresse'] ?? ''),
        'contact' => (string) ($row['contact'] ?? $row['telephone'] ?? ''),
        'slogan' => (string) ($row['slogan'] ?? 'Ophtamax'),
    ];
}

if ($method === 'GET') {
    $row = $pdo->query('SELECT * FROM societes ORDER BY id ASC LIMIT 1')->fetch(PDO::FETCH_ASSOC) ?: [];
    api_json(api_societe_map($row));
}

if ($method === 'PUT') {
    $body = api_body();
    $nom = (string) ($body['nom'] ?? '');
    $adresse = (string) ($body['adresse'] ?? '');
    $contact = (string) ($body['contact'] ?? '');
    $slogan = (string) ($body['slogan'] ?? '');
    $now = date('Y-m-d H:i:s');

    $exists = $pdo->query('SELECT id FROM societes ORDER BY id ASC LIMIT 1')->fetchColumn();
    if ($exists) {
        $stmt = $pdo->prepare(
            'UPDATE societes SET nom=?, raison_sociale=?, adresse=?, contact=?, telephone=?, slogan=?, updated_at=? WHERE id=?'
        );
        $stmt->execute([$nom, $nom, $adresse, $contact, $contact, $slogan, $now, $exists]);
    } else {
        $code = 'SOC' . strtoupper(substr(api_new_id(), 0, 8));
        $stmt = $pdo->prepare(
            'INSERT INTO societes (code, raison_sociale, nom, adresse, telephone, contact, slogan, devise, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([$code, $nom ?: "Centre d'Ophtalmologie", $nom, $adresse, $contact, $contact, $slogan, 'XOF', $now, $now]);
    }

    api_json([
        'nom' => $nom,
        'adresse' => $adresse,
        'contact' => $contact,
        'slogan' => $slogan,
    ], 200, 'Société mise à jour');
}

api_error('Méthode non autorisée', 405);
