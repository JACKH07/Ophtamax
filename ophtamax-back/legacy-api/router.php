<?php
/**
 * Routeur PHP intégré pour servir l'API sous /api/v1/...
 * Usage :
 *   cd Ophtamax/production
 *   php -S 127.0.0.1:8088 api/router.php
 */

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
$uri = rawurldecode($uri);

if ($uri === '/' || $uri === '') {
    header('Content-Type: application/json');
    echo json_encode(['message' => 'Ophtamax API', 'prefix' => '/api/v1']);
    return true;
}

// Fichier exact : /api/v1/auth/login → api/v1/auth/login.php
if (preg_match('#^/api/v1/(.+)$#', $uri, $m)) {
    $relative = $m[1];
    $exact = __DIR__ . '/v1/' . $relative . '.php';
    if (is_file($exact)) {
        require $exact;
        return true;
    }

    // Ressource /api/v1/{resource}/{id}/{action?}
    $parts = explode('/', $relative);
    $resource = $parts[0] ?? '';
    $id = $parts[1] ?? null;
    $action = $parts[2] ?? null;

    $candidates = [
        __DIR__ . '/v1/' . $resource . '.php',
        __DIR__ . '/v1/' . $resource . '/index.php',
    ];

    foreach ($candidates as $script) {
        if (is_file($script)) {
            $_API_RESOURCE = $resource;
            $_API_ID = $id;
            $_API_ACTION = $action;
            require $script;
            return true;
        }
    }
}

http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['message' => 'Endpoint introuvable', 'path' => $uri]);
return true;
