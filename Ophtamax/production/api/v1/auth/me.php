<?php
/**
 * GET /api/v1/auth/me
 */

require_once __DIR__ . '/../_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    api_error('Méthode non autorisée', 405);
}

$user = api_require_user($pdo);
$payload = api_user_payload($user);

api_json([
    'token' => api_bearer_token(),
    'user' => $payload,
    'permissions' => api_permissions_for_role($payload['id_role']),
]);
