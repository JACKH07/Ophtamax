<?php
require_once __DIR__ . '/../_bootstrap.php';
api_require_user($pdo);
api_json(['date' => date('Y-m-d'), 'total' => 0, 'count' => 0, 'factures' => []]);
