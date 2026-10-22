<?php

function api_facture_ensure(PDO $pdo): void
{
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS t_factures (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            idpatients VARCHAR(255) NOT NULL,
            date_fact DATE NOT NULL,
            modepaiement VARCHAR(255) NULL,
            montantfact DECIMAL(15,2) NOT NULL DEFAULT 0,
            statut VARCHAR(32) NOT NULL,
            created_at TIMESTAMP NULL,
            updated_at TIMESTAMP NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
    );
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS t_det_factures (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            idfacture VARCHAR(255) NOT NULL,
            lignelibelle VARCHAR(255) NOT NULL,
            quantite VARCHAR(32) NOT NULL,
            prixunitaire DECIMAL(15,2) NOT NULL DEFAULT 0,
            created_at TIMESTAMP NULL,
            updated_at TIMESTAMP NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
    );
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

    return [
        'id' => $id,
        'numero' => 'FAC-' . $year . '-' . str_pad($id, 4, '0', STR_PAD_LEFT),
        'patient_id' => (string) ($row['idpatients'] ?? ''),
        'patient_name' => trim((string) ($row['patient_name'] ?? '')),
        'date' => $date,
        'montant_ht' => $montant,
        'montant_ttc' => $montant,
        'statut' => (string) ($row['statut'] ?? 'impayee'),
        'mode_paiement' => (string) ($row['modepaiement'] ?? ''),
        'lignes' => api_facture_lignes($pdo, $id),
    ];
}

function api_facture_select_sql(): string
{
    return 'SELECT f.*, TRIM(CONCAT(COALESCE(p.nom, ""), " ", COALESCE(p.prenom, ""))) AS patient_name
            FROM t_factures f
            LEFT JOIN patient p ON p.id = f.idpatients';
}
