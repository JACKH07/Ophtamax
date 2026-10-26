<?php

function api_referentiel_ensure(PDO $pdo, string $table): void
{
    $allowed = ['t_professions', 't_assurances', 't_examens', 't_sexes'];
    if (!in_array($table, $allowed, true)) {
        api_error('Référentiel inconnu', 500);
    }

    $code = $pdo->query("SHOW COLUMNS FROM {$table} LIKE 'code'")->fetch();
    if (!$code) {
        $pdo->exec("ALTER TABLE {$table} ADD COLUMN code VARCHAR(32) NOT NULL DEFAULT ''");
    }
    $libelle = $pdo->query("SHOW COLUMNS FROM {$table} LIKE 'libelle'")->fetch();
    if (!$libelle) {
        $pdo->exec("ALTER TABLE {$table} ADD COLUMN libelle VARCHAR(255) NOT NULL DEFAULT ''");
    }
}

function api_referentiel_code(string $libelle): string
{
    $compact = preg_replace('/\s+/', '', $libelle) ?? $libelle;

    return strtoupper(substr($compact, 0, 10));
}

function api_referentiel_seed(PDO $pdo, string $table, array $rows): void
{
    $count = (int) $pdo->query("SELECT COUNT(*) FROM {$table} WHERE libelle <> ''")->fetchColumn();
    if ($count > 0) {
        return;
    }

    $stmt = $pdo->prepare("INSERT INTO {$table} (code, libelle, created_at, updated_at) VALUES (?, ?, ?, ?)");
    $now = date('Y-m-d H:i:s');
    foreach ($rows as $row) {
        $libelle = trim((string) ($row['libelle'] ?? ''));
        if ($libelle === '') {
            continue;
        }
        $code = trim((string) ($row['code'] ?? ''));
        if ($code === '') {
            $code = api_referentiel_code($libelle);
        }
        $stmt->execute([$code, $libelle, $now, $now]);
    }
}

function api_referentiel_map(array $row): array
{
    return [
        'id' => (string) $row['id'],
        'code' => (string) ($row['code'] ?? ''),
        'libelle' => (string) ($row['libelle'] ?? ''),
    ];
}

function api_referentiel_handle(PDO $pdo, string $table): void
{
    api_referentiel_ensure($pdo, $table);
    $method = $_SERVER['REQUEST_METHOD'];
    $id = api_route_id();

    if ($method === 'GET' && !$id) {
        $rows = $pdo->query("SELECT id, code, libelle FROM {$table} WHERE libelle <> '' ORDER BY libelle")->fetchAll(PDO::FETCH_ASSOC);
        api_json(array_map('api_referentiel_map', $rows));
    }

    if ($method === 'POST' && !$id) {
        $body = api_body();
        $libelle = trim((string) ($body['libelle'] ?? ''));
        $code = strtoupper(trim((string) ($body['code'] ?? '')));
        if ($libelle === '' || $code === '') {
            api_error('Code et libellé requis', 422);
        }
        $exists = $pdo->prepare("SELECT id FROM {$table} WHERE libelle = ? LIMIT 1");
        $exists->execute([$libelle]);
        if ($exists->fetch()) {
            api_error('Ce libellé existe déjà', 422);
        }
        $now = date('Y-m-d H:i:s');
        $insert = $pdo->prepare("INSERT INTO {$table} (code, libelle, created_at, updated_at) VALUES (?, ?, ?, ?)");
        $insert->execute([$code, $libelle, $now, $now]);
        $newId = (string) $pdo->lastInsertId();
        api_json(api_referentiel_map(['id' => $newId, 'code' => $code, 'libelle' => $libelle]), 201, 'Ajouté');
    }

    if ($method === 'DELETE' && $id) {
        $stmt = $pdo->prepare("DELETE FROM {$table} WHERE id = ?");
        $stmt->execute([$id]);
        api_json(null, 200, 'Supprimé');
    }

    api_error('Méthode non autorisée', 405);
}
