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
    define('API_TOKEN_TTL', 86400);
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

function api_json($data, int $status = 200, ?string $message = null, ?array $meta = null): void
{
    $payload = ['data' => $data];
    if ($message !== null) {
        $payload['message'] = $message;
    }
    if ($meta !== null) {
        $payload['meta'] = $meta;
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
        'ASS' => [
            'patients.create', 'patients.edit',
            'consultations.write', 'ordonnance.print',
            'facturation.write', 'caisse.access',
        ],
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
    $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
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
        'vl_sans' => '', 'vl_avec' => '', 'vp_sans' => '', 'vp_avec' => '',
        'sphere' => '', 'cylindre' => '', 'axe' => '', 'addition' => '',
        'pio' => '', 'segment_anterieur' => '', 'fond_oeil' => '',
    ];
}

function api_consultation_has_column(PDO $pdo, string $column): bool
{
    $stmt = $pdo->query('SHOW COLUMNS FROM t_consultations LIKE ' . $pdo->quote($column));

    return (bool) $stmt->fetch();
}

function api_consultation_ensure(PDO $pdo): void
{
    static $done = false;
    if ($done) {
        return;
    }
    $done = true;

    if (!api_consultation_has_column($pdo, 'uid')) {
        $pdo->exec('ALTER TABLE t_consultations ADD COLUMN uid VARCHAR(64) NULL');
    }
    if (!api_consultation_has_column($pdo, 'nom_prenoms_pat')) {
        $pdo->exec('ALTER TABLE t_consultations ADD COLUMN nom_prenoms_pat VARCHAR(255) NOT NULL DEFAULT ""');
    }
    if (!api_consultation_has_column($pdo, 'datecons')) {
        $pdo->exec('ALTER TABLE t_consultations ADD COLUMN datecons DATETIME NULL');
    }
    if (!api_consultation_has_column($pdo, 'ordonnance')) {
        $pdo->exec('ALTER TABLE t_consultations ADD COLUMN ordonnance TEXT NULL');
    }
    if (!api_consultation_has_column($pdo, 'prescription')) {
        $pdo->exec('ALTER TABLE t_consultations ADD COLUMN prescription TEXT NULL');
    }
    if (!api_consultation_has_column($pdo, 'details_json')) {
        $pdo->exec('ALTER TABLE t_consultations ADD COLUMN details_json LONGTEXT NULL');
    }

    $pdo->exec(
        'ALTER TABLE t_consultations
            MODIFY idpatients VARCHAR(255) NOT NULL DEFAULT "",
            MODIFY vl_Sans_corr VARCHAR(255) NOT NULL DEFAULT "",
            MODIFY vl_avec_corr VARCHAR(255) NOT NULL DEFAULT "",
            MODIFY vp_Sans_corr VARCHAR(255) NOT NULL DEFAULT "",
            MODIFY vp_avec_corr VARCHAR(255) NOT NULL DEFAULT "",
            MODIFY sphere VARCHAR(255) NOT NULL DEFAULT "",
            MODIFY cylindre VARCHAR(255) NOT NULL DEFAULT "",
            MODIFY axe0 VARCHAR(255) NOT NULL DEFAULT "",
            MODIFY pio_mmhg VARCHAR(255) NOT NULL DEFAULT "",
            MODIFY addition VARCHAR(255) NOT NULL DEFAULT "",
            MODIFY segment_anterieur TEXT NULL,
            MODIFY fond_oeil TEXT NULL,
            MODIFY diagnostic TEXT NULL,
            MODIFY prochain_rdv DATE NULL,
            MODIFY cat TEXT NULL'
    );

    try {
        $pdo->exec('CREATE UNIQUE INDEX t_consultations_uid_unique ON t_consultations (uid)');
    } catch (Throwable $e) {
        // already exists
    }

    api_consultation_migrate_legacy($pdo);
}

