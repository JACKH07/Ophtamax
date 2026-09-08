<?php
/**
 * POST /api/v1/auth/logout
 */

require_once __DIR__ . '/../_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    api_error('Méthode non autorisée', 405);
}

// Token stateless : invalidation côté client uniquement
api_json(['ok' => true], 200, 'Déconnexion réussie');
