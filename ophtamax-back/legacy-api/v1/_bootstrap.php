<?php
/**
 * Bootstrap API REST Ophtamax v1 — auth connectée à la BDD existante.
 */

if (!defined('OPHTAMAX_EMBEDDED')) {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Authorization, Content-Type, Accept');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

require_once __DIR__ . '/_cnx.php';

if (!defined('API_TOKEN_SECRET')) {
    define('API_TOKEN_SECRET', 'ophtamax_api_secret_2024_doch');
}
if (!defined('API_TOKEN_TTL')) {
    define('API_TOKEN_TTL', 86400); // 24h
}

function api_respond(array $payload, int $status = 200): void
{
    if (defined('OPHTAMAX_EMBEDDED') && OPHTAMAX_EMBEDDED && class_exists(\App\Support\ApiExitException::class)) {
        throw new \App\Support\ApiExitException($payload, $status);
    }
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function api_json($data, int $status = 200, ?string $message = null): void
{
    $payload = ['data' => $data];
    if ($message !== null) {
        $payload['message'] = $message;
    }
    api_respond($payload, $status);
}

function api_error(string $message, int $status = 400): void
{
    api_respond(['message' => $message, 'data' => null], $status);
}

function api_body(): array
{
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return $_POST ?: [];
    }
    $json = json_decode($raw, true);
    return is_array($json) ? $json : [];
}

function api_normalize_role(?string $idRole, ?string $fonction): string
{
    $candidates = [strtoupper(trim((string) $idRole)), strtoupper(trim((string) $fonction))];
    $map = [
        'ADMIN' => 'ADMIN',
        'ADMINISTRATEUR' => 'ADMIN',
        'SEC' => 'SEC',
        'SECRETAIRE' => 'SEC',
        'SECRETARIAT' => 'SEC',
        'OPHT' => 'OPHT',
        'OPHTALMOLOGISTE' => 'OPHT',
        'ASS' => 'ASS',
        'ASSISTANTE' => 'ASS',
        'ASSISTANT' => 'ASS',
        'ORTHOPTISTE' => 'ASS',
        'COMPTA' => 'COMPTA',
        'COMPTABLE' => 'COMPTA',
    ];
    foreach ($candidates as $c) {
        if (isset($map[$c])) {
            return $map[$c];
        }
    }
    // Libellés partiels
    foreach ($candidates as $c) {
        if (str_contains($c, 'ADMIN')) return 'ADMIN';
        if (str_contains($c, 'OPHT')) return 'OPHT';
        if (str_contains($c, 'SEC')) return 'SEC';
        if (str_contains($c, 'ASS') || str_contains($c, 'ORTH')) return 'ASS';
        if (str_contains($c, 'COMPT')) return 'COMPTA';
    }
    return 'ASS';
}

function api_permissions_for_role(string $role): array
{
    $all = [
        'ADMIN' => [
            'patients.create', 'patients.edit', 'patients.delete',
            'consultations.write', 'ordonnance.print',
            'facturation.write', 'caisse.access',
            'settings.manage', 'users.manage',
        ],
        'SEC' => ['patients.create', 'patients.edit', 'caisse.access'],
        'OPHT' => ['consultations.write', 'ordonnance.print'],
        'ASS' => ['consultations.write'],
        'COMPTA' => ['facturation.write', 'caisse.access'],
    ];
    return $all[$role] ?? [];
}

function api_user_payload(array $row): array
{
    $role = api_normalize_role($row['id_role'] ?? null, $row['fonction'] ?? null);
    return [
        'id' => (string) ($row['id'] ?? ''),
        'nom' => (string) ($row['nom'] ?? ''),
        'prenoms' => (string) ($row['prenoms'] ?? ''),
        'login_user' => (string) ($row['login_user'] ?? ''),
        'email' => (string) ($row['email'] ?? ''),
        'id_role' => $role,
        'fonction' => (string) ($row['fonction'] ?? $row['id_role'] ?? ''),
    ];
}

function api_issue_token(string $userId): string
{
    $exp = time() + API_TOKEN_TTL;
    $payload = $userId . '|' . $exp;
    $sig = hash_hmac('sha256', $payload, API_TOKEN_SECRET);
    return rtrim(strtr(base64_encode($payload . '|' . $sig), '+/', '-_'), '=');
}

function api_parse_token(?string $token): ?array
{
    if (!$token) {
        return null;
    }
    $raw = base64_decode(strtr($token, '-_', '+/'));
    if ($raw === false) {
        return null;
    }
    $parts = explode('|', $raw);
    if (count($parts) !== 3) {
        return null;
    }
    [$userId, $exp, $sig] = $parts;
    if (!ctype_digit((string) $exp) || (int) $exp < time()) {
        return null;
    }
    $expected = hash_hmac('sha256', $userId . '|' . $exp, API_TOKEN_SECRET);
    if (!hash_equals($expected, $sig)) {
        return null;
    }
    return ['user_id' => $userId, 'exp' => (int) $exp];
}

function api_bearer_token(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? '';
    if (preg_match('/Bearer\s+(\S+)/i', $header, $m)) {
        return $m[1];
    }
    return null;
}

function api_require_user(PDO $pdo): array
{
    $parsed = api_parse_token(api_bearer_token());
    if (!$parsed) {
        api_error('Non authentifié', 401);
    }
    $stmt = $pdo->prepare('SELECT * FROM user WHERE id = ? LIMIT 1');
    $stmt->execute([$parsed['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$user) {
        api_error('Session invalide', 401);
    }
    return $user;
}

function api_route_id(): ?string
{
    return $GLOBALS['_API_ID'] ?? null;
}

function api_route_action(): ?string
{
    return $GLOBALS['_API_ACTION'] ?? null;
}

function api_empty_oeil(): array
{
    return [
        'vl_sans' => '',
        'vl_avec' => '',
        'vp_sans' => '',
        'vp_avec' => '',
        'sphere' => '',
        'cylindre' => '',
        'axe' => '',
        'addition' => '',
        'pio' => '',
        'segment_anterieur' => '',
        'fond_oeil' => '',
    ];
}

function api_map_patient(array $row): array
{
    $sexe = strtoupper(substr((string) ($row['sexe'] ?? 'M'), 0, 1));
    if ($sexe !== 'F') {
        $sexe = 'M';
    }

    return [
        'id' => (string) $row['id'],
        'nom' => (string) ($row['nom'] ?? ''),
        'prenom' => (string) ($row['prenom'] ?? ''),
        'sexe' => $sexe,
        'date_nais' => (string) ($row['date_nais'] ?? ''),
        'profession' => (string) ($row['profession'] ?? ''),
        'contact' => (string) ($row['contact'] ?? ''),
        'assurance' => (string) ($row['assurance'] ?? ''),
        'antecedents' => (string) ($row['antecedents'] ?? ''),
        'derniere_visite' => $row['derniere_visite'] ?? null,
    ];
}

function api_map_consultation(array $row): array
{
    return [
        'id' => (string) $row['id'],
        'id_patient' => (string) ($row['id_patient'] ?? ''),
        'patient_name' => (string) ($row['nom_prenoms_pat'] ?? ''),
        'dossier_numero' => 'D-' . substr((string) ($row['id_patient'] ?? ''), 0, 8),
        'datecons' => (string) ($row['datecons'] ?? ''),
        'diagnostic' => (string) ($row['diagnostic'] ?? ''),
        'examen_od' => api_empty_oeil(),
        'examen_og' => api_empty_oeil(),
        'ordonnance' => (string) ($row['ordonnance'] ?? ''),
        'prescription' => (string) ($row['prescription'] ?? ''),
        'conduite_a_tenir' => (string) ($row['examen'] ?? ''),
        'prochain_rdv_date' => '',
        'prochain_rdv_delai' => '',
        'statut' => 'terminee',
    ];
}

function api_new_id(): string
{
    return sha1(uniqid((string) mt_rand(), true));
}
