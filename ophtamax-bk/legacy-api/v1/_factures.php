<?php

function api_facture_has_column(PDO $pdo, string $table, string $column): bool
{
    $stmt = $pdo->query("SHOW COLUMNS FROM {$table} LIKE " . $pdo->quote($column));

    return (bool) $stmt->fetch();
}

function api_facture_add_column(PDO $pdo, string $table, string $column, string $definition): void
{
    if (!api_facture_has_column($pdo, $table, $column)) {
        $pdo->exec("ALTER TABLE {$table} ADD COLUMN {$column} {$definition}");
    }
}

function api_facture_ensure(PDO $pdo): void
{
    static $done = false;
    if ($done) {
        return;
    }
    $done = true;

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS t_factures (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            idpatients VARCHAR(255) NOT NULL DEFAULT "",
            date_fact DATE NOT NULL,
            modepaiement VARCHAR(255) NOT NULL DEFAULT "",
            montantfact DECIMAL(15,2) NOT NULL DEFAULT 0,
            statut VARCHAR(32) NOT NULL DEFAULT "impayee",
            created_at TIMESTAMP NULL,
            updated_at TIMESTAMP NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
    );
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS t_det_factures (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            idfacture VARCHAR(255) NOT NULL DEFAULT "",
            lignelibelle VARCHAR(255) NOT NULL DEFAULT "",
            quantite VARCHAR(32) NOT NULL DEFAULT "1",
            prixunitaire DECIMAL(15,2) NOT NULL DEFAULT 0,
            created_at TIMESTAMP NULL,
            updated_at TIMESTAMP NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
    );

    api_facture_add_column($pdo, 't_factures', 'idpatients', 'VARCHAR(255) NOT NULL DEFAULT ""');
    api_facture_add_column($pdo, 't_factures', 'date_fact', 'DATE NULL');
    api_facture_add_column($pdo, 't_factures', 'modepaiement', 'VARCHAR(255) NOT NULL DEFAULT ""');
    api_facture_add_column($pdo, 't_factures', 'montantfact', 'DECIMAL(15,2) NOT NULL DEFAULT 0');
    api_facture_add_column($pdo, 't_factures', 'statut', 'VARCHAR(32) NOT NULL DEFAULT "impayee"');

    api_facture_add_column($pdo, 't_det_factures', 'idfacture', 'VARCHAR(255) NOT NULL DEFAULT ""');
    api_facture_add_column($pdo, 't_det_factures', 'lignelibelle', 'VARCHAR(255) NOT NULL DEFAULT ""');
    api_facture_add_column($pdo, 't_det_factures', 'quantite', 'VARCHAR(32) NOT NULL DEFAULT "1"');
    api_facture_add_column($pdo, 't_det_factures', 'prixunitaire', 'DECIMAL(15,2) NOT NULL DEFAULT 0');

    // Assouplir les NOT NULL trop stricts issus des migrations Laravel
    try {
        $pdo->exec('ALTER TABLE t_factures MODIFY modepaiement VARCHAR(255) NOT NULL DEFAULT ""');
        $pdo->exec('ALTER TABLE t_factures MODIFY montantfact DECIMAL(15,2) NOT NULL DEFAULT 0');
        $pdo->exec('ALTER TABLE t_factures MODIFY statut VARCHAR(32) NOT NULL DEFAULT "impayee"');
    } catch (Throwable $e) {
        // ignore si déjà compatible
    }
}

function api_facture_lignes(PDO $pdo, string $factureId): array
{
    $stmt = $pdo->prepare(
        'SELECT lignelibelle, quantite, prixunitaire FROM t_det_factures WHERE idfacture = ? ORDER BY id'
    );
    $stmt->execute([$factureId]);

    return array_map(static function (array $row): array {
        return [
            'libelle' => (string) $row['lignelibelle'],
            'quantite' => (float) $row['quantite'],
            'prix_unitaire' => (float) $row['prixunitaire'],
        ];
    }, $stmt->fetchAll(PDO::FETCH_ASSOC));
}

function api_map_facture(PDO $pdo, array $row): array
{
    $id = (string) $row['id'];
    $date = substr((string) ($row['date_fact'] ?? ''), 0, 10);
    $year = $date !== '' ? substr($date, 0, 4) : date('Y');
    $montant = (float) ($row['montantfact'] ?? 0);

    $createdAt = (string) ($row['created_at'] ?? '');
    if ($createdAt !== '' && strpos($createdAt, ' ') !== false) {
        $createdAt = str_replace(' ', 'T', $createdAt);
    }

    return [
        'id' => $id,
        'numero' => 'FAC-' . $year . '-' . str_pad($id, 4, '0', STR_PAD_LEFT),
        'patient_id' => (string) ($row['idpatients'] ?? ''),
        'patient_name' => trim((string) ($row['patient_name'] ?? '')),
        'date' => $date,
        'created_at' => $createdAt,
        'montant_ht' => $montant,
        'montant_ttc' => $montant,
        'statut' => (string) ($row['statut'] ?? 'impayee'),
        'mode_paiement' => (string) ($row['modepaiement'] ?? ''),
        'lignes' => api_facture_lignes($pdo, $id),
    ];
}

function api_facture_select_sql(): string
{
    return 'SELECT f.*, TRIM(CONCAT(COALESCE(p.nom, ""), " ", COALESCE(p.prenoms, ""))) AS patient_name
            FROM t_factures f
            LEFT JOIN t_patients p ON p.id = f.idpatients';
}
