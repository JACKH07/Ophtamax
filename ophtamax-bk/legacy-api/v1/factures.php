<?php

require_once __DIR__ . '/_bootstrap.php';
require_once __DIR__ . '/_factures.php';
api_require_user($pdo);
api_facture_ensure($pdo);

$method = $_SERVER['REQUEST_METHOD'];
$id = api_route_id();

if ($method === 'GET' && !$id) {
    $rows = $pdo->query(api_facture_select_sql() . ' ORDER BY f.date_fact DESC, f.id DESC')->fetchAll(PDO::FETCH_ASSOC);
    api_json(array_map(static fn ($row) => api_map_facture($pdo, $row), $rows));
}

if ($method === 'GET' && $id) {
    $stmt = $pdo->prepare(api_facture_select_sql() . ' WHERE f.id = ? LIMIT 1');
    $stmt->execute([$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        api_error('Facture introuvable', 404);
    }
    api_json(api_map_facture($pdo, $row));
}

if ($method === 'POST' && !$id) {
    $body = api_body();
    $patientId = trim((string) ($body['patient_id'] ?? ''));
    $date = substr((string) ($body['date'] ?? ''), 0, 10);
    $statut = (string) ($body['statut'] ?? 'impayee');
    $mode = (string) ($body['mode_paiement'] ?? '');
    $lignes = $body['lignes'] ?? [];

    if ($patientId === '' || $date === '' || !is_array($lignes) || $lignes === []) {
        api_error('Patient, date et au moins une ligne sont requis', 422);
    }
    if (!in_array($statut, ['payee', 'partielle', 'impayee'], true)) {
        api_error('Statut invalide', 422);
    }

    $patient = $pdo->prepare('SELECT id FROM patient WHERE id = ? LIMIT 1');
    $patient->execute([$patientId]);
    if (!$patient->fetch()) {
        api_error('Patient introuvable', 422);
    }

    $total = 0.0;
    $clean = [];
    foreach ($lignes as $ligne) {
        $libelle = trim((string) ($ligne['libelle'] ?? ''));
        $qte = (float) ($ligne['quantite'] ?? 0);
        $prix = (float) ($ligne['prix_unitaire'] ?? 0);
        if ($libelle === '' || $qte < 1) {
            api_error('Chaque ligne doit avoir un libellé et une quantité', 422);
        }
        $clean[] = [$libelle, $qte, $prix];
        $total += $qte * $prix;
    }

    $pdo->beginTransaction();
    try {
        $insert = $pdo->prepare(
            'INSERT INTO t_factures (idpatients, date_fact, modepaiement, montantfact, statut, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, NOW(), NOW())'
        );
        $insert->execute([$patientId, $date, $mode, $total, $statut]);
        $factureId = (string) $pdo->lastInsertId();

        $line = $pdo->prepare(
            'INSERT INTO t_det_factures (idfacture, lignelibelle, quantite, prixunitaire, created_at, updated_at)
             VALUES (?, ?, ?, ?, NOW(), NOW())'
        );
        foreach ($clean as [$libelle, $qte, $prix]) {
            $line->execute([$factureId, $libelle, (string) $qte, $prix]);
        }
        $pdo->commit();
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        api_error('Impossible d\'enregistrer la facture', 500);
    }

    $stmt = $pdo->prepare(api_facture_select_sql() . ' WHERE f.id = ? LIMIT 1');
    $stmt->execute([$factureId]);
    api_json(api_map_facture($pdo, $stmt->fetch(PDO::FETCH_ASSOC)), 201, 'Facture créée');
}

api_error('Méthode non autorisée', 405);
