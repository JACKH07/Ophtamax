<?php
/**
 * Connexion PDO pour l'API — erreurs en JSON.
 */

try {
    $strConnection = 'mysql:host=127.0.0.1;dbname=ophtamax_db;charset=utf8mb4';
    // Mot de passe local (MySQL système sur :3306) — vide sur cette machine de dev
    $dbPass = getenv('OPHTAMAX_DB_PASS') !== false ? (string) getenv('OPHTAMAX_DB_PASS') : '';
    $pdo = new PDO($strConnection, 'root', $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    http_response_code(503);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'message' => 'Base de données indisponible. Vérifiez que MySQL est démarré.',
        'data' => null,
        'detail' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
