<?php
/**
 * Routeur PHP intégré pour servir l'API sous /api/v1/...
 * Usage :
 *   cd Ophtamax/production
 *   php -S 127.0.0.1:8080 api/router.php
 */

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
$uri = rawurldecode($uri);

if ($uri === '/' || $uri === '') {
    header('Content-Type: application/json');
    echo json_encode(['message' => 'Ophtamax API', 'prefix' => '/api/v1']);
    return true;
}

// /api/v1/auth/login -> api/v1/auth/login.php
if (preg_match('#^/api/v1/(.+)$#', $uri, $m)) {
    $script = __DIR__ . '/v1/' . $m[1] . '.php';
    if (is_file($script)) {
        require $script;
        return true;
    }
}

http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['message' => 'Endpoint introuvable', 'path' => $uri]);
return true;
