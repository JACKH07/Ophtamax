<?php

require_once __DIR__ . '/../_bootstrap.php';
api_require_user($pdo);

$rows = $pdo->query('SELECT id, libelle FROM examen ORDER BY libelle')->fetchAll(PDO::FETCH_ASSOC);
api_json(array_map(static fn ($r) => [
    'id' => (string) $r['id'],
    'code' => (string) $r['id'],
    'libelle' => (string) ($r['libelle'] ?? ''),
], $rows));
