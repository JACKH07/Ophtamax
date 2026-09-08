<?php
/**
 * POST /api/v1/auth/login
 * Body: { "login": "...", "password": "..." }
 */

require_once __DIR__ . '/../_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    api_error('Méthode non autorisée', 405);
}

$body = api_body();
$login = trim((string) ($body['login'] ?? ''));
$password = (string) ($body['password'] ?? '');

if ($login === '' || $password === '') {
    api_error('Identifiant et mot de passe requis', 422);
}

$hash = sha1($password);

$stmt = $pdo->prepare('SELECT * FROM user WHERE login_user = ? AND pswrd = ? LIMIT 1');
$stmt->execute([$login, $hash]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    api_error('Identifiant ou mot de passe incorrect', 401);
}

$payload = api_user_payload($user);
$token = api_issue_token($payload['id']);

api_json([
    'token' => $token,
    'user' => $payload,
    'permissions' => api_permissions_for_role($payload['id_role']),
], 200, 'Connexion réussie');