function api_consultation_migrate_legacy(PDO $pdo): void
{
    $legacyExists = (bool) $pdo->query("SHOW TABLES LIKE 'consultation'")->fetch();
    if (!$legacyExists) {
        return;
    }
    $already = (int) $pdo->query("SELECT COUNT(*) FROM t_consultations WHERE uid IS NOT NULL AND uid <> ''")->fetchColumn();
    if ($already > 0) {
        return;
    }
    $legacyCount = (int) $pdo->query('SELECT COUNT(*) FROM consultation')->fetchColumn();
    if ($legacyCount === 0) {
        return;
    }

    $rows = $pdo->query('SELECT * FROM consultation')->fetchAll(PDO::FETCH_ASSOC);
    $stmt = $pdo->prepare(
        'INSERT INTO t_consultations
            (uid, idpatients, nom_prenoms_pat, datecons, diagnostic, cat, ordonnance, prescription, details_json,
             vl_Sans_corr, vl_avec_corr, vp_Sans_corr, vp_avec_corr, sphere, cylindre, axe0, pio_mmhg, addition,
             segment_anterieur, fond_oeil, prochain_rdv, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $now = date('Y-m-d H:i:s');
    foreach ($rows as $row) {
        $details = [];
        if (!empty($row['details_json'])) {
            $decoded = json_decode((string) $row['details_json'], true);
            if (is_array($decoded)) {
                $details = $decoded;
            }
        }
        $od = is_array($details['examen_od'] ?? null) ? $details['examen_od'] : [];
        $rdvDate = substr((string) ($details['prochain_rdv_date'] ?? ''), 0, 10);
        $stmt->execute([
            (string) $row['id'],
            (string) ($row['id_patient'] ?? ''),
            (string) ($row['nom_prenoms_pat'] ?? ''),
            $row['datecons'] ?? $now,
            (string) ($row['diagnostic'] ?? ''),
            (string) ($row['examen'] ?? ''),
            (string) ($row['ordonnance'] ?? ''),
            (string) ($row['prescription'] ?? ''),
            $row['details_json'] ?? null,
            (string) ($od['vl_sans'] ?? ''),
            (string) ($od['vl_avec'] ?? ''),
            (string) ($od['vp_sans'] ?? ''),
            (string) ($od['vp_avec'] ?? ''),
            (string) ($od['sphere'] ?? ''),
            (string) ($od['cylindre'] ?? ''),
            (string) ($od['axe'] ?? ''),
            (string) ($od['pio'] ?? ''),
            (string) ($od['addition'] ?? ''),
            (string) ($od['segment_anterieur'] ?? ''),
            (string) ($od['fond_oeil'] ?? ''),
            $rdvDate !== '' ? $rdvDate : null,
            $now,
            $now,
        ]);
    }
}

function api_consultation_details_json(array $body): string
{
    $statut = (string) ($body['statut'] ?? 'terminee');
    if (!in_array($statut, ['brouillon', 'terminee'], true)) {
        $statut = 'terminee';
    }
    $od = is_array($body['examen_od'] ?? null) ? $body['examen_od'] : [];
    $og = is_array($body['examen_og'] ?? null) ? $body['examen_og'] : [];

    return json_encode([
        'examen_od' => array_merge(api_empty_oeil(), $od),
        'examen_og' => array_merge(api_empty_oeil(), $og),
        'prochain_rdv_date' => substr((string) ($body['prochain_rdv_date'] ?? ''), 0, 10),
        'prochain_rdv_delai' => (string) ($body['prochain_rdv_delai'] ?? ''),
        'statut' => $statut,
    ], JSON_UNESCAPED_UNICODE);
}

function api_patient_label(PDO $pdo, string $id): string
{
    $stmt = $pdo->prepare('SELECT nom, prenoms FROM t_patients WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        return '';
    }

    return trim(((string) ($row['nom'] ?? '')) . ' ' . ((string) ($row['prenoms'] ?? '')));
}

function api_user_label(PDO $pdo, string $id): string
{
    $stmt = $pdo->prepare('SELECT nom, prenoms, fonction, login_user FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        return '';
    }
    $name = trim(((string) ($row['nom'] ?? '')) . ' ' . ((string) ($row['prenoms'] ?? '')));

    return $name !== '' ? $name : (string) ($row['fonction'] ?: $row['login_user']);
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
        'prenom' => (string) ($row['prenoms'] ?? $row['prenom'] ?? ''),
        'sexe' => $sexe,
        'date_nais' => (string) ($row['datenaissance'] ?? $row['date_nais'] ?? ''),
        'profession' => (string) ($row['profession'] ?? ''),
        'contact' => (string) ($row['contact'] ?? ''),
        'assurance' => (string) ($row['assurance'] ?? ''),
        'antecedents' => (string) ($row['antecedents'] ?? ''),
        'derniere_visite' => $row['derniere_visite'] ?? null,
    ];
}

function api_map_consultation(array $row): array
{
    $details = [];
    if (!empty($row['details_json'])) {
        $decoded = json_decode((string) $row['details_json'], true);
        if (is_array($decoded)) {
            $details = $decoded;
        }
    }
    $statut = (string) ($details['statut'] ?? 'terminee');
    if (!in_array($statut, ['brouillon', 'terminee'], true)) {
        $statut = 'terminee';
    }
    $od = is_array($details['examen_od'] ?? null) ? $details['examen_od'] : [];
    $og = is_array($details['examen_og'] ?? null) ? $details['examen_og'] : [];

    // Colonnes plates OD (table t_consultations) si JSON absent
    if ($od === [] && (isset($row['vl_Sans_corr']) || isset($row['sphere']))) {
        $od = [
            'vl_sans' => (string) ($row['vl_Sans_corr'] ?? ''),
            'vl_avec' => (string) ($row['vl_avec_corr'] ?? ''),
            'vp_sans' => (string) ($row['vp_Sans_corr'] ?? ''),
            'vp_avec' => (string) ($row['vp_avec_corr'] ?? ''),
            'sphere' => (string) ($row['sphere'] ?? ''),
            'cylindre' => (string) ($row['cylindre'] ?? ''),
            'axe' => (string) ($row['axe0'] ?? ''),
            'addition' => (string) ($row['addition'] ?? ''),
            'pio' => (string) ($row['pio_mmhg'] ?? ''),
            'segment_anterieur' => (string) ($row['segment_anterieur'] ?? ''),
            'fond_oeil' => (string) ($row['fond_oeil'] ?? ''),
        ];
    }

    $id = (string) ($row['uid'] ?? $row['id'] ?? '');
    $patientId = (string) ($row['idpatients'] ?? $row['id_patient'] ?? '');
    $cat = (string) ($row['cat'] ?? $row['examen'] ?? '');
    $rdvDate = substr((string) ($details['prochain_rdv_date'] ?? $row['prochain_rdv'] ?? ''), 0, 10);

    return [
        'id' => $id,
        'id_patient' => $patientId,
        'patient_name' => (string) ($row['nom_prenoms_pat'] ?? ''),
        'dossier_numero' => 'D-' . substr($patientId, 0, 8),
        'datecons' => (string) ($row['datecons'] ?? ''),
        'diagnostic' => (string) ($row['diagnostic'] ?? ''),
        'examen_od' => array_merge(api_empty_oeil(), $od),
        'examen_og' => array_merge(api_empty_oeil(), $og),
        'ordonnance' => (string) ($row['ordonnance'] ?? ''),
        'prescription' => (string) ($row['prescription'] ?? ''),
        'conduite_a_tenir' => $cat,
        'prochain_rdv_date' => $rdvDate,
        'prochain_rdv_delai' => (string) ($details['prochain_rdv_delai'] ?? ''),
        'statut' => $statut,
    ];
}

function api_consultation_eye_columns(array $body): array
{
    $od = is_array($body['examen_od'] ?? null) ? $body['examen_od'] : [];

    return [
        (string) ($od['vl_sans'] ?? ''),
        (string) ($od['vl_avec'] ?? ''),
        (string) ($od['vp_sans'] ?? ''),
        (string) ($od['vp_avec'] ?? ''),
        (string) ($od['sphere'] ?? ''),
        (string) ($od['cylindre'] ?? ''),
        (string) ($od['axe'] ?? ''),
        (string) ($od['pio'] ?? ''),
        (string) ($od['addition'] ?? ''),
        (string) ($od['segment_anterieur'] ?? ''),
        (string) ($od['fond_oeil'] ?? ''),
    ];
}

function api_new_id(): string
{
    return sha1(uniqid((string) mt_rand(), true));
}
