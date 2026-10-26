<?php
require_once __DIR__ . '/../_bootstrap.php';
require_once __DIR__ . '/_store.php';
api_require_user($pdo);

api_referentiel_ensure($pdo, 't_sexes');

$seed = [
    ['code' => 'M', 'libelle' => 'Masculin'],
    ['code' => 'F', 'libelle' => 'Féminin'],
];

// Reprendre les libellés de l'ancienne table genre si présente
$genreTable = $pdo->query("SHOW TABLES LIKE 'genre'")->fetch();
if ($genreTable) {
    $fromGenre = $pdo->query(
        "SELECT code, libelle FROM genre WHERE code IS NOT NULL AND code <> '' ORDER BY libelle"
    )->fetchAll(PDO::FETCH_ASSOC);
    if ($fromGenre) {
        $seed = array_map(static fn ($r) => [
            'code' => strtoupper(substr((string) $r['code'], 0, 1)),
            'libelle' => (string) ($r['libelle'] ?? $r['code']),
        ], $fromGenre);
    }
}

api_referentiel_seed($pdo, 't_sexes', $seed);
api_referentiel_handle($pdo, 't_sexes');
