<?php
require_once __DIR__ . '/../_bootstrap.php';
api_require_user($pdo);

$rows = $pdo->query(
    "SELECT DISTINCT assurance AS libelle FROM patient
     WHERE assurance IS NOT NULL AND assurance != ''
     ORDER BY assurance LIMIT 100"
)->fetchAll(PDO::FETCH_ASSOC);

api_json(array_map(static fn ($r, $i) => [
    'id' => (string) ($i + 1),
    'code' => strtoupper(substr(preg_replace('/\s+/', '', (string) $r['libelle']), 0, 10)),
    'libelle' => (string) $r['libelle'],
], $rows, array_keys($rows)));
