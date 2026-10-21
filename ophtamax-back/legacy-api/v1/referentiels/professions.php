<?php

require_once __DIR__ . '/../_bootstrap.php';
api_require_user($pdo);

$rows = $pdo->query('SELECT id, code, libelle FROM profession ORDER BY libelle LIMIT 500')->fetchAll(PDO::FETCH_ASSOC);
api_json(array_map(static fn ($r) => [
    'id' => (string) $r['id'],
    'code' => (string) ($r['code'] ?? ''),
    'libelle' => (string) ($r['libelle'] ?? ''),
], $rows));
