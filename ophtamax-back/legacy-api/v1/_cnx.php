<?php
/**
 * Connexion PDO pour l'API — utilise les variables d'environnement Laravel (.env).
 */

try {
    $host = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: '127.0.0.1';
    $port = $_ENV['DB_PORT'] ?? getenv('DB_PORT') ?: '3306';
    $db = $_ENV['DB_DATABASE'] ?? getenv('DB_DATABASE') ?: 'ophtamax_db';
    $user = $_ENV['DB_USERNAME'] ?? getenv('DB_USERNAME') ?: 'root';
    $pass = $_ENV['DB_PASSWORD'] ?? getenv('DB_PASSWORD');
    if ($pass === false || $pass === null) {
        $pass = '';
    }

    $dsn = "mysql:host={$host};port={$port};dbname={$db};charset=utf8mb4";
    $pdo = new PDO($dsn, $user, (string) $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    $payload = [
        'message' => 'Base de données indisponible. Vérifiez que MySQL est démarré.',
        'data' => null,
        'detail' => $e->getMessage(),
    ];
    if (defined('OPHTAMAX_EMBEDDED') && OPHTAMAX_EMBEDDED && class_exists(\App\Support\ApiExitException::class)) {
        throw new \App\Support\ApiExitException($payload, 503);
    }
    http_response_code(503);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}
